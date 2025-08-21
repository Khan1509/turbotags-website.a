import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

// Import the handler function
import apiHandler from './api/generate.js';

// Custom Vite plugin to emulate Vercel's serverless functions in development
function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev-plugin',
    configureServer(server) {
      server.middlewares.use('/api/generate', (req, res) => {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          if (req.method === 'POST' && body) {
            try {
              req.body = JSON.parse(body);
            } catch (e) {
              req.body = {};
            }
          } else {
            req.body = {};
          }

          // Shim Express-like res methods onto Node's native res object
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return res;
          };
          
          try {
            await apiHandler(req, res);
          } catch (error) {
            console.error('Error in API handler middleware:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
        });
      });
    },
  };
}


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiDevPlugin()],
})
