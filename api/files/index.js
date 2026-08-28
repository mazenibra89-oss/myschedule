import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const files = await prisma.fileMetadata.findMany({
        orderBy: {
          created_at: 'desc',
        },
      });

      return res.status(200).json({
        success: true,
        count: files.length,
        files: files,
      });
    } catch (error) {
      console.error('[GET /api/files Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch files from PostgreSQL database.',
        files: [],
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
