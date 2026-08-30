import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      if (id) {
        const task = await prisma.task.findUnique({ where: { id: String(id) } });
        return res.status(200).json({ success: true, task });
      }
      const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
      return res.status(200).json({ success: true, count: tasks.length, tasks });
    } catch (error) {
      console.error('[GET /api/tasks Error]:', error);
      return res.status(500).json({ success: false, error: error.message, tasks: [] });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { id: bodyId, title, courseId, category, priority, status, dueDate, dueTime, description, subtasks } = body;

      if (!title || !dueDate) {
        return res.status(400).json({ success: false, error: 'Task title and dueDate are required.' });
      }

      const taskData = {
        title,
        courseId: courseId || 'general',
        category: category || 'Akademik',
        priority: priority || 'Sedang',
        status: status || 'belum',
        dueDate,
        dueTime: dueTime || '23:59',
        description: description || null,
        subtasks: subtasks ? (typeof subtasks === 'string' ? JSON.parse(subtasks) : subtasks) : [],
      };

      if (bodyId && !bodyId.startsWith('task_')) {
        taskData.id = bodyId;
      }

      const createdTask = await prisma.task.create({ data: taskData });
      return res.status(201).json({ success: true, task: createdTask });
    } catch (error) {
      console.error('[POST /api/tasks Error]:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'PUT') {
    const targetId = id || req.body?.id;
    if (!targetId) {
      return res.status(400).json({ success: false, error: 'Task ID is required.' });
    }
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { title, courseId, category, priority, status, dueDate, dueTime, description, subtasks } = body;

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (courseId !== undefined) updateData.courseId = courseId;
      if (category !== undefined) updateData.category = category;
      if (priority !== undefined) updateData.priority = priority;
      if (status !== undefined) updateData.status = status;
      if (dueDate !== undefined) updateData.dueDate = dueDate;
      if (dueTime !== undefined) updateData.dueTime = dueTime;
      if (description !== undefined) updateData.description = description;
      if (subtasks !== undefined) {
        updateData.subtasks = typeof subtasks === 'string' ? JSON.parse(subtasks) : subtasks;
      }

      const existingTask = await prisma.task.findUnique({ where: { id: String(targetId) } });

      if (!existingTask) {
        const upsertedTask = await prisma.task.create({
          data: {
            id: String(targetId),
            title: title || 'Untitled Task',
            courseId: courseId || 'general',
            category: category || 'Akademik',
            priority: priority || 'Sedang',
            status: status || 'belum',
            dueDate: dueDate || new Date().toISOString().split('T')[0],
            dueTime: dueTime || '23:59',
            description: description || null,
            subtasks: subtasks ? (typeof subtasks === 'string' ? JSON.parse(subtasks) : subtasks) : [],
          },
        });
        return res.status(200).json({ success: true, task: upsertedTask });
      }

      const updatedTask = await prisma.task.update({
        where: { id: String(targetId) },
        data: updateData,
      });
      return res.status(200).json({ success: true, task: updatedTask });
    } catch (error) {
      console.error('[PUT /api/tasks Error]:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    const targetId = id || req.query.id;
    if (!targetId) {
      return res.status(400).json({ success: false, error: 'Task ID is required.' });
    }
    try {
      await prisma.task.delete({ where: { id: String(targetId) } });
      return res.status(200).json({ success: true, message: 'Task deleted.' });
    } catch (error) {
      console.error('[DELETE /api/tasks Error]:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
