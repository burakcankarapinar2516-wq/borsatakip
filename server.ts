import express from "express";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // WebSocket Server
  const wss = new WebSocketServer({ server });

  const stocks = [
    { symbol: 'AAPL', price: 192.42 },
    { symbol: 'NVDA', price: 875.28 },
    { symbol: 'THYAO', price: 284.50 },
    { symbol: 'BTC', price: 68432.10 },
    { symbol: 'TSLA', price: 174.52 },
    { symbol: 'ETH', price: 3421.90 },
    { symbol: 'AMZN', price: 186.13 },
  ];

  // Broadcast updates every 2 seconds
  setInterval(() => {
    const updates = stocks.map(stock => {
      const changePercent = (Math.random() - 0.5) * 0.01; // +/- 0.5%
      stock.price = parseFloat((stock.price * (1 + changePercent)).toFixed(2));
      return {
        symbol: stock.symbol,
        price: stock.price,
        change: (changePercent * 100).toFixed(2) + '%',
        isPositive: changePercent >= 0
      };
    });

    const message = JSON.stringify({ type: 'MARKET_UPDATE', data: updates });
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }, 2000);

  wss.on('connection', (ws) => {
    console.log('Client connected to market feed');
    // Send initial state
    const initialState = stocks.map(stock => ({
      symbol: stock.symbol,
      price: stock.price,
      change: '0.00%',
      isPositive: true
    }));
    ws.send(JSON.stringify({ type: 'MARKET_UPDATE', data: initialState }));
  });
}

startServer();
