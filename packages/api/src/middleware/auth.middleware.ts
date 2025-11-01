import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// We extend the Express Request type to have a 'user' property
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Get token from the header
  const token = req.header('Authorization')?.split(' ')[1]; // "Bearer TOKEN"

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string; role: string };

    req.user = decoded; // Add user payload to request object
    next(); // Move to the next middleware or controller
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // We check the 'role' that the authMiddleware attached to req.user
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};