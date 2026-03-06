/**
 * Visual verification script — takes screenshots of every view in the prototype.
 * Usage: node scripts/screenshot.mjs
 * Requires: dev server running on localhost:3000
 */
import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const OUT = "screenshots";

async function run() {
  const fs = await import("fs");
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  async function snap(name) {
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
    console.log(`  captured: ${name}`);
  }

  await page.goto(BASE);
  await page.waitForTimeout(1000);

  // First, expand the sidebar so nav labels are visible
  const toggleArrow = page.locator('button svg[viewBox="0 0 24 24"]').last();
  // The toggle button is at the bottom of the sidebar — click the parent button
  const sidebarToggle = page.locator('button:has(svg path[d="M9 18l6-6-6-6"])');
  if (await sidebarToggle.count() > 0) {
    await sidebarToggle.click();
    await page.waitForTimeout(500);
  }

  // Dashboard views by role
  const roles = ["Admin", "Counselor", "Essay Coach", "Tutor"];
  for (const role of roles) {
    const roleBtn = page.locator(`button:has-text("${role}")`).first();
    if (await roleBtn.isVisible().catch(() => false)) {
      await roleBtn.click();
      await page.waitForTimeout(500);
    }
    await snap(`dashboard-${role.toLowerCase().replace(/ /g, "-")}`);
  }

  // Switch back to Admin for full nav access
  const adminBtn = page.locator('button:has-text("Admin")').first();
  if (await adminBtn.isVisible().catch(() => false)) {
    await adminBtn.click();
    await page.waitForTimeout(300);
  }

  // Click nav items by their visible label text in the expanded sidebar
  const navPages = [
    { label: "Colleges", file: "page-colleges" },
    { label: "High Schools", file: "page-high-schools" },
    { label: "Registration", file: "page-registration" },
    { label: "Time Tracker", file: "page-time-tracker" },
    { label: "Reports", file: "page-reports" },
    { label: "Programs", file: "page-programs" },
    { label: "Services", file: "page-services" },
    { label: "Settings", file: "page-settings" },
  ];

  for (const pg of navPages) {
    const navBtn = page.locator(`nav button span:has-text("${pg.label}")`).first();
    if (await navBtn.isVisible().catch(() => false)) {
      await navBtn.click();
      await page.waitForTimeout(500);
    }
    await snap(pg.file);
  }

  // Go back to dashboard
  const dashBtn = page.locator('nav button span:has-text("Dashboard")').first();
  if (await dashBtn.isVisible().catch(() => false)) {
    await dashBtn.click();
    await page.waitForTimeout(500);
  }

  // Click Tasks & Workshops tab
  const tasksTab = page.locator('button:has-text("Tasks & Workshops")').first();
  if (await tasksTab.isVisible().catch(() => false)) {
    await tasksTab.click();
    await page.waitForTimeout(500);
    await snap("page-tasks");
  }

  // Go back to counselor tab and click first student
  const counselorTab = page.locator('button:has-text("Counselor")').nth(1);
  if (await counselorTab.isVisible().catch(() => false)) {
    await counselorTab.click();
    await page.waitForTimeout(500);
  }

  const studentLink = page.locator('button:has-text("Aguilar")').first();
  if (await studentLink.isVisible().catch(() => false)) {
    await studentLink.click();
    await page.waitForTimeout(500);
    await snap("student-detail");

    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(300);
    await snap("student-detail-scroll1");

    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(300);
    await snap("student-detail-scroll2");
  }

  await browser.close();
  console.log("\nAll screenshots saved to ./screenshots/");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
