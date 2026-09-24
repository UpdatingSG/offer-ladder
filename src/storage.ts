import { format, parseISO, subDays } from 'date-fns'
import type { AppState, DayKind, DayLog, TaskId } from './types'

const KEY = 'offer-ladder-v1'

function emptyState(): AppState {
  return {
    logs: {},
    applicationsSent: 0,
    hundredXUnlocked: false,
    startedAt: new Date().toISOString(),
    studyDone: {},
    studyDismissed: {},
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw) as AppState
    return {
      ...emptyState(),
      ...parsed,
      logs: parsed.logs ?? {},
      studyDone: parsed.studyDone ?? {},
      studyDismissed: parsed.studyDismissed ?? {},
    }
  } catch {
    return emptyState()
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function ensureLog(
  state: AppState,
  date: string,
  kind: DayKind = 'work',
): DayLog {
  const existing = state.logs[date]
  if (existing) return existing
  return { date, kind, completed: {}, note: '' }
}

export function weekRestCount(state: AppState, dateStr: string): number {
  const d = parseISO(dateStr + 'T12:00:00')
  const day = d.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + mondayOffset)

  let count = 0
  for (let i = 0; i < 7; i++) {
    const cur = new Date(monday)
    cur.setDate(monday.getDate() + i)
    const key = format(cur, 'yyyy-MM-dd')
    if (state.logs[key]?.kind === 'rest') count += 1
  }
  return count
}

/** Streak = consecutive days that are rest, long_work, or have any completion marked. */
export function computeStreak(state: AppState, today: string): number {
  let streak = 0
  let cursor = parseISO(today + 'T12:00:00')

  for (let i = 0; i < 400; i++) {
    const key = format(cursor, 'yyyy-MM-dd')
    const log = state.logs[key]

    if (!log) {
      if (key === today) {
        cursor = subDays(cursor, 1)
        continue
      }
      break
    }

    if (log.kind === 'rest' || log.kind === 'long_work') {
      streak += 1
    } else if (Object.values(log.completed).some(Boolean)) {
      streak += 1
    } else if (key === today) {
      // incomplete today doesn't break
    } else {
      break
    }
    cursor = subDays(cursor, 1)
  }
  return streak
}

export function setDayKind(
  state: AppState,
  date: string,
  kind: DayKind,
): AppState {
  const log = ensureLog(state, date, kind)
  return {
    ...state,
    logs: { ...state.logs, [date]: { ...log, kind } },
  }
}

export function setNote(state: AppState, date: string, note: string): AppState {
  const log = ensureLog(state, date)
  return {
    ...state,
    logs: { ...state.logs, [date]: { ...log, note } },
  }
}

export function setApplications(state: AppState, n: number): AppState {
  const applicationsSent = Math.max(0, n)
  return {
    ...state,
    applicationsSent,
    hundredXUnlocked: applicationsSent > 0 || state.hundredXUnlocked,
  }
}

export function requiredComplete(
  log: DayLog | undefined,
  requiredIds: TaskId[],
): boolean {
  if (!log) return false
  if (log.kind === 'rest' || log.kind === 'long_work') return true
  if (requiredIds.length === 0) return true
  return requiredIds.every((id) => log.completed[id] === true)
}

export function setStudyDone(state: AppState, dateKey: string, done: boolean): AppState {
  return {
    ...state,
    studyDone: { ...state.studyDone, [dateKey]: done },
  }
}

export function dismissStudy(state: AppState, dateKey: string): AppState {
  return {
    ...state,
    studyDismissed: { ...state.studyDismissed, [dateKey]: true },
  }
}
