import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      if (id) {
        const note = await prisma.note.findUnique({ where: { id: String(id) } });
        return res.status(200).json({ success: true, note });
      }
      const notes = await prisma.note.findMany({
        orderBy: { updatedAt: 'desc' },
      });
      return res.status(200).json({ success: true, count: notes.length, notes });
    } catch (error) {
      console.error('[GET /api/notes Error]:', error);
      return res.status(500).json({ success: false, error: error.message, notes: [] });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { id: bodyId, title, category, parentId, blocks } = body;

      if (!title) {
        return res.status(400).json({ success: false, error: 'Note title is required.' });
      }

      const noteData = {
        title: title,
        category: category || 'Akademik',
        parentId: parentId || null,
        blocks: blocks ? (typeof blocks === 'string' ? JSON.parse(blocks) : blocks) : [],
      };

      if (bodyId && !bodyId.startsWith('n_')) {
        noteData.id = bodyId;
      }

      const createdNote = await prisma.note.create({ data: noteData });
      return res.status(201).json({ success: true, message: 'Note created.', note: createdNote });
    } catch (error) {
      console.error('[POST /api/notes Error]:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'PUT') {
    const targetId = id || req.body?.id;
    if (!targetId) {
      return res.status(400).json({ success: false, error: 'Note ID is required.' });
    }
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

      const existingNote = await prisma.note.findUnique({ where: { id: String(targetId) } });

      if (!existingNote) {
        const upsertedNote = await prisma.note.create({
          data: {
            id: String(targetId),
            title: title || 'Untitled Note',
            category: category || 'Akademik',
            parentId: parentId || null,
            blocks: blocks ? (typeof blocks === 'string' ? JSON.parse(blocks) : blocks) : [],
          },
        });
        return res.status(200).json({ success: true, note: upsertedNote });
      }

      const updatedNote = await prisma.note.update({
        where: { id: String(targetId) },
        data: updateData,
      });
      return res.status(200).json({ success: true, note: updatedNote });
    } catch (error) {
      console.error('[PUT /api/notes Error]:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    const targetId = id || req.query.id;
    if (!targetId) {
      return res.status(400).json({ success: false, error: 'Note ID is required.' });
    }
    try {
      await prisma.note.deleteMany({
        where: { OR: [{ id: String(targetId) }, { parentId: String(targetId) }] },
      });
      return res.status(200).json({ success: true, message: 'Note deleted.' });
    } catch (error) {
      console.error('[DELETE /api/notes Error]:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
