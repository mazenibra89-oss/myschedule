import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const notes = await prisma.note.findMany({
        orderBy: {
          updatedAt: 'desc',
        },
      });

      return res.status(200).json({
        success: true,
        count: notes.length,
        notes: notes,
      });
    } catch (error) {
      console.error('[GET /api/notes Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch notes from PostgreSQL database.',
        notes: [],
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { id, title, category, parentId, blocks } = body;

      if (!title) {
        return res.status(400).json({ success: false, error: 'Note title is required.' });
      }

      const noteData = {
        title: title,
        category: category || 'Kuliah',
        parentId: parentId || null,
        blocks: blocks ? (typeof blocks === 'string' ? JSON.parse(blocks) : blocks) : [],
      };

      if (id && !id.startsWith('n_')) {
        noteData.id = id;
      }

      const createdNote = await prisma.note.create({
        data: noteData,
      });

      return res.status(201).json({
        success: true,
        message: 'Note created successfully in PostgreSQL database.',
        note: createdNote,
      });
    } catch (error) {
      console.error('[POST /api/notes Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to create note in PostgreSQL database.',
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
