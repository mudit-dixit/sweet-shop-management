import { Request, Response } from 'express';
import { registerUserService } from '../services/auth.service';

export const registerUser = async (req: Request, res: Response) => {
  try {
    // 1. Call the service layer
    await registerUserService();

    // If it succeeds (it won't yet), send 201
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    // 2. If the service throws an error, catch it
    res.status(400).json({ message: 'Validation failed' });
  }
};