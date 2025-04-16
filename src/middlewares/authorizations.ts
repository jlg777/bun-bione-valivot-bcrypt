import type { User } from '../models'
import type { AuthenticatedRequest } from './authentications'
import { ServerResponse } from 'http'

/**
 * Middleware to authorize a user based on their role.
 *
 * @param {AuthenticatedRequest} req - The incoming HTTP request, with a verified user attached.
 * @param {ServerResponse} res - The HTTP server response object.
 * @param {string[]} roles - An array of allowed roles for accessing the resource.
 * @returns {Promise<boolean>} - Returns `true` if the user's role is authorized.
 * Otherwise, sends a 403 Forbidden response and returns `false`.
 */
export const authorizeRoles = async (
  req: AuthenticatedRequest,
  res: ServerResponse,  
  roles: string[]
): Promise<boolean> => {
  const userRole = (req.user as User).role

  if (!userRole || !roles.includes(userRole)) {
    res.statusCode = 403
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ message: 'Forbidden' }))
    return false
  }

  return true
}
