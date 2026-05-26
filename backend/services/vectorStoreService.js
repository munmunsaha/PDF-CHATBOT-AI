const path = require('path');
const fs = require('fs/promises');
const { AppError } = require('../utils/AppError');
const { createEmbeddingService } = require('./embeddingService');

const VECTOR_DB_DIR = path.join(__dirname, '..', 'uploads', 'vector-db');
const VECTOR_DB_FILE = path.join(VECTOR_DB_DIR, 'store.json');
let activeVectorStore = null;

function normalizeVector(vector) {
  const values = Array.isArray(vector) ? vector.map((value) => Number(value || 0)) : [];
  const magnitude = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
  if (!magnitude) {
    return values;
  }

  return values.map((value) => value / magnitude);
}

function cosineSimilarity(a, b) {
  const length = Math.min(a.length, b.length);
  if (!length) {
    return 0;
  }

  let dot = 0;
  for (let i = 0; i < length; i += 1) {
    dot += (a[i] || 0) * (b[i] || 0);
  }

  return dot;
}

function createVectorStore(records) {
  return {
    records,
    async save(dir = VECTOR_DB_DIR) {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, 'store.json'), JSON.stringify({ records: this.records }, null, 2), 'utf8');
    },
    async similaritySearch(query, topK = 4) {
      const embeddings = createEmbeddingService();
      const queryVector = normalizeVector(await embeddings.embedQuery(query));

      return [...this.records]
        .map((record) => ({
          ...record,
          score: cosineSimilarity(queryVector, record.vector),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map((record) => ({
          pageContent: record.text,
          metadata: record.metadata || {},
        }));
    },
    async maxMarginalRelevanceSearch(query, { k = 4 } = {}) {
      return this.similaritySearch(query, k);
    },
    asRetriever(options = {}) {
      return {
        getRelevantDocuments: async (query) => this.similaritySearch(query, options.k || 4),
      };
    },
  };
}

async function ensureVectorDbDir() {
  await fs.mkdir(VECTOR_DB_DIR, { recursive: true });
}

async function buildVectorStore(chunks) {
  try {
    const embeddings = createEmbeddingService();
    const texts = chunks.map((chunk) => chunk.text);
    const vectors = await embeddings.embedDocuments(texts);

    const records = chunks.map((chunk, index) => ({
      text: chunk.text,
      metadata: chunk.metadata || {},
      vector: normalizeVector(vectors[index] || []),
    }));

    const store = createVectorStore(records);
    activeVectorStore = store;
    return store;
  } catch (error) {
    throw new AppError(`Failed to build vector store: ${error.message}`, 500);
  }
}

async function saveVectorStore(store = activeVectorStore) {
  if (!store) {
    throw new AppError('No vector store available to save.', 400);
  }

  try {
    await ensureVectorDbDir();
    await store.save(VECTOR_DB_DIR);
    return VECTOR_DB_FILE;
  } catch (error) {
    throw new AppError(`Failed to save vector store: ${error.message}`, 500);
  }
}

async function loadVectorStore() {
  try {
    const raw = await fs.readFile(VECTOR_DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    const store = createVectorStore(Array.isArray(parsed.records) ? parsed.records : []);
    activeVectorStore = store;
    return store;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new AppError('No saved vector store found.', 404);
    }

    throw new AppError(`Failed to load vector store: ${error.message}`, 500);
  }
}

function setActiveVectorStore(store) {
  activeVectorStore = store;
}

function getActiveVectorStore() {
  return activeVectorStore;
}

async function similaritySearch(store, query, topK = 4) {
  if (!store) {
    throw new AppError('Vector store is not initialized.', 400);
  }

  try {
    const docs = await store.similaritySearch(query, topK);
    return docs.map((doc, index) => ({
      id: index + 1,
      text: doc.pageContent || '',
      metadata: doc.metadata || {},
    }));
  } catch (error) {
    throw new AppError(`Similarity search failed: ${error.message}`, 500);
  }
}

async function mmrRetrieval(store, query, { k = 4, fetchK = 10 } = {}) {
  if (!store) {
    throw new AppError('Vector store is not initialized.', 400);
  }

  try {
    if (typeof store.maxMarginalRelevanceSearch === 'function') {
      const docs = await store.maxMarginalRelevanceSearch(query, { k, fetchK });
      return docs.map((doc, index) => ({
        id: index + 1,
        text: doc.pageContent || '',
        metadata: doc.metadata || {},
      }));
    }

    return similaritySearch(store, query, k);
  } catch (error) {
    throw new AppError(`MMR retrieval failed: ${error.message}`, 500);
  }
}

function setupRetriever(store = activeVectorStore, options = {}) {
  if (!store) {
    throw new AppError('Vector store is not initialized.', 400);
  }

  if (typeof store.asRetriever !== 'function') {
    throw new AppError('Retriever is not supported by the current vector store implementation.', 500);
  }

  return store.asRetriever(options);
}

module.exports = {
  buildVectorStore,
  getActiveVectorStore,
  loadVectorStore,
  mmrRetrieval,
  saveVectorStore,
  setActiveVectorStore,
  setupRetriever,
  similaritySearch,
};
