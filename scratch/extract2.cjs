const fs = require('fs');
const content = fs.readFileSync('src/data/quizzes.ts', 'utf8');
const targets = ['q-exe-10', 'q-exp-10', 'q-exd-05', 'q-exd-09', 'q-exi-07', 'q-exp-06', 'q-epl-2', 'q-lifecycle-2', 'q-competence-2', 'q-integrated-1'];
let out = '';
targets.forEach(id => {
  out += '=================================\nTARGET ID: ' + id + '\n';
  const regex = new RegExp(`id:\\s*['"]${id}['"].*?(?=\\n\\s*\\{|\\n\\s*phase6Question|\\n\\s*\\])`, 's');
  let match = content.match(regex);
  if (match) {
    out += match[0].trim() + '\n';
  } else {
    const regex2 = new RegExp(`phase6Question\\(\\s*['"]${id}['"].*?(?=\\n\\s*phase6Question|\\n\\s*\\]|\\n\\s*\\})`, 's');
    const match2 = content.match(regex2);
    if (match2) {
      out += match2[0].trim() + '\n';
    } else {
      out += 'NOT FOUND\n';
    }
  }
});
fs.writeFileSync('scratch/extracted_10_utf8.txt', out, 'utf8');
