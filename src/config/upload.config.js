const path = require('path');

const TEN_MB = 10 * 1024 * 1024;

module.exports = {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || String(TEN_MB), 10),
  uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'),
  allowedExtensions: /jpeg|jpg|png|gif|webp|pdf|doc|docx|txt|zip|mp3|mp4/,
  allowedMimePatterns: ['image/', 'video/', 'audio/', 'application/pdf', 'document']
};
