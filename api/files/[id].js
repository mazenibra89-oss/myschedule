import prisma from '../_lib/prisma.js';
import { deleteFileFromDrive } from '../_lib/googleDrive.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      // 1. Find file record in PostgreSQL
      let fileRecord;
      try {
        fileRecord = await prisma.fileMetadata.findUnique({
          where: { id: String(id) },
        });
      } catch (findErr) {
        console.warn('[PostgreSQL] Could not find file record:', findErr.message);
      }

      if (!fileRecord && String(id).startsWith('drive_')) {
        fileRecord = { drive_file_id: String(id).replace('drive_', '') };
      }

      // 2. Delete file from Google Drive if drive_file_id is available
      if (fileRecord?.drive_file_id) {
        try {
          await deleteFileFromDrive(fileRecord.drive_file_id);
        } catch (driveErr) {
          console.warn('[Google Drive] File deletion warning:', driveErr.message);
        }
      }

      // 3. Delete record from PostgreSQL database
      if (fileRecord?.id) {
        await prisma.fileMetadata.delete({
          where: { id: fileRecord.id },
        });
      }

      return res.status(200).json({
        success: true,
        message: 'File successfully deleted from PostgreSQL database and Google Drive.',
        id: id,
      });
    } catch (error) {
      console.error('[DELETE /api/files/[id] Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete file.',
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
