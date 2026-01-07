const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

const uploadsDir = config.upload.uploadDir;
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const extOk = config.upload.allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeOk = config.upload.allowedMimePatterns.some(
    pattern => file.mimetype.includes(pattern)
  );
  cb(null, extOk || mimeOk);
};

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSize },
  fileFilter
});

module.exports = { upload, uploadsDir };
