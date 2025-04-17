import type { IncomingMessage, ServerResponse } from 'http'
import {
  addrevokeTokens,
  authSchema,
  createUser,
  findUserbyEmail,
  HttpMethod,
  revokeUserToken,
  validatePassword
} from '../models'
import { parserBody } from '../utils/parserBody'
import { safeParse } from 'valibot'
import { sign } from 'jsonwebtoken'
import { config } from '../../config'
import type { AuthenticatedRequest } from '../middlewares/authentications'

/**
 * Handles the authentication routes for user registration, login, and logout.
 * @param {IncomingMessage} req - The incoming HTTP request object.
 * @param {ServerResponse} res - The outgoing HTTP response object.
 */
export const authRouter = async (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req

  // Register new user
  if (url == '/auth/register' && method == HttpMethod.POST) {
    const body = await parserBody(req)
    const result = safeParse(authSchema, body)

    // If validation fails, return a 400 Bad Request response
    if (result.issues) {
      res.statusCode = 400
      res.end(JSON.stringify({ message: 'Bad Request' }))
      return
    }

    const { email, password } = body
    try {
      const user = await createUser(email, password)
      res.statusCode = 201
      res.end(JSON.stringify(user))
    } catch (error) {
      if (error instanceof Error) {
        res.end(JSON.stringify('Internal server error'))
      }
    }
  }

  // User login
  if (url == '/auth/login' && method == HttpMethod.POST) {
    const body = await parserBody(req)
    const result = safeParse(authSchema, body)

    // If validation fails, return a 400 Bad Request response
    if (!result.success) {
      res.statusCode = 400
      res.end(JSON.stringify({ message: 'Bad Request' }))
      return
    }

    const { email, password } = body

    try {
      const user = await findUserbyEmail(email)

      // If user does not exist, return a 401 Unauthorized response
      if (!user) {
        res.statusCode = 401
        res.end(JSON.stringify({ message: 'Invalid email or password' }))
        return
      }

      // Validate user password
      const isPasswordValid = await validatePassword(user, password)
      if (!isPasswordValid) {
        res.statusCode = 401
        res.end(JSON.stringify({ message: 'Invalid email or password' }))
        return
      }

      // Generate access and refresh tokens
      const accesToken = sign(
        { id: user.id, email: user.email, role: user.role },
        config.jwtSecret,
        { expiresIn: '1h' }
      )
      const refreshToken = sign({ id: user.id }, config.jwtSecret, { expiresIn: '1d' })
      user.refreshtoken = refreshToken

      res.statusCode = 200
      res.setHeader('authorization', `Bearer ${accesToken}`)
      res.end(JSON.stringify({ message: 'Login successful', accesToken, refreshToken }))
      return
    } catch (error) {
      // If an error occurs during authentication, return a 500 Internal Server Error response
      res.statusCode = 500
      if (error instanceof Error) {
        res.end(JSON.stringify({ message: 'Internal server error', error: error.message }))
      } else {
        res.end(JSON.stringify({ message: 'Internal server error' }))
      }
    }
  }

  // User logout
  if (url == '/auth/logout' && method == HttpMethod.POST) {
    const token = req.headers['authorization']?.split(' ')[1]

    // Revoke token if available
    if (token) {
      addrevokeTokens(token)
    }

    const formattedReq = req as AuthenticatedRequest

    // If the user is authenticated, revoke their session
    if (formattedReq.user && typeof formattedReq.user == 'object' && 'id' in formattedReq.user) {
      const result = revokeUserToken(formattedReq.user.email)
      if (!result) {
        res.statusCode = 403
        res.end(JSON.stringify({ message: 'Forbidden' }))
        return
      }
      res.statusCode = 200
      res.end(JSON.stringify({ message: 'Logout successful' }))
    } else {
      // If the user is not authenticated, return a 400 Bad Request response
      res.statusCode = 400
      res.end(JSON.stringify({ message: 'User not authenticated' }))
    }
  }
}
