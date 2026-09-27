import { describe, expect, it } from 'vitest'
import { lessons } from './lessons'
import { quizzes } from './quizzes'
import { scenarios } from './scenarios'
import { normaliseProgress } from '../utils/progress'
import { validateCurriculumIntegrity } from '../utils/integrity'

describe('Phase 2 curriculum integrity', () => {
  it('keeps stable, ordered lesson references', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(20)
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(lessons.length)
    expect(lessons.map((lesson) => lesson.moduleOrder)).toEqual([...lessons].sort((a, b) => a.moduleOrder - b.moduleOrder).map((lesson) => lesson.moduleOrder))
    for (const lesson of lessons) {
      for (const prerequisite of lesson.prerequisites) expect(lessons.some((item) => item.id === prerequisite)).toBe(true)
    }
  })

  it('guarantees no fabricated clause numbers exist in the curriculum text', () => {
    const clauseRegex = /Clause\s+\d+\.\d+/i
    for (const lesson of lessons) {
      expect(clauseRegex.test(JSON.stringify(lesson))).toBe(false)
    }
    for (const scenario of scenarios) {
      expect(clauseRegex.test(JSON.stringify(scenario))).toBe(false)
    }
  })

  it('keeps quiz and scenario lesson relationships valid', () => {
    expect(quizzes.reduce((total, quiz) => total + quiz.questions.length, 0)).toBeGreaterThanOrEqual(100)
    expect(scenarios.length).toBeGreaterThanOrEqual(12)
    const lessonIds = new Set(lessons.map((lesson) => lesson.id))
    expect(new Set(quizzes.map((quiz) => quiz.id)).size).toBe(quizzes.length)
    expect(new Set(scenarios.map((scenario) => scenario.id)).size).toBe(scenarios.length)
    for (const quiz of quizzes) {
      expect(quiz.lessonIds.every((id) => lessonIds.has(id))).toBe(true)
      expect(quiz.questions.every((question) => lessonIds.has(question.relatedLessonId))).toBe(true)
    }
    for (const scenario of scenarios) expect(scenario.lessonIds.every((id) => lessonIds.has(id))).toBe(true)
  })

  it('passes complete assessment integrity validation', () => {
    expect(validateCurriculumIntegrity(lessons, quizzes, scenarios)).toEqual([])
  })

  it('provides Phase 6 applied content and educational metadata', () => {
    const phase6Ids = ['ex007-installation-practice', 'ex-d-flameproof', 'ex-e-increased-safety', 'ex-i-intrinsic-safety', 'ex-t-dust-protection', 'ex-p-pressurization', 'glands-and-cable-entries', 'marking-findings-and-is-calculations']
    for (const id of phase6Ids) {
      const lesson = lessons.find((item) => item.id === id)
      expect(lesson).toBeDefined()
    }
    const phase6Questions = quizzes.flatMap((quiz) => quiz.questions).filter((question) => question.trainingData?.educationalOnly)
    expect(phase6Questions.length).toBeGreaterThanOrEqual(80)
    expect(phase6Questions.some((question) => question.kind === 'calculation')).toBe(true)
    expect(phase6Questions.some((question) => question.kind === 'finding')).toBe(true)
  })

  it('meets the focused EX001, EX007, and EX008 assessment distribution', () => {
    const questions = quizzes.flatMap((quiz) => quiz.questions)
    const countForLesson = (lessonId: string) => questions.filter((question) => question.relatedLessonId === lessonId).length
    expect(countForLesson('ex001-foundations')).toBeGreaterThanOrEqual(25)
    expect(countForLesson('ex007-installation-practice')).toBeGreaterThanOrEqual(20)
    expect(countForLesson('ex008-inspection')).toBeGreaterThanOrEqual(25)
  })

  it('maintains balanced answer distributions across all option positions', () => {
    const allQuestions = quizzes.flatMap((quiz) => quiz.questions)
    const quizAnswerCounts = [0, 1, 2, 3].map((pos) => allQuestions.filter((q) => q.correctAnswer === pos).length)
    for (const count of quizAnswerCounts) {
      expect(count).toBeGreaterThan(0)
      const ratio = count / allQuestions.length
      expect(ratio).toBeLessThan(0.35)
      expect(ratio).toBeGreaterThan(0.15)
    }

    const scenarioChoiceCounts = [0, 1, 2, 3].map((pos) => scenarios.filter((s) => s.correctChoice === pos).length)
    for (const count of scenarioChoiceCounts) {
      expect(count).toBeGreaterThan(0)
      const ratio = count / scenarios.length
      expect(ratio).toBeLessThan(0.40)
    }
  })

  it('guarantees quiz question semantic integrity, option distinctness, and absence of positional references', () => {
    const allQuestions = quizzes.flatMap((quiz) => quiz.questions)
    expect(allQuestions.length).toBeGreaterThanOrEqual(160)

    const letterRefRegex = /\b(?:option|choice)\s+[a-d]\b|\b[A-D]\s+is\s+correct\b/i
    const clauseRegex = /Clause\s+\d+\.\d+/i

    for (const q of allQuestions) {
      expect(q.options.length).toBe(4)
      expect(q.correctAnswer).toBeGreaterThanOrEqual(0)
      expect(q.correctAnswer).toBeLessThanOrEqual(3)

      const correctOptionText = q.options[q.correctAnswer]
      expect(correctOptionText).toBeDefined()
      expect(correctOptionText.trim().length).toBeGreaterThan(0)

      // Ensure all 4 options within each question are distinct
      const normalizedOptions = q.options.map((opt) => opt.trim().toLowerCase())
      expect(new Set(normalizedOptions).size).toBe(4)

      // Ensure explanations are substantive and do not contain fragile positional letter references
      expect(q.explanation.trim().length).toBeGreaterThanOrEqual(25)
      expect(letterRefRegex.test(q.explanation)).toBe(false)
      expect(clauseRegex.test(q.explanation)).toBe(false)
    }

    for (const scenario of scenarios) {
      expect(scenario.context.trim().length).toBeGreaterThanOrEqual(25)
      expect(scenario.explanation.trim().length).toBeGreaterThanOrEqual(25)
      expect(scenario.recommendedAction.trim().length).toBeGreaterThanOrEqual(25)
      expect(clauseRegex.test(scenario.explanation)).toBe(false)
    }
  })

  it('detects invalid answer indexes, duplicate IDs, and missing references', () => {
    const invalidQuiz = { ...quizzes[0], id: quizzes[1].id, lessonIds: ['missing-lesson'], questions: [{ ...quizzes[0].questions[0], id: quizzes[0].questions[1].id, correctAnswer: 99, relatedLessonId: 'missing-lesson' }] }
    const invalidScenario = { ...scenarios[0], correctChoice: 99, lessonIds: ['missing-lesson'] }
    const issues = validateCurriculumIntegrity(lessons, [invalidQuiz], [invalidScenario])
    expect(issues.some((issue) => issue.type === 'answer-index')).toBe(true)
    expect(issues.some((issue) => issue.type === 'scenario-choice')).toBe(true)
    expect(issues.some((issue) => issue.type === 'quiz-reference')).toBe(true)
    expect(issues.some((issue) => issue.type === 'question-reference')).toBe(true)
    expect(issues.some((issue) => issue.type === 'scenario-reference')).toBe(true)
  })

  it('preserves legacy progress fields while adding Phase 2 fields', () => {
    const progress = normaliseProgress({ completedLessons: ['ex001-foundations'], quizScores: { 'foundations-check': 100 } })
    expect(progress.completedLessons).toEqual(['ex001-foundations'])
    expect(progress.quizScores['foundations-check']).toBe(100)
    expect(progress.attemptedQuizzes).toEqual([])
    expect(progress.completedScenarios).toEqual([])
  })

  it('states the CoPC, RTP, and ExCB boundary explicitly', () => {
    const boundary = lessons.find((lesson) => lesson.id === 'copc-rtp-excb')
    const text = boundary?.sections.map((section) => section.body).join(' ') ?? ''
    expect(text).toMatch(/not an RTP/i)
    expect(text).toMatch(/not an ExCB/i)
    expect(text).toMatch(/does not issue CoPC/i)
  })

  it('covers concrete standards specifications: zones, gas/dust groups, EPLs, T-classes, and IS entity parameters', () => {
    const allLessonText = lessons.flatMap((l) => [l.title, l.briefDescription, ...l.sections.map((s) => s.body), ...l.keyTakeaways]).join(' ')
    expect(allLessonText).toMatch(/Zone 0/i)
    expect(allLessonText).toMatch(/Zone 1/i)
    expect(allLessonText).toMatch(/Zone 2/i)
    expect(allLessonText).toMatch(/Zone 20/i)
    expect(allLessonText).toMatch(/Zone 21/i)
    expect(allLessonText).toMatch(/Zone 22/i)
    expect(allLessonText).toMatch(/Group IIA/i)
    expect(allLessonText).toMatch(/Group IIB/i)
    expect(allLessonText).toMatch(/Group IIC/i)
    expect(allLessonText).toMatch(/Group IIIA/i)
    expect(allLessonText).toMatch(/Group IIIB/i)
    expect(allLessonText).toMatch(/Group IIIC/i)
    expect(allLessonText).toMatch(/EPL Ga/i)
    expect(allLessonText).toMatch(/EPL Gb/i)
    expect(allLessonText).toMatch(/EPL Gc/i)
    expect(allLessonText).toMatch(/EPL Da/i)
    expect(allLessonText).toMatch(/EPL Db/i)
    expect(allLessonText).toMatch(/EPL Dc/i)
    expect(allLessonText).toMatch(/450°C/)
    expect(allLessonText).toMatch(/85°C/)
    expect(allLessonText).toMatch(/Ui ≥ Uo|Ui >= Uo/)
    expect(allLessonText).toMatch(/Ci \+ Ccable ≤ Co|Ci \+ Cc <= Co/)
  })

  it('covers marking interpretation, X/U certificate suffixes, EX008 grades/regimes, and EX007 installation rules', () => {
    const allLessonText = lessons.flatMap((l) => [l.title, l.briefDescription, ...l.sections.map((s) => s.body), ...l.keyTakeaways]).join(' ')
    // ATEX & Certificate rules
    expect(allLessonText).toMatch(/2014\/34\/EU/i)
    expect(allLessonText).toMatch(/⟨Ex⟩|Community hexagon/i)
    expect(allLessonText).toMatch(/Specific Conditions of Use/i)
    expect(allLessonText).toMatch(/Ex Component Certificate/i)
    expect(allLessonText).toMatch(/"X" Suffix/i)
    expect(allLessonText).toMatch(/"U" Suffix/i)

    // EX008 Inspection methodology
    expect(allLessonText).toMatch(/Visual Inspection/i)
    expect(allLessonText).toMatch(/Close Inspection/i)
    expect(allLessonText).toMatch(/Detailed Inspection/i)
    expect(allLessonText).toMatch(/Initial Inspection/i)
    expect(allLessonText).toMatch(/Periodic Inspection/i)
    expect(allLessonText).toMatch(/Continuous Supervision/i)
    expect(allLessonText).toMatch(/12 months/i) // portable/transportable equipment interval

    // EX007 Installation rules
    expect(allLessonText).toMatch(/Barrier Gland/i)
    expect(allLessonText).toMatch(/stopping plugs/i)
  })
})
