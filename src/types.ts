export type DayKind = 'work' | 'rest' | 'long_work'

export type TaskId =
  | 'dsa_minimum'
  | 'design_minimum'
  | 'body'
  | 'content_weekend'
  | 'applications'

export type TaskDef = {
  id: TaskId
  label: string
  detail: string
  minutes: number
  required: boolean
}

export type DayLog = {
  date: string // yyyy-MM-dd
  kind: DayKind
  completed: Partial<Record<TaskId, boolean>>
  note: string
  longWorkHours?: number
}

export type AppState = {
  logs: Record<string, DayLog>
  applicationsSent: number
  hundredXUnlocked: boolean
  startedAt: string
  /** Curriculum date → study assignment completed */
  studyDone: Record<string, boolean>
  /** Skipped forever — won't show in catch-up */
  studyDismissed: Record<string, boolean>
}

export type PhaseId =
  | 'settle'
  | 'pre_diwali'
  | 'apply_open'
  | 'interview_push'
  | 'offer_window'
