import { Request, Response } from 'express';
import { registerUserService, loginUserService } from '../services/auth.service';

export const registerUser = async (req: Request, res: Response) => {
  try {
    // 1. Extract data from the request body
    const { email, password } = req.body;

    // 2. Basic Validation (our 400 test)
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 3. Call the service layer with the data
    await registerUserService({ email, password });

    // 4. If it succeeds, send 201
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // 5. If the service throws an error (like 'User already exists')
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({ message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Basic Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 2. Call the service
    const token = await loginUserService({ email, password });

    // 3. Success: Send token back
    res.status(200).json({ token });
  } catch (error) {
    // 4. Failure: Service throws "Invalid credentials"
    // We return 401 (Unauthorized)
    res.status(401).json({ message: 'Invalid credentials' });
  }
};