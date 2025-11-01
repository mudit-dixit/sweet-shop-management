import express, { Request, Response } from 'express';
import authRoutes from './routes/auth.routes';
export const app = express();

// --- Middlewares ---
app.use(express.json()); 
// --- Routes ---
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is up and running!' });
});

app.use('/api/auth', authRoutes); 
// --- Server Start ---
const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
  });
}