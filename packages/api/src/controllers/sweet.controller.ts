import { Request, Response } from 'express';
import Sweet from '../models/sweet.model';

export const getAllSweets = async (req: Request, res: Response) => {
  try {
    // This sort is the critical part
    const sweets = await Sweet.find({}).sort({ createdAt: 1 });
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createSweet = async (req: Request, res: Response) => {
  try {
    const { name, category, price, quantity } = req.body;

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

export const searchSweets = async (req: Request, res: Response) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query: any = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    // --- THIS IS FIX #2 ---
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice as string); // $gte = greater than or equal
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice as string); // $lte = less than or equal
      }
    }

    const sweets = await Sweet.find(query).sort({ createdAt: 1 });
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedSweet = await Sweet.findByIdAndUpdate(id, updatedData, {
      new: true, 
    });

    if (!updatedSweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    res.status(200).json(updatedSweet);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedSweet = await Sweet.findByIdAndDelete(id);

    if (!deletedSweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    res.status(200).json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const purchaseSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    if (sweet.quantity <= 0) {
      return res.status(400).json({ message: 'Sweet is out of stock' });
    }

    // Decrease quantity by 1
    sweet.quantity -= 1;
    await sweet.save();

    res.status(200).json(sweet);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const restockSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Valid restock amount is required' });
    }

    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    sweet.quantity += amount;
    await sweet.save();

    res.status(200).json(sweet);
  } catch (error)
{
    res.status(500).json({ message: 'Server error' });
  }
};