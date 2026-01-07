const multer = require('multer');

function errorMiddleware(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' 
      ? 'File too large (max 10MB)' 
      : err.message;
    return res.status(400).json({ error: message });
  }

  if (err) {
    return res.status(400).json({ error: err.message });
  }

  next();
}

module.exports = { errorMiddleware };
