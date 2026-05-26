const app = require('./app');
const { ensureUploadsDir } = require('./utils/fileSystem');
const { getEmbeddingHealth } = require('./services/embeddingService');

const PORT = process.env.PORT || 4000;

ensureUploadsDir();

const embeddingHealth = getEmbeddingHealth();
if (!embeddingHealth.ready) {
  console.warn(`Embedding service not ready: ${embeddingHealth.message}`);
} else {
  console.log(`Embedding service ready with model: ${embeddingHealth.model}`);
}

const server = app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});

function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
