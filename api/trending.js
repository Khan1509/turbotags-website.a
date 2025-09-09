import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const fallbackPath = path.join(process.cwd(), 'public', 'data', 'fallback-trending.json');
    const data = await fs.readFile(fallbackPath, 'utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache for 1 hour
    return res.status(200).json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading trending topics fallback:', error);
    return res.status(500).json({ error: 'Failed to load trending topics.' });
  }
}
