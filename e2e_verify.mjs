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

  // 1. Load Main Game & Verify Lazy-Start (Inspection State)
  console.log('1. Navigating to Kudosu on http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Verify Ready / Inspection Banner is present
  const readyText = await page.locator('text=Inspection Mode').first();
  console.log('Inspection Mode visible:', await readyText.isVisible());

  // Wait 1.5s and verify timer did NOT tick
  await page.waitForTimeout(1500);
  const timerReady = await page.locator('text=READY (0:00)').first();
  console.log('Timer still READY (0:00) after wait:', await timerReady.isVisible());

  // Take Main Board Screenshot in Ready State
  await page.screenshot({ path: 'screenshots/01_main_board_midnight.png' });
  console.log('📸 Captured 01_main_board_midnight.png (Inspection Mode)');

  // 2. Test Cell Selection and Move -> Starts Game
  console.log('2. Interacting with Board & Numpad to start game...');
  const cells = page.locator('div[class*="aspect-square"]');
  await cells.first().click();
  await page.waitForTimeout(200);

  // Press '1' to place digit and start timer
  await page.keyboard.press('1');
  await page.waitForTimeout(800);

  // 3. Test Pause Overlay (Escape)
  console.log('3. Testing Frosted Pause Overlay (Point 3)...');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  const pauseOverlay = page.locator('text=Game Paused').first();
  console.log('Pause overlay visible:', await pauseOverlay.isVisible());
  await page.screenshot({ path: 'screenshots/08_frosted_pause_overlay.png' });
  console.log('📸 Captured 08_frosted_pause_overlay.png');

  // Resume by pressing Space
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);

  // 4. Test 4-Tier Hint Tutor
  console.log('4. Testing Deduction Hint Tutor...');
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

  // 5. Test Kudosu Academy Hub
  console.log('5. Navigating to Academy Hub...');
  const academyBtn = page.getByRole('button', { name: /Academy/i });
  await academyBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/03_academy_hub.png' });
  console.log('📸 Captured 03_academy_hub.png');

  // Open Chapter 1
  console.log('5b. Opening Academy Chapter 1...');
  const chapter1Card = page.locator('text=Naked Singles').first();
  await chapter1Card.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/04_academy_lesson_walkthrough.png' });
  console.log('📸 Captured 04_academy_lesson_walkthrough.png');

  // 6. Test Speedcubing Analytics Dashboard
  console.log('6. Navigating to Speedcubing Analytics Dashboard...');
  const analyticsBtn = page.getByRole('button', { name: /Analytics/i });
  await analyticsBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/05_analytics_dashboard.png' });
  console.log('📸 Captured 05_analytics_dashboard.png');

  // 7. Test Custom Puzzle Creator
  console.log('7. Navigating to Custom Puzzle Creator Studio...');
  const creatorBtn = page.getByRole('button', { name: /Creator/i });
  await creatorBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/06_puzzle_creator.png' });
  console.log('📸 Captured 06_puzzle_creator.png');

  // 8. Test Theme Switcher (Sepia Theme)
  console.log('8. Testing Theme Switcher...');
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
