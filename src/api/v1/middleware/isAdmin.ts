
import { NextFunction, Request, Response } from "express";
export const adminMiddleware = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      // Check if user has the required role
      console.log('====================================');
      console.log((<any>req).user.userId);
      console.log('====================================');
      if (!roles.includes((<any>req).user.role)) {
        
        res.status(403).json({ error: 'Unauthorized' });
        
        return;
      }
      next();
    };
  };
  