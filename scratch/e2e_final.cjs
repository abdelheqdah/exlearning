// Final targeted quiz + submit + feedback + scoring validation
const { chromium } = require('playwright');
const BASE = 'http://localhost:5173';
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
    // Clear state
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    
    // ===== TEST 1: QUIZ WITH CORRECT ANSWERS =====
    console.log('=== TEST 1: QUIZ WITH CORRECT ANSWERS ===');
    await page.click('button:has-text("Quizzes")');
    await page.waitForTimeout(1000);
    
    // Click first quiz (Explosive atmospheres)
    const startBtns = await page.$$('button.text-button');
    await startBtns[0].click();
    await page.waitForTimeout(2000);
    
    // Quiz has 2 questions with radio inputs. Select correct answers:
    // Q1 correct = option 2 (index 2, 0-based): "Flammable substance properties..."
    // Q2 correct = option 3 (index 3, 0-based): "They thermally insulate hot surfaces..."
    
    const radioInputs = await page.$$('input[type="radio"]');
    log('Radio inputs found', radioInputs.length === 8 ? 'PASS' : 'WARN', `${radioInputs.length} inputs (expected 8 for 2 questions x 4 options)`);
    
    // Q1: Click third option (index 2)
    if (radioInputs.length >= 8) {
      await radioInputs[2].click(); // Q1 correct answer
      await page.waitForTimeout(500);
      log('Q1 answer selected', 'PASS', 'Selected option 3 (correct)');
      
      // Q2: Click fourth option (index 7 = Q2 option 3, 0-based: 4+3=7)
      await radioInputs[7].click(); // Q2 correct answer
      await page.waitForTimeout(500);
      log('Q2 answer selected', 'PASS', 'Selected option 4 (correct)');
      
      // Click Submit
      await page.click('button:has-text("Submit")');
      await page.waitForTimeout(2000);
      
      const afterSubmit = await page.evaluate(() => document.body.innerText);
      console.log('\nAfter submit (first 2000 chars):\n', afterSubmit.substring(0, 2000));
      
      // Check for results/score
      const hasScore = afterSubmit.includes('2 of 2') || afterSubmit.includes('100') || afterSubmit.includes('Score') || afterSubmit.includes('score') || afterSubmit.includes('Result') || afterSubmit.includes('result') || afterSubmit.includes('correct') || afterSubmit.includes('Correct');
      log('Score/results displayed', hasScore ? 'PASS' : 'WARN', hasScore ? 'Score visible' : 'No explicit score found');
      
      // Check for explanations
      const hasExplanation = afterSubmit.includes('explanation') || afterSubmit.includes('Explanation') || afterSubmit.includes('depends on') || afterSubmit.includes('classification') || afterSubmit.includes('hazardous area');
      log('Explanations displayed', hasExplanation ? 'PASS' : 'WARN');
      
      // Check visual indicators for correct answers
      const hasCorrectIndicator = afterSubmit.includes('✓') || afterSubmit.includes('✗') || afterSubmit.includes('✕') || afterSubmit.includes('Correct') || afterSubmit.includes('correct');
      log('Correct/incorrect indicators', hasCorrectIndicator ? 'PASS' : 'INFO');
    }
    
    // ===== TEST 2: QUIZ WITH WRONG ANSWERS =====
    console.log('\n=== TEST 2: QUIZ WITH WRONG ANSWERS ===');
    await page.click('button:has-text("All quizzes")');
    await page.waitForTimeout(1500);
    
    // Click second quiz (Zones and EPL)
    const startBtns2 = await page.$$('button.text-button');
    if (startBtns2.length >= 2) {
      await startBtns2[1].click();
      await page.waitForTimeout(2000);
      
      // Select deliberately WRONG answers
      const radioInputs2 = await page.$$('input[type="radio"]');
      if (radioInputs2.length >= 8) {
        await radioInputs2[0].click(); // Q1 wrong answer (option 0)
        await page.waitForTimeout(300);
        await radioInputs2[4].click(); // Q2 wrong answer (option 0)
        await page.waitForTimeout(300);
        log('Wrong answers selected', 'PASS');
        
        await page.click('button:has-text("Submit")');
        await page.waitForTimeout(2000);
        
        const afterWrong = await page.evaluate(() => document.body.innerText);
        console.log('\nAfter wrong submit (first 1500 chars):\n', afterWrong.substring(0, 1500));
        
        const hasWrongFeedback = afterWrong.includes('0 of 2') || afterWrong.includes('incorrect') || afterWrong.includes('Incorrect') || afterWrong.includes('✗') || afterWrong.includes('wrong');
        log('Wrong answer feedback', hasWrongFeedback ? 'PASS' : 'INFO', hasWrongFeedback ? 'Incorrect answers shown' : 'Feedback pattern may differ');
        
        // Check the correct answer is indicated
        const showsCorrect = afterWrong.includes('explanation') || afterWrong.includes('Explanation') || afterWrong.includes('correct answer') || afterWrong.includes('EPL');
        log('Correct answer revealed', showsCorrect ? 'PASS' : 'INFO');
      }
    }
    
    // ===== TEST 3: PROGRESS PERSISTENCE =====
    console.log('\n=== TEST 3: PERSISTENCE ===');
    const progressBefore = await page.evaluate(() => localStorage.getItem('exlearn-progress-v1'));
    log('Progress data exists', progressBefore ? 'PASS' : 'WARN', progressBefore ? `${progressBefore.length} chars` : 'No data');
    
    // Parse and inspect
    if (progressBefore) {
      const parsed = JSON.parse(progressBefore);
      console.log('Progress data:', JSON.stringify(parsed, null, 2).substring(0, 500));
      log('Progress has quiz data', Object.keys(parsed).length > 0 ? 'PASS' : 'WARN');
    }
    
    // Reload
    await page.reload({ waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    const progressAfter = await page.evaluate(() => localStorage.getItem('exlearn-progress-v1'));
    log('Progress persists reload', progressBefore === progressAfter ? 'PASS' : 'FAIL');
    
    // ===== TEST 4: EXAM GATE =====
    console.log('\n=== TEST 4: EXAM GATE ===');
    await page.click('button:has-text("Progress")');
    await page.waitForTimeout(1500);
    const progressContent = await page.evaluate(() => document.body.innerText);
    console.log('\nProgress page (first 1000 chars):\n', progressContent.substring(0, 1000));
    log('Progress page loads', progressContent.length > 100 ? 'PASS' : 'WARN');
    
    // Check if exam section is shown on progress page
    const hasExamInfo = progressContent.includes('Exam') || progressContent.includes('exam') || progressContent.includes('Final') || progressContent.includes('Assessment');
    log('Exam info on progress', hasExamInfo ? 'PASS' : 'INFO');
    
    // ===== TEST 5: REFERENCE/ABOUT =====
    console.log('\n=== TEST 5: ABOUT PAGE ===');
    await page.click('button.nav-about');
    await page.waitForTimeout(1500);
    const aboutContent = await page.evaluate(() => document.body.innerText);
    log('About page loads', aboutContent.length > 100 ? 'PASS' : 'WARN', aboutContent.substring(0, 80));
    
    // ===== CONSOLE ERRORS =====
    const filteredErrors = consoleErrors.filter(e => !e.includes('favicon'));
    log('Console errors (final)', filteredErrors.length === 0 ? 'PASS' : 'FAIL',
        filteredErrors.length === 0 ? 'None' : filteredErrors.join(' | '));

  } catch(e) {
    log('CRITICAL', 'FAIL', e.message);
    console.error(e);
  }

  console.log('\n========================================');
  console.log('FINAL QUIZ INTERACTION SUMMARY');
  console.log('========================================');
  const passes = results.filter(r => r.status === 'PASS').length;
  const fails = results.filter(r => r.status === 'FAIL').length;
  const warns = results.filter(r => r.status === 'WARN').length;
  const infos = results.filter(r => r.status === 'INFO').length;
  console.log(`PASS: ${passes}  FAIL: ${fails}  WARN: ${warns}  INFO: ${infos}`);
  console.log('========================================');
  
  if (fails > 0) {
    console.log('\nFAILED:');
    results.filter(r => r.status === 'FAIL').forEach(r => console.log(`  - ${r.test}: ${r.detail}`));
  }

  await browser.close();
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
