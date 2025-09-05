import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to pick random items from an array
const pickRandom = (arr, num = 1) => {
  if (!arr || arr.length === 0) return [];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

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
    const fallbackPath = path.join(__dirname, 'fallback.json');
    const fallbackContent = fs.readFileSync(fallbackPath, 'utf-8');
    const fallbackData = JSON.parse(fallbackContent);

    const platformKeys = ['youtube', 'instagram', 'tiktok', 'facebook'];
    const selectedPlatforms = pickRandom(platformKeys, 4);

    const trendingTopics = selectedPlatforms.map(platformKey => {
      const platformData = fallbackData[platformKey];
      const nicheKeys = Object.keys(platformData.niches).filter(k => k !== 'default');
      const randomNicheKey = pickRandom(nicheKeys)[0] || 'default';
      const nicheData = platformData.niches[randomNicheKey];

      const topics = pickRandom(nicheData.titles, 3).map(title => ({
        title: title.text,
        description: `A trending topic in the ${randomNicheKey.replace(/_/g, ' ')} niche on ${platformKey.charAt(0).toUpperCase() + platformKey.slice(1)}.`,
      }));

      let icon, color;
      switch(platformKey) {
        case 'youtube': icon = 'Youtube'; color = 'text-red-500'; break;
        case 'instagram': icon = 'Instagram'; color = 'text-pink-500'; break;
        case 'tiktok': icon = 'TikTokIcon'; color = 'text-black'; break;
        case 'facebook': icon = 'Facebook'; color = 'text-blue-600'; break;
        default: icon = 'Globe'; color = 'text-gray-800';
      }

      return {
        platform: platformKey.charAt(0).toUpperCase() + platformKey.slice(1),
        icon: icon,
        color: color,
        topics: topics,
      };
    });

    console.log('[API Trending] Successfully served randomized trending topics from fallback.json.');
    return res.status(200).json({ topics: trendingTopics });

  } catch (error) {
    console.error('Fatal error in trending.js:', error);
    // As a final fallback, return a minimal static response
    const staticFallback = {
        topics: [{
            platform: "Trending",
            icon: "Globe",
            color: "text-gray-800",
            topics: [{ title: "AI Tools Explained", description: "Deep dives into new AI tools." }]
        }]
    };
    return res.status(500).json(staticFallback);
  }
}
