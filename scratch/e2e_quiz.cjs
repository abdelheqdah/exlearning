// Targeted quiz answer interaction test
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
  page.on('pageerror', err => consoleErrors.push(err.message));

  try {
    // Clear state
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    
    // Navigate to quizzes
    console.log('=== NAVIGATE TO QUIZZES ===');
    await page.click('button:has-text("Quizzes")');
    await page.waitForTimeout(1500);
    
    // Click the first "Start quiz →" button
    console.log('=== START FIRST QUIZ ===');
    const startButtons = await page.$$('button.text-button');
    if (startButtons.length > 0) {
      await startButtons[0].click();
      await page.waitForTimeout(2000);
      
      // Get page content to see what happened
      const content = await page.evaluate(() => document.body.innerText);
      console.log('After clicking Start quiz, page content:\n', content.substring(0, 1500));
      
      // Check if we're now in a quiz view with questions
      const hasQuestion = content.includes('?') || content.includes('Which') || content.includes('What') || content.includes('Under') || content.includes('How');
      log('Quiz question displayed', hasQuestion ? 'PASS' : 'WARN', hasQuestion ? 'Question text found' : 'No question text detected');
      
      // Get all interactive elements on the page now
      const interactive = await page.evaluate(() => {
        const all = document.querySelectorAll('button, [role="radio"], [role="option"], input, label');
        return Array.from(all).map((e, i) => ({
          index: i, tag: e.tagName, text: (e.textContent || '').trim().substring(0, 120),
          className: e.className || '', role: e.getAttribute('role') || '',
          ariaLabel: e.getAttribute('aria-label') || ''
        }));
      });
      console.log('\nInteractive elements in quiz view:');
      interactive.forEach(e => console.log(`  [${e.index}] <${e.tag}> class="${e.className}" role="${e.role}" text="${e.text}"`));
      
      // Look for answer option buttons - they should have option-related classes
      const optionBtns = interactive.filter(e => 
        e.className.includes('option') || e.className.includes('answer') || e.className.includes('choice') ||
        e.role === 'radio' || e.role === 'option' ||
        (e.tag === 'BUTTON' && e.text.length > 30 && !e.text.includes('Start') && !e.text.includes('ExLearn'))
      );
      log('Answer option elements', optionBtns.length > 0 ? 'PASS' : 'WARN', `${optionBtns.length} options found`);
      
      if (optionBtns.length > 0) {
        // Click the first option (may or may not be correct)
        const allEls = await page.$$('button, [role="radio"], [role="option"], input, label');
        await allEls[optionBtns[0].index].click();
        await page.waitForTimeout(2000);
        
        const afterClick = await page.evaluate(() => document.body.innerText);
        const hasExplanation = afterClick.includes('explanation') || afterClick.includes('Explanation') || 
                               afterClick.includes('Correct') || afterClick.includes('correct') ||
                               afterClick.includes('Incorrect') || afterClick.includes('incorrect') ||
                               afterClick.includes('✓') || afterClick.includes('✗') || afterClick.includes('✕');
        log('Feedback after answer click', hasExplanation ? 'PASS' : 'INFO', 
            hasExplanation ? 'Feedback/explanation shown' : 'No immediate feedback — may need submit button');
        
        console.log('\nPage content after clicking option:\n', afterClick.substring(0, 2000));
        
        // Look for next/submit buttons
        const postClickBtns = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('button')).map((b, i) => ({
            index: i, text: (b.textContent || '').trim().substring(0, 50), disabled: b.disabled, className: b.className
          }));
        });
        console.log('\nButtons after clicking option:', JSON.stringify(postClickBtns, null, 2));
        
        // Try clicking Next
        for (const pb of postClickBtns) {
          if (pb.text.includes('Next') || pb.text.includes('next') || pb.text.includes('→') || pb.text.includes('Continue')) {
            if (!pb.text.includes('Start')) {
              const btns = await page.$$('button');
              await btns[pb.index].click();
              await page.waitForTimeout(1500);
              log('Next question button works', 'PASS');
              
              // Get second question content
              const q2Content = await page.evaluate(() => document.body.innerText);
              const hasQ2 = q2Content.includes('?') || q2Content.includes('Which') || q2Content.includes('What');
              log('Second question loaded', hasQ2 ? 'PASS' : 'WARN');
              console.log('\nSecond question page:\n', q2Content.substring(0, 1000));
              break;
            }
          }
        }
      } else {
        // Maybe the quiz uses a different UI pattern - check for cards that act as options
        console.log('\nLooking for alternative option patterns...');
        const allBtns = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('button, div[onclick], li')).map((e, i) => ({
            index: i, tag: e.tagName, text: (e.textContent || '').trim().substring(0, 120),
            className: e.className, clickable: !!e.onclick
          }));
        });
        allBtns.filter(b => b.text.length > 30).forEach(b => 
          console.log(`  [${b.index}] <${b.tag}> class="${b.className}" text="${b.text}"`)
        );
      }
    } else {
      log('Start quiz buttons', 'FAIL', 'No "Start quiz →" buttons found');
    }

    // ===== CONSOLE ERRORS =====
    const filteredErrors = consoleErrors.filter(e => !e.includes('favicon'));
    log('Console errors', filteredErrors.length === 0 ? 'PASS' : 'FAIL',
        filteredErrors.length === 0 ? 'None' : filteredErrors.join(' | '));

  } catch(e) {
    log('CRITICAL', 'FAIL', e.message);
    console.error(e);
  }

  console.log('\n========================================');
  console.log('QUIZ INTERACTION SUMMARY');
  console.log('========================================');
  const passes = results.filter(r => r.status === 'PASS').length;
  const fails = results.filter(r => r.status === 'FAIL').length;
  console.log(`PASS: ${passes}  FAIL: ${fails}  WARN: ${results.filter(r => r.status === 'WARN').length}  INFO: ${results.filter(r => r.status === 'INFO').length}`);
  console.log('========================================');

  await browser.close();
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
