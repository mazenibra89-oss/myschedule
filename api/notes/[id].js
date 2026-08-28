import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: 'Note ID is required.' });
  }

  if (req.method === 'PUT') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { title, category, parentId, blocks } = body;

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (category !== undefined) updateData.category = category;
      if (parentId !== undefined) updateData.parentId = parentId;
      if (blocks !== undefined) {
        updateData.blocks = typeof blocks === 'string' ? JSON.parse(blocks) : blocks;
      }

      // Check if note exists
      const existingNote = await prisma.note.findUnique({
        where: { id: String(id) },
      });

      if (!existingNote) {
        // Upsert if not found
        const upsertedNote = await prisma.note.create({
          data: {
            id: String(id),
            title: title || 'Untitled Note',
            category: category || 'Kuliah',
            parentId: parentId || null,
            blocks: blocks ? (typeof blocks === 'string' ? JSON.parse(blocks) : blocks) : [],
          },
        });

        return res.status(200).json({
          success: true,
          message: 'Note created via upsert in PostgreSQL database.',
          note: upsertedNote,
        });
      }

      const updatedNote = await prisma.note.update({
        where: { id: String(id) },
        data: updateData,
      });

      return res.status(200).json({
        success: true,
        message: 'Note updated successfully in PostgreSQL database.',
        note: updatedNote,
      });
    } catch (error) {
      console.error('[PUT /api/notes/[id] Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to update note in PostgreSQL database.',
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Delete child notes first if any
      await prisma.note.deleteMany({
        where: { parentId: String(id) },
      });

      // Delete note
      await prisma.note.delete({
        where: { id: String(id) },
      });

      return res.status(200).json({
        success: true,
        message: 'Note deleted successfully from PostgreSQL database.',
        id: id,
      });
    } catch (error) {
      console.error('[DELETE /api/notes/[id] Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete note from PostgreSQL database.',
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
