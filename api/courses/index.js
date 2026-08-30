import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      if (id) {
        const course = await prisma.course.findUnique({ where: { id: String(id) } });
        return res.status(200).json({ success: true, course });
      }
      const courses = await prisma.course.findMany({ orderBy: { createdAt: 'desc' } });
      return res.status(200).json({ success: true, count: courses.length, courses });
    } catch (error) {
      console.error('[GET /api/courses Error]:', error);
      return res.status(500).json({ success: false, error: error.message, courses: [] });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { id: bodyId, name, code, day, time, room, color, sks, lecturer, extraSchedulesCount, extraSchedules } = body;

      if (!name || !day || !time) {
        return res.status(400).json({ success: false, error: 'Course name, day, and time are required.' });
      }

      const courseData = {
        name,
        code: code || '',
        day,
        time,
        room: room || 'Daring',
        color: color || '#0099dd',
        sks: Number(sks) || 3,
        lecturer: lecturer || '',
        extraSchedulesCount: Number(extraSchedulesCount) || 0,
        extraSchedules: Array.isArray(extraSchedules) ? extraSchedules : [],
      };

      if (bodyId && !bodyId.startsWith('course_')) {
        courseData.id = bodyId;
      }

      const createdCourse = await prisma.course.create({ data: courseData });
      return res.status(201).json({ success: true, course: createdCourse });
    } catch (error) {
      console.error('[POST /api/courses Error]:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'PUT') {
    const targetId = id || req.body?.id;
    if (!targetId) {
      return res.status(400).json({ success: false, error: 'Course ID is required.' });
    }
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { name, code, day, time, room, color, sks, lecturer, extraSchedulesCount, extraSchedules } = body;

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (code !== undefined) updateData.code = code;
      if (day !== undefined) updateData.day = day;
      if (time !== undefined) updateData.time = time;
      if (room !== undefined) updateData.room = room;
      if (color !== undefined) updateData.color = color;
      if (sks !== undefined) updateData.sks = Number(sks);
      if (lecturer !== undefined) updateData.lecturer = lecturer;
      if (extraSchedulesCount !== undefined) updateData.extraSchedulesCount = Number(extraSchedulesCount);
      if (extraSchedules !== undefined) {
        updateData.extraSchedules = Array.isArray(extraSchedules) ? extraSchedules : [];
      }

      const existingCourse = await prisma.course.findUnique({ where: { id: String(targetId) } });

      if (!existingCourse) {
        const upsertedCourse = await prisma.course.create({
          data: {
            id: String(targetId),
            name: name || 'Mata Kuliah',
            code: code || '',
            day: day || 'Senin',
            time: time || '08:00 - 10:30',
            room: room || 'Daring',
            color: color || '#0099dd',
            sks: Number(sks) || 3,
            lecturer: lecturer || '',
            extraSchedulesCount: Number(extraSchedulesCount) || 0,
            extraSchedules: Array.isArray(extraSchedules) ? extraSchedules : [],
          },
        });
        return res.status(200).json({ success: true, course: upsertedCourse });
      }

      const updatedCourse = await prisma.course.update({
        where: { id: String(targetId) },
        data: updateData,
      });
      return res.status(200).json({ success: true, course: updatedCourse });
    } catch (error) {
      console.error('[PUT /api/courses Error]:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    const targetId = id || req.query.id;
    if (!targetId) {
      return res.status(400).json({ success: false, error: 'Course ID is required.' });
    }
    try {
      await prisma.course.delete({ where: { id: String(targetId) } });
      return res.status(200).json({ success: true, message: 'Course deleted.' });
    } catch (error) {
      console.error('[DELETE /api/courses Error]:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
