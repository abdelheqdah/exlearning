import { quizzes } from './test_quizzes';

const letterRefRegex = /\b(?:option|choice)\s+[a-d]\b|\b[A-D]\s+is\s+correct\b/i;
const allQuestions = quizzes.flatMap(q => q.questions);

let errors = 0;
for (const q of allQuestions) {
  if (letterRefRegex.test(q.prompt) || letterRefRegex.test(q.explanation)) {
    console.error(`ERROR letterRef: ${q.id}`);
    errors++;
  }
  for (const opt of q.options) {
    if (letterRefRegex.test(opt)) {
      console.error(`ERROR letterRef in option: ${q.id}`);
      errors++;
    }
  }
  if (new Set(q.options).size !== 4) {
    console.error(`ERROR non-distinct options: ${q.id}`);
    errors++;
  }
}

console.log(`Semantic check completed with ${errors} errors across ${allQuestions.length} questions.`);
