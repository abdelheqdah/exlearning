// Production build smoke test
const { chromium } = require('playwright');
const BASE = 'http://localhost:4173';
const results = [];

function log(test, status, detail = '') {
  results.push({ test, status, detail });
  console.log(`[${status}] ${test}${detail ? ': ' + detail : ''}`);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleErrors = [];
  page.on('pageerror', err => consoleErrors.push(err.message));

  try {
    // 1. Dashboard loads
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    const title = await page.title();
    log('Prod: Dashboard loads', title.includes('ExLearn') ? 'PASS' : 'FAIL', title);
    
    const heading = await page.textContent('h1');
    log('Prod: Main heading', heading ? 'PASS' : 'FAIL', heading);
    
    // 2. Navigate all sections
    await page.click('button:has-text("Lessons")');
    await page.waitForTimeout(1000);
    const lessonsContent = await page.evaluate(() => document.body.innerText);
    log('Prod: Lessons page', lessonsContent.includes('Lesson') || lessonsContent.includes('Module') ? 'PASS' : 'FAIL');
    
    await page.click('button:has-text("Quizzes")');
    await page.waitForTimeout(1000);
    const quizzesContent = await page.evaluate(() => document.body.innerText);
    log('Prod: Quizzes page', quizzesContent.includes('Quiz') || quizzesContent.includes('quiz') ? 'PASS' : 'FAIL');
    
    await page.click('button:has-text("Scenarios")');
    await page.waitForTimeout(1000);
    const scenariosContent = await page.evaluate(() => document.body.innerText);
    log('Prod: Scenarios page', scenariosContent.includes('Scenario') || scenariosContent.includes('scenario') ? 'PASS' : 'FAIL');
    
    await page.click('button:has-text("Progress")');
    await page.waitForTimeout(1000);
    const progressContent = await page.evaluate(() => document.body.innerText);
    log('Prod: Progress page', progressContent.includes('Progress') || progressContent.includes('progress') || progressContent.includes('Dashboard') ? 'PASS' : 'FAIL');
    
    await page.click('button.nav-about');
    await page.waitForTimeout(1000);
    const aboutContent = await page.evaluate(() => document.body.innerText);
    log('Prod: About page', aboutContent.includes('About') || aboutContent.includes('ExLearn') ? 'PASS' : 'FAIL');
    
    // 3. Quiz interaction on production
    await page.click('button:has-text("Quizzes")');
    await page.waitForTimeout(1000);
    const startBtns = await page.$$('button.text-button');
    if (startBtns.length > 0) {
      await startBtns[0].click();
      await page.waitForTimeout(2000);
      
      const radioInputs = await page.$$('input[type="radio"]');
      log('Prod: Quiz loads with options', radioInputs.length >= 4 ? 'PASS' : 'FAIL', `${radioInputs.length} radio inputs`);
      
      if (radioInputs.length >= 4) {
        await radioInputs[2].click();
        await page.waitForTimeout(300);
        
        // If 2nd question exists, answer it too
        if (radioInputs.length >= 8) {
          await radioInputs[7].click();
          await page.waitForTimeout(300);
        }
        
        await page.click('button:has-text("Submit")');
        await page.waitForTimeout(2000);
        
        const afterSubmit = await page.evaluate(() => document.body.innerText);
        const hasResult = afterSubmit.includes('RESULT') || afterSubmit.includes('100') || afterSubmit.includes('Correct');
        log('Prod: Quiz submit + results', hasResult ? 'PASS' : 'FAIL');
      }
    }
    
    // 4. Persistence
    const store = await page.evaluate(() => localStorage.getItem('exlearn-progress-v1'));
    log('Prod: LocalStorage works', store ? 'PASS' : 'WARN', store ? `${store.length} chars` : 'empty');
    
    await page.reload({ waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    const storeAfter = await page.evaluate(() => localStorage.getItem('exlearn-progress-v1'));
    log('Prod: Persistence after reload', store === storeAfter ? 'PASS' : 'FAIL');
    
    // 5. Console errors
    const filteredErrors = consoleErrors.filter(e => !e.includes('favicon'));
    log('Prod: Console errors', filteredErrors.length === 0 ? 'PASS' : 'FAIL',
        filteredErrors.length === 0 ? 'None' : filteredErrors.join(' | '));

  } catch(e) {
    log('CRITICAL', 'FAIL', e.message);
    console.error(e);
  }

  console.log('\n========================================');
  console.log('PRODUCTION SMOKE TEST SUMMARY');
  console.log('========================================');
  const passes = results.filter(r => r.status === 'PASS').length;
  const fails = results.filter(r => r.status === 'FAIL').length;
  console.log(`PASS: ${passes}  FAIL: ${fails}  WARN: ${results.filter(r => r.status === 'WARN').length}`);
  console.log('========================================');
  
  if (fails > 0) {
    console.log('\nFAILED:');
    results.filter(r => r.status === 'FAIL').forEach(r => console.log(`  - ${r.test}: ${r.detail}`));
  }

  await browser.close();
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
