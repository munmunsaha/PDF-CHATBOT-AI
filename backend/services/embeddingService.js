const axios = require('axios');
const { AppError } = require('../utils/AppError');

const DEFAULT_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';
const DEFAULT_ENDPOINT = 'https://api-inference.huggingface.co/pipeline/feature-extraction';

function toVector(embedding) {
  if (!Array.isArray(embedding)) {
    return [];
  }

  if (embedding.length > 0 && typeof embedding[0] === 'number') {
    return embedding;
  }

  if (embedding.length > 0 && Array.isArray(embedding[0])) {
    const tokenEmbeddings = embedding;
    const dims = tokenEmbeddings[0]?.length || 0;
    const pooled = new Array(dims).fill(0);

    for (const tokenVector of tokenEmbeddings) {
      for (let i = 0; i < dims; i += 1) {
        pooled[i] += Number(tokenVector[i] || 0);
      }
    }

    return pooled.map((value) => value / tokenEmbeddings.length);
  }

  return [];
}

function createHuggingFaceEmbeddingsClient(apiKey, model) {
  const endpoint = `${DEFAULT_ENDPOINT}/${encodeURIComponent(model)}`;

  async function embedBatch(texts) {
    const response = await axios.post(
      endpoint,
      { inputs: texts, options: { wait_for_model: true } },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 120000,
      }
    );

    const data = response.data;
    const outputs = Array.isArray(data) ? data : [data];

    return outputs.map(toVector);
  }

  return {
    async embedDocuments(texts) {
      return embedBatch(texts);
    },
    async embedQuery(text) {
      const [vector] = await embedBatch([text]);
      return vector;
    },
  };
}

function createEmbeddingService() {
  const apiKey = process.env.HUGGING_FACE_API_KEY;
  if (!apiKey) {
    throw new AppError('HUGGING_FACE_API_KEY is not configured.', 500);
  }

  return createHuggingFaceEmbeddingsClient(
    apiKey,
    process.env.HUGGING_FACE_EMBEDDING_MODEL || DEFAULT_MODEL
  );
}

function getEmbeddingHealth() {
  const apiKey = process.env.HUGGING_FACE_API_KEY || '';
  const model = process.env.HUGGING_FACE_EMBEDDING_MODEL || DEFAULT_MODEL;

  return {
    configured: Boolean(apiKey),
    model,
    ready: Boolean(apiKey),
    message: apiKey
      ? 'Hugging Face embedding service is configured.'
      : 'HUGGING_FACE_API_KEY is not configured.',
  };
}

async function createEmbeddings(texts) {
  try {
    const embeddings = createEmbeddingService();
    return embeddings.embedDocuments(texts);
  } catch (error) {
    throw new AppError(`Failed to create embeddings: ${error.message}`, 500);
  }
}

async function createQueryEmbedding(text) {
  try {
    const embeddings = createEmbeddingService();
    return embeddings.embedQuery(text);
  } catch (error) {
    throw new AppError(`Failed to create query embedding: ${error.message}`, 500);
  }
}

module.exports = {
  createEmbeddingService,
  createEmbeddings,
  createQueryEmbedding,
  DEFAULT_MODEL,
  getEmbeddingHealth,
};
