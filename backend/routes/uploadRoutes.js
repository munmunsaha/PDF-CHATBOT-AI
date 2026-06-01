import express from 'express';
import * as uploadController from '../controllers/uploadController.js';
import { upload, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post(
  '/upload',
  upload.single('pdf'),
  handleUploadError,
  uploadController.uploadPdf
);

export default router;
