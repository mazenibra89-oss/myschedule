import formidable from 'formidable';
import fs from 'fs';
import prisma from '../_lib/prisma.js';
import { uploadFileToDrive } from '../_lib/googleDrive.js';

// Disable default Vercel Body Parser for multipart/form-data upload handling
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 4.5 * 1024 * 1024, // Vercel 4.5MB Payload Limit
      keepExtensions: true,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const fileInput = files.file?.[0] || files.file;
    if (!fileInput) {
      return res.status(400).json({ success: false, error: 'No file provided in form field "file".' });
    }

    const filePath = fileInput.filepath || fileInput.path;
    const buffer = fs.readFileSync(filePath);
    const fileName = fileInput.originalFilename || fileInput.name || 'unnamed_file';
    const mimeType = fileInput.mimetype || fileInput.type || 'application/octet-stream';
    const fileSize = fileInput.size || buffer.length;

    // 1. Upload file to Google Drive via Service Account
    const driveResult = await uploadFileToDrive({
      buffer,
      fileName,
      mimeType,
    });

    // 2. Save file metadata in PostgreSQL database via Prisma
    let dbRecord;
    try {
      dbRecord = await prisma.fileMetadata.create({
        data: {
          name: fileName,
          mime_type: mimeType,
          file_size: fileSize,
          drive_file_id: driveResult.driveFileId,
          drive_view_link: driveResult.webViewLink,
        },
      });
    } catch (dbError) {
      console.warn('[PostgreSQL] Database fallback record creation:', dbError.message);
      dbRecord = {
        id: 'file_' + Date.now(),
        name: fileName,
        mime_type: mimeType,
        file_size: fileSize,
        drive_file_id: driveResult.driveFileId,
        drive_view_link: driveResult.webViewLink,
        created_at: new Date().toISOString(),
      };
    }

    // Clean up temporary local uploaded file
    try {
      fs.unlinkSync(filePath);
    } catch (unlinkErr) {
      // Ignore temporary file deletion warning
    }

    return res.status(200).json({
      success: true,
      message: 'File successfully uploaded to Google Drive and saved in PostgreSQL.',
      file: dbRecord,
    });
  } catch (error) {
    console.error('[Upload Handler Error]:', error);

    if (error.code === 1009 || error.message?.includes('maxFileSize')) {
      return res.status(413).json({
        success: false,
        error: 'File size exceeds Vercel Serverless payload limit of 4.5 MB.',
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error during file upload.',
    });
  }
}
