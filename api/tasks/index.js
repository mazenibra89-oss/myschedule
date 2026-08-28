import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const tasks = await prisma.task.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json({
        success: true,
        count: tasks.length,
        tasks: tasks,
      });
    } catch (error) {
      console.error('[GET /api/tasks Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch tasks from PostgreSQL database.',
        tasks: [],
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { id, title, courseId, category, priority, status, dueDate, description, subtasks } = body;

      if (!title) {
        return res.status(400).json({ success: false, error: 'Task title is required.' });
      }

      const taskData = {
        title: title,
        courseId: courseId || 'general',
        category: category || 'Akademik',
        priority: priority || 'Sedang',
        status: status || 'belum',
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        description: description || '',
        subtasks: subtasks ? (typeof subtasks === 'string' ? JSON.parse(subtasks) : subtasks) : [],
      };

      if (id && !id.startsWith('t_')) {
        taskData.id = id;
      }

      const createdTask = await prisma.task.create({
        data: taskData,
      });

      return res.status(201).json({
        success: true,
        message: 'Task created successfully in PostgreSQL database.',
        task: createdTask,
      });
    } catch (error) {
      console.error('[POST /api/tasks Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to create task in PostgreSQL database.',
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
