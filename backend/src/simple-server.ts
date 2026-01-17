import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Simple store endpoint
app.get('/api/store', (req, res) => {
  res.json({
    success: true,
    data: {
      id: '1',
      name: 'TYNBO Store',
      country: 'United States',
      currency_symbol: 'US$',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});

export = app;