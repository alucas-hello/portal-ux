/**
 * Screenshot all pages for visual verification
 */
import { chromium } from "playwright";
import fs from "fs";

const BASE = "http://localhost:3003/portal-ux/";
const OUT = "screenshots/verification";

async function run() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  async function snap(name) {
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
    console.log(`  ✓ ${name}`);
  }

  await page.goto(BASE);
  await page.waitForTimeout(1000);

  // Expand sidebar - use JS to set state directly since SVG path matching is fragile
  await page.evaluate(() => {
    // Find the sidebar toggle button (last button in the sidebar column)
    const sidebar = document.querySelector('nav')?.closest('div');
    if (sidebar) {
      const toggleBtn = sidebar.querySelector(':scope > button:last-child')
        || sidebar.parentElement.querySelector(':scope > button:last-child');
      if (toggleBtn) toggleBtn.click();
    }
  });
  await page.waitForTimeout(500);

  // Check if expanded
  let sidebarOk = await page.locator('nav span:has-text("Dashboard")').first().isVisible().catch(() => false);
  if (!sidebarOk) {
    // Try clicking any button with the chevron SVG
    const allBtns = await page.locator('button:has(svg)').all();
    for (const btn of allBtns) {
      const html = await btn.innerHTML().catch(() => "");
      if (html.includes("M9 18") || html.includes("rotate")) {
        await btn.click();
        await page.waitForTimeout(500);
        sidebarOk = await page.locator('nav span:has-text("Dashboard")').first().isVisible().catch(() => false);
        if (sidebarOk) break;
      }
    }
  }
  console.log(`  Sidebar expanded: ${sidebarOk}`);

  // Dashboard tabs
  await snap("01-dashboard-counselor");

  const tasksTab = page.locator('button:has-text("Tasks & Workshops")').first();
  if (await tasksTab.isVisible().catch(() => false)) {
    await tasksTab.click();
    await page.waitForTimeout(500);
    await snap("02-dashboard-tasks");
  }

  const essayTab = page.locator('button:has-text("Essay Coach")').first();
  if (await essayTab.isVisible().catch(() => false)) {
    await essayTab.click();
    await page.waitForTimeout(500);
    await snap("03-dashboard-essay-coach");
  }

  const tutorTab = page.locator('button:has-text("Tutor")').first();
  if (await tutorTab.isVisible().catch(() => false)) {
    await tutorTab.click();
    await page.waitForTimeout(500);
    await snap("04-dashboard-tutor");
  }

  // Nav pages
  const navPages = [
    { label: "Colleges", file: "05-colleges" },
    { label: "High Schools", file: "06-high-schools" },
    { label: "Registration", file: "07-registration" },
    { label: "Time Tracker", file: "08-time-tracker" },
    { label: "Reports", file: "09-reports" },
    { label: "Programs", file: "10-programs" },
    { label: "Services", file: "11-services" },
    { label: "Settings", file: "12-settings" },
    { label: "Product Order", file: "13-product-order" },
  ];

  // Switch to Admin role to see all nav items
  const adminBtn = page.locator('button:has-text("Admin")').first();
  if (await adminBtn.isVisible().catch(() => false)) {
    await adminBtn.click();
    await page.waitForTimeout(500);
  }

  // Re-expand sidebar if collapsed after role switch
  const sidebarCheck = await page.locator('nav span:has-text("Dashboard")').first().isVisible().catch(() => false);
  if (!sidebarCheck) {
    const allBtns2 = await page.locator('button:has(svg)').all();
    for (const btn of allBtns2) {
      const html = await btn.innerHTML().catch(() => "");
      if (html.includes("M9 18") || html.includes("rotate")) {
        await btn.click();
        await page.waitForTimeout(500);
        if (await page.locator('nav span:has-text("Dashboard")').first().isVisible().catch(() => false)) break;
      }
    }
  }

  // Debug: list all nav span texts
  const navSpans = await page.locator('nav span').all();
  const navTexts = [];
  for (const s of navSpans) {
    const t = await s.textContent().catch(() => "");
    if (t) navTexts.push(t.trim());
  }
  console.log(`  Nav items visible: ${navTexts.join(", ")}`);

  for (const pg of navPages) {
    const navBtn = page.locator(`nav button:has(span:text-is("${pg.label}"))`).first();
    if (await navBtn.isVisible().catch(() => false)) {
      await navBtn.click();
      await page.waitForTimeout(500);
      await snap(pg.file);
    } else {
      console.log(`  ✗ ${pg.label} nav button not found`);
    }
  }

  // Go to dashboard, click a student for student detail
  const dashBtn = page.locator('nav button:has(span:has-text("Dashboard"))').first();
  if (await dashBtn.isVisible().catch(() => false)) {
    await dashBtn.click();
    await page.waitForTimeout(500);
  }

  // Click Counselor tab first
  const counselorTab = page.locator('button:has-text("Counselor")').nth(1);
  if (await counselorTab.isVisible().catch(() => false)) {
    await counselorTab.click();
    await page.waitForTimeout(500);
  }

  const studentLink = page.locator('button:has-text("Aguilar")').first();
  if (await studentLink.isVisible().catch(() => false)) {
    await studentLink.click();
    await page.waitForTimeout(500);
    await snap("14-student-detail");

    // Scroll to capture more
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(300);
    await snap("14-student-detail-s1");
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(300);
    await snap("14-student-detail-s2");

    // Click LOGIN AS STUDENT
    const loginBtn = page.locator('button:has-text("LOGIN AS STUDENT")').first();
    if (await loginBtn.isVisible().catch(() => false)) {
      await loginBtn.click();
      await page.waitForTimeout(500);
      await snap("15-student-portal-home");

      // Navigate student portal pages
      const collegesNav = page.locator('button:has-text("COLLEGES")').first();
      if (await collegesNav.isVisible().catch(() => false)) {
        await collegesNav.click();
        await page.waitForTimeout(300);
        const searchLink = page.locator('button:has-text("College Search")').first();
        if (await searchLink.isVisible().catch(() => false)) {
          await searchLink.click();
          await page.waitForTimeout(500);
          await snap("16-student-college-search");
        }

        await collegesNav.click();
        await page.waitForTimeout(300);
        const listLink = page.locator('button:has-text("College List")').first();
        if (await listLink.isVisible().catch(() => false)) {
          await listLink.click();
          await page.waitForTimeout(500);
          await snap("17-student-college-list");
        }
      }

      const resourcesNav = page.locator('button:has-text("RESOURCES")').first();
      if (await resourcesNav.isVisible().catch(() => false)) {
        await resourcesNav.click();
        await page.waitForTimeout(500);
        await snap("18-student-resources");
      }

      const schedulingNav = page.locator('button:has-text("SCHEDULING")').first();
      if (await schedulingNav.isVisible().catch(() => false)) {
        await schedulingNav.click();
        await page.waitForTimeout(500);
        await snap("19-student-scheduling");
      }

      // Revert to admin
      const revertBtn = page.locator('button:has-text("REVERT TO ADMIN")').first();
      if (await revertBtn.isVisible().catch(() => false)) {
        await revertBtn.click();
        await page.waitForTimeout(500);
      }
    }
  }

  // Role switches
  for (const role of ["Counselor", "Essay Coach", "Tutor"]) {
    const roleBtn = page.locator(`button:has-text("${role}")`).first();
    if (await roleBtn.isVisible().catch(() => false)) {
      await roleBtn.click();
      await page.waitForTimeout(500);
      await snap(`20-role-${role.toLowerCase().replace(/ /g, "-")}`);
    }
  }

  await browser.close();
  console.log(`\nAll screenshots saved to ./${OUT}/`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
