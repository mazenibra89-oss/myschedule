import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: 'Course ID is required.' });
  }

  if (req.method === 'PUT') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { name, code, day, time, room, color, sks, lecturer, extraSchedules } = body;

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (code !== undefined) updateData.code = code;
      if (day !== undefined) updateData.day = day;
      if (time !== undefined) updateData.time = time;
      if (room !== undefined) updateData.room = room;
      if (color !== undefined) updateData.color = color;
      if (sks !== undefined) updateData.sks = Number(sks);
      if (lecturer !== undefined) updateData.lecturer = lecturer;
      if (extraSchedules !== undefined) {
        updateData.extraSchedules = Array.isArray(extraSchedules) ? extraSchedules : [extraSchedules];
      }

      const existingCourse = await prisma.course.findUnique({
        where: { id: String(id) },
      });

      if (!existingCourse) {
        const upsertedCourse = await prisma.course.create({
          data: {
            id: String(id),
            name: name || 'Mata Kuliah Baru',
            code: code || '',
            day: day || 'Senin',
            time: time || '08:00 - 10:30',
            room: room || 'Daring',
            color: color || '#0099dd',
            sks: sks ? Number(sks) : 3,
            lecturer: lecturer || '',
            extraSchedules: extraSchedules ? (Array.isArray(extraSchedules) ? extraSchedules : [extraSchedules]) : [],
          },
        });

        return res.status(200).json({
          success: true,
          message: 'Course created via upsert in PostgreSQL database.',
          course: upsertedCourse,
        });
      }

      const updatedCourse = await prisma.course.update({
        where: { id: String(id) },
        data: updateData,
      });

      return res.status(200).json({
        success: true,
        message: 'Course updated successfully in PostgreSQL database.',
        course: updatedCourse,
      });
    } catch (error) {
      console.error('[PUT /api/courses/[id] Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to update course in PostgreSQL database.',
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.course.delete({
        where: { id: String(id) },
      });

      return res.status(200).json({
        success: true,
        message: 'Course deleted successfully from PostgreSQL database.',
        id: id,
      });
    } catch (error) {
      console.error('[DELETE /api/courses/[id] Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete course from PostgreSQL database.',
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
