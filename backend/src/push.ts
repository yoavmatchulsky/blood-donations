import 'dotenv/config';
import { scrapeBloodDonations } from './scraper';
import { readCache } from './cache';

const SERVER_URL = process.env.SERVER_URL;
const PUSH_SECRET = process.env.PUSH_SECRET;

if (!SERVER_URL || !PUSH_SECRET) {
  console.error('Missing SERVER_URL or PUSH_SECRET in .env');
  process.exit(1);
}

(async () => {
  console.log('Scraping MDA blood donations...');
  await scrapeBloodDonations();

  const cache = readCache();
  if (!cache) {
    console.error('Scrape completed but no cache found');
    process.exit(1);
  }

  console.log(`Scraped ${cache.data.length} donations. Pushing to ${SERVER_URL}...`);

  const response = await fetch(`${SERVER_URL}/api/blood-donations/push`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PUSH_SECRET}`,
    },
    body: JSON.stringify({ data: cache.data }),
  });

  const result = await response.json() as { success: boolean; count?: number; error?: string };
  if (!result.success) throw new Error(result.error ?? 'Push failed');

  console.log(`Done — server cache updated with ${result.count} donations.`);
})().catch((err) => {
  console.error('Push failed:', err.message);
  process.exit(1);
});
