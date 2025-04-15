import { IncomingMessage, ServerResponse } from 'http' // Importa IncomingMessage desde 'http'
import { verify, type JwtPayload } from 'jsonwebtoken' // Importación de tipo
import { isRevokedTokens } from '../models'
import { config } from '../../config'


export interface AuthenticatedRequest extends IncomingMessage {
  user: JwtPayload | string
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: ServerResponse
): Promise<boolean> => {
  const authHeader = req.headers['authorization']

  const token = authHeader && authHeader.split(' ')[1] // Arreglado `authheader` mal escrito

  if (!token) {
    res.statusCode = 401
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ message: 'Unauthorized' }))
    return false
  }

  if (isRevokedTokens(token)) {
    res.statusCode = 403
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ message: 'Token revoked' }))
    return false
  }

  try {
    const decoded = verify(token, config.jwtSecret);
    req.user = decoded; // Asignar payload a la request
    return true;
  } catch (err) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Invalid token' }));
    return false;
  }
}
