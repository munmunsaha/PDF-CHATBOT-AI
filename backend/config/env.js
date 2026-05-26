function loadEnv() {
  return {
    port: process.env.PORT || 4000,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    groqApiKey: process.env.GROQ_API_KEY || '',
    groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    huggingFaceApiKey: process.env.HUGGING_FACE_API_KEY || '',
    huggingFaceEmbeddingModel: process.env.HUGGING_FACE_EMBEDDING_MODEL || 'sentence-transformers/all-MiniLM-L6-v2',
    huggingFaceGenerationModel: process.env.HUGGING_FACE_GENERATION_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3',
  };
}

module.exports = { loadEnv };
