const express = require('express');
const path = require('path');
const uploadRoutes = require('./http/routes/upload.routes');
const { errorMiddleware } = require('./http/middleware/error.middleware');
const { uploadsDir } = require('./http/middleware/upload.middleware');

function createApp() {
  const app = express();

  app.use(express.static(path.join(__dirname, '../public')));
  app.use('/uploads', express.static(uploadsDir));

  app.use('/upload', uploadRoutes);

  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };
