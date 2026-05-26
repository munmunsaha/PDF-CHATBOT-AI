function buildChatPrompt({ question, contextChunks, mode = 'pdf' }) {
  const context = (contextChunks || [])
    .map((chunk, index) => `Chunk ${index + 1}:\n${chunk.text}`)
    .join('\n\n');

  if (mode === 'general') {
    return `You are a helpful AI assistant.

Answer the user's question clearly and concisely.

Question:
${question}

Answer:`;
  }

  return `You are a PDF question-answering assistant.

Rules:
- Answer using ONLY the PDF context below.
- Do not use outside knowledge.
- Provide detailed answers.
- Use bullet points where they help clarity.
- If the answer is missing from the context, politely say you cannot find it in the document.

PDF Context:
${context || 'No relevant context found.'}

Question:
${question}

Answer:`;
}

module.exports = { buildChatPrompt };
