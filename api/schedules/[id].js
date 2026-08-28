import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: 'Schedule Event ID is required.' });
  }

  if (req.method === 'PUT') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { title, courseId, date, day, time, location, category, color, isRecurring } = body;

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (courseId !== undefined) updateData.courseId = courseId;
      if (date !== undefined) updateData.date = date;
      if (day !== undefined) updateData.day = day;
      if (time !== undefined) updateData.time = time;
      if (location !== undefined) updateData.location = location;
      if (category !== undefined) updateData.category = category;
      if (color !== undefined) updateData.color = color;
      if (isRecurring !== undefined) updateData.isRecurring = Boolean(isRecurring);

      const existingEvent = await prisma.scheduleEvent.findUnique({
        where: { id: String(id) },
      });

      if (!existingEvent) {
        const upsertedEvent = await prisma.scheduleEvent.create({
          data: {
            id: String(id),
            title: title || 'Untitled Event',
            courseId: courseId || null,
            date: date || null,
            day: day || null,
            time: time || 'Fleksibel',
            location: location || 'Daring',
            category: category || 'Kegiatan',
            color: color || '#10b981',
            isRecurring: isRecurring !== undefined ? Boolean(isRecurring) : false,
          },
        });

        return res.status(200).json({
          success: true,
          message: 'Schedule event created via upsert in PostgreSQL database.',
          event: upsertedEvent,
        });
      }

      const updatedEvent = await prisma.scheduleEvent.update({
        where: { id: String(id) },
        data: updateData,
      });

      return res.status(200).json({
        success: true,
        message: 'Schedule event updated successfully in PostgreSQL database.',
        event: updatedEvent,
      });
    } catch (error) {
      console.error('[PUT /api/schedules/[id] Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to update schedule event in PostgreSQL database.',
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.scheduleEvent.delete({
        where: { id: String(id) },
      });

      return res.status(200).json({
        success: true,
        message: 'Schedule event deleted successfully from PostgreSQL database.',
        id: id,
      });
    } catch (error) {
      console.error('[DELETE /api/schedules/[id] Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete schedule event from PostgreSQL database.',
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
