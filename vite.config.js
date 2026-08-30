import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dotenv from 'dotenv';
import filesIndexHandler from './api/files/index.js';
import uploadHandler from './api/files/upload.js';
import notesIndexHandler from './api/notes/index.js';
import tasksIndexHandler from './api/tasks/index.js';
import schedulesIndexHandler from './api/schedules/index.js';
import coursesIndexHandler from './api/courses/index.js';
import cronRemindersHandler from './api/cron/reminders.js';

// Load environment variables from .env
dotenv.config();

// Vite Dev Server Plugin to execute Vercel Serverless API routes on Localhost
function localApiPlugin() {
  return {
    name: 'local-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api')) return next();

        // Helper methods for Express/Vercel serverless compat
        res.status = (statusCode) => {
          res.statusCode = statusCode;
          return res;
        };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        try {
          if (pathname === '/api/files/upload') {
            return await uploadHandler(req, res);
          } else if (pathname.startsWith('/api/files')) {
            const id = pathname.replace('/api/files/', '').replace('/api/files', '');
            if (id) req.query = { ...req.query, id };
            return await filesIndexHandler(req, res);
          } else if (pathname.startsWith('/api/notes')) {
            const id = pathname.replace('/api/notes/', '').replace('/api/notes', '');
            if (id) req.query = { ...req.query, id };
            return await notesIndexHandler(req, res);
          } else if (pathname.startsWith('/api/tasks')) {
            const id = pathname.replace('/api/tasks/', '').replace('/api/tasks', '');
            if (id) req.query = { ...req.query, id };
            return await tasksIndexHandler(req, res);
          } else if (pathname.startsWith('/api/schedules')) {
            const id = pathname.replace('/api/schedules/', '').replace('/api/schedules', '');
            if (id) req.query = { ...req.query, id };
            return await schedulesIndexHandler(req, res);
          } else if (pathname.startsWith('/api/courses')) {
            const id = pathname.replace('/api/courses/', '').replace('/api/courses', '');
            if (id) req.query = { ...req.query, id };
            return await coursesIndexHandler(req, res);
          } else if (pathname === '/api/cron/reminders') {
            return await cronRemindersHandler(req, res);
          }
          next();
        } catch (err) {
          console.error('[Local Dev API Error]:', err);
          res.status(500).json({ success: false, error: err.message });
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localApiPlugin()],
});
