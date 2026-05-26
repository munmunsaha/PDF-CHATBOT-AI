let RecursiveCharacterTextSplitter;

try {
  ({ RecursiveCharacterTextSplitter } = require('@langchain/textsplitters'));
} catch (_error) {
  ({ RecursiveCharacterTextSplitter } = require('langchain/text_splitter'));
}

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ['\n\n', '\n', '. ', ' ', ''],
});

async function splitTextIntoChunks(text) {
  const normalizedText = String(text || '').trim();
  if (!normalizedText) {
    return [];
  }

  const chunks = await splitter.splitText(normalizedText);
  return chunks.map((chunk) => chunk.trim()).filter(Boolean);
}

module.exports = {
  splitTextIntoChunks,
};
