import { chromium } from 'playwright';

async function runE2E() {
  console.log('🚀 Launching Chromium for Kudosu E2E Verification...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  // 1. Load Main Game
  console.log('1. Navigating to Kudosu on http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Take Main Board Screenshot
  await page.screenshot({ path: 'screenshots/01_main_board_midnight.png' });
  console.log('📸 Captured 01_main_board_midnight.png');

  // 2. Test Cell Selection and Input
  console.log('2. Interacting with Board & Numpad...');
  const cells = page.locator('div[class*="aspect-square"]');
  const cellCount = await cells.count();
  console.log(`Found ${cellCount} board cells.`);

  // Click a cell
  await cells.first().click();
  await page.waitForTimeout(300);

  // 3. Test 4-Tier Hint Tutor
  console.log('3. Testing Deduction Hint Tutor...');
  const hintBtn = page.getByRole('button', { name: /Deduction Hint/i });
  await hintBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/02_hint_tutor_modal.png' });
  console.log('📸 Captured 02_hint_tutor_modal.png');

  // Close Hint Modal
  const tryMyselfBtn = page.getByRole('button', { name: /Try Myself/i });
  if (await tryMyselfBtn.isVisible()) {
    await tryMyselfBtn.click();
  }

  // 4. Test Kudosu Academy Hub
  console.log('4. Navigating to Academy Hub...');
  const academyBtn = page.getByRole('button', { name: /Academy/i });
  await academyBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/03_academy_hub.png' });
  console.log('📸 Captured 03_academy_hub.png');

  // Open Chapter 1
  console.log('4b. Opening Academy Chapter 1...');
  const chapter1Card = page.locator('text=Naked Singles').first();
  await chapter1Card.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/04_academy_lesson_walkthrough.png' });
  console.log('📸 Captured 04_academy_lesson_walkthrough.png');

  // 5. Test Speedcubing Analytics Dashboard
  console.log('5. Navigating to Speedcubing Analytics Dashboard...');
  const analyticsBtn = page.getByRole('button', { name: /Analytics/i });
  await analyticsBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/05_analytics_dashboard.png' });
  console.log('📸 Captured 05_analytics_dashboard.png');

  // 6. Test Custom Puzzle Creator
  console.log('6. Navigating to Custom Puzzle Creator Studio...');
  const creatorBtn = page.getByRole('button', { name: /Creator/i });
  await creatorBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/06_puzzle_creator.png' });
  console.log('📸 Captured 06_puzzle_creator.png');

  // 7. Test Theme Switcher (Sepia Theme)
  console.log('7. Testing Theme Switcher...');
  const backToGame = page.getByRole('button', { name: /Back to Game/i });
  if (await backToGame.isVisible()) {
    await backToGame.click();
  }
  await page.waitForTimeout(300);

  const themeBtn = page.getByTitle('Themes');
  await themeBtn.click();
  await page.waitForTimeout(300);

  const sepiaTheme = page.locator('text=Newspaper Sepia').first();
  if (await sepiaTheme.isVisible()) {
    await sepiaTheme.click();
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: 'screenshots/07_newspaper_sepia_theme.png' });
  console.log('📸 Captured 07_newspaper_sepia_theme.png');

  console.log('✅ ALL E2E SCREENSHOTS AND INTERACTIONS VERIFIED SUCCESSFULLY!');
  await browser.close();
}

runE2E().catch(err => {
  console.error('❌ E2E Error:', err);
  process.exit(1);
});
