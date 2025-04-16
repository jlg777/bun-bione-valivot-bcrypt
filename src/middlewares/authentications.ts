import { IncomingMessage, ServerResponse } from 'http'
import { verify, type JwtPayload } from 'jsonwebtoken'
import { isRevokedTokens } from '../models'
import { config } from '../../config'

/**
 * Extends the standard IncomingMessage to include a `user` property
 * for storing decoded JWT payload after authentication.
 */
export interface AuthenticatedRequest extends IncomingMessage {
  user: JwtPayload | string
}

/**
 * Middleware function to authenticate incoming HTTP requests using JWT.
 *
 * @param {AuthenticatedRequest} req - The incoming HTTP request, extended with a `user` property.
 * @param {ServerResponse} res - The HTTP server response object.
 * @returns {Promise<boolean>} - Returns `true` if the token is valid and not revoked,
 * otherwise sends an error response and returns `false`.
 */
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: ServerResponse
): Promise<boolean> => {
  // Extract the 'Authorization' header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  // If no token is provided, respond with 401 (Unauthorized)
  if (!token) {
    res.statusCode = 401
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ message: 'Unauthorized' }))
    return false
  }

  // If the token is revoked, respond with 403 (Forbidden)
  if (isRevokedTokens(token)) {
    res.statusCode = 403
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ message: 'Token revoked' }))
    return false
  }

  try {
    // Verify the token using the secret key
    const decoded = verify(token, config.jwtSecret)
    req.user = decoded // Attach the decoded payload to the request
    return true
  } catch (err) {
    // If the token is invalid or verification fails, respond with 403 (Forbidden)
    res.statusCode = 403
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ message: 'Invalid token' }))
    return false
  }
}
