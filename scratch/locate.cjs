const fs = require('fs');
const content = fs.readFileSync('src/data/quizzes.ts', 'utf8');
const lines = content.split('\n');

const deleteIds = [
  'q-ex001-18', 'q-ex001-25', 'q-ex001-28', 'q-ex001-29',
  'q-ex007-08', 'q-ex007-09',
  'q-find-06', 'q-find-07', 'q-find-10'
];

const rewriteIds = [
  'q-ex001-08', 'q-ex001-10', 'q-ex001-14', 'q-ex001-16',
  'q-ex001-24', 'q-ex001-30', 'q-ex001-33', 'q-ex001-35',
  'q-ex007-01', 'q-ex007-03', 'q-ex007-10', 'q-ex007-24',
  'q-find-05', 'q-ex008-30'
];

console.log('=== DELETE IDS ===');
deleteIds.forEach(id => {
  const idx = lines.findIndex(l => l.includes(id));
  console.log(`${id}: ${idx !== -1 ? `Line ${idx + 1}` : 'NOT FOUND'}`);
});

console.log('=== REWRITE IDS ===');
rewriteIds.forEach(id => {
  const idx = lines.findIndex(l => l.includes(id));
  console.log(`${id}: ${idx !== -1 ? `Line ${idx + 1}` : 'NOT FOUND'}`);
});
