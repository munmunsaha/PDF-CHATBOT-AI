const Groq = require('groq-sdk');
const { AppError } = require('../utils/AppError');
const { buildChatPrompt } = require('./promptBuilder');
const { formatResponse } = require('./responseFormatter');
const vectorStoreService = require('./vectorStoreService');

const CHAT_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

function createGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new AppError('GROQ_API_KEY is not configured.', 500);
  }

  return new Groq({ apiKey });
}

async function retrieveRelevantChunks(question, topK = 4) {
  let store = vectorStoreService.getActiveVectorStore();
  if (!store) {
    try {
      store = await vectorStoreService.loadVectorStore();
    } catch (error) {
      return [];
    }
  }

  return vectorStoreService.similaritySearch(store, question, topK);
}

async function generateAnswer(question, contextChunks) {
  try {
    const client = createGroqClient();
    const prompt = buildChatPrompt({
      question,
      contextChunks,
      mode: contextChunks.length ? 'pdf' : 'general',
    });

    const response = await client.chat.completions.create({
      model: CHAT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 400,
    });

    const generatedText = response?.choices?.[0]?.message?.content || '';
    return formatResponse(generatedText);
  } catch (error) {
    throw new AppError(`Failed to generate answer: ${error.message}`, 500);
  }
}

async function answerQuestion(question) {
  const contextChunks = await retrieveRelevantChunks(question, 4);
  const answer = await generateAnswer(question, contextChunks);

  return {
    answer,
    context: contextChunks,
  };
}

module.exports = {
  answerQuestion,
  generateAnswer,
  retrieveRelevantChunks,
};
