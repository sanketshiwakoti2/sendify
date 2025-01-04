const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { generateQRCode } = require('./utils/generateQRCode');
const { deleteFileAfterExpiry } = require('./utils/deleteFile');
require('dotenv').config();

const app = express();
const uploadDir = process.env.UPLOADS_DIR;
const port = process.env.PORT || 3001;

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create upload directory if it doesn't exist
}

// Enable CORS for all origins (you can customize the origin if needed)
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow any origin or set your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.static('public')); // Serve static files (e.g., HTML, CSS, JS)

app.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = uploadDir;
  form.keepExtensions = true;
  form.maxFileSize = 15 * 1024 * 1024 * 1024; // Max size 15GB

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'File upload failed' });

    const uploadedFile = files.file[0];
    const originalFilename = uploadedFile.originalFilename;  // Get original filename
    const filePath = path.join(uploadDir, originalFilename);  // Save with original filename

    // Move file from temporary location to desired directory with original name
    fs.renameSync(uploadedFile.filepath, filePath);

    // Set expiration time for the uploaded file
    const expirationTime = Date.now() + parseInt(process.env.EXPIRE_TIME);

    // Save the expiration time
    fs.writeFileSync(`${filePath}.txt`, expirationTime.toString());

    // Schedule deletion after expiration time
    setTimeout(() => {
      deleteFileAfterExpiry(filePath);
    }, process.env.EXPIRE_TIME);

    // Generate download link
    const downloadLink = `http://localhost:${port}/download/${originalFilename}`;
    const qrCode = generateQRCode(downloadLink);

    res.status(200).json({
      downloadLink,
      qrCode
    });
  });
});

app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);

  if (fs.existsSync(filePath)) {
    // Serve the download UI
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Downloading File...</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #1e1e1e;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            text-align: center;
          }
          .loading {
            font-size: 1.5rem;
            margin-bottom: 20px;
          }
          .download-button {
            padding: 10px 20px;
            font-size: 1rem;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="loading">Starting your download...</div>
          <button class="download-button" onclick="startDownload()">Download Now</button>
        </div>
        <script>
          function startDownload() {
            // Initiate the download process
            window.location.href = '/downloadFile/${filename}';
            document.querySelector('.loading').textContent = 'Your file is being downloaded...';
          }
        </script>
      </body>
      </html>
    `);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

app.get('/downloadFile/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
