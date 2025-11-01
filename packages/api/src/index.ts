import express, { Request, Response } from 'express';

// DEBUGGING 1: Check ENV on file import
console.log(`[DEBUG] index.ts: Current NODE_ENV = '${process.env.NODE_ENV}'`);

// Create the Express app
export const app = express();

// Define a port to listen on
const PORT = process.env.PORT || 3001;

// Create a simple "health check" route
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is up and running!' });
});

// DEBUGGING 2: Check ENV right before the 'if' statement
console.log(`[DEBUG] index.ts: Checking NODE_ENV before listen: '${process.env.NODE_ENV}'`);

// Start the server
// We only want the server to listen when we run the file directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
  });
}