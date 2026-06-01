import * as vectorStoreService from '../services/vectorStoreService.js';
import * as groqService from '../services/groqService.js';

/**
 * Handle chat questions by retrieving relevant chunks and querying Groq.
 */
export const chat = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    let vectorStore = vectorStoreService.getActiveVectorStore();

    if (!vectorStore) {
      try {
        vectorStore = await vectorStoreService.loadVectorStore();
      } catch (error) {
        return res.status(400).json({ error: 'No indexed PDF found. Please upload a PDF first.' });
      }
    }

    // Similarity search (k=4)
    const contextResults = await vectorStoreService.similaritySearch(vectorStore, question, 4);
    
    if (!contextResults.length) {
      return res.status(200).json({
        answer: 'The uploaded document does not seem to contain information related to your question.',
        context: [],
      });
    }

    const contextText = contextResults.map((res) => res.text).join('\n\n---\n\n');

    // Query Groq
    const answer = await groqService.askGroq(contextText, question);

    return res.status(200).json({
      answer,
      context: contextResults.map((c) => ({ text: c.text, metadata: c.metadata })),
    });
  } catch (error) {
    console.error('Chat Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
