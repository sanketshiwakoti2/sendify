'use client'
import { useState } from 'react';
import QRCode from 'qrcode';

export default function Home() {
  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState('');
  const [qrCode, setQrCode] = useState('');

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.downloadLink) {
        setDownloadLink(data.downloadLink);
        const qr = await QRCode.toDataURL(data.downloadLink);
        setQrCode(qr);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-lg p-6 bg-gray-700 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Share Large Files Securely</h1>
        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
          {downloadLink && (
            <>
              <p className="text-green-400">File uploaded successfully! Share this link:</p>
              <a href={downloadLink} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                {downloadLink}
              </a>
              {qrCode && <img src={qrCode} alt="QR Code" className="w-40 h-40 mt-4 rounded-lg" />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
