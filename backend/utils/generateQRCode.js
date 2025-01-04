const QRCode = require('qrcode');

const generateQRCode = async (url) => {
  try {
    const qrCode = await QRCode.toDataURL(url);
    return qrCode;
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
};

module.exports = { generateQRCode };
