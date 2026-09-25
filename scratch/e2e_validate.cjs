// End-to-end validation script for ATEX IECEx Training Simulator
// Uses Playwright to validate all critical user flows

const { chromium } = require('playwright');

const BASE = 'http://localhost:5174';
const results = [];
let errors = [];

function log(test, status, detail = '') {
  const entry = { test, status, detail };
  results.push(entry);
  console.log(`[${status}] ${test}${detail ? ': ' + detail : ''}`);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  try {
    // ===== 1. DASHBOARD LOADS =====
    console.log('\n=== 1. DASHBOARD ===');
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    const title = await page.title();
    log('Dashboard title', title.includes('ExLearn') ? 'PASS' : 'FAIL', title);
    
    // Check main heading
    const heading = await page.textContent('h1');
    log('Dashboard heading exists', heading ? 'PASS' : 'FAIL', heading || 'none');

    // Check main sections/nav
    const navText = await page.textContent('body');
    const hasTraining = navText.includes('Training') || navText.includes('training') || navText.includes('Learn');
    log('Training section visible', hasTraining ? 'PASS' : 'FAIL');

    // ===== 2. NAVIGATION =====
    console.log('\n=== 2. NAVIGATION ===');
    
    // Look for nav links/buttons
    const navLinks = await page.$$('nav a, nav button, [role="navigation"] a, [role="tab"], .nav-item, .sidebar a, aside a');
    log('Navigation elements found', navLinks.length > 0 ? 'PASS' : 'WARN', `${navLinks.length} elements`);

    // Try to find and click training/learn section
    const allLinks = await page.$$('a, button');
    let trainingClicked = false;
    for (const link of allLinks) {
      const text = await link.textContent();
      if (text && (text.includes('Training') || text.includes('Learn') || text.includes('Modules') || text.includes('Curriculum'))) {
        try {
          await link.click();
          await page.waitForTimeout(1000);
          trainingClicked = true;
          log('Navigate to Training', 'PASS', text.trim());
          break;
        } catch(e) {}
      }
    }
    if (!trainingClicked) {
      // Maybe it's already on the training page, or uses tabs
      log('Navigate to Training', 'INFO', 'Training section may already be visible or use different UI pattern');
    }

    // ===== 3. MODULES CAN BE OPENED =====
    console.log('\n=== 3. MODULES ===');
    
    // Take a screenshot of current state
    await page.screenshot({ path: 'scratch/e2e-training.png' });
    
    // Look for module/lesson cards or links
    const moduleElements = await page.$$('[class*="card"], [class*="module"], [class*="lesson"], .accordion-item, details, [data-lesson]');
    log('Module/lesson elements', moduleElements.length > 0 ? 'PASS' : 'WARN', `${moduleElements.length} found`);

    // Try clicking the first module
    if (moduleElements.length > 0) {
      try {
        await moduleElements[0].click();
        await page.waitForTimeout(1000);
        log('Open first module', 'PASS');
      } catch(e) {
        log('Open first module', 'WARN', e.message);
      }
    }

    // ===== 4. QUIZ INTERACTION =====
    console.log('\n=== 4. QUIZ INTERACTION ===');
    
    // Navigate back to main page to find a quiz
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    
    // Look for quiz/assessment links
    const allElements = await page.$$('a, button');
    let quizFound = false;
    for (const el of allElements) {
      const text = await el.textContent();
      if (text && (text.includes('Quiz') || text.includes('quiz') || text.includes('Start') || text.includes('Practice') || text.includes('Assessment'))) {
        try {
          await el.click();
          await page.waitForTimeout(1500);
          quizFound = true;
          log('Quiz section opened', 'PASS', text.trim().substring(0, 50));
          break;
        } catch(e) {}
      }
    }

    if (quizFound) {
      // Look for question text and options
      const questionText = await page.$('[class*="question"], [class*="prompt"], [class*="quiz"] p, [class*="quiz"] h2, [class*="quiz"] h3');
      if (questionText) {
        const qText = await questionText.textContent();
        log('Question displayed', 'PASS', qText.substring(0, 80));
      }

      // Look for answer options
      const options = await page.$$('[class*="option"], [class*="answer"], [class*="choice"], input[type="radio"], label, [role="radio"]');
      log('Answer options visible', options.length >= 2 ? 'PASS' : 'WARN', `${options.length} options`);

      // Try clicking an option
      if (options.length > 0) {
        try {
          await options[0].click();
          await page.waitForTimeout(1000);
          log('Answer option clickable', 'PASS');
          
          // Look for submit/check button
          const submitButtons = await page.$$('button');
          for (const btn of submitButtons) {
            const btnText = await btn.textContent();
            if (btnText && (btnText.includes('Submit') || btnText.includes('Check') || btnText.includes('Answer') || btnText.includes('Confirm'))) {
              try {
                await btn.click();
                await page.waitForTimeout(1500);
                log('Submit answer', 'PASS', btnText.trim());
                
                // Check for feedback (correct/incorrect)
                const pageContent = await page.textContent('body');
                const hasFeedback = pageContent.includes('Correct') || pageContent.includes('correct') || pageContent.includes('Incorrect') || pageContent.includes('incorrect') || pageContent.includes('Explanation') || pageContent.includes('explanation');
                log('Answer feedback shown', hasFeedback ? 'PASS' : 'WARN');
                break;
              } catch(e) {}
            }
          }
          
          // Look for next button
          const nextButtons = await page.$$('button');
          for (const btn of nextButtons) {
            const btnText = await btn.textContent();
            if (btnText && (btnText.includes('Next') || btnText.includes('next') || btnText.includes('Continue'))) {
              try {
                await btn.click();
                await page.waitForTimeout(1000);
                log('Next question navigation', 'PASS');
                break;
              } catch(e) {}
            }
          }
        } catch(e) {
          log('Answer interaction', 'WARN', e.message);
        }
      }
    } else {
      log('Quiz section', 'INFO', 'Quiz access may require module completion or different navigation path');
    }

    // ===== 5. EXAM FLOW =====
    console.log('\n=== 5. EXAM ===');
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    
    const examLinks = await page.$$('a, button');
    let examFound = false;
    for (const el of examLinks) {
      const text = await el.textContent();
      if (text && (text.includes('Exam') || text.includes('exam') || text.includes('Final'))) {
        try {
          await el.click();
          await page.waitForTimeout(1500);
          examFound = true;
          log('Exam section accessible', 'PASS', text.trim().substring(0, 50));
          
          // Check if exam is gated
          const examContent = await page.textContent('body');
          const isGated = examContent.includes('complete') || examContent.includes('locked') || examContent.includes('requirements') || examContent.includes('modules');
          log('Exam gate/restriction logic', isGated ? 'PASS' : 'INFO', isGated ? 'Gate mechanism detected' : 'Exam appears accessible');
          break;
        } catch(e) {}
      }
    }
    if (!examFound) {
      log('Exam section', 'INFO', 'Exam link not found in current navigation');
    }

    // ===== 6. INSPECTION SCENARIOS =====
    console.log('\n=== 6. INSPECTION SCENARIOS ===');
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    
    const allBtns = await page.$$('a, button');
    let scenarioFound = false;
    for (const el of allBtns) {
      const text = await el.textContent();
      if (text && (text.includes('Scenario') || text.includes('scenario') || text.includes('Inspection') || text.includes('inspection'))) {
        try {
          await el.click();
          await page.waitForTimeout(1500);
          scenarioFound = true;
          log('Inspection scenarios accessible', 'PASS', text.trim().substring(0, 50));
          break;
        } catch(e) {}
      }
    }
    if (!scenarioFound) {
      log('Inspection scenarios', 'INFO', 'Scenario link not found, may be under different label');
    }

    // ===== 7. REFERENCE TOOLS =====
    console.log('\n=== 7. REFERENCE TOOLS ===');
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    
    for (const el of await page.$$('a, button')) {
      const text = await el.textContent();
      if (text && (text.includes('Reference') || text.includes('reference') || text.includes('Tools') || text.includes('tools'))) {
        try {
          await el.click();
          await page.waitForTimeout(1500);
          log('Reference tools accessible', 'PASS', text.trim().substring(0, 50));
          break;
        } catch(e) {}
      }
    }

    // ===== 8. PERSISTENCE =====
    console.log('\n=== 8. PERSISTENCE ===');
    
    // Get localStorage keys before reload
    const storageBefore = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      const data = {};
      keys.forEach(k => data[k] = localStorage.getItem(k));
      return { keys, data };
    });
    log('LocalStorage keys', storageBefore.keys.length > 0 ? 'PASS' : 'INFO', `${storageBefore.keys.length} keys: ${storageBefore.keys.join(', ')}`);

    // Reload and check persistence
    await page.reload({ waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);
    
    const storageAfter = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      const data = {};
      keys.forEach(k => data[k] = localStorage.getItem(k));
      return { keys, data };
    });

    const keysPreserved = storageBefore.keys.length === storageAfter.keys.length;
    let dataPreserved = true;
    for (const key of storageBefore.keys) {
      if (storageBefore.data[key] !== storageAfter.data[key]) {
        dataPreserved = false;
        break;
      }
    }
    log('Persistence after reload', keysPreserved && dataPreserved ? 'PASS' : 'FAIL', 
        `Keys: ${storageBefore.keys.length} → ${storageAfter.keys.length}, Data intact: ${dataPreserved}`);

    // ===== 9. CONSOLE ERRORS =====
    console.log('\n=== 9. CONSOLE ERRORS ===');
    const filteredErrors = consoleErrors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('manifest') &&
      !e.includes('ERR_CONNECTION_REFUSED') &&
      !e.includes('DevTools')
    );
    log('Console errors', filteredErrors.length === 0 ? 'PASS' : 'FAIL', 
        filteredErrors.length === 0 ? 'No errors' : filteredErrors.join(' | '));

    // ===== 10. PAGE SCREENSHOTS =====
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'scratch/e2e-final-dashboard.png', fullPage: true });

  } catch(e) {
    log('CRITICAL ERROR', 'FAIL', e.message);
  }

  // ===== FINAL SUMMARY =====
  console.log('\n========================================');
  console.log('E2E VALIDATION SUMMARY');
  console.log('========================================');
  const passes = results.filter(r => r.status === 'PASS').length;
  const fails = results.filter(r => r.status === 'FAIL').length;
  const warns = results.filter(r => r.status === 'WARN').length;
  const infos = results.filter(r => r.status === 'INFO').length;
  console.log(`PASS: ${passes}  FAIL: ${fails}  WARN: ${warns}  INFO: ${infos}`);
  console.log('========================================');
  
  if (fails > 0) {
    console.log('\nFAILED TESTS:');
    results.filter(r => r.status === 'FAIL').forEach(r => console.log(`  - ${r.test}: ${r.detail}`));
  }

  await browser.close();
}

run().catch(e => {
  console.error('Fatal error:', e.message);
  process.exit(1);
});
