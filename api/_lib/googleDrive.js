import { google } from 'googleapis';
import { Readable } from 'stream';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

/**
 * Initializes and returns an authenticated Google Drive client using Service Account credentials.
 */
export function getDriveClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error('Google Drive API credentials missing in environment variables (GOOGLE_CLIENT_EMAIL / GOOGLE_PRIVATE_KEY).');
  }

  // Handle line breaks and quotes in environment variables
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });

  return google.drive({ version: 'v3', auth });
}

/**
 * Convert buffer to Readable stream for googleapis file upload.
 */
function bufferToStream(buffer) {
  const readable = new Readable();
  readable._read = () => { };
  readable.push(buffer);
  readable.push(null);
  return readable;
}

/**
 * Uploads a file buffer to Google Drive via Service Account.
 * Sets permission so anyone with the link can view the file.
 *
 * @param {Object} options
 * @param {Buffer} options.buffer - File buffer
 * @param {string} options.fileName - File name
 * @param {string} options.mimeType - File MIME type
 * @returns {Promise<{ driveFileId: string, webViewLink: string, webContentLink: string }>}
 */
export async function uploadFileToDrive({ buffer, fileName, mimeType }) {
  const drive = getDriveClient();
  let folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!folderId) {
    throw new Error('GOOGLE_DRIVE_FOLDER_ID is missing in environment variables. Service account cannot upload without a destination folder.');
  }

  folderId = folderId.trim();
  if (folderId.includes('/folders/')) {
    const match = folderId.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (match) folderId = match[1];
  }

  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType: mimeType || 'application/octet-stream',
    body: bufferToStream(buffer),
  };

  // 1. Upload File with supportsAllDrives enabled
  const fileRes = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, name, mimeType, webViewLink, webContentLink',
    supportsAllDrives: true,
  });

  const driveFileId = fileRes.data.id;
  const webViewLink = fileRes.data.webViewLink || `https://drive.google.com/file/d/${driveFileId}/view?usp=sharing`;
  const webContentLink = fileRes.data.webContentLink || `https://drive.google.com/uc?id=${driveFileId}&export=download`;

  // 2. Set Permissions (Anyone with link can read)
  try {
    await drive.permissions.create({
      fileId: driveFileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
      supportsAllDrives: true,
    });
  } catch (permError) {
    console.warn(`[GoogleDrive] Permission setting warning for file ${driveFileId}:`, permError.message);
  }

  return {
    driveFileId,
    webViewLink,
    webContentLink,
  };
}

/**
 * Deletes a file from Google Drive by ID.
 * @param {string} driveFileId
 */
export async function deleteFileFromDrive(driveFileId) {
  if (!driveFileId) return;
  const drive = getDriveClient();
  await drive.files.delete({
    fileId: driveFileId,
    supportsAllDrives: true,
  });
}

/**
 * Retrieves file metadata from Google Drive.
 * @param {string} driveFileId
 */
export async function getDriveFileMetadata(driveFileId) {
  const drive = getDriveClient();
  const response = await drive.files.get({
    fileId: driveFileId,
    fields: 'id, name, mimeType, size, webViewLink, webContentLink',
    supportsAllDrives: true,
  });
  return response.data;
}