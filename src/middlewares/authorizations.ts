import type { Role, User } from '../models'
import type { AuthenticatedRequest } from './authentications'
import { ServerResponse } from 'http'


export const authorizeRoles = (...allowedRoles: Role[]) => {
  return async (
    req: AuthenticatedRequest,
    res: ServerResponse
  ): Promise<boolean> => {
    const user = req.user as User;

    if (!user || !user.role || !allowedRoles.includes(user.role)) {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Forbidden" }));
      return false;
    }

    return true;
  };
};
