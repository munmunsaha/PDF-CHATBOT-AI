const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { AppError } = require('../utils/AppError');

const tempUploadDir = path.join(__dirname, '..', 'uploads', 'temp');

if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir, { recursive: true });
}

function pdfFileFilter(_req, file, cb) {
  const isPdfMime = file.mimetype === 'application/pdf';
  const isPdfExt = path.extname(file.originalname || '').toLowerCase() === '.pdf';

  if (!isPdfMime || !isPdfExt) {
    return cb(new AppError('Only PDF files are allowed.', 400));
  }

  cb(null, true);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, tempUploadDir),
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 30 * 1024 * 1024,
  },
  fileFilter: pdfFileFilter,
});

function handleUploadError(err, _req, _res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('PDF file is too large. Maximum size is 30 MB.', 413));
    }
    return next(new AppError(err.message, 400));
  }

  if (err) {
    return next(err);
  }

  next();
}

module.exports = {
  upload,
  handleUploadError,
  pdfFileFilter,
  tempUploadDir,
};
