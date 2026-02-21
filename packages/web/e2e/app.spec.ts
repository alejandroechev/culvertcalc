import { test, expect, type Page } from '@playwright/test';

// ── Selectors ────────────────────────────────────────────────────────
// The shape select is inside .sidebar, the sample select is in .toolbar.
// Labels aren't associated via for/id, so we locate inputs by their
// parent .form-group which contains the label text.

const shapeSelect = (p: Page) => p.locator('.sidebar select').first();
const sampleSelect = (p: Page) => p.locator('.toolbar select');
const fieldInput = (p: Page, label: string) =>
  p.locator('.form-group', { has: p.locator(`label:has-text("${label}")`) }).locator('input');
const fieldSelect = (p: Page, label: string) =>
  p.locator('.form-group', { has: p.locator(`label:has-text("${label}")`) }).locator('select');
const hwValue = (p: Page) =>
  p.locator('.result-item', { hasText: 'Headwater' }).locator('.value');

async function waitForResults(page: Page) {
  await expect(page.locator('.result-grid')).toBeVisible({ timeout: 5000 });
}

async function getHW(page: Page): Promise<number> {
  await waitForResults(page);
  const txt = await hwValue(page).textContent();
  return Number(txt);
}

// ── Core Workflow ────────────────────────────────────────────────────

test.describe('Core Workflow', () => {
  test('page loads with default circular culvert and auto-calculates', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.toolbar h1')).toContainText('CulvertCalc');

    // Shape defaults to circular
    await expect(shapeSelect(page)).toHaveValue('circular');

    // Diameter field visible
    await expect(fieldInput(page, 'Diameter')).toBeVisible();

    // Auto-calculation produces results
    await waitForResults(page);
  });

  test('HW result displayed and rating curve chart visible', async ({ page }) => {
    await page.goto('/');
    const hw = await getHW(page);
    expect(hw).toBeGreaterThan(0);

    // Chart card visible
    await expect(page.locator('h2', { hasText: 'HW-Q Rating Curve' })).toBeVisible();
    await expect(page.locator('.chart-container svg').first()).toBeVisible();
  });

  test('SVG culvert preview shows correct shape (circle)', async ({ page }) => {
    await page.goto('/');
    await waitForResults(page);
    const crossSection = page.locator('.cross-section svg');
    await expect(crossSection).toBeVisible();
    await expect(crossSection.locator('circle')).toBeVisible();
  });
});

// ── Shape Switching ──────────────────────────────────────────────────

test.describe('Shape Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForResults(page);
  });

  test('switch to Rectangular → span/rise fields appear, rect SVG', async ({ page }) => {
    await shapeSelect(page).selectOption('rectangular');
    await waitForResults(page);
    await expect(fieldInput(page, 'Span')).toBeVisible();
    await expect(fieldInput(page, 'Rise')).toBeVisible();
    await expect(fieldInput(page, 'Diameter')).not.toBeVisible();
    await expect(page.locator('.cross-section svg rect')).toBeVisible();
  });

  test('switch to Elliptical → span/rise fields, ellipse SVG', async ({ page }) => {
    await shapeSelect(page).selectOption('elliptical');
    await waitForResults(page);
    await expect(fieldInput(page, 'Span')).toBeVisible();
    await expect(fieldInput(page, 'Rise')).toBeVisible();
    await expect(page.locator('.cross-section svg ellipse')).toBeVisible();
  });

  test('switch back to Circular → diameter returns, circle SVG', async ({ page }) => {
    await shapeSelect(page).selectOption('rectangular');
    await waitForResults(page);
    await shapeSelect(page).selectOption('circular');
    await waitForResults(page);
    await expect(fieldInput(page, 'Diameter')).toBeVisible();
    await expect(fieldInput(page, 'Span')).not.toBeVisible();
    await expect(page.locator('.cross-section svg circle')).toBeVisible();
  });

  test('each shape produces valid (positive) headwater', async ({ page }) => {
    for (const shape of ['circular', 'rectangular', 'elliptical'] as const) {
      await shapeSelect(page).selectOption(shape);
      const hw = await getHW(page);
      expect(hw, `HW for ${shape}`).toBeGreaterThan(0);
    }
  });
});

// ── Samples ──────────────────────────────────────────────────────────

const SAMPLE_NAMES = [
  'HDS-5 Example 1: 36″ CMP Pipe',
  'Highway Crossing Box Culvert',
  'Low-Flow Driveway Pipe',
  'Large Storm Drain (60″ RCP)',
  'Elliptical Culvert',
  'Outlet Control Dominant',
];

test.describe('Samples', () => {
  test('dropdown lists all 6 samples', async ({ page }) => {
    await page.goto('/');
    const sel = sampleSelect(page);
    const options = sel.locator('option');
    const count = await options.count();
    expect(count).toBe(SAMPLE_NAMES.length + 1); // +1 for placeholder
    for (const name of SAMPLE_NAMES) {
      await expect(options.filter({ hasText: name })).toHaveCount(1);
    }
  });

  for (const [idx, name] of SAMPLE_NAMES.entries()) {
    test(`load sample "${name}" → results update`, async ({ page }) => {
      await page.goto('/');
      await sampleSelect(page).selectOption({ index: idx + 1 });
      const hw = await getHW(page);
      expect(hw).toBeGreaterThan(0);
    });
  }
});

// ── Input Validation ─────────────────────────────────────────────────

test.describe('Input Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForResults(page);
  });

  test('enter 0 for diameter → error message or no crash', async ({ page }) => {
    await fieldInput(page, 'Diameter').fill('0');
    await page.waitForTimeout(500);
    const errorVisible = await page.locator('.card', { hasText: '⚠' }).isVisible();
    const resultsVisible = await page.locator('.result-grid').isVisible();
    expect(errorVisible || resultsVisible).toBeTruthy();
  });

  test('enter negative slope → handles gracefully', async ({ page }) => {
    await fieldInput(page, 'Slope').fill('-0.01');
    await page.waitForTimeout(500);
    const errorVisible = await page.locator('.card', { hasText: '⚠' }).isVisible();
    const resultsVisible = await page.locator('.result-grid').isVisible();
    expect(errorVisible || resultsVisible).toBeTruthy();
  });

  test('enter very large Q → results still computed', async ({ page }) => {
    await fieldInput(page, 'Design Flow').fill('10000');
    const hw = await getHW(page);
    expect(hw).toBeGreaterThan(0);
  });

  test('clear required field → error or keeps previous value', async ({ page }) => {
    await fieldInput(page, 'Diameter').fill('');
    await page.waitForTimeout(500);
    const errorVisible = await page.locator('.card', { hasText: '⚠' }).isVisible();
    const resultsVisible = await page.locator('.result-grid').isVisible();
    expect(errorVisible || resultsVisible).toBeTruthy();
  });
});

// ── Results ──────────────────────────────────────────────────────────

test.describe('Results', () => {
  test('rating curve chart has inlet and outlet control lines', async ({ page }) => {
    await page.goto('/');
    await waitForResults(page);
    await expect(page.locator('.recharts-legend-item', { hasText: 'Inlet Control' })).toBeVisible();
    await expect(page.locator('.recharts-legend-item', { hasText: 'Outlet Control' })).toBeVisible();
    await expect(page.locator('.recharts-legend-item', { hasText: 'Controlling' })).toBeVisible();
  });

  test('rating curve has data points (SVG paths rendered)', async ({ page }) => {
    await page.goto('/');
    await waitForResults(page);
    const paths = page.locator('.chart-container .recharts-line-curve');
    const count = await paths.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('controlling condition badge shows inlet or outlet', async ({ page }) => {
    await page.goto('/');
    await waitForResults(page);
    const badge = page.locator('.condition-badge');
    await expect(badge).toBeVisible();
    const text = await badge.textContent();
    expect(text).toMatch(/Inlet Control|Outlet Control/);
  });

  test('report section exists in DOM (print-only)', async ({ page }) => {
    await page.goto('/');
    await waitForResults(page);
    const report = page.locator('.print-report');
    await expect(report).toBeAttached();
    await expect(report.locator('h1')).toContainText('CulvertCalc');
  });
});

// ── UI ───────────────────────────────────────────────────────────────

test.describe('UI', () => {
  test('theme toggle switches dark/light', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    const themeBtn = page.locator('.toolbar button').last();
    await themeBtn.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await themeBtn.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('Guide button exists in toolbar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.toolbar button', { hasText: 'Guide' })).toBeVisible();
  });

  test('New button resets form to defaults', async ({ page }) => {
    await page.goto('/');
    await sampleSelect(page).selectOption({ index: 2 });
    await waitForResults(page);
    await page.locator('.toolbar button', { hasText: 'New' }).click();
    await expect(shapeSelect(page)).toHaveValue('circular');
  });

  test('responsive layout stacks on narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 800 });
    await page.goto('/');
    await waitForResults(page);
    const grid = page.locator('.main-grid');
    const columns = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    const colCount = columns.split(' ').length;
    expect(colCount).toBe(1);
  });
});
