const fs = require('fs');

const deleteFileAfterExpiry = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // Delete the file
    console.log(`File ${filePath} has been deleted after expiration.`);
  }
};

module.exports = { deleteFileAfterExpiry };
