import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ['\n\n', '\n', '. ', ' ', ''],
});

/**
 * Split text into chunks using RecursiveCharacterTextSplitter.
 */
export const splitTextIntoChunks = async (text) => {
  const normalizedText = String(text || '').trim();
  if (!normalizedText) {
    return [];
  }

  const chunks = await splitter.splitText(normalizedText);
  return chunks.map((chunk) => chunk.trim()).filter(Boolean);
};
