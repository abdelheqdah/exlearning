// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import App, { resolveRoute } from '../App'
import {
  calculateCurriculumProgress,
  getLessonStatus,
  getRecommendedPath,
  initialProgress,
  normaliseProgress,
  quizPassThreshold,
  recordQuizResult,
  recordScenarioResult,
  resetProgress,
  safeGetStorage,
  safeRemoveStorage,
  safeSetStorage,
  scoreQuiz,
  storageKey,
} from './progress'
import { lessons } from '../data/lessons'

afterEach(() => cleanup())
beforeEach(() => {
  window.scrollTo = vi.fn()
})

describe('route rendering', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
    localStorage.clear()
  })

  it('renders the home page', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /build better decisions/i })).toBeTruthy()
  })

  it('renders the fallback page for an unknown route', () => {
    window.history.pushState({}, '', '/does-not-exist')
    render(<App />)
    expect(screen.getByRole('heading', { name: /learning item is unavailable/i })).toBeTruthy()
  })

  it('resolves known detail routes and an unknown route', () => {
    expect(resolveRoute('/lesson/ex001-foundations')).toEqual({ page: 'lesson', id: 'ex001-foundations' })
    expect(resolveRoute('/unknown/path')).toEqual({ page: 'not-found', id: 'path' })
  })

  it('unpacks fallback query param ?p=... for static SPA hosts like GitHub Pages', () => {
    window.history.pushState({}, '', '/?p=%2Fquizzes')
    render(<App />)
    expect(screen.getByRole('heading', { name: /check your understanding/i })).toBeTruthy()
    expect(window.location.pathname).toBe('/quizzes')
  })
})

describe('learning outcomes', () => {
  it('calculates quiz scores and preserves the best score after a retry', () => {
    expect(scoreQuiz(2, 3)).toBe(67)
    const attempted = recordQuizResult(initialProgress, 'quiz-1', 50)
    expect(attempted.attemptedQuizzes).toContain('quiz-1')
    expect(attempted.completedQuizzes).not.toContain('quiz-1')
    const belowThreshold = recordQuizResult(attempted, 'quiz-1', quizPassThreshold - 1)
    expect(belowThreshold.completedQuizzes).not.toContain('quiz-1')
    const completed = recordQuizResult(attempted, 'quiz-1', quizPassThreshold)
    expect(completed.completedQuizzes).toContain('quiz-1')
    expect(recordQuizResult(completed, 'quiz-1', 50).quizScores['quiz-1']).toBe(quizPassThreshold)
    expect(recordQuizResult(completed, 'quiz-1', 50).quizAttempts['quiz-1']).toBe(3)
  })

  it('records scenario attempts separately from successful completion', () => {
    const attempted = recordScenarioResult(initialProgress, 'scenario-1', false)
    expect(attempted.attemptedScenarios).toContain('scenario-1')
    expect(attempted.completedScenarios).not.toContain('scenario-1')
    expect(recordScenarioResult(attempted, 'scenario-1', true).completedScenarios).toContain('scenario-1')
    expect(recordScenarioResult(attempted, 'scenario-1', true).scenarioAttempts['scenario-1']).toBe(2)
  })
})

describe('localStorage persistence', () => {
  it('normalises and restores stored progress', () => {
    localStorage.setItem(storageKey, JSON.stringify({ completedLessons: ['lesson-1'], attemptedQuizzes: ['quiz-1'] }))
    const restored = normaliseProgress(JSON.parse(localStorage.getItem(storageKey)!))
    expect(restored.completedLessons).toEqual(['lesson-1'])
    expect(restored.attemptedQuizzes).toEqual(['quiz-1'])
    expect(restored.completedScenarios).toEqual([])
    expect(restored.startedLessons).toEqual(['lesson-1'])
  })

  it('safely sanitizes corrupted progress payloads with non-strings, nulls, and invalid numbers', () => {
    const corrupted = {
      startedLessons: ['valid-lesson', null, 123, '', undefined],
      completedLessons: ['valid-lesson', {}],
      attemptedQuizzes: ['quiz-1', false],
      quizAttempts: { 'quiz-1': 2, 'bad-1': 'invalid', 'bad-2': NaN, 'bad-3': -5, 'bad-4': null },
      completedQuizzes: ['quiz-1'],
      quizScores: { 'quiz-1': 85, 'bad-1': '100', 'bad-2': Infinity },
      attemptedScenarios: ['scenario-1'],
      scenarioAttempts: { 'scenario-1': 1 },
      completedScenarios: ['scenario-1'],
    }
    const sanitized = normaliseProgress(corrupted)
    expect(sanitized.startedLessons).toEqual(['valid-lesson'])
    expect(sanitized.completedLessons).toEqual(['valid-lesson'])
    expect(sanitized.attemptedQuizzes).toEqual(['quiz-1'])
    expect(sanitized.quizAttempts).toEqual({ 'quiz-1': 2 })
    expect(sanitized.quizScores).toEqual({ 'quiz-1': 85 })
    expect(sanitized.attemptedScenarios).toEqual(['scenario-1'])
    expect(sanitized.completedScenarios).toEqual(['scenario-1'])
  })

  it('safely handles storage exceptions without throwing', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError: The operation is insecure.')
    })
    expect(safeGetStorage('any-key')).toBeNull()
    getItemSpy.mockRestore()

    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(safeSetStorage('any-key', 'val')).toBe(false)
    setItemSpy.mockRestore()

    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('StorageBlocked')
    })
    expect(safeRemoveStorage('any-key')).toBe(false)
    removeItemSpy.mockRestore()
  })
})

describe('curriculum progression', () => {
  it('calculates lesson status, module progress, and level progress', () => {
    const progress = { ...initialProgress, startedLessons: [lessons[0].id, lessons[1].id], completedLessons: [lessons[0].id] }
    const summary = calculateCurriculumProgress(progress, lessons)
    expect(getLessonStatus(progress, lessons[0].id)).toBe('completed')
    expect(getLessonStatus(progress, lessons[1].id)).toBe('in-progress')
    expect(summary.completedLessons).toBe(1)
    expect(summary.inProgressLessons).toBe(1)
    expect(summary.byModule[lessons[0].moduleOrder].completed).toBe(1)
    expect(summary.byLevel.Beginner.total).toBeGreaterThan(0)
  })

  it('keeps reset state empty and compatible with the stored shape', () => {
    const reset = resetProgress()
    expect(reset.startedLessons).toEqual([])
    expect(reset.quizScores).toEqual({})
    expect(reset.completedScenarios).toEqual([])
  })

  it('recommends the next ordered activity for each progress state', () => {
    const lessonIds = ['lesson-a', 'lesson-b']
    const quizIds = ['quiz-a', 'quiz-b']
    const scenarioIds = ['scenario-a', 'scenario-b']
    expect(getRecommendedPath(initialProgress, lessonIds, quizIds, scenarioIds)).toBe('/lesson/lesson-a')
    expect(getRecommendedPath({ ...initialProgress, startedLessons: ['lesson-a'] }, lessonIds, quizIds, scenarioIds)).toBe('/lesson/lesson-a')
    expect(getRecommendedPath({ ...initialProgress, completedLessons: ['lesson-a'] }, lessonIds, quizIds, scenarioIds)).toBe('/lesson/lesson-b')
    expect(getRecommendedPath({ ...initialProgress, completedLessons: lessonIds, completedQuizzes: ['quiz-a'] }, lessonIds, quizIds, scenarioIds)).toBe('/quiz/quiz-b')
    expect(getRecommendedPath({ ...initialProgress, completedLessons: lessonIds, completedQuizzes: quizIds, completedScenarios: ['scenario-a'] }, lessonIds, quizIds, scenarioIds)).toBe('/scenario/scenario-b')
    expect(getRecommendedPath({ ...initialProgress, completedLessons: lessonIds, completedQuizzes: quizIds, completedScenarios: scenarioIds }, lessonIds, quizIds, scenarioIds)).toBe('/scenarios')
  })

  it('handles empty curricula and unknown progress IDs without invalid percentages', () => {
    const progress = { ...initialProgress, startedLessons: ['missing'], completedLessons: ['missing'] }
    const summary = calculateCurriculumProgress(progress, [])
    expect(summary.totalLessons).toBe(0)
    expect(summary.completionPercent).toBe(0)
    expect(summary.byModule).toEqual({})
    expect(Object.values(summary.byLevel).every((level) => level.percent === 0 && level.notStarted === 0)).toBe(true)
    expect(calculateCurriculumProgress(progress, lessons).completedLessons).toBe(0)
  })
})

describe('progress UI', () => {
  it('marks only the opened lesson in progress and preserves completed lessons', async () => {
    const completedId = lessons[0].id
    const openedId = lessons[1].id
    localStorage.setItem(storageKey, JSON.stringify({ completedLessons: [completedId] }))
    window.history.pushState({}, '', `/lesson/${openedId}`)
    render(<App />)
    await waitFor(() => expect(normaliseProgress(JSON.parse(localStorage.getItem(storageKey)!)).startedLessons).toEqual([completedId, openedId]))
    expect(normaliseProgress(JSON.parse(localStorage.getItem(storageKey)!)).completedLessons).toEqual([completedId])
  })

  it('navigates to the previous and next ordered modules', () => {
    window.history.pushState({}, '', `/lesson/${lessons[1].id}`)
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /previous module/i }))
    expect(screen.getByRole('heading', { name: lessons[0].title })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /next module/i }))
    expect(screen.getByRole('heading', { name: lessons[1].title })).toBeTruthy()
  })

  it('clears local progress only after reset confirmation', async () => {
    localStorage.setItem(storageKey, JSON.stringify({ completedLessons: [lessons[0].id] }))
    window.history.pushState({}, '', '/progress')
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const view = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /reset local progress/i }))
    expect(confirm).toHaveBeenCalled()
    expect(JSON.parse(localStorage.getItem(storageKey)!)).toMatchObject({ completedLessons: [lessons[0].id] })
    view.unmount()

    confirm.mockReturnValue(true)
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /reset local progress/i }))
    await waitFor(() => expect(normaliseProgress(JSON.parse(localStorage.getItem(storageKey)!))).toEqual(initialProgress))
    confirm.mockRestore()
  })

  it('renders an empty assessment summary and a populated accessible summary', async () => {
    window.history.pushState({}, '', '/progress')
    const emptyView = render(<App />)
    expect(screen.getByRole('heading', { name: /your practice record/i })).toBeTruthy()
    expect(screen.getByText(/no quiz or scenario attempts yet/i)).toBeTruthy()
    emptyView.unmount()

    localStorage.setItem(storageKey, JSON.stringify({
      attemptedQuizzes: ['hazardous-atmospheres'],
      completedQuizzes: ['hazardous-atmospheres'],
      quizScores: { 'hazardous-atmospheres': 100 },
      quizAttempts: { 'hazardous-atmospheres': 2 },
      attemptedScenarios: ['unclear-area-drawing'],
      scenarioAttempts: { 'unclear-area-drawing': 1 },
    }))
    render(<App />)
    await waitFor(() => expect(screen.getByRole('table')).toBeTruthy())
    expect(screen.getByRole('cell', { name: /best 100%/i })).toBeTruthy()
    expect(screen.getByText(/explosive atmospheres and hazards/i)).toBeTruthy()
    expect(screen.getByText(/an unclear area drawing/i)).toBeTruthy()
    expect(screen.getByText(/not certification, approval, compliance evidence/i)).toBeTruthy()
  })

  it('renders missing lesson and quiz references safely', () => {
    window.history.pushState({}, '', '/lesson/missing-lesson')
    const lessonView = render(<App />)
    expect(screen.getByRole('heading', { name: /learning item is unavailable/i })).toBeTruthy()
    lessonView.unmount()
    window.history.pushState({}, '', '/quiz/missing-quiz')
    render(<App />)
    expect(screen.getByRole('heading', { name: /learning item is unavailable/i })).toBeTruthy()
  })

  it('exposes the primary navigation and skip link for keyboard users', () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeTruthy()
    expect(screen.getByRole('link', { name: /skip to main content/i }).getAttribute('href')).toBe('#main-content')
    expect(screen.getByRole('main').getAttribute('tabindex')).toBe('-1')
  })

  it('displays activities attempted count on home page reflecting started lessons, attempted quizzes, and attempted scenarios', () => {
    localStorage.setItem(storageKey, JSON.stringify({
      startedLessons: ['ex-orientation', 'ex001-foundations'],
      completedLessons: ['ex-orientation'],
      attemptedQuizzes: ['orientation-boundaries'],
      attemptedScenarios: ['unclear-area-drawing'],
    }))
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.getByText('4')).toBeTruthy()
    expect(screen.getByText(/activities attempted/i)).toBeTruthy()
  })

  it('renders related practice quiz link for modules whose quiz links them via lessonIds (e.g. Module 2 and Module 13)', () => {
    window.history.pushState({}, '', '/lesson/hazardous-areas')
    const view1 = render(<App />)
    expect(screen.getByRole('button', { name: /take explosive atmospheres and hazards/i })).toBeTruthy()
    view1.unmount()

    window.history.pushState({}, '', '/lesson/documentation-and-records')
    render(<App />)
    expect(screen.getByRole('button', { name: /take inspection and lifecycle decisions/i })).toBeTruthy()
  })

  it('highlights the active section in navigation with aria-current when viewing detail routes', () => {
    window.history.pushState({}, '', '/lesson/ex001-foundations')
    const view = render(<App />)
    const lessonsNav = screen.getByRole('button', { name: 'Lessons' })
    expect(lessonsNav.getAttribute('aria-current')).toBe('page')
    expect(lessonsNav.classList.contains('active')).toBe(true)
    view.unmount()

    window.history.pushState({}, '', '/quiz/hazardous-atmospheres')
    const view2 = render(<App />)
    const quizzesNav = screen.getByRole('button', { name: 'Quizzes' })
    expect(quizzesNav.getAttribute('aria-current')).toBe('page')
    expect(quizzesNav.classList.contains('active')).toBe(true)
    view2.unmount()
  })

  it('displays visible and screen-reader accessible tags alongside colors for assessment feedback', () => {
    window.history.pushState({}, '', '/scenario/unclear-area-drawing')
    render(<App />)
    const option = screen.getByRole('button', { name: /control the change/i })
    fireEvent.click(option)
    expect(screen.getByText(/✓ recommended/i)).toBeTruthy()
  })

  it('shows clear confirmation feedback when progress is reset', async () => {
    localStorage.setItem(storageKey, JSON.stringify({ completedLessons: [lessons[0].id] }))
    window.history.pushState({}, '', '/progress')
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /reset local progress/i }))
    await waitFor(() => expect(screen.getByText(/all locally stored learning progress has been reset/i)).toBeTruthy())
    confirm.mockRestore()
  })
})

describe('dynamic route state isolation', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('resets quiz answers and submission state when navigating between different quiz IDs', async () => {
    window.history.pushState({}, '', '/quiz/hazardous-atmospheres')
    render(<App />)

    expect(screen.getByRole('heading', { name: /explosive atmospheres and hazards/i })).toBeTruthy()
    expect(screen.getByText(/0 of 2 questions answered/i)).toBeTruthy()

    // Answer both questions and submit the first quiz
    const radios = screen.getAllByRole('radio')
    fireEvent.click(radios[0])
    fireEvent.click(radios[6])

    const submitButton = screen.getByRole('button', { name: /submit answers/i })
    fireEvent.click(submitButton)

    expect(screen.getByRole('button', { name: /retry quiz/i })).toBeTruthy()

    // Navigate to a different quiz without unmounting App
    window.history.pushState({}, '', '/quiz/competence-boundaries')
    window.dispatchEvent(new PopStateEvent('popstate'))

    await waitFor(() => expect(screen.getByRole('heading', { name: /competence and scheme boundaries/i })).toBeTruthy())
    expect(screen.queryByRole('button', { name: /retry quiz/i })).toBeNull()
    expect(screen.getByText(/0 of 1 questions answered/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /submit answers/i }).hasAttribute('disabled')).toBe(true)
  })

  it('resets scenario decision state when navigating between different scenario IDs', async () => {
    window.history.pushState({}, '', '/scenario/unclear-area-drawing')
    render(<App />)

    expect(screen.getByRole('heading', { name: /an unclear area drawing/i })).toBeTruthy()
    expect(screen.getByText(/awaiting your decision/i)).toBeTruthy()

    // Make a choice in the first scenario
    const option = screen.getByRole('button', { name: /control the change/i })
    fireEvent.click(option)

    expect(screen.getByText(/decision reviewed/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /retry scenario/i })).toBeTruthy()

    // Navigate to a different scenario without unmounting App
    window.history.pushState({}, '', '/scenario/gas-release-ignition-source')
    window.dispatchEvent(new PopStateEvent('popstate'))

    await waitFor(() => expect(screen.getByRole('heading', { name: /gas release near an ignition source/i })).toBeTruthy())
    expect(screen.getByText(/awaiting your decision/i)).toBeTruthy()
    expect(screen.queryByRole('button', { name: /retry scenario/i })).toBeNull()
  })
})
