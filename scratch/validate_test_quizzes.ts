import { quizzes as oldQuizzes } from '../src/data/quizzes';
import { quizzes as newQuizzes } from './test_quizzes';

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

const oldQuestions = oldQuizzes.flatMap(q => q.questions);
const newQuestions = newQuizzes.flatMap(q => q.questions);

console.log(`Old questions: ${oldQuestions.length}`);
console.log(`New questions: ${newQuestions.length}`);

if (newQuestions.length !== 174) {
  console.error(`ERROR: expected 174, got ${newQuestions.length}`);
}

const oldMap = new Map(oldQuestions.map(q => [q.id, q]));
const newMap = new Map(newQuestions.map(q => [q.id, q]));

// Check deleted IDs
for (const id of deleteIds) {
  if (newMap.has(id)) {
    console.error(`ERROR: Deleted ID ${id} is still present!`);
  }
}

// Check rewritten IDs
for (const id of rewriteIds) {
  if (!newMap.has(id)) {
    console.error(`ERROR: Rewritten ID ${id} is missing!`);
  } else {
    const oldQ = oldMap.get(id)!;
    const newQ = newMap.get(id)!;
    if (oldQ.prompt === newQ.prompt) {
      console.error(`ERROR: Rewritten ID ${id} has unchanged prompt!`);
    }
  }
}

// Check that all other questions match old questions EXACTLY
let unchangedCount = 0;
for (const [id, oldQ] of oldMap.entries()) {
  if (deleteIds.has(id) || rewriteIds.has(id)) {
    continue;
  }
  const newQ = newMap.get(id);
  if (!newQ) {
    console.error(`ERROR: Non-targeted question ${id} was deleted!`);
    continue;
  }
  if (
    oldQ.prompt !== newQ.prompt ||
    JSON.stringify(oldQ.options) !== JSON.stringify(newQ.options) ||
    oldQ.correctAnswer !== newQ.correctAnswer ||
    oldQ.explanation !== newQ.explanation ||
    oldQ.relatedLessonId !== newQ.relatedLessonId ||
    oldQ.kind !== newQ.kind
  ) {
    console.error(`ERROR: Non-targeted question ${id} was accidentally modified!`);
  } else {
    unchangedCount++;
  }
}

console.log(`Unchanged questions verified: ${unchangedCount} (expected: ${183 - 9 - 14} = 160, which includes the 78 KEEP questions)`);

// Check duplicate IDs
const seenIds = new Set<string>();
for (const q of newQuestions) {
  if (seenIds.has(q.id)) {
    console.error(`ERROR: Duplicate ID ${q.id}`);
  }
  seenIds.add(q.id);
  if (q.options.length !== 4) {
    console.error(`ERROR: ${q.id} has ${q.options.length} options`);
  }
  if (q.correctAnswer < 0 || q.correctAnswer > 3) {
    console.error(`ERROR: ${q.id} correctAnswer out of range: ${q.correctAnswer}`);
  }
  if (!q.prompt.trim() || !q.explanation.trim()) {
    console.error(`ERROR: ${q.id} empty prompt or explanation`);
  }
}

// Check distribution
const dist = [0, 0, 0, 0];
for (const q of newQuestions) {
  dist[q.correctAnswer]++;
}
console.log('Answer distribution:');
dist.forEach((c, idx) => {
  console.log(`  Option ${idx}: ${c} (${((c / 174) * 100).toFixed(1)}%)`);
});
