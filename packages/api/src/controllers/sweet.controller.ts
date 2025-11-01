import { Request, Response } from 'express';
import Sweet from '../models/sweet.model'; 
export const getAllSweets = async (req: Request, res: Response) => {
  try {
   const sweets = await Sweet.find({}).sort({ createdAt: 1 });
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};