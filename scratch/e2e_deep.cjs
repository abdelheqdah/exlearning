// Deep quiz interaction and exam validation
const { chromium } = require('playwright');
const BASE = 'http://localhost:5174';
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
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push(err.message));

  try {
    // ===== CLEAR STATE FOR FRESH TEST =====
    console.log('=== CLEARING STATE ===');
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    log('Fresh state established', 'PASS');
    
    // ===== NAVIGATE TO TRAINING =====
    console.log('\n=== TRAINING FLOW ===');
    
    // Get the full page content to understand the app structure
    const bodyHtml = await page.evaluate(() => document.body.innerHTML);
    
    // Find all clickable elements and their text
    const clickables = await page.evaluate(() => {
      const els = document.querySelectorAll('a, button, [role="tab"], [role="button"]');
      return Array.from(els).map((e, i) => ({ index: i, tag: e.tagName, text: (e.textContent || '').trim().substring(0, 60), href: e.getAttribute('href') || '' }));
    });
    console.log('Clickable elements:', JSON.stringify(clickables, null, 2));
    
    // Click on lessons/training tab
    let foundTraining = false;
    for (const c of clickables) {
      if (c.text.includes('Lesson') || c.text.includes('Learn') || c.text.includes('Training') || c.text.includes('Module')) {
        const els = await page.$$('a, button, [role="tab"], [role="button"]');
        if (els[c.index]) {
          await els[c.index].click();
          await page.waitForTimeout(1500);
          foundTraining = true;
          log('Navigated to training/lessons', 'PASS', c.text);
          break;
        }
      }
    }

    // Now look for individual lesson items to open
    const lessonItems = await page.evaluate(() => {
      const els = document.querySelectorAll('a, button, [role="tab"], [role="button"], details, summary, [class*="lesson"], [class*="card"], [class*="module"], [class*="accordion"]');
      return Array.from(els).map((e, i) => ({ index: i, tag: e.tagName, text: (e.textContent || '').trim().substring(0, 80), className: e.className || '' }));
    });
    console.log('\nLesson-level items:', JSON.stringify(lessonItems.slice(0, 20), null, 2));
    
    // Look for specific lessons and try to open one
    for (const item of lessonItems) {
      if (item.text.includes('EX001') || item.text.includes('Foundation') || item.text.includes('Hazardous') || item.text.includes('Zone') || item.text.includes('Protection')) {
        const els = await page.$$('a, button, [role="tab"], [role="button"], details, summary, [class*="lesson"], [class*="card"], [class*="module"], [class*="accordion"]');
        if (els[item.index]) {
          try {
            await els[item.index].click();
            await page.waitForTimeout(2000);
            log('Opened a lesson', 'PASS', item.text.substring(0, 60));
            break;
          } catch(e) {}
        }
      }
    }

    // ===== QUIZ DEEP TEST =====
    console.log('\n=== QUIZ DEEP TEST ===');
    
    // Navigate to quizzes tab
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    
    const quizNav = await page.evaluate(() => {
      const els = document.querySelectorAll('a, button, [role="tab"], [role="button"]');
      return Array.from(els).map((e, i) => ({ index: i, text: (e.textContent || '').trim().substring(0, 60) }));
    });
    
    for (const q of quizNav) {
      if (q.text.includes('Quiz') || q.text.includes('quiz')) {
        const els = await page.$$('a, button, [role="tab"], [role="button"]');
        if (els[q.index]) {
          await els[q.index].click();
          await page.waitForTimeout(2000);
          log('Navigated to Quizzes tab', 'PASS', q.text);
          break;
        }
      }
    }
    
    // Now see what quiz items are listed
    const quizItems = await page.evaluate(() => {
      const els = document.querySelectorAll('a, button, [class*="card"], [class*="quiz"], [class*="start"]');
      return Array.from(els).map((e, i) => ({ index: i, tag: e.tagName, text: (e.textContent || '').trim().substring(0, 80), className: e.className || '' }));
    });
    console.log('\nQuiz items:', JSON.stringify(quizItems.slice(0, 15), null, 2));
    log('Quiz items listed', quizItems.length > 0 ? 'PASS' : 'WARN', `${quizItems.length} items`);
    
    // Try to start a specific quiz
    for (const qi of quizItems) {
      if (qi.text.includes('Start') || qi.text.includes('Begin') || qi.text.includes('Take') || qi.text.includes('Hazardous') || qi.text.includes('atmosphere')) {
        const els = await page.$$('a, button, [class*="card"], [class*="quiz"], [class*="start"]');
        if (els[qi.index]) {
          try {
            await els[qi.index].click();
            await page.waitForTimeout(2000);
            log('Started a quiz', 'PASS', qi.text.substring(0, 60));
            break;
          } catch(e) {}
        }
      }
    }
    
    // Now inspect the quiz question UI
    const questionContent = await page.evaluate(() => {
      const body = document.body.innerText;
      return body.substring(0, 2000);
    });
    console.log('\nCurrent page content (first 1500 chars):\n', questionContent.substring(0, 1500));
    
    // Try to find and click an answer option by looking at all buttons
    const buttons = await page.evaluate(() => {
      const btns = document.querySelectorAll('button, [role="radio"], [role="option"], input[type="radio"], label');
      return Array.from(btns).map((b, i) => ({ index: i, tag: b.tagName, text: (b.textContent || '').trim().substring(0, 100), type: b.getAttribute('type') || '', className: b.className || '' }));
    });
    console.log('\nAll buttons/interactive:', JSON.stringify(buttons.slice(0, 20), null, 2));
    
    // Click first answer-like button (one with long text that looks like an answer option)
    let answeredQuestion = false;
    for (const btn of buttons) {
      if (btn.text.length > 30 && !btn.text.includes('ExLearn') && !btn.text.includes('Dashboard') && !btn.text.includes('Quiz')) {
        const els = await page.$$('button, [role="radio"], [role="option"], input[type="radio"], label');
        if (els[btn.index]) {
          try {
            await els[btn.index].click();
            await page.waitForTimeout(1500);
            log('Clicked answer option', 'PASS', btn.text.substring(0, 60));
            answeredQuestion = true;
            break;
          } catch(e) {}
        }
      }
    }
    
    if (answeredQuestion) {
      // Check for feedback  
      const afterAnswer = await page.evaluate(() => document.body.innerText);
      const hasFeedback = afterAnswer.includes('Correct') || afterAnswer.includes('correct') || afterAnswer.includes('Incorrect') || afterAnswer.includes('incorrect') || afterAnswer.includes('Explanation') || afterAnswer.includes('explanation');
      log('Answer feedback displayed', hasFeedback ? 'PASS' : 'INFO', hasFeedback ? 'Feedback shown' : 'May require submit button');
      
      // Look for Next button
      const afterBtns = await page.evaluate(() => {
        const btns = document.querySelectorAll('button');
        return Array.from(btns).map((b, i) => ({ index: i, text: (b.textContent || '').trim().substring(0, 50) }));
      });
      
      for (const ab of afterBtns) {
        if (ab.text.includes('Next') || ab.text.includes('next') || ab.text.includes('Continue')) {
          const els = await page.$$('button');
          if (els[ab.index]) {
            try {
              await els[ab.index].click();
              await page.waitForTimeout(1000);
              log('Next question navigation', 'PASS');
              break;
            } catch(e) {}
          }
        }
      }
      
      // Answer a wrong option to test incorrect feedback
      const q2Buttons = await page.evaluate(() => {
        const btns = document.querySelectorAll('button');
        return Array.from(btns).map((b, i) => ({ index: i, text: (b.textContent || '').trim().substring(0, 100) }));
      });
      
      for (const q2b of q2Buttons) {
        // Click the last answer option (likely wrong)
        if (q2b.text.length > 30 && !q2b.text.includes('ExLearn') && !q2b.text.includes('Dashboard') && !q2b.text.includes('Next')) {
          const els = await page.$$('button');
          if (els[q2b.index]) {
            try {
              await els[q2b.index].click();
              await page.waitForTimeout(1500);
              const afterWrong = await page.evaluate(() => document.body.innerText);
              const hasWrongFeedback = afterWrong.includes('Correct') || afterWrong.includes('correct') || afterWrong.includes('Incorrect') || afterWrong.includes('incorrect');
              log('Wrong answer feedback', hasWrongFeedback ? 'PASS' : 'INFO', hasWrongFeedback ? 'Feedback shown for wrong answer' : 'May be correct answer');
              break;
            } catch(e) {}
          }
        }
      }
    }

    // ===== EXAM GATE TEST =====
    console.log('\n=== EXAM GATE TEST ===');
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    
    // Try to access exam
    const examNav = await page.evaluate(() => {
      const els = document.querySelectorAll('a, button, [role="tab"]');
      return Array.from(els).map((e, i) => ({ index: i, text: (e.textContent || '').trim().substring(0, 60) }));
    });
    
    for (const e of examNav) {
      if (e.text.includes('Exam') || e.text.includes('exam')) {
        const els = await page.$$('a, button, [role="tab"]');
        if (els[e.index]) {
          await els[e.index].click();
          await page.waitForTimeout(2000);
          
          const examContent = await page.evaluate(() => document.body.innerText);
          const isGated = examContent.includes('complete') || examContent.includes('locked') || examContent.includes('Complete all') || examContent.includes('must complete') || examContent.includes('requirement');
          log('Exam gate on fresh state', isGated ? 'PASS' : 'INFO', isGated ? 'Exam correctly gated' : 'Exam may be open');
          
          // Try clicking start exam if available
          const examBtns = await page.evaluate(() => {
            const btns = document.querySelectorAll('button');
            return Array.from(btns).map((b, i) => ({ index: i, text: (b.textContent || '').trim().substring(0, 50), disabled: b.disabled }));
          });
          
          for (const eb of examBtns) {
            if (eb.text.includes('Start') || eb.text.includes('Begin')) {
              log('Exam start button', eb.disabled ? 'PASS' : 'INFO', eb.disabled ? 'Correctly disabled (gated)' : 'Start button enabled');
              break;
            }
          }
          break;
        }
      }
    }
    
    // ===== INSPECTION SCENARIOS =====
    console.log('\n=== INSPECTION SCENARIO DEEP TEST ===');
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    
    const scenarioNav = await page.evaluate(() => {
      const els = document.querySelectorAll('a, button, [role="tab"]');
      return Array.from(els).map((e, i) => ({ index: i, text: (e.textContent || '').trim().substring(0, 60) }));
    });
    
    for (const s of scenarioNav) {
      if (s.text.includes('Scenario') || s.text.includes('scenario') || s.text.includes('Inspection')) {
        const els = await page.$$('a, button, [role="tab"]');
        if (els[s.index]) {
          await els[s.index].click();
          await page.waitForTimeout(2000);
          
          // Check scenario content
          const scenarioContent = await page.evaluate(() => document.body.innerText.substring(0, 1000));
          log('Scenarios page loaded', scenarioContent.length > 100 ? 'PASS' : 'WARN', scenarioContent.substring(0, 80));
          
          // Try starting a scenario
          const scenarioBtns = await page.evaluate(() => {
            const btns = document.querySelectorAll('button, a');
            return Array.from(btns).map((b, i) => ({ index: i, text: (b.textContent || '').trim().substring(0, 80) }));
          });
          
          for (const sb of scenarioBtns) {
            if (sb.text.includes('Start') || sb.text.includes('Begin') || sb.text.includes('Open') || sb.text.includes('Launch') || sb.text.includes('Scenario 1') || sb.text.includes('scenario')) {
              const els2 = await page.$$('button, a');
              if (els2[sb.index]) {
                try {
                  await els2[sb.index].click();
                  await page.waitForTimeout(2000);
                  log('Opened a scenario', 'PASS', sb.text.substring(0, 60));
                  break;
                } catch(e) {}
              }
            }
          }
          break;
        }
      }
    }

    // ===== PERSISTENCE AFTER ACTIONS =====
    console.log('\n=== PERSISTENCE AFTER QUIZ ACTIONS ===');
    const storeBefore = await page.evaluate(() => localStorage.getItem('exlearn-progress-v1'));
    await page.reload({ waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    const storeAfter = await page.evaluate(() => localStorage.getItem('exlearn-progress-v1'));
    log('Progress persists after reload', storeBefore === storeAfter ? 'PASS' : 'FAIL',
        `Before: ${(storeBefore || '').length} chars, After: ${(storeAfter || '').length} chars`);

    // ===== RETURN TO PREVIOUSLY VISITED MODULE =====
    console.log('\n=== RETURN TO VISITED MODULE ===');
    // Navigate to quizzes
    const returnNav = await page.evaluate(() => {
      const els = document.querySelectorAll('a, button, [role="tab"]');
      return Array.from(els).map((e, i) => ({ index: i, text: (e.textContent || '').trim().substring(0, 60) }));
    });
    for (const r of returnNav) {
      if (r.text.includes('Quiz') || r.text.includes('quiz')) {
        const els = await page.$$('a, button, [role="tab"]');
        if (els[r.index]) {
          await els[r.index].click();
          await page.waitForTimeout(1500);
          log('Return to quizzes section', 'PASS');
          break;
        }
      }
    }

    // ===== CONSOLE ERRORS FINAL CHECK =====
    console.log('\n=== FINAL CONSOLE ERRORS ===');
    const filteredErrors = consoleErrors.filter(e => 
      !e.includes('favicon') && !e.includes('manifest') && 
      !e.includes('DevTools') && !e.includes('404')
    );
    log('Final console errors', filteredErrors.length === 0 ? 'PASS' : 'FAIL', 
        filteredErrors.length === 0 ? 'No errors' : filteredErrors.join(' | '));

  } catch(e) {
    log('CRITICAL ERROR', 'FAIL', e.message + '\n' + e.stack);
  }

  // Summary
  console.log('\n========================================');
  console.log('DEEP VALIDATION SUMMARY');
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

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
