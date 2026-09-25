const fs = require('fs');
const content = fs.readFileSync('src/data/quizzes.ts', 'utf8');
const matches = content.match(/id:\s*['"]([^'"]+)['"]|phase6Question\(\s*['"]([^'"]+)['"]/g);
const ids = matches ? matches.map(m => {
  const innerMatch = m.match(/['"]([^'"]+)['"]/);
  return innerMatch ? innerMatch[1] : null;
}).filter(Boolean) : [];
console.log(JSON.stringify(ids, null, 2));
