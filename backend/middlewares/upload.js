const multer = require('multer');

// Configure multer to use memory storage
// This stores the file as a Buffer in memory, which we can upload directly to ImageKit
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // limit to 5MB
  }
});

module.exports = upload;
