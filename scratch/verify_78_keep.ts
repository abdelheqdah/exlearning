import fs from 'fs';
import { quizzes } from '../src/data/quizzes';

// The 101 audited questions in EX001, EX007, and EX008:
const ex001All = [
  'q-ex001-01', 'q-ex001-02', 'q-ex001-03', 'q-ex001-04', 'q-ex001-05',
  'q-ex001-06', 'q-ex001-07', 'q-ex001-08', 'q-ex001-09', 'q-ex001-10',
  'q-ex001-11', 'q-ex001-12', 'q-ex001-13', 'q-ex001-14', 'q-ex001-15',
  'q-ex001-16', 'q-ex001-17', 'q-ex001-18', 'q-ex001-19', 'q-ex001-20',
  'q-ex001-21', 'q-ex001-22', 'q-ex001-23', 'q-ex001-24', 'q-ex001-25',
  'q-ex001-26', 'q-ex001-27', 'q-ex001-28', 'q-ex001-29', 'q-ex001-30',
  'q-ex001-31', 'q-ex001-32', 'q-ex001-33', 'q-ex001-34', 'q-ex001-35'
]; // 35 questions

const ex007All = [
  'q-ex007-01', 'q-ex007-02', 'q-ex007-03', 'q-ex007-04', 'q-ex007-05',
  'q-ex007-06', 'q-ex007-07', 'q-ex007-08', 'q-ex007-09', 'q-ex007-10',
  'q-ex007-11', 'q-ex007-12', 'q-ex007-13', 'q-ex007-14', 'q-ex007-15',
  'q-ex007-16', 'q-ex007-17', 'q-ex007-18', 'q-ex007-19', 'q-ex007-20',
  'q-ex007-21', 'q-ex007-22', 'q-ex007-23', 'q-ex007-24', 'q-ex007-25',
  'q-ex007-26', 'q-ex007-27', 'q-ex007-28'
]; // 28 questions

const ex008All = [
  'q-ex008-11', 'q-ex008-12', 'q-ex008-13', 'q-ex008-14', 'q-ex008-15',
  'q-ex008-16', 'q-ex008-17', 'q-ex008-18', 'q-ex008-19', 'q-ex008-20',
  'q-ex008-21', 'q-ex008-22', 'q-ex008-23', 'q-ex008-24', 'q-ex008-25',
  'q-ex008-26', 'q-ex008-27', 'q-ex008-28', 'q-ex008-29', 'q-ex008-30',
  'q-ex008-31', 'q-ex008-32', 'q-ex008-33', 'q-ex008-34', 'q-ex008-35',
  'q-ex008-36',
  'q-find-01', 'q-find-02', 'q-find-03', 'q-find-04', 'q-find-05',
  'q-find-06', 'q-find-07', 'q-find-08', 'q-find-09', 'q-find-10',
  'q-lifecycle-1', 'q-lifecycle-2'
]; // 38 questions

const allAudited = [...ex001All, ...ex007All, ...ex008All];
console.log(`Total audited questions: ${allAudited.length}`); // 101

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

const keepIds = allAudited.filter(id => !deleteIds.has(id) && !rewriteIds.has(id));
console.log(`Audited KEEP IDs count: ${keepIds.length} (Target: 78)`);
console.log(`Audited REWRITE IDs count: ${rewriteIds.size} (Target: 14)`);
console.log(`Audited DELETE IDs count: ${deleteIds.size} (Target: 9)`);
console.log(`Total: ${keepIds.length + rewriteIds.size + deleteIds.size} (Target: 101)`);

const liveQuestions = quizzes.flatMap(q => q.questions);
const liveMap = new Map(liveQuestions.map(q => [q.id, q]));

// Verify each KEEP ID is in liveMap
let keepMissing = 0;
for (const id of keepIds) {
  if (!liveMap.has(id)) {
    console.error(`ERROR: KEEP ID ${id} is missing!`);
    keepMissing++;
  }
}
if (keepMissing === 0) {
  console.log(`SUCCESS: All 78 KEEP IDs are present in the live question bank!`);
}
