const fs = require('fs/promises');
const pdfParse = require('pdf-parse');
const { AppError } = require('../utils/AppError');

async function extractTextFromPdf(filePath) {
  if (!filePath) {
    throw new AppError('Uploaded file path is missing.', 400);
  }

  try {
    const buffer = await fs.readFile(filePath);
    const parsed = await pdfParse(buffer);

    return {
      text: parsed.text || '',
      pages: parsed.numpages || 0,
    };
  } catch (error) {
    throw new AppError(`Failed to extract text from PDF: ${error.message}`, 400);
  }
}

module.exports = {
  extractTextFromPdf,
};
