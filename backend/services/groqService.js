import { ChatGroq } from '@langchain/groq';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Create and return an instance of LangChain ChatGroq.
 */
export const createGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in environment variables.');
  }

  return new ChatGroq({
    apiKey,
    model, // Try 'model' instead of 'modelName'
    temperature: 0,
  });
};

/**
 * Generate a response using Groq based on context and question.
 */
export const askGroq = async (context, question) => {
  try {
    const chat = createGroqClient();

    const systemPrompt = `
You are a helpful assistant answering questions about a PDF document.

Rules:
1. Use only the provided context.
2. Provide detailed and accurate answers.
3. Include bullet points where appropriate.
4. Include relevant numbers, facts, and explanations found in the context.
5. Do not use outside knowledge.
6. If the answer is not available in the context, politely state that the information was not found in the uploaded document.
7. Keep answers clear and well-structured.

Context:
${context}
`;

    const response = await chat.invoke([
      ['system', systemPrompt],
      ['user', question],
    ]);

    return response.content;
  } catch (error) {
    throw new Error(`Groq request failed: ${error.message}`);
  }
};
