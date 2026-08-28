import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const courses = await prisma.course.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      });

      return res.status(200).json({
        success: true,
        count: courses.length,
        courses: courses,
      });
    } catch (error) {
      console.error('[GET /api/courses Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch courses from PostgreSQL database.',
        courses: [],
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { id, name, code, day, time, room, color, sks, lecturer, extraSchedules } = body;

      if (!name) {
        return res.status(400).json({ success: false, error: 'Course name is required.' });
      }

      const courseData = {
        name: name,
        code: code || '',
        day: day || 'Senin',
        time: time || '08:00 - 10:30',
        room: room || 'Daring',
        color: color || '#0099dd',
        sks: sks ? Number(sks) : 3,
        lecturer: lecturer || '',
        extraSchedules: extraSchedules ? (Array.isArray(extraSchedules) ? extraSchedules : [extraSchedules]) : [],
      };

      if (id && !id.startsWith('c_')) {
        courseData.id = id;
      }

      const createdCourse = await prisma.course.create({
        data: courseData,
      });

      return res.status(201).json({
        success: true,
        message: 'Course created successfully in PostgreSQL database.',
        course: createdCourse,
      });
    } catch (error) {
      console.error('[POST /api/courses Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to create course in PostgreSQL database.',
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
