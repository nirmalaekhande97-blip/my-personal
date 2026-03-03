// Backend entry point
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'IIoT Platform Backend'
  });
});

// Auth routes  — POST /api/auth/login, POST /api/auth/refresh
app.use('/api/auth', authRoutes);

// API info
app.get('/api', (req: Request, res: Response) => {
  res.json({ 
    message: 'IIoT Platform API',
    version: '1.0.0',
    thingsboard: 'Ready'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;