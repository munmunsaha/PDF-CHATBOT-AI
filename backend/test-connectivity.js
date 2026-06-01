const Groq = require('groq-sdk');
const axios = require('axios');
require('dotenv').config({ path: '.env' });

async function test() {
  console.log('Testing connectivity...');
  
  try {
    console.log('Checking Groq API Key...');
    if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY missing');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'hi' }],
    });
    console.log('✅ Groq connectivity OK');
  } catch (e) {
    console.error('❌ Groq connectivity FAILED:', e.message);
  }

  try {
    console.log('Checking Hugging Face API Key...');
    if (!process.env.HUGGING_FACE_API_KEY) throw new Error('HUGGING_FACE_API_KEY missing');
    const model = process.env.HUGGING_FACE_EMBEDDING_MODEL || 'sentence-transformers/all-MiniLM-L6-v2';
    const endpoint = `https://api-inference.huggingface.co/pipeline/feature-extraction/${encodeURIComponent(model)}`;
    await axios.post(endpoint, { inputs: ['test'] }, {
      headers: { Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}` }
    });
    console.log('✅ Hugging Face connectivity OK');
  } catch (e) {
    console.error('❌ Hugging Face connectivity FAILED:', e.message);
  }
}

test();
