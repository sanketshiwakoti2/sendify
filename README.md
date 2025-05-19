# Sendify

Sendify is a file-sharing application that enables users to upload large files and share them securely via generated download links and QR codes. It comes with automatic file expiration and deletion, making it a practical solution for temporary file sharing needs.

## Features

- **File Upload:** Upload files up to 15GB.
- **File Sharing:** Generate shareable links with QR codes.
- **Auto Deletion:** Files are automatically deleted after a configurable expiration time (default: 12 hours).
- **Simple UI:** A minimalistic and user-friendly interface for both uploading and downloading files.
- **Cross-Origin Request Handling (CORS):** Proper CORS support for frontend-backend communication.

## Tech Stack

- **Backend:** Node.js, Express.js
- **File Handling:** Formidable
- **QR Code Generation:** `qrcode` library
- **File Deletion:** Custom script for auto-deleting files after expiration
- **Frontend:** HTML, CSS, JavaScript (React/Vue can be used if extended)
- **Environment Variables:** `.env` for configurations

## Installation

### Prerequisites

1. [Node.js](https://nodejs.org/en/) installed on your machine.
2. A `.env` file for setting environment variables like `UPLOADS_DIR` (file storage path) and `EXPIRE_TIME` (file expiration time in milliseconds).

### Steps to Run Locally

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/sanketshiwakoti2/sendify.git
   cd sendify
   ```

2. **Install Backend Dependencies:**

   Navigate to the `backend` folder and run:

   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**

   Navigate to the `frontend` folder and run:

   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables:**

   In the `backend` folder, create a `.env` file and add the following variables:

   ```env
   UPLOADS_DIR=./uploads
   EXPIRE_TIME=43200000  # 12 hours in milliseconds
   PORT=3001
   FRONTEND_URL=http://localhost:3000  # or your frontend URL if deployed elsewhere
   ```

5. **Start the Backend Server:**

   In the `backend` folder, run:

   ```bash
   cd backend
   node server.js
   ```

   This will start the backend server on [http://localhost:3001](http://localhost:3001).

6. **Start the Frontend Server:**

   Go back to the `frontend` folder and run:

   ```bash
   cd frontend
   npm start
   ```

   The frontend will now be accessible at [http://localhost:3000](http://localhost:3000).

## Usage

1. **Upload a file:**
   - Open the frontend page and select a file to upload.
   - Click "Upload" to initiate the upload process.
   - After the file is uploaded, you will receive a download link along with a QR code for easy sharing.

2. **Download a file:**
   - Use the generated download link or scan the QR code to download the file.

3. **File Expiration and Auto Deletion:**
   - Uploaded files will automatically expire after the set time (12 hours by default). The file will be deleted from the server once the expiration time is reached.

## File Deletion

Files are automatically deleted based on the expiration time set in the `.env` file. This ensures that files are not stored indefinitely, helping to save server space.


## Acknowledgements

- **Node.js:** Backend runtime environment.
- **Express.js:** Web framework for building the server.
- **Formidable:** For handling file uploads efficiently.
- **QR Code Generator:** For generating QR codes for file links.

---

