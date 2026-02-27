import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from './routes/authRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import infoRoutes from './routes/infoRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import startupRoutes from './routes/startupRoutes.js';
import loanRoutes from './routes/loanRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/loans', loanRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'FinSaathi Backend Server - Financial Literacy App' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\nFinSaathi Backend Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`);
});
