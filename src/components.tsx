import type { ReactNode } from 'react'
import type { Level, LessonStatus } from './types'

export function Badge({ children, tone = 'amber' }: { children: ReactNode; tone?: 'amber' | 'teal' | 'muted' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return <aside className={`disclaimer ${compact ? 'disclaimer-compact' : ''}`}><strong>Educational use only.</strong> ExLearn is an independent learning aid. It is not official IECEx or IEC training, is not an RTP or ExCB, does not issue CoPC, and is not certification, approval, legal advice, or a substitute for current standards, manufacturer instructions, local regulations, or competent professional judgment.</aside>
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <header className="page-header"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></header>
}

export function LevelBadge({ level }: { level: Level }) {
  return <Badge tone={level === 'Advanced' ? 'teal' : level === 'Intermediate' ? 'amber' : 'muted'}>{level}</Badge>
}

export function StatusBadge({ status }: { status: LessonStatus }) {
  const labels = { 'not-started': 'Not started', 'in-progress': 'In progress', completed: 'Completed' }
  return <Badge tone={status === 'completed' ? 'teal' : status === 'in-progress' ? 'amber' : 'muted'}>{labels[status]}</Badge>
}
