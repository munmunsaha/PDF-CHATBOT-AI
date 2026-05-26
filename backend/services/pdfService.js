const pdfParse = require('pdf-parse');
const { AppError } = require('../utils/AppError');
const { splitTextIntoChunks } = require('./textChunkingService');

async function extractAndChunkPdf(buffer, filename = 'uploaded.pdf') {
  try {
    const parsed = await pdfParse(buffer);
    const chunkTexts = await splitTextIntoChunks(parsed.text);
    const chunks = chunkTexts.map((text, index) => ({
      text,
      metadata: {
        chunkIndex: index,
      },
    }));

    return {
      filename,
      text: parsed.text || '',
      pages: parsed.numpages || 0,
      chunks,
    };
  } catch (error) {
    throw new AppError(`Failed to parse PDF: ${error.message}`, 400);
  }
}

module.exports = {
  extractAndChunkPdf,
};
