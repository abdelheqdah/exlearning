const { quizzes } = require('../src/data/quizzes');

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

for (const quiz of quizzes) {
  for (const q of quiz.questions) {
    if (rewriteIds.has(q.id)) {
      console.log(`REWRITE ${q.id} in quiz ${quiz.id}: relatedLessonId=${q.relatedLessonId}, kind=${q.kind}`);
    }
    if (deleteIds.has(q.id)) {
      console.log(`DELETE ${q.id} in quiz ${quiz.id}: relatedLessonId=${q.relatedLessonId}, kind=${q.kind}`);
    }
  }
}
