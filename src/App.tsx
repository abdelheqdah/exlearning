import { useEffect, useState } from 'react'
import { lessons } from './data/lessons'
import { quizzes } from './data/quizzes'
import { scenarios } from './data/scenarios'
import { useProgress } from './hooks/useProgress'
import { Badge, Disclaimer, LevelBadge, PageHeader, StatusBadge } from './components'
import { calculateCurriculumProgress, getLessonStatus, getRecommendedPath, scoreQuiz } from './utils/progress'
import type { Level, LessonStatus } from './types'

type Route = { page: string; id?: string }

function getRoute(): Route {
  const parts = window.location.pathname.split('/').filter(Boolean)
  return { page: parts[0] ?? 'home', id: parts[1] }
}

export function resolveRoute(pathname: string): Route {
  const parts = pathname.split('/').filter(Boolean)
  const page = parts[0] ?? 'home'
  const knownPages = ['home', 'lessons', 'lesson', 'quizzes', 'quiz', 'scenarios', 'scenario', 'progress', 'about', 'disclaimer']
  return { page: knownPages.includes(page) ? page : 'not-found', id: parts[1] }
}

function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function getInitialPath(): string {
  if (typeof window !== 'undefined' && window.location.search) {
    const params = new URLSearchParams(window.location.search)
    const p = params.get('p')
    if (p) {
      window.history.replaceState({}, '', p)
      return p
    }
  }
  return typeof window !== 'undefined' ? window.location.pathname : '/'
}

function isNavActive(page: string, targetPath: string): boolean {
  if (targetPath === '/lessons') return page === 'lessons' || page === 'lesson'
  if (targetPath === '/quizzes') return page === 'quizzes' || page === 'quiz'
  if (targetPath === '/scenarios') return page === 'scenarios' || page === 'scenario'
  if (targetPath === '/progress') return page === 'progress'
  return false
}

function App() {
  const [route, setRoute] = useState<Route>(() => resolveRoute(getInitialPath()))
  const { progress, startLesson, completeLesson, saveQuizScore, recordScenario, clearProgress, loadImportedProgress } = useProgress()
  useEffect(() => {
    const onPop = () => setRoute(resolveRoute(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  useEffect(() => { document.getElementById('main-content')?.focus() }, [route])
  const go = (path: string) => {
    navigate(path)
    setRoute(resolveRoute(path))
    if (typeof window.scrollTo === 'function') {
      try { window.scrollTo(0, 0) } catch {}
    }
  }

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <nav className="topbar" aria-label="Primary navigation"><button className="brand" onClick={() => go('/')}><span className="brand-mark">EX</span><span>ExLearn</span></button><div className="nav-links">{[['Lessons', '/lessons'], ['Quizzes', '/quizzes'], ['Scenarios', '/scenarios'], ['Progress', '/progress']].map(([label, path]) => { const active = isNavActive(route.page, path); return <button key={path} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined} onClick={() => go(path)}>{label}</button> })}</div><button className="nav-about" onClick={() => go('/about')}>About</button></nav>
    <main id="main-content" tabIndex={-1}>
      {route.page === 'home' && <Home go={go} progress={progress} />}
      {route.page === 'lessons' && <Lessons go={go} progress={progress} />}
      {route.page === 'lesson' && <LessonDetail key={route.id} id={route.id} go={go} progress={progress} startLesson={startLesson} completeLesson={completeLesson} />}
      {route.page === 'quizzes' && <Quizzes go={go} scores={progress.quizScores} />}
      {route.page === 'quiz' && <QuizDetail key={route.id} id={route.id} go={go} saveQuizScore={saveQuizScore} progress={progress} />}
      {route.page === 'scenarios' && <Scenarios go={go} completed={progress.completedScenarios} />}
      {route.page === 'scenario' && <ScenarioDetail key={route.id} id={route.id} go={go} completed={progress.completedScenarios} recordScenario={recordScenario} progress={progress} />}
      {route.page === 'progress' && <Progress go={go} progress={progress} clearProgress={clearProgress} loadImportedProgress={loadImportedProgress} />}
      {route.page === 'about' && <About go={go} />}
      {route.page === 'disclaimer' && <DisclaimerPage />}
      {route.page === 'not-found' && <NotFound go={go} />}
    </main>
    <footer><span>© {new Date().getFullYear()} ExLearn · Independent educational project</span><button onClick={() => go('/disclaimer')}>Legal Disclaimer</button></footer>
  </div>
}

function Home({ go, progress }: { go: (path: string) => void; progress: ReturnType<typeof useProgress>['progress'] }) {
  const total = lessons.length + quizzes.length + scenarios.length
  const done = progress.completedLessons.length + progress.completedQuizzes.length + progress.completedScenarios.length
  const completion = Math.round((done / total) * 100)
  return <><section className="hero"><div><Badge>FIELD-READY LEARNING</Badge><h1>Build better decisions in hazardous areas.</h1><p>Original, practical learning paths for ATEX and IECEx fundamentals, Ex equipment, inspection, and maintenance thinking.</p><div className="hero-actions"><button className="button button-primary" onClick={() => go('/lessons')}>Explore lessons <span>→</span></button><button className="button button-ghost" onClick={() => go('/scenarios')}>Try a scenario</button></div></div><div className="hero-panel"><p className="eyebrow">YOUR LEARNING SIGNAL</p><strong>{progress.startedLessons.length + progress.attemptedQuizzes.length + progress.attemptedScenarios.length}</strong><span>activities attempted</span><div className="signal-line"><i style={{ width: `${completion}%` }} /></div><small>{completion}% successfully completed. Progress stays in this browser.</small></div></section><section className="home-grid"><div><p className="eyebrow">LEARNING PATHS</p><h2>Learn the why, then practise the decision.</h2></div><div className="path-cards"><button onClick={() => go('/lessons')}><span className="path-number">01</span><strong>Lessons</strong><span>Concepts, examples, and takeaways</span></button><button onClick={() => go('/quizzes')}><span className="path-number">02</span><strong>Quizzes</strong><span>Check your understanding</span></button><button onClick={() => go('/scenarios')}><span className="path-number">03</span><strong>Scenarios</strong><span>Practise safe decisions</span></button></div></section><Disclaimer /></>
}

function Lessons({ go, progress }: { go: (path: string) => void; progress: ReturnType<typeof useProgress>['progress'] }) {
  const [level, setLevel] = useState<Level | 'All'>('All')
  const [status, setStatus] = useState<LessonStatus | 'all'>('all')
  const visible = [...lessons].sort((a, b) => a.moduleOrder - b.moduleOrder).filter((lesson) => (level === 'All' || lesson.level === level) && (status === 'all' || getLessonStatus(progress, lesson.id) === status))
  return <div className="container"><PageHeader eyebrow="01 / LESSONS" title="Build your foundation." intro="Follow the ordered curriculum. Filters help you review without losing the module sequence." /><div className="filters" aria-label="Lesson filters"><label>Level<select value={level} onChange={(event) => setLevel(event.target.value as Level | 'All')}><option>All</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label><label>Status<select value={status} onChange={(event) => setStatus(event.target.value as LessonStatus | 'all')}><option value="all">All</option><option value="not-started">Not started</option><option value="in-progress">In progress</option><option value="completed">Completed</option></select></label></div><div className="card-grid">{visible.map((lesson) => { const lessonStatus = getLessonStatus(progress, lesson.id); return <article className="card" key={lesson.id}><div className="card-top"><LevelBadge level={lesson.level} /><StatusBadge status={lessonStatus} /></div><p className="eyebrow">Module {lesson.moduleOrder} · {lesson.category}</p><h2>{lesson.title}</h2><p>{lesson.briefDescription}</p><button className="text-button" onClick={() => go(`/lesson/${lesson.id}`)}>{lessonStatus === 'completed' ? 'Review lesson' : lessonStatus === 'in-progress' ? 'Continue lesson' : 'Start lesson'} <span>→</span></button></article> })}</div>{visible.length === 0 && <p className="empty-state">No lessons match these filters.</p>}</div>
}

function LessonDetail({ id, go, progress, startLesson, completeLesson }: { id?: string; go: (path: string) => void; progress: ReturnType<typeof useProgress>['progress']; startLesson: (id: string) => void; completeLesson: (id: string) => void }) {
  const lesson = lessons.find((item) => item.id === id)
  useEffect(() => { if (lesson) startLesson(lesson.id) }, [lesson?.id])
  if (!lesson) return <NotFound go={go} />
  const relatedQuiz = quizzes.find((quiz) => quiz.lessonIds.includes(lesson.id) || quiz.questions.some((question) => question.relatedLessonId === lesson.id))
  const orderedLessons = [...lessons].sort((a, b) => a.moduleOrder - b.moduleOrder)
  const index = orderedLessons.findIndex((item) => item.id === lesson.id)
  const previous = orderedLessons[index - 1]
  const next = orderedLessons[index + 1]
  const relatedScenarios = scenarios.filter((scenario) => scenario.lessonIds.includes(lesson.id))
  return <div className="container narrow"><button className="back-button" onClick={() => go('/lessons')}>← All lessons</button><PageHeader eyebrow={`Module ${lesson.moduleOrder} · ${lesson.category} / ${lesson.level}`} title={lesson.title} intro={lesson.briefDescription} /><p className="lesson-status-line"><StatusBadge status={getLessonStatus(progress, lesson.id)} /></p><div className="lesson-meta"><div><p className="eyebrow">PREREQUISITES</p><p>{lesson.prerequisites.length ? lesson.prerequisites.map((prerequisite) => lessons.find((item) => item.id === prerequisite)?.title ?? 'Unavailable module').join(' · ') : 'None — start here.'}</p></div></div><div className="lesson-content">{lesson.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}<section><h2>Key takeaways</h2><ul className="takeaways">{lesson.keyTakeaways.map((item) => <li key={item}>{item}</li>)}</ul></section></div><div className="related-links"><p className="eyebrow">RELATED PRACTICE</p>{relatedQuiz && <button className="text-button" onClick={() => go(`/quiz/${relatedQuiz.id}`)}>Take {relatedQuiz.title} <span>→</span></button>}{relatedScenarios.slice(0, 2).map((scenario) => <button className="text-button" key={scenario.id} onClick={() => go(`/scenario/${scenario.id}`)}>Open scenario: {scenario.title} <span>→</span></button>)}</div><div className="detail-actions"><button className="button button-primary" onClick={() => completeLesson(lesson.id)}>{getLessonStatus(progress, lesson.id) === 'completed' ? 'Lesson completed' : 'Mark lesson complete'} <span>✓</span></button></div><nav className="module-nav" aria-label="Curriculum module navigation"><button className="button button-ghost" disabled={!previous} onClick={() => previous && go(`/lesson/${previous.id}`)}>← Previous module</button><button className="button button-ghost" disabled={!next} onClick={() => next && go(`/lesson/${next.id}`)}>Next module →</button></nav></div>
}

function Quizzes({ go, scores }: { go: (path: string) => void; scores: Record<string, number> }) {
  return <div className="container"><PageHeader eyebrow="02 / QUIZZES" title="Check your understanding." intro="Short multiple-choice checks with explanations that point you back to the right learning topic." /><div className="card-grid">{quizzes.map((quiz) => <article className="card" key={quiz.id}><div className="card-top"><LevelBadge level={quiz.level} /><span>{quiz.questions.length} questions</span></div><h2>{quiz.title}</h2><p>{quiz.description}</p>{scores[quiz.id] !== undefined && <p className="score-line">Best score: {scores[quiz.id]}%</p>}<button className="text-button" onClick={() => go(`/quiz/${quiz.id}`)}>{scores[quiz.id] !== undefined ? 'Retry quiz' : 'Start quiz'} <span>→</span></button></article>)}</div></div>
}

function QuizDetail({ id, go, saveQuizScore, progress }: { id?: string; go: (path: string) => void; saveQuizScore: (id: string, score: number) => void; progress: ReturnType<typeof useProgress>['progress'] }) {
  const quiz = quizzes.find((item) => item.id === id)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  useEffect(() => { setAnswers({}); setSubmitted(false) }, [id])
  if (!quiz) return <NotFound go={go} />
  const score = scoreQuiz(quiz.questions.filter((question) => answers[question.id] === question.correctAnswer).length, quiz.questions.length)
  const submit = () => { setSubmitted(true); saveQuizScore(quiz.id, score) }
  const answeredCount = Object.keys(answers).length
  const bestScore = progress.quizScores[quiz.id]
  return <div className="container narrow"><button className="back-button" onClick={() => go('/quizzes')}>← All quizzes</button><PageHeader eyebrow={`${quiz.level} / KNOWLEDGE CHECK`} title={quiz.title} intro={quiz.description} /><div className="assessment-instructions" role="note"><strong>How to use this check</strong><p>Answer every question, submit when ready, and use the explanations to decide what to revisit. This is educational practice only, not certification or an approval decision.</p><p aria-live="polite">{answeredCount} of {quiz.questions.length} questions answered</p></div><div className="quiz-list">{quiz.questions.map((question, index) => <fieldset className="question" key={question.id}><legend><span>{String(index + 1).padStart(2, '0')}</span>{question.prompt}</legend><div className="options">{question.options.map((option, optionIndex) => <label className={submitted ? optionIndex === question.correctAnswer ? 'correct' : answers[question.id] === optionIndex ? 'incorrect' : '' : ''} key={option}><input type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => setAnswers({ ...answers, [question.id]: optionIndex })} disabled={submitted} />{option}{submitted && optionIndex === question.correctAnswer && <span className="option-status correct-tag" aria-label="Correct answer"> ✓ Correct</span>}{submitted && answers[question.id] === optionIndex && optionIndex !== question.correctAnswer && <span className="option-status incorrect-tag" aria-label="Your answer"> ✗ Your answer</span>}</label>)}</div>{submitted && <p className="explanation" role="status">{question.explanation}</p>}</fieldset>)}</div>{submitted ? <div className="result-panel" role="status" aria-live="polite"><p className="eyebrow">RESULT</p><strong>{score}%</strong><p className="result-status">{score >= 80 ? 'Passed this learning check' : 'Needs review'}</p><p>{score >= 80 ? (score === 100 ? 'Excellent. Keep connecting the concept to the installed condition.' : 'Good progress. Review the explanations before moving on.') : 'Review the explanations, then revisit the related lesson before trying again.'}</p>{bestScore !== undefined && <p>Best score: {Math.max(bestScore, score)}%. Attempts: {progress.quizAttempts[quiz.id] ?? 0}.</p>}<button className="button button-primary" onClick={() => { setAnswers({}); setSubmitted(false) }}>Retry quiz</button></div> : <button className="button button-primary" onClick={submit} disabled={answeredCount !== quiz.questions.length} aria-describedby="quiz-submit-help">Submit answers <span>→</span></button>}{answeredCount !== quiz.questions.length && <p id="quiz-submit-help" className="form-help">Answer all questions before submitting.</p>}</div>
}

function Scenarios({ go, completed }: { go: (path: string) => void; completed: string[] }) {
  return <div className="container"><PageHeader eyebrow="03 / SCENARIOS" title="Practise the next safe decision." intro="Work through realistic observations and choose a defensible action before seeing the reasoning." /><div className="card-grid">{scenarios.map((scenario) => <article className="card scenario-card" key={scenario.id}><div className="card-top"><LevelBadge level={scenario.level} /><span>{completed.includes(scenario.id) ? 'Completed' : 'Decision exercise'}</span></div><h2>{scenario.title}</h2><p>{scenario.context}</p><button className="text-button" onClick={() => go(`/scenario/${scenario.id}`)}>{completed.includes(scenario.id) ? 'Review scenario' : 'Open scenario'} <span>→</span></button></article>)}</div></div>
}

function ScenarioDetail({ id, go, completed, recordScenario, progress }: { id?: string; go: (path: string) => void; completed: string[]; recordScenario: (id: string, isCorrect: boolean) => void; progress: ReturnType<typeof useProgress>['progress'] }) {
  const scenario = scenarios.find((item) => item.id === id)
  const [choice, setChoice] = useState<number>()
  useEffect(() => { setChoice(undefined) }, [id])
  if (!scenario) return <NotFound go={go} />
  const answered = choice !== undefined
  return <div className="container narrow"><button className="back-button" onClick={() => go('/scenarios')}>← All scenarios</button><PageHeader eyebrow={`${scenario.level} / DECISION EXERCISE`} title={scenario.title} intro="Read the conditions, pause, and choose the action you would defend." /><div className="assessment-instructions" role="note"><strong>Decision guidance</strong><p>When evidence is incomplete or safety-critical, stop, verify the facts, and escalate through the responsible site process.</p><p aria-live="polite">{answered ? 'Decision reviewed' : 'Awaiting your decision'}</p></div><div className="scenario-context"><p className="eyebrow">SITUATION</p><p>{scenario.context}</p></div><div className="options scenario-options">{scenario.decisionOptions.map((option, index) => <button className={answered ? index === scenario.correctChoice ? 'scenario-option correct' : choice === index ? 'scenario-option incorrect' : 'scenario-option' : 'scenario-option'} onClick={() => { setChoice(index); recordScenario(scenario.id, index === scenario.correctChoice) }} key={option} disabled={answered}><span>{String.fromCharCode(65 + index)}</span>{option}{answered && index === scenario.correctChoice && <span className="option-status correct-tag" aria-label="Recommended decision"> ✓ Recommended</span>}{answered && choice === index && index !== scenario.correctChoice && <span className="option-status incorrect-tag" aria-label="Your choice"> ✗ Selected</span>}</button>)}</div>{answered && <div className="explanation-box" role="status" aria-live="polite"><p className="eyebrow">{choice === scenario.correctChoice ? 'GOOD DECISION' : 'REVIEW THE DECISION'}</p><p>{scenario.explanation}</p><p><strong>Consequence:</strong> {scenario.consequence}</p><p><strong>Recommended action:</strong> {scenario.recommendedAction}</p><p>Attempts: {progress.scenarioAttempts[scenario.id] ?? 0}.</p><button className="button button-ghost" onClick={() => setChoice(undefined)}>Retry scenario</button></div>}<p className="completion-note">{completed.includes(scenario.id) ? 'Successfully completed and saved locally.' : 'Your answer attempt is saved locally.'}</p></div>
}

function Progress({ go, progress, clearProgress, loadImportedProgress }: { go: (path: string) => void; progress: ReturnType<typeof useProgress>['progress']; clearProgress: () => void; loadImportedProgress: (json: string) => boolean }) {
  const [resetMessage, setResetMessage] = useState('')
  const curriculum = calculateCurriculumProgress(progress, lessons)
  const total = lessons.length + quizzes.length + scenarios.length
  const done = progress.completedLessons.length + progress.completedQuizzes.length + progress.completedScenarios.length
  const recommendation = getRecommendedPath(progress, lessons.map((lesson) => lesson.id), quizzes.map((quiz) => quiz.id), scenarios.map((scenario) => scenario.id))
  const recTargetId = recommendation.split('/')[2]
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(progress));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "exlearn-progress.json");
    dlAnchorElem.click();
  }
  const handleImport = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';
    fileInput.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = readerEvent => {
        const content = readerEvent.target?.result as string;
        if (loadImportedProgress(content)) {
          setResetMessage('Progress successfully imported.');
        } else {
          setResetMessage('Failed to import progress. Invalid file format.');
        }
      }
      reader.readAsText(file);
    }
    fileInput.click();
  }
  return <div className="container"><PageHeader eyebrow="YOUR DASHBOARD" title="Progress that stays yours." intro="A lightweight local dashboard for this browser. No login, account, or server storage." /><div className="progress-overview"><div><strong>{Math.round((done / total) * 100)}%</strong><span>overall activity complete</span></div><div><strong>{curriculum.completedLessons}</strong><span>lessons complete</span></div><div><strong>{curriculum.inProgressLessons}</strong><span>lessons in progress</span></div><div><strong>{curriculum.notStartedLessons}</strong><span>lessons not started</span></div></div><div className="progress-bar" role="progressbar" aria-valuenow={curriculum.completionPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Curriculum lesson progress"><i style={{ width: `${curriculum.completionPercent}%` }} /></div><div className="level-progress">{(['Beginner', 'Intermediate', 'Advanced'] as Level[]).map((level) => <div key={level}><div className="card-top"><strong>{level}</strong><span>{curriculum.byLevel[level].percent}%</span></div><div className="progress-bar"><i style={{ width: `${curriculum.byLevel[level].percent}%` }} /></div><small>{curriculum.byLevel[level].completed} completed · {curriculum.byLevel[level].inProgress} in progress · {curriculum.byLevel[level].notStarted} not started</small></div>)}</div><section className="module-summary"><p className="eyebrow">MODULE PROGRESS</p>{Object.entries(curriculum.byModule).map(([module, summary]) => <div className="module-summary-row" key={module}><span>Module {module}</span><span>{summary.completed}/{summary.total} complete</span><div className="progress-bar"><i style={{ width: `${summary.percent}%` }} /></div></div>)}</section><section className="performance-grid"><div><p className="eyebrow">QUIZ PERFORMANCE</p><strong>{progress.attemptedQuizzes.length}</strong><span>attempted · {progress.completedQuizzes.length} passed</span></div><div><p className="eyebrow">SCENARIO PERFORMANCE</p><strong>{progress.attemptedScenarios.length}</strong><span>attempted · {progress.completedScenarios.length} completed</span></div></section><section className="next-step"><p className="eyebrow">CONTINUE LEARNING</p><h2>{recommendation.startsWith('/lesson/') ? lessons.find((lesson) => lesson.id === recTargetId)?.title : recommendation.startsWith('/quiz/') ? quizzes.find((quiz) => quiz.id === recTargetId)?.title : recommendation.startsWith('/scenario/') ? scenarios.find((scenario) => scenario.id === recTargetId)?.title : 'Review any module or scenario'}</h2><button className="text-button" onClick={() => go(recommendation)}>Continue learning <span>→</span></button></section>  <AssessmentSummary progress={progress} /><Disclaimer /><div className="progress-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}><button className="button button-ghost" onClick={handleExport}>Export progress (JSON)</button><button className="button button-ghost" onClick={handleImport}>Import progress</button><button className="reset-button" onClick={() => { if (window.confirm('Reset all locally stored learning progress? This cannot be undone.')) { clearProgress(); setResetMessage('All locally stored learning progress has been reset.') } }}>Reset local progress</button></div>{resetMessage && <p className="reset-confirmation" role="status" aria-live="polite">{resetMessage}</p>}</div>
}

function AssessmentSummary({ progress }: { progress: ReturnType<typeof useProgress>['progress'] }) {
  const quizRows = progress.attemptedQuizzes.map((id) => {
    const quiz = quizzes.find((item) => item.id === id)
    return quiz ? { id, title: quiz.title, lessons: quiz.lessonIds.map((lessonId) => lessons.find((lesson) => lesson.id === lessonId)?.title ?? 'Unavailable lesson').join(' · '), score: progress.quizScores[id], attempts: progress.quizAttempts[id] ?? 0, status: progress.completedQuizzes.includes(id) ? 'Passed' : 'Needs review' } : null
  }).filter((row): row is NonNullable<typeof row> => row !== null)
  const scenarioRows = progress.attemptedScenarios.map((id) => {
    const scenario = scenarios.find((item) => item.id === id)
    return scenario ? { id, title: scenario.title, lessons: scenario.lessonIds.map((lessonId) => lessons.find((lesson) => lesson.id === lessonId)?.title ?? 'Unavailable lesson').join(' · '), attempts: progress.scenarioAttempts[id] ?? 0, status: progress.completedScenarios.includes(id) ? 'Completed' : 'Review needed' } : null
  }).filter((row): row is NonNullable<typeof row> => row !== null)
  return <section className="assessment-summary" aria-labelledby="assessment-summary-title"><p className="eyebrow">ASSESSMENT SUMMARY</p><h2 id="assessment-summary-title">Your practice record</h2><p className="summary-note">This record supports personal learning only. It is not certification, approval, compliance evidence, or authorization to perform work.</p>{quizRows.length === 0 && scenarioRows.length === 0 ? <p className="empty-state">No quiz or scenario attempts yet. Start with a lesson, then return here to review your practice record.</p> : <div className="assessment-table-wrap"><table><caption className="sr-only">Quiz and scenario attempts with related lessons</caption><thead><tr><th scope="col">Activity</th><th scope="col">Related lessons</th><th scope="col">Result</th><th scope="col">Attempts</th></tr></thead><tbody>{quizRows.map((row) => <tr key={`quiz-${row.id}`}><th scope="row">{row.title}</th><td>{row.lessons}</td><td>{row.status}{row.score !== undefined ? ` · Best ${row.score}%` : ''}</td><td>{row.attempts}</td></tr>)}{scenarioRows.map((row) => <tr key={`scenario-${row.id}`}><th scope="row">{row.title}</th><td>{row.lessons}</td><td>{row.status}</td><td>{row.attempts}</td></tr>)}</tbody></table></div>}</section>
}

function About({ go }: { go: (path: string) => void }) {
  return <div className="container narrow"><PageHeader eyebrow="ABOUT EXLEARN" title="A practical learning companion." intro="ExLearn makes it easier to revisit core ideas, test your understanding, and practise a calm investigation mindset." /><div className="lesson-content"><section><h2>What this app is</h2><p>ExLearn is an independent, browser-based educational project for personal and internal learning. Its examples and explanations are original learning material designed to support discussion and preparation.</p></section><section><h2>What this app is not</h2><p>It is not official IECEx or IEC training, a certification platform, a compliance tool, or a substitute for current standards, site procedures, manufacturer instructions, or competent professional advice. ExLearn is not an RTP, not an ExCB, and does not issue CoPC.</p></section></div><Disclaimer /><button className="text-button" onClick={() => go('/disclaimer')}>Read the full legal disclaimer <span>→</span></button></div>
}

function DisclaimerPage() {
  return <div className="container narrow"><PageHeader eyebrow="LEGAL / DISCLAIMER" title="Use this learning aid responsibly." intro="Please read this before relying on any information presented in ExLearn." /><div className="legal-copy"><p>ExLearn is provided for general educational and training use only. It is an independent project and is not affiliated with, endorsed by, approved by, or connected to IECEx, the International Electrotechnical Commission (IEC), or any certification authority.</p><p>No certification, qualification, approval, or legal compliance status is granted by using this application. The content does not replace formal training, current applicable standards, manufacturer documentation, local laws or regulations, site-specific risk assessment, or competent professional judgment.</p><p>Technical requirements and good practice can change. Before making a real-world decision, verify information against the current documents and procedures that apply to your equipment, workplace, and jurisdiction. Stop and seek qualified assistance when conditions are uncertain or safety-critical.</p><p>All learning content in this app is original educational material. It is not copied official standard text or an official interpretation of any publication.</p></div><Disclaimer /></div>
}

function NotFound({ go }: { go: (path: string) => void }) { return <div className="container"><PageHeader eyebrow="NOT FOUND" title="That learning item is unavailable." intro="Choose a live section to continue exploring." /><button className="button button-primary" onClick={() => go('/')}>Return home</button></div> }

export default App
