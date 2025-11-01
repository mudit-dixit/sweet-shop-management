import { Request, Response } from 'express';

export const registerUser = (_req: Request, res: Response) => {

  res.status(400).json({ message: 'Validation failed' });
};