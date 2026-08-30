import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      if (id) {
        const event = await prisma.scheduleEvent.findUnique({ where: { id: String(id) } });
        return res.status(200).json({ success: true, event });
      }
      const events = await prisma.scheduleEvent.findMany({ orderBy: { createdAt: 'desc' } });
      return res.status(200).json({ success: true, count: events.length, events });
    } catch (error) {
      console.error('[GET /api/schedules Error]:', error);
      return res.status(500).json({ success: false, error: error.message, events: [] });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { id: bodyId, title, courseId, date, day, time, location, category, color, isRecurring } = body;

      if (!title) {
        return res.status(400).json({ success: false, error: 'Schedule event title is required.' });
      }

      const eventData = {
        title,
        courseId: courseId || null,
        date: date || null,
        day: day || null,
        time: time || 'Fleksibel',
        location: location || 'Daring',
        category: category || 'Kegiatan',
        color: color || '#10b981',
        isRecurring: Boolean(isRecurring),
      };

      if (bodyId && !bodyId.startsWith('event_')) {
        eventData.id = bodyId;
      }

      const createdEvent = await prisma.scheduleEvent.create({ data: eventData });
      return res.status(201).json({ success: true, event: createdEvent });
    } catch (error) {
      console.error('[POST /api/schedules Error]:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'PUT') {
    const targetId = id || req.body?.id;
    if (!targetId) {
      return res.status(400).json({ success: false, error: 'Schedule event ID is required.' });
    }
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

      const existingEvent = await prisma.scheduleEvent.findUnique({ where: { id: String(targetId) } });

      if (!existingEvent) {
        const upsertedEvent = await prisma.scheduleEvent.create({
          data: {
            id: String(targetId),
            title: title || 'Untitled Event',
            courseId: courseId || null,
            date: date || null,
            day: day || null,
            time: time || 'Fleksibel',
            location: location || 'Daring',
            category: category || 'Kegiatan',
            color: color || '#10b981',
            isRecurring: Boolean(isRecurring),
          },
        });
        return res.status(200).json({ success: true, event: upsertedEvent });
      }

      const updatedEvent = await prisma.scheduleEvent.update({
        where: { id: String(targetId) },
        data: updateData,
      });
      return res.status(200).json({ success: true, event: updatedEvent });
    } catch (error) {
      console.error('[PUT /api/schedules Error]:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    const targetId = id || req.query.id;
    if (!targetId) {
      return res.status(400).json({ success: false, error: 'Schedule event ID is required.' });
    }
    try {
      await prisma.scheduleEvent.delete({ where: { id: String(targetId) } });
      return res.status(200).json({ success: true, message: 'Schedule event deleted.' });
    } catch (error) {
      console.error('[DELETE /api/schedules Error]:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
