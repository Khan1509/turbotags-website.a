import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This is a simple mock API for development.
// In a real production scenario, this would fetch data from a live source.
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // For local dev, we read from a file. In Vercel, this file would be bundled.
    const filePath = path.resolve(process.cwd(), 'src/data/trendingTopicsData.js');
    
    if (fs.existsSync(filePath)) {
      // Dynamically import the ES module
      const fileUrl = path.toFileUrl(filePath).href;
      const { trendingTopicsData } = await import(fileUrl);
      
      console.log('[API Trending] Successfully fetched trending topics from local data.');
      return res.status(200).json({ topics: trendingTopicsData });
    } else {
      console.error(`[API Trending] Data file not found at: ${filePath}`);
      return res.status(404).json({ error: 'Not Found', message: 'Trending topics data file not found.' });
    }
  } catch (error) {
    console.error('Fatal error in trending.js:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred while fetching trending topics.'
    });
  }
}
