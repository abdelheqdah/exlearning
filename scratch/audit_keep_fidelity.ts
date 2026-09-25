import fs from 'fs';
import path from 'path';
import { quizzes } from '../src/data/quizzes';

const baselineQuestions = JSON.parse(
  fs.readFileSync('C:/Users/ELITEBOOK/.gemini/antigravity-ide/brain/44d3f4f8-2874-4f1c-883c-c07a0fa47bad/scratch/all_183_questions.json', 'utf8')
);

const deleteIds = new Set([
  'q-ex001-18', 'q-ex001-25', 'q-ex001-28', 'q-ex001-29',
  'q-ex007-08', 'q-ex007-09',
  'q-find-06', 'q-find-07', 'q-find-10'
]);

const rewriteIds = new Set([
  'q-ex001-08', 'q-ex001-10', 'q-ex001-14', 'q-ex001-16',
  'q-ex001-24', 'q-ex001-30', 'q-ex001-33', 'q-ex001-35',
  'q-ex007-01', 'q-ex007-03', 'q-ex007-10', 'q-ex007-24',
  'q-find-05', 'q-ex008-30'
]);

const currentQuestions = quizzes.flatMap(q => q.questions);
const currentMap = new Map(currentQuestions.map(q => [q.id, q]));

let differences = 0;
let verifiedKeepCount = 0;

for (const baseQ of baselineQuestions) {
  const id = baseQ.id;
  if (deleteIds.has(id)) {
    if (currentMap.has(id)) {
      console.error(`ERROR: Deleted question ${id} is still in current quizzes!`);
      differences++;
    }
    continue;
  }
  if (rewriteIds.has(id)) {
    if (!currentMap.has(id)) {
      console.error(`ERROR: Rewritten question ${id} is missing in current quizzes!`);
      differences++;
    }
    continue;
  }

  // Must be a KEEP question
  const curQ = currentMap.get(id);
  if (!curQ) {
    console.error(`ERROR: KEEP question ${id} is missing in current quizzes!`);
    differences++;
    continue;
  }

  const promptMatch = baseQ.prompt === curQ.prompt;
  const optionsMatch = JSON.stringify(baseQ.options) === JSON.stringify(curQ.options);
  const answerMatch = baseQ.correctAnswer === curQ.correctAnswer;
  const explanationMatch = baseQ.explanation === curQ.explanation;
  const lessonMatch = baseQ.relatedLessonId === curQ.relatedLessonId;

  if (!promptMatch || !optionsMatch || !answerMatch || !explanationMatch || !lessonMatch) {
    console.error(`ERROR: KEEP question ${id} was ACCIDENTALLY MODIFIED!`);
    if (!promptMatch) console.error(`  Prompt mismatch:\n    base: ${baseQ.prompt}\n    curr: ${curQ.prompt}`);
    if (!optionsMatch) console.error(`  Options mismatch`);
    if (!answerMatch) console.error(`  Answer mismatch: base=${baseQ.correctAnswer}, curr=${curQ.correctAnswer}`);
    if (!explanationMatch) console.error(`  Explanation mismatch`);
    differences++;
  } else {
    verifiedKeepCount++;
  }
}

console.log(`=== KEEP QUESTION FIDELITY AUDIT ===`);
console.log(`Baseline questions checked: ${baselineQuestions.length}`);
console.log(`Deleted questions confirmed removed: ${deleteIds.size}`);
console.log(`Rewritten questions confirmed in rewrite set: ${rewriteIds.size}`);
console.log(`KEEP questions verified 100% identical: ${verifiedKeepCount}`);
console.log(`Accidental modifications: ${differences}`);
if (differences === 0 && verifiedKeepCount === 160) {
  console.log(`SUCCESS: EXACTLY ZERO KEEP questions were accidentally changed!`);
} else {
  console.error(`FAILURE: Unexpected count or modifications found!`);
}
