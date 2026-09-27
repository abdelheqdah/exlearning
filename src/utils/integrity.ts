import type { Lesson, Quiz, Scenario } from '../types'

export type IntegrityIssue = { type: string; id: string; detail: string }

function duplicateIssues(ids: string[], type: string): IntegrityIssue[] {
  const seen = new Set<string>()
  return ids.flatMap((id) => {
    if (seen.has(id)) return [{ type, id, detail: 'Duplicate identifier.' }]
    seen.add(id)
    return []
  })
}

export function validateCurriculumIntegrity(lessons: Lesson[], quizzes: Quiz[], scenarios: Scenario[]): IntegrityIssue[] {
  const issues: IntegrityIssue[] = []
  const questionCount = quizzes.reduce((total, quiz) => total + quiz.questions.length, 0)
  if (lessons.length < 20) issues.push({ type: 'content-count', id: 'lessons', detail: 'Curriculum requires at least 20 lessons.' })
  if (questionCount < 100) issues.push({ type: 'content-count', id: 'questions', detail: 'Curriculum requires at least 100 quiz questions.' })
  if (scenarios.length < 12) issues.push({ type: 'content-count', id: 'scenarios', detail: 'Curriculum requires at least 12 scenarios.' })
  const lessonIds = new Set(lessons.map((lesson) => lesson.id))
  issues.push(...duplicateIssues(lessons.map((lesson) => lesson.id), 'lesson'))
  issues.push(...duplicateIssues(quizzes.map((quiz) => quiz.id), 'quiz'))
  issues.push(...duplicateIssues(scenarios.map((scenario) => scenario.id), 'scenario'))
  const questionIds = quizzes.flatMap((quiz) => quiz.questions.map((question) => question.id))
  issues.push(...duplicateIssues(questionIds, 'question'))
  const questionsByLesson = new Map<string, number>()
  quizzes.flatMap((quiz) => quiz.questions).forEach((question) => {
    questionsByLesson.set(question.relatedLessonId, (questionsByLesson.get(question.relatedLessonId) ?? 0) + 1)
  })
  for (const [lessonId, minimum] of [['ex001-foundations', 25], ['ex007-installation-practice', 20], ['ex008-inspection', 25]] as const) {
    if ((questionsByLesson.get(lessonId) ?? 0) < minimum) {
      issues.push({ type: 'topic-coverage', id: lessonId, detail: `Question bank requires at least ${minimum} directly related questions.` })
    }
  }
  lessons.forEach((lesson) => {
    if (!lesson.id.trim()) issues.push({ type: 'lesson', id: lesson.id, detail: 'Missing stable identifier.' })
    if (!lesson.title.trim() || !lesson.briefDescription.trim()) issues.push({ type: 'lesson-quality', id: lesson.id, detail: 'Lesson needs a title and description.' })
    if (lesson.sections.length < 2 || lesson.keyTakeaways.length < 2) issues.push({ type: 'lesson-quality', id: lesson.id, detail: 'Lesson needs meaningful sections and takeaways.' })
    if (lesson.moduleOrder < 1 || !Number.isInteger(lesson.moduleOrder)) issues.push({ type: 'lesson-order', id: lesson.id, detail: 'Lesson module order must be a positive integer.' })
  })
  quizzes.forEach((quiz) => {
    if (!quiz.id.trim()) issues.push({ type: 'quiz', id: quiz.id, detail: 'Missing stable identifier.' })
    quiz.lessonIds.forEach((id) => { if (!lessonIds.has(id)) issues.push({ type: 'quiz-reference', id: quiz.id, detail: `Unknown lesson reference: ${id}` }) })
    if (!quiz.questions.length) issues.push({ type: 'quiz', id: quiz.id, detail: 'Quiz has no questions.' })
    quiz.questions.forEach((question) => {
      if (!question.id.trim()) issues.push({ type: 'question', id: question.id, detail: 'Missing stable identifier.' })
      if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) issues.push({ type: 'answer-index', id: question.id, detail: 'Correct answer index is outside the option list.' })
      if (question.options.length < 3 || new Set(question.options).size !== question.options.length) issues.push({ type: 'question-quality', id: question.id, detail: 'Question needs at least three distinct options.' })
      if (!question.prompt.trim() || !question.explanation.trim()) issues.push({ type: 'question-quality', id: question.id, detail: 'Question needs original instructional wording and an explanation.' })
      if (!lessonIds.has(question.relatedLessonId)) issues.push({ type: 'question-reference', id: question.id, detail: `Unknown lesson reference: ${question.relatedLessonId}` })
    })
  })
  scenarios.forEach((scenario) => {
    if (!scenario.id.trim()) issues.push({ type: 'scenario', id: scenario.id, detail: 'Missing stable identifier.' })
    scenario.lessonIds.forEach((id) => { if (!lessonIds.has(id)) issues.push({ type: 'scenario-reference', id: scenario.id, detail: `Unknown lesson reference: ${id}` }) })
    if (scenario.correctChoice < 0 || scenario.correctChoice >= scenario.decisionOptions.length) issues.push({ type: 'scenario-choice', id: scenario.id, detail: 'Correct choice index is outside the decision list.' })
  })
  const boundaryText = lessons.filter((lesson) => /orientation|copc|boundary/i.test(`${lesson.id} ${lesson.title}`)).flatMap((lesson) => lesson.sections.map((section) => section.body)).join(' ')
  if (!/educational|learning/i.test(boundaryText) || !/not an RTP/i.test(boundaryText) || !/not an ExCB/i.test(boundaryText) || !/does not issue CoPC/i.test(boundaryText)) {
    issues.push({ type: 'educational-boundary', id: 'curriculum', detail: 'Curriculum must state its educational-only and RTP, ExCB, and CoPC boundaries.' })
  }
  return issues
}
