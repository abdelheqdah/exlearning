import { quizzes } from '../src/data/quizzes';

const targets = ['q-exe-10', 'q-exp-10', 'q-exd-05', 'q-exd-09', 'q-exi-07', 'q-exp-06', 'q-epl-2', 'q-lifecycle-2', 'q-competence-2', 'q-integrated-1'];
const found = quizzes.filter(q => targets.includes(q.id));

found.forEach(q => {
  console.log('---');
  console.log('ID: ' + q.id);
  console.log('Lesson: ' + q.relatedLesson);
  console.log('Prompt: ' + q.prompt);
  console.log('Options:');
  q.options.forEach((opt, i) => console.log('  ' + i + ': ' + opt));
  console.log('Correct Answer Index: ' + q.correctAnswer);
  console.log('Explanation: ' + q.explanation);
  console.log('Reference: ' + q.reference);
});
