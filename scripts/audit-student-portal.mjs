/**
 * Audit the student portal via Login As Student impersonation
 */
import { chromium } from "playwright";
import fs from "fs";

const BASE = "https://portal.sayhellocollege.com";
const EMAIL = "***REMOVED***";
const PASSWORD = "***REMOVED***";
const OUT = "screenshots/student-portal";

async function run() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Login
  console.log("Logging in...");
  await page.goto(`${BASE}/backend`, { waitUntil: "networkidle", timeout: 30000 });
  const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
  const passInput = page.locator('input[type="password"]').first();
  if (await emailInput.count() > 0) {
    await emailInput.fill(EMAIL);
    await passInput.fill(PASSWORD);
    await page.locator('input[type="submit"], button[type="submit"]').first().click();
    await page.waitForTimeout(3000);
    await page.waitForLoadState("networkidle").catch(() => {});
  }
  console.log("  Logged in:", page.url());

  // Navigate directly to a student profile (Zara Kusmin, id=5449)
  console.log("\nNavigating to student profile...");
  await page.goto(`${BASE}/backend/students/5449`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(2000);
  console.log("  Student page:", page.url());
  await page.screenshot({ path: `${OUT}/01-student-profile-top.png`, fullPage: false });

  // Save HTML for analysis
  fs.writeFileSync(`${OUT}/student-profile.html`, await page.content());

  // Scroll down to find LOGIN AS STUDENT
  for (let i = 1; i <= 3; i++) {
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/01-student-profile-scroll${i}.png`, fullPage: false });
  }

  // Back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  // Try to find LOGIN AS STUDENT (could be a link, button, or input)
  const selectors = [
    'a:text-is("LOGIN AS STUDENT")',
    'a:has-text("Login As Student")',
    'a:has-text("Login as Student")',
    'a:has-text("LOGIN AS STUDENT")',
    'input[value*="LOGIN AS STUDENT"]',
    'button:has-text("LOGIN AS STUDENT")',
    'a[href*="impersonate"]',
    'a[href*="login_as"]',
    'a[href*="masquerade"]',
  ];

  let found = false;
  for (const sel of selectors) {
    const el = page.locator(sel).first();
    if (await el.count() > 0) {
      const isVisible = await el.isVisible().catch(() => false);
      console.log(`  Found: ${sel} (visible: ${isVisible})`);
      if (isVisible) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle", timeout: 15000 }).catch(() => {}),
          el.click(),
        ]);
        found = true;
        break;
      } else {
        // Try scrolling to it
        await el.scrollIntoViewIfNeeded().catch(() => {});
        await page.waitForTimeout(500);
        const nowVisible = await el.isVisible().catch(() => false);
        if (nowVisible) {
          await Promise.all([
            page.waitForNavigation({ waitUntil: "networkidle", timeout: 15000 }).catch(() => {}),
            el.click(),
          ]);
          found = true;
          break;
        }
      }
    }
  }

  if (!found) {
    // Search the raw HTML for "login as student" or similar
    const html = await page.content();
    const loginAsMatch = html.match(/href="([^"]*)"[^>]*>.*?LOGIN AS STUDENT/i);
    if (loginAsMatch) {
      console.log(`  Found LOGIN AS STUDENT link in HTML: ${loginAsMatch[1]}`);
      await page.goto(`${BASE}${loginAsMatch[1]}`, { waitUntil: "networkidle", timeout: 15000 });
      found = true;
    } else {
      // Look for any link with "login_as" or "impersonate"
      const allLinks = html.match(/href="[^"]*(?:login_as|impersonate|masquerade)[^"]*"/gi);
      if (allLinks) {
        console.log("  Found impersonation links in HTML:", allLinks);
        const href = allLinks[0].match(/href="([^"]*)"/)[1];
        await page.goto(`${BASE}${href}`, { waitUntil: "networkidle", timeout: 15000 });
        found = true;
      }
    }
  }

  if (found) {
    await page.waitForTimeout(2000);
    console.log("\n=== STUDENT PORTAL ===");
    console.log("  URL:", page.url());
    await page.screenshot({ path: `${OUT}/02-student-portal-home.png`, fullPage: true });
    fs.writeFileSync(`${OUT}/student-portal-home.html`, await page.content());

    // Collect all nav links
    const allLinks = await page.locator('a[href]').all();
    const linkData = [];
    const seenHrefs = new Set();
    for (const link of allLinks) {
      try {
        const text = (await link.textContent()).trim().replace(/\s+/g, " ");
        const href = await link.getAttribute("href");
        if (href && text && !seenHrefs.has(href) && !href.includes("javascript:") && !href.startsWith("#") && !href.includes("sign_out")) {
          seenHrefs.add(href);
          linkData.push({ text: text.slice(0, 80), href });
        }
      } catch (e) {}
    }
    console.log(`\n  Found ${linkData.length} unique links:`);
    linkData.forEach(l => console.log(`    [${l.text}] → ${l.href}`));
    fs.writeFileSync(`${OUT}/student-portal-links.json`, JSON.stringify(linkData, null, 2));

    // Visit each student portal page
    let pageNum = 3;
    const visited = new Set([page.url()]);
    for (const link of linkData) {
      const fullUrl = link.href.startsWith("http") ? link.href : `${BASE}${link.href}`;
      if (visited.has(fullUrl) || fullUrl.includes("sign_out") || fullUrl.includes("backend") || fullUrl.includes("editate")) continue;
      visited.add(fullUrl);

      try {
        console.log(`\n  → ${link.text}: ${fullUrl}`);
        await page.goto(fullUrl, { waitUntil: "networkidle", timeout: 15000 });
        await page.waitForTimeout(1000);
        const safeName = link.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
        const fileName = `${String(pageNum).padStart(2, "0")}-${safeName || "page"}`;

        await page.screenshot({ path: `${OUT}/${fileName}.png`, fullPage: true });
        fs.writeFileSync(`${OUT}/${safeName || "page"}.html`, await page.content());
        console.log(`    captured: ${fileName}`);

        // Scroll captures for long pages
        const height = await page.evaluate(() => document.body.scrollHeight);
        if (height > 1200) {
          for (let s = 1; s <= Math.min(3, Math.floor(height / 800)); s++) {
            await page.evaluate(() => window.scrollBy(0, 800));
            await page.waitForTimeout(300);
            await page.screenshot({ path: `${OUT}/${fileName}-s${s}.png`, fullPage: false });
          }
          await page.evaluate(() => window.scrollTo(0, 0));
        }

        pageNum++;
      } catch (e) {
        console.log(`    Error: ${e.message.slice(0, 100)}`);
      }
    }
  } else {
    console.log("\n  Could not find LOGIN AS STUDENT. Dumping visible buttons/links...");
    const btns = await page.locator('a, button, input[type="submit"]').all();
    for (const btn of btns.slice(0, 30)) {
      try {
        const text = (await btn.textContent()).trim();
        const href = await btn.getAttribute("href");
        const visible = await btn.isVisible().catch(() => false);
        if (text && visible) console.log(`    "${text}" ${href || ""}`);
      } catch (e) {}
    }
  }

  await browser.close();
  console.log(`\nDone! Screenshots in ./${OUT}/`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
