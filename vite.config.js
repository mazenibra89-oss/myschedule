import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dotenv from 'dotenv';
import healthHandler from './api/health.js';
import filesIndexHandler from './api/files/index.js';
import uploadHandler from './api/files/upload.js';
import fileDetailHandler from './api/files/[id].js';
import notesIndexHandler from './api/notes/index.js';
import noteDetailHandler from './api/notes/[id].js';
import tasksIndexHandler from './api/tasks/index.js';
import taskDetailHandler from './api/tasks/[id].js';

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
          if (pathname === '/api/health') {
            return await healthHandler(req, res);
          } else if (pathname === '/api/files/upload') {
            return await uploadHandler(req, res);
          } else if (pathname === '/api/files') {
            return await filesIndexHandler(req, res);
          } else if (pathname.startsWith('/api/files/')) {
            const id = pathname.replace('/api/files/', '');
            req.query = { ...req.query, id };
            return await fileDetailHandler(req, res);
          } else if (pathname === '/api/notes') {
            return await notesIndexHandler(req, res);
          } else if (pathname.startsWith('/api/notes/')) {
            const id = pathname.replace('/api/notes/', '');
            req.query = { ...req.query, id };
            return await noteDetailHandler(req, res);
          } else if (pathname === '/api/tasks') {
            return await tasksIndexHandler(req, res);
          } else if (pathname.startsWith('/api/tasks/')) {
            const id = pathname.replace('/api/tasks/', '');
            req.query = { ...req.query, id };
            return await taskDetailHandler(req, res);
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
