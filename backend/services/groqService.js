const Groq = require('groq-sdk');
const { AppError } = require('../utils/AppError');

const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

function getGroqHealth() {
  const apiKey = process.env.GROQ_API_KEY || '';
  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;

  return {
    configured: Boolean(apiKey),
    model,
    ready: Boolean(apiKey),
    message: apiKey ? 'Groq is configured.' : 'GROQ_API_KEY is not configured.',
  };
}

function createGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new AppError('GROQ_API_KEY is not configured.', 500);
  }

  return new Groq({ apiKey });
}

async function askGroq(context, question) {
  try {
    const client = createGroqClient();
    const prompt = `
You are a helpful AI assistant.

Answer ONLY using the provided PDF context.

If the answer is not found, say:
"Answer not found in the uploaded PDF."

Context:
${context}

Question:
${question}
`;

    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.GROQ_MODEL || DEFAULT_MODEL,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    throw new AppError(`Groq request failed: ${error.message}`, 500);
  }
}

module.exports = {
  askGroq,
  getGroqHealth,
  DEFAULT_MODEL,
};
