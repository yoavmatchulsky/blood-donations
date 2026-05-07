import fs from 'fs';
import path from 'path';

const CACHE_PATH = path.join(__dirname, '../data/cache.json');
const TTL_MS = 24 * 60 * 60 * 1000;

interface Cache {
  timestamp: string;
  data: any[];
}

export function readCache(): Cache | null {
  try {
    if (!fs.existsSync(CACHE_PATH)) return null;
    return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
  } catch {
    return null;
  }
}

export function writeCache(data: any[]): void {
  const dir = path.dirname(CACHE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify({ timestamp: new Date().toISOString(), data }, null, 2), 'utf-8');
}

export function isCacheStale(): boolean {
  const cache = readCache();
  if (!cache) return true;
  return Date.now() - new Date(cache.timestamp).getTime() > TTL_MS;
}
