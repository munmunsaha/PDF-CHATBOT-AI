import { FaissStore } from '@langchain/community/vectorstores/faiss';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { createEmbeddingService } from './embeddingService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VECTOR_DB_DIR = path.join(__dirname, '..', 'uploads', 'vector-db');
let activeVectorStore = null;

/**
 * Build a FAISS vector store from document chunks.
 */
export const buildVectorStore = async (chunks) => {
  try {
    const embeddings = createEmbeddingService();
    
    const texts = chunks.map((chunk) => chunk.text);
    const metadatas = chunks.map((chunk) => chunk.metadata || {});

    const vectorStore = await FaissStore.fromTexts(
      texts,
      metadatas,
      embeddings
    );

    activeVectorStore = vectorStore;
    return vectorStore;
  } catch (error) {
    throw new Error(`Failed to build FAISS vector store: ${error.message}`);
  }
};

/**
 * Save the active vector store to disk.
 */
export const saveVectorStore = async (store = activeVectorStore) => {
  if (!store) {
    throw new Error('No vector store available to save.');
  }

  try {
    await fs.mkdir(VECTOR_DB_DIR, { recursive: true });
    await store.save(VECTOR_DB_DIR);
    return VECTOR_DB_DIR;
  } catch (error) {
    throw new Error(`Failed to save vector store: ${error.message}`);
  }
};

/**
 * Load the vector store from disk.
 */
export const loadVectorStore = async () => {
  try {
    const embeddings = createEmbeddingService();
    const store = await FaissStore.load(VECTOR_DB_DIR, embeddings);
    activeVectorStore = store;
    return store;
  } catch (error) {
    throw new Error(`Failed to load vector store: ${error.message}`);
  }
};

/**
 * Perform a similarity search on the vector store.
 */
export const similaritySearch = async (store, query, k = 4) => {
  if (!store) {
    throw new Error('Vector store is not initialized.');
  }

  try {
    const results = await store.similaritySearch(query, k);
    return results.map((doc, index) => ({
      id: index + 1,
      text: doc.pageContent,
      metadata: doc.metadata,
    }));
  } catch (error) {
    throw new Error(`Similarity search failed: ${error.message}`);
  }
};

export const getActiveVectorStore = () => activeVectorStore;
export const setActiveVectorStore = (store) => { activeVectorStore = store; };
