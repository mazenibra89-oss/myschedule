import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const events = await prisma.scheduleEvent.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json({
        success: true,
        count: events.length,
        events: events,
      });
    } catch (error) {
      console.error('[GET /api/schedules Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch schedule events from PostgreSQL database.',
        events: [],
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { id, title, courseId, date, day, time, location, category, color, isRecurring } = body;

      if (!title) {
        return res.status(400).json({ success: false, error: 'Schedule title is required.' });
      }

      const eventData = {
        title: title,
        courseId: courseId || null,
        date: date || null,
        day: day || null,
        time: time || 'Fleksibel',
        location: location || 'Daring',
        category: category || 'Kegiatan',
        color: color || '#10b981',
        isRecurring: isRecurring !== undefined ? Boolean(isRecurring) : false,
      };

      if (id && !id.startsWith('e_')) {
        eventData.id = id;
      }

      const createdEvent = await prisma.scheduleEvent.create({
        data: eventData,
      });

      return res.status(201).json({
        success: true,
        message: 'Schedule event created successfully in PostgreSQL database.',
        event: createdEvent,
      });
    } catch (error) {
      console.error('[POST /api/schedules Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to create schedule event in PostgreSQL database.',
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
