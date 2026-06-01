import fs from 'fs/promises';
import path from 'path';
import * as pdfService from '../services/pdfService.js';
import * as vectorStoreService from '../services/vectorStoreService.js';

/**
 * Handle PDF upload, text extraction, and vector store building.
 */
export const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file received.' });
    }

    const fileBuffer = await fs.readFile(req.file.path);
    const parsed = await pdfService.extractAndChunkPdf(fileBuffer, req.file.originalname);

    if (!parsed.chunks.length) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ error: 'PDF contained no readable text to index.' });
    }

    const vectorStore = await vectorStoreService.buildVectorStore(parsed.chunks);
    await vectorStoreService.saveVectorStore(vectorStore);

    await fs.unlink(req.file.path).catch(() => {});

    return res.status(200).json({
      success: true,
      message: 'PDF uploaded and indexed successfully.',
      filename: req.file.originalname,
      pages: parsed.pages,
      chunks: parsed.chunks.length,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
