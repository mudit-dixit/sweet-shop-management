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
export const createSweet = async (req: Request, res: Response) => {
  try {
    const { name, category, price, quantity } = req.body;

    // Basic validation
    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newSweet = new Sweet({
      name,
      category,
      price,
      quantity,
    });

    const savedSweet = await newSweet.save();
    res.status(201).json(savedSweet);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};