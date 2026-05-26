const pdfService = require('../services/pdfService');
const vectorStoreService = require('../services/vectorStoreService');
const aiService = require('../services/aiService');
const { AppError } = require('../utils/AppError');

let activeDocument = null;

exports.uploadPdf = async (req, res) => {
  if (!req.file) {
    throw new AppError('No PDF file received.', 400);
  }

  const parsed = await pdfService.extractAndChunkPdf(req.file.buffer, req.file.originalname);
  if (!parsed.chunks.length) {
    throw new AppError('PDF contained no readable text.', 400);
  }

  const vectorStore = await vectorStoreService.buildVectorStore(parsed.chunks);
  vectorStoreService.setActiveVectorStore(vectorStore);
  await vectorStoreService.saveVectorStore(vectorStore);

  activeDocument = {
    name: req.file.originalname,
    size: req.file.size,
    chunks: parsed.chunks.length,
    uploadedAt: new Date().toISOString(),
  };

  return res.status(200).json({
    success: true,
    message: 'PDF uploaded and indexed successfully.',
    document: activeDocument,
  });
};

exports.askQuestion = async (req, res) => {
  const question = req.body?.question;

  if (!question || typeof question !== 'string' || !question.trim()) {
    throw new AppError('Question is required.', 400);
  }

  const result = await aiService.answerQuestion(question);

  return res.status(200).json({
    success: true,
    answer: result.answer,
    context: result.context,
    document: activeDocument,
  });
};
