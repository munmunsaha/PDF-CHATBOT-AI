import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Create and return an instance of LangChain HuggingFaceEmbeddings.
 */
export const createEmbeddingService = () => {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  const modelName = process.env.HUGGINGFACE_EMBEDDING_MODEL || 'sentence-transformers/all-MiniLM-L6-v2';

  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY is not configured in environment variables.');
  }

  return new HuggingFaceInferenceEmbeddings({
    apiKey,
    model: modelName,
  });
};

/**
 * Generate embeddings for an array of texts.
 */
export const createEmbeddings = async (texts) => {
  const embeddings = createEmbeddingService();
  return await embeddings.embedDocuments(texts);
};

/**
 * Generate an embedding for a single query.
 */
export const createQueryEmbedding = async (text) => {
  const embeddings = createEmbeddingService();
  return await embeddings.embedQuery(text);
};
