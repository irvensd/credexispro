import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { AuthRequest } from '../modules/auth/middleware';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log the error
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    user: (req as AuthRequest).user?.id,
  });

  // Send error response
  res.status(500).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}; 