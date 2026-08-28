import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: 'Task ID is required.' });
  }

  if (req.method === 'PUT') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { title, courseId, category, priority, status, dueDate, description, subtasks } = body;

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (courseId !== undefined) updateData.courseId = courseId;
      if (category !== undefined) updateData.category = category;
      if (priority !== undefined) updateData.priority = priority;
      if (status !== undefined) updateData.status = status;
      if (dueDate !== undefined) updateData.dueDate = dueDate;
      if (description !== undefined) updateData.description = description;
      if (subtasks !== undefined) {
        updateData.subtasks = typeof subtasks === 'string' ? JSON.parse(subtasks) : subtasks;
      }

      // Check if task exists
      const existingTask = await prisma.task.findUnique({
        where: { id: String(id) },
      });

      if (!existingTask) {
        // Upsert if not found
        const upsertedTask = await prisma.task.create({
          data: {
            id: String(id),
            title: title || 'Untitled Task',
            courseId: courseId || 'general',
            category: category || 'Akademik',
            priority: priority || 'Sedang',
            status: status || 'belum',
            dueDate: dueDate || new Date().toISOString().split('T')[0],
            description: description || '',
            subtasks: subtasks ? (typeof subtasks === 'string' ? JSON.parse(subtasks) : subtasks) : [],
          },
        });

        return res.status(200).json({
          success: true,
          message: 'Task created via upsert in PostgreSQL database.',
          task: upsertedTask,
        });
      }

      const updatedTask = await prisma.task.update({
        where: { id: String(id) },
        data: updateData,
      });

      return res.status(200).json({
        success: true,
        message: 'Task updated successfully in PostgreSQL database.',
        task: updatedTask,
      });
    } catch (error) {
      console.error('[PUT /api/tasks/[id] Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to update task in PostgreSQL database.',
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.task.delete({
        where: { id: String(id) },
      });

      return res.status(200).json({
        success: true,
        message: 'Task deleted successfully from PostgreSQL database.',
        id: id,
      });
    } catch (error) {
      console.error('[DELETE /api/tasks/[id] Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete task from PostgreSQL database.',
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
