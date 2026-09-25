import { useEffect, useState } from 'react'
import type { ProgressState } from '../types'
import {
  initialProgress,
  normaliseProgress,
  recordQuizResult,
  recordScenarioResult,
  resetProgress,
  safeGetStorage,
  safeSetStorage,
  storageKey,
} from '../utils/progress'

function loadProgress(): ProgressState {
  const raw = safeGetStorage(storageKey)
  if (!raw) return initialProgress
  try {
    return normaliseProgress(JSON.parse(raw))
  } catch {
    return initialProgress
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress)

  useEffect(() => {
    safeSetStorage(storageKey, JSON.stringify(progress))
  }, [progress])

  const startLesson = (id: string) => setProgress((current) => ({ ...current, startedLessons: [...new Set([...current.startedLessons, id])] }))
  const completeLesson = (id: string) => setProgress((current) => ({ ...current, startedLessons: [...new Set([...current.startedLessons, id])], completedLessons: [...new Set([...current.completedLessons, id])] }))
  const saveQuizScore = (id: string, score: number) => setProgress((current) => recordQuizResult(current, id, score))
  const recordScenario = (id: string, isCorrect: boolean) => setProgress((current) => recordScenarioResult(current, id, isCorrect))

  const clearProgress = () => {
    const fresh = resetProgress()
    safeSetStorage(storageKey, JSON.stringify(fresh))
    setProgress(fresh)
  }

  return { progress, startLesson, completeLesson, saveQuizScore, recordScenario, clearProgress }
}
