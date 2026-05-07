import express from 'express';
import { readCache, isCacheStale, writeCache } from '../cache';
import { scrapeBloodDonations } from '../scraper';

const router = express.Router();

router.post('/', async (req, res) => {
  const cache = readCache();

  if (cache && !isCacheStale()) {
    return res.json({ success: true, data: cache.data, timestamp: cache.timestamp });
  }

  if (cache) {
    // Stale: serve immediately, refresh in the background
    scrapeBloodDonations().catch((err) => console.error('Background scrape failed:', err));
    return res.json({ success: true, data: cache.data, timestamp: cache.timestamp, stale: true });
  }

  // No cache yet — block until first scrape completes
  try {
    await scrapeBloodDonations();
    const fresh = readCache();
    if (!fresh) throw new Error('Scrape completed but cache is empty');
    return res.json({ success: true, data: fresh.data, timestamp: fresh.timestamp });
  } catch (error) {
    console.error('Scrape error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch donation data',
      timestamp: new Date().toISOString()
    });
  }
});

// Force an immediate refresh
router.post('/refresh', async (req, res) => {
  try {
    await scrapeBloodDonations();
    const cache = readCache();
    res.json({ success: true, count: cache?.data.length ?? 0, timestamp: cache?.timestamp });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Refresh failed',
    });
  }
});

// Receive data pushed from a trusted machine (laptop) — used when server IP is WAF-blocked
router.post('/push', (req, res) => {
  const secret = process.env.PUSH_SECRET;
  if (!secret) return res.status(500).json({ success: false, error: 'PUSH_SECRET not configured' });

  const auth = req.headers['authorization'];
  if (auth !== `Bearer ${secret}`) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const { data } = req.body;
  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ success: false, error: 'Invalid data' });
  }

  writeCache(data);
  console.log(`Cache updated via push: ${data.length} donations at ${new Date().toISOString()}`);
  res.json({ success: true, count: data.length });
});

router.get('/health', (req, res) => {
  const cache = readCache();
  res.json({
    status: 'OK',
    service: 'Blood Donations',
    cacheTimestamp: cache?.timestamp ?? null,
    stale: isCacheStale(),
    timestamp: new Date().toISOString()
  });
});

export { router as bloodDonationsRouter };
