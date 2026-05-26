const fs = require('fs/promises');
const path = require('path');
const { AppError } = require('../utils/AppError');
const pdfService = require('../services/pdfService');
const vectorStoreService = require('../services/vectorStoreService');

exports.uploadPdf = async (req, res) => {
  if (!req.file) {
    throw new AppError('No PDF file received.', 400);
  }

  const fileBuffer = await fs.readFile(req.file.path);
  const parsed = await pdfService.extractAndChunkPdf(fileBuffer, req.file.originalname);

  if (!parsed.chunks.length) {
    await fs.unlink(req.file.path).catch(() => {});
    throw new AppError('PDF contained no readable text to index.', 400);
  }

  const vectorStore = await vectorStoreService.buildVectorStore(parsed.chunks);
  vectorStoreService.setActiveVectorStore(vectorStore);
  await vectorStoreService.saveVectorStore(vectorStore);

  await fs.unlink(req.file.path).catch(() => {});

  return res.status(200).json({
    success: true,
    message: 'PDF uploaded, text extracted, and document indexed successfully.',
    filename: req.file.originalname,
    extractedText: parsed.text,
    pages: parsed.pages,
    size: req.file.size,
    storedAs: path.basename(req.file.path),
    document: {
      name: req.file.originalname,
      size: req.file.size,
      chunks: parsed.chunks.length,
    },
  });
};
