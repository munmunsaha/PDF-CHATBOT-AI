import http from 'http';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 4000;

/**
 * Ensure necessary directories exist.
 */
const ensureDirs = async () => {
  const dirs = [
    path.join(__dirname, 'uploads', 'temp'),
    path.join(__dirname, 'uploads', 'vector-db'),
  ];

  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
};

const startServer = async () => {
  try {
    await ensureDirs();

    const server = http.createServer(app);

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the process using that port or set a different PORT before starting the backend.`);
        process.exit(1);
      }

      throw error;
    });

    server.listen(PORT, () => {
      console.log(`🚀 Backend listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
