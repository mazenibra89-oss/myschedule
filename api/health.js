import prisma from './_lib/prisma.js';
import { getDriveClient } from './_lib/googleDrive.js';

export default async function handler(req, res) {
  const status = {
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    database: { connected: false, type: 'PostgreSQL' },
    googleDrive: { authenticated: false, folderConfigured: false },
  };

  // Test Database Connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    status.database.connected = true;
  } catch (dbErr) {
    status.database.error = dbErr.message;
  }

  // Test Google Drive API Credentials
  try {
    const drive = getDriveClient();
    status.googleDrive.authenticated = true;
    status.googleDrive.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || 'Not Specified';

    if (process.env.GOOGLE_DRIVE_FOLDER_ID) {
      status.googleDrive.folderConfigured = true;
    }
  } catch (driveErr) {
    status.googleDrive.error = driveErr.message;
  }

  const httpStatus = status.database.connected && status.googleDrive.authenticated ? 200 : 500;
  return res.status(httpStatus).json(status);
}
