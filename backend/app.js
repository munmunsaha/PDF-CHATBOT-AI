require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');
const { getEmbeddingHealth } = require('./services/embeddingService');
const { getGroqHealth } = require('./services/groqService');

const app = express();

const explicitOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const localhostOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
];

const allowedOrigins = [...new Set([...explicitOrigins, ...localhostOrigins])];

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser requests and all localhost origins during development.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use((req, _res, next) => {
  req.requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  next();
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 150),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use(apiLimiter);

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'AI PDF chat backend is running.',
    services: {
      groq: getGroqHealth(),
      embeddings: getEmbeddingHealth(),
    },
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'AI PDF Chat API is live.',
    endpoints: {
      health: 'GET /health',
      uploadPdf: 'POST /upload-pdf',
      askQuestion: 'POST /ask-question',
    },
    timestamp: new Date().toISOString(),
  });
});

app.use('/', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
