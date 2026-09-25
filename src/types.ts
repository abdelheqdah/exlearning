export type Level = 'Beginner' | 'Intermediate' | 'Advanced'

export type Lesson = {
  id: string
  moduleOrder: number
  title: string
  level: Level
  category: string
  briefDescription: string
  estimatedMinutes: number
  objectives: string[]
  prerequisites: string[]
  sections: { heading: string; body: string }[]
  checklist?: string[]
  examples?: string[]
  keyTakeaways: string[]
  relatedTopics: string[]
}

export type QuizQuestion = {
  id: string
  prompt: string
  options: string[]
  correctAnswer: number
  explanation: string
  relatedLessonId: string
  difficulty?: 'introductory' | 'applied' | 'advanced'
  objective?: string
  kind?: 'knowledge' | 'calculation' | 'finding' | 'boundary'
  trainingData?: { source: 'original'; educationalOnly: true }
}

export type Quiz = {
  id: string
  title: string
  level: Level
  description: string
  lessonIds: string[]
  questions: QuizQuestion[]
}

export type Scenario = {
  id: string
  title: string
  level: Level
  lessonIds: string[]
  context: string
  decisionOptions: string[]
  correctChoice: number
  explanation: string
  consequence: string
  recommendedAction: string
}

export type ProgressState = {
  startedLessons: string[]
  completedLessons: string[]
  attemptedQuizzes: string[]
  quizAttempts: Record<string, number>
  completedQuizzes: string[]
  quizScores: Record<string, number>
  attemptedScenarios: string[]
  scenarioAttempts: Record<string, number>
  completedScenarios: string[]
}

export type LessonStatus = 'not-started' | 'in-progress' | 'completed'

export type CurriculumProgress = {
  totalLessons: number
  completedLessons: number
  inProgressLessons: number
  notStartedLessons: number
  completionPercent: number
  byLevel: Record<Level, { total: number; completed: number; inProgress: number; notStarted: number; percent: number }>
  byModule: Record<number, { total: number; completed: number; inProgress: number; notStarted: number; percent: number }>
}
