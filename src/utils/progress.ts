import type { CurriculumProgress, Lesson, LessonStatus, Level, ProgressState } from '../types'

export const storageKey = 'exlearn-progress-v1'

export const initialProgress: ProgressState = {
  startedLessons: [],
  completedLessons: [],
  attemptedQuizzes: [],
  quizAttempts: {},
  completedQuizzes: [],
  quizScores: {},
  attemptedScenarios: [],
  scenarioAttempts: {},
  completedScenarios: [],
}

function cleanStringArray(arr: unknown): string[] {
  return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string' && x.length > 0) : []
}

function cleanNumberMap(obj: unknown): Record<string, number> {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {}
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => typeof k === 'string' && typeof v === 'number' && Number.isFinite(v) && v >= 0)
  )
}

export function normaliseProgress(value: unknown): ProgressState {
  if (!value || typeof value !== 'object') return initialProgress
  const parsed = value as Partial<ProgressState>
  const completedLessons = cleanStringArray(parsed.completedLessons)
  const startedLessons = [...new Set([...cleanStringArray(parsed.startedLessons), ...completedLessons])]

  return {
    startedLessons,
    completedLessons,
    attemptedQuizzes: cleanStringArray(parsed.attemptedQuizzes),
    quizAttempts: cleanNumberMap(parsed.quizAttempts),
    completedQuizzes: cleanStringArray(parsed.completedQuizzes),
    quizScores: cleanNumberMap(parsed.quizScores),
    attemptedScenarios: cleanStringArray(parsed.attemptedScenarios),
    scenarioAttempts: cleanNumberMap(parsed.scenarioAttempts),
    completedScenarios: cleanStringArray(parsed.completedScenarios),
  }
}

export function safeGetStorage(key: string): string | null {
  try {
    return typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null
  } catch {
    return null
  }
}

export function safeSetStorage(key: string, value: string): boolean {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value)
      return true
    }
    return false
  } catch {
    return false
  }
}

export function safeRemoveStorage(key: string): boolean {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key)
      return true
    }
    return false
  } catch {
    return false
  }
}

export function getLessonStatus(progress: ProgressState, lessonId: string): LessonStatus {
  if (progress.completedLessons.includes(lessonId)) return 'completed'
  if (progress.startedLessons.includes(lessonId)) return 'in-progress'
  return 'not-started'
}

export function calculateCurriculumProgress(progress: ProgressState, lessons: Lesson[]): CurriculumProgress {
  const levels: Level[] = ['Beginner', 'Intermediate', 'Advanced']
  const byLevel = Object.fromEntries(levels.map((level) => {
    const items = lessons.filter((lesson) => lesson.level === level)
    const completed = items.filter((lesson) => getLessonStatus(progress, lesson.id) === 'completed').length
    const inProgress = items.filter((lesson) => getLessonStatus(progress, lesson.id) === 'in-progress').length
    return [level, { total: items.length, completed, inProgress, notStarted: items.length - completed - inProgress, percent: items.length ? Math.round((completed / items.length) * 100) : 0 }]
  })) as CurriculumProgress['byLevel']
  const completedLessons = lessons.filter((lesson) => getLessonStatus(progress, lesson.id) === 'completed').length
  const inProgressLessons = lessons.filter((lesson) => getLessonStatus(progress, lesson.id) === 'in-progress').length
  const moduleOrders = [...new Set(lessons.map((lesson) => lesson.moduleOrder))].sort((a, b) => a - b)
  const byModule = Object.fromEntries(moduleOrders.map((moduleOrder) => {
    const items = lessons.filter((lesson) => lesson.moduleOrder === moduleOrder)
    const completed = items.filter((lesson) => getLessonStatus(progress, lesson.id) === 'completed').length
    const inProgress = items.filter((lesson) => getLessonStatus(progress, lesson.id) === 'in-progress').length
    return [moduleOrder, { total: items.length, completed, inProgress, notStarted: items.length - completed - inProgress, percent: items.length ? Math.round((completed / items.length) * 100) : 0 }]
  })) as CurriculumProgress['byModule']
  return { totalLessons: lessons.length, completedLessons, inProgressLessons, notStartedLessons: lessons.length - completedLessons - inProgressLessons, completionPercent: lessons.length ? Math.round((completedLessons / lessons.length) * 100) : 0, byLevel, byModule }
}

export const quizPassThreshold = 80

export function scoreQuiz(correctAnswers: number, questionCount: number): number {
  return questionCount > 0 ? Math.round((correctAnswers / questionCount) * 100) : 0
}

export function recordQuizResult(current: ProgressState, id: string, score: number): ProgressState {
  return {
    ...current,
    attemptedQuizzes: [...new Set([...current.attemptedQuizzes, id])],
    quizAttempts: { ...current.quizAttempts, [id]: (current.quizAttempts[id] ?? 0) + 1 },
    completedQuizzes: score >= quizPassThreshold ? [...new Set([...current.completedQuizzes, id])] : current.completedQuizzes,
    quizScores: { ...current.quizScores, [id]: Math.max(current.quizScores[id] ?? 0, score) },
  }
}

export function recordScenarioResult(current: ProgressState, id: string, isCorrect: boolean): ProgressState {
  return {
    ...current,
    attemptedScenarios: [...new Set([...current.attemptedScenarios, id])],
    scenarioAttempts: { ...current.scenarioAttempts, [id]: (current.scenarioAttempts[id] ?? 0) + 1 },
    completedScenarios: isCorrect ? [...new Set([...current.completedScenarios, id])] : current.completedScenarios,
  }
}

export function getRecommendedPath(progress: ProgressState, lessonIds: string[], quizIds: string[], scenarioIds: string[]): string {
  const nextLesson = lessonIds.find((id) => !progress.completedLessons.includes(id))
  if (nextLesson) return `/lesson/${nextLesson}`
  const nextQuiz = quizIds.find((id) => !progress.completedQuizzes.includes(id))
  if (nextQuiz) return `/quiz/${nextQuiz}`
  const nextScenario = scenarioIds.find((id) => !progress.completedScenarios.includes(id))
  return nextScenario ? `/scenario/${nextScenario}` : '/scenarios'
}

export function resetProgress(): ProgressState {
  return { ...initialProgress, quizScores: {} }
}
