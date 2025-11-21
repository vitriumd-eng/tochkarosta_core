import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gateway' });
});

// Core Backend API (default)
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api',
  },
}));

// Dynamic subdomain routing
app.use((req, res, next) => {
  const host = req.get('host') || '';
  const subdomain = host.split('.')[0];
  
  // If subdomain exists and is not 'www' or 'api', route to module
  if (subdomain && subdomain !== 'www' && subdomain !== 'api' && subdomain !== 'localhost') {
    // TODO: Lookup tenant by subdomain from Core API
    // Map subdomain to module port
    const moduleMap: { [key: string]: number } = {
      'shop': 5001,
      'event': 5002,
      'portfolio': 5003,
    };
    
    const modulePort = moduleMap[subdomain] || 5001; // Default to shop
    
    // Route API requests to backend, others to frontend
    if (req.path.startsWith('/api/')) {
      const backendPort = modulePort === 5001 ? 8001 : modulePort + 3000;
      return createProxyMiddleware({
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
      })(req, res, next);
    } else {
      return createProxyMiddleware({
        target: `http://localhost:${modulePort}`,
        changeOrigin: true,
      })(req, res, next);
    }
  }
  
  next();
});

// Default: route to core frontend
app.use(createProxyMiddleware({
  target: 'http://localhost:7000',
  changeOrigin: true,
}));

app.listen(PORT, () => {
  console.log(`[GATEWAY] Server running on port ${PORT}`);
  console.log(`[GATEWAY] Routing API requests to http://localhost:8000`);
  console.log(`[GATEWAY] Routing frontend to http://localhost:7000`);
});
