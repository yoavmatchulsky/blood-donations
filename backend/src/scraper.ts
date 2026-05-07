import { chromium, BrowserContext } from 'playwright';
import { writeCache } from './cache';

let isRunning = false;

async function applyStealthPatches(context: BrowserContext) {
  // Passed as a string so TypeScript doesn't try to type-check browser globals
  await context.addInitScript(`
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'plugins', { get: () => { const p = [1,2,3]; p.length = 3; return p; } });
    Object.defineProperty(navigator, 'languages', { get: () => ['he-IL','he','en-US'] });
    window.chrome = { runtime: {}, loadTimes: () => ({}), csi: () => ({}), app: {} };

    const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function(type) {
      const ctx2d = this.getContext('2d');
      if (ctx2d && (this.width > 0 || this.height > 0)) {
        ctx2d.fillStyle = 'rgba(1,1,1,0.01)';
        ctx2d.fillRect(0, 0, 1, 1);
      }
      return origToDataURL.apply(this, [type]);
    };

    const origGetParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(parameter) {
      if (parameter === 37445) return 'Intel Inc.';
      if (parameter === 37446) return 'Intel Iris OpenGL Engine';
      return origGetParameter.apply(this, [parameter]);
    };
  `);
}

export async function scrapeBloodDonations(): Promise<void> {
  if (isRunning) {
    console.log('Scraper already running, skipping.');
    return;
  }
  isRunning = true;

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-first-run', '--no-default-browser-check'],
  });

  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      locale: 'he-IL',
      timezoneId: 'Asia/Jerusalem',
      viewport: { width: 1280, height: 720 },
    });

    await applyStealthPatches(context);

    const page = await context.newPage();

    const responsePromise = page.waitForResponse(
      (resp) => resp.url().includes('/umbraco/api/invoker/execute'),
      { timeout: 90_000 }
    );

    await page.goto('https://www.mdais.org/blood-donation', { waitUntil: 'domcontentloaded', timeout: 60_000 });

    const apiResponse = await responsePromise;
    const json = await apiResponse.json();
    const donations: any[] = JSON.parse(json.Result);

    writeCache(donations);
    console.log(`Cached ${donations.length} donations at ${new Date().toISOString()}`);
  } finally {
    await browser.close();
    isRunning = false;
  }
}

// Run standalone when called directly (e.g. from cron)
if (require.main === module) {
  scrapeBloodDonations()
    .then(() => process.exit(0))
    .catch((err) => { console.error('Scraper failed:', err); process.exit(1); });
}
