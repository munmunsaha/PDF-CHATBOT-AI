import pdfParse from 'pdf-parse';
import { splitTextIntoChunks } from './textChunkingService.js';

/**
 * Extract text from PDF buffer and split into chunks.
 */
export const extractAndChunkPdf = async (buffer, filename = 'uploaded.pdf') => {
  try {
    const data = await pdfParse(buffer);
    const chunkTexts = await splitTextIntoChunks(data.text);
    
    const chunks = chunkTexts.map((text, index) => ({
      text,
      metadata: {
        source: filename,
        chunkIndex: index,
      },
    }));

    return {
      filename,
      text: data.text || '',
      pages: data.numpages || 0,
      chunks,
    };
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};
