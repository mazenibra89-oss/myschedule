import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawFilename = req.headers['x-filename'] || `file-${Date.now()}`;
    const filename = decodeURIComponent(rawFilename);
    const contentType = req.headers['content-type'] || 'application/octet-stream';

    // Upload langsung data stream ke Vercel Blob
    const blob = await put(filename, req, {
      access: 'public',
      contentType,
    });

    return res.status(200).json({
      success: true,
      file: {
        id: blob.url,
        name: filename,
        mimeType: contentType,
        webViewLink: blob.url,
        webContentLink: blob.downloadUrl,
      },
    });
  } catch (error) {
    console.error('[Vercel Blob Upload Error]:', error);
    return res.status(500).json({ error: error.message });
  }
}