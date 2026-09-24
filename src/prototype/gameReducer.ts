/**
 * PROTOTYPE — Offer Ladder gamification reducer.
 * Question: Can XP + streak + rest tokens reward minimums without punishing rest/long-work days?
 * Throwaway until a variant wins; then lift into real storage.
 */

export type DayMode = 'work' | 'rest' | 'long_work'

export type GameState = {
  date: string
  mode: DayMode
  /** Study / body / content checkboxes for today */
  studyDone: boolean
  bodyDone: boolean
  xp: number
  level: number
  streak: number
  /** Rest tokens left this week (start 2) */
  restTokens: number
  appsSent: number
  lastEvent: string
  /** Company rung index 0..n for ladder metaphor */
  rung: number
}

export type GameAction =
  | { type: 'COMPLETE_STUDY' }
  | { type: 'COMPLETE_BODY' }
  | { type: 'MARK_REST' }
  | { type: 'MARK_LONG_WORK' }
  | { type: 'MARK_WORK' }
  | { type: 'SEND_APP' }
  | { type: 'ADVANCE_DAY' }
  | { type: 'RESET' }

export const RUNGS = [
  'Settle',
  'Pattern fluent',
  'Design verbal',
  'Apply ready',
  'Interviewing',
  'Offer ladder',
] as const

export const XP_PER_LEVEL = 100

export function initialGame(date = '2026-09-25'): GameState {
  return {
    date,
    mode: 'work',
    studyDone: false,
    bodyDone: false,
    xp: 20,
    level: 1,
    streak: 0,
    restTokens: 2,
    appsSent: 0,
    lastEvent: 'Fresh day. Hit study + body for full clear.',
    rung: 0,
  }
}

function addXp(state: GameState, amount: number, why: string): GameState {
  let xp = state.xp + amount
  let level = state.level
  let rung = state.rung
  while (xp >= XP_PER_LEVEL) {
    xp -= XP_PER_LEVEL
    level += 1
    rung = Math.min(RUNGS.length - 1, rung + (level % 2 === 0 ? 1 : 0))
  }
  return {
    ...state,
    xp,
    level,
    rung,
    lastEvent: `${why} (+${amount} XP)`,
  }
}

function dayCleared(state: GameState): boolean {
  if (state.mode === 'rest' || state.mode === 'long_work') return true
  return state.studyDone && state.bodyDone
}

export function reduceGame(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'RESET':
      return initialGame(state.date)
    case 'MARK_WORK':
      return {
        ...state,
        mode: 'work',
        lastEvent: 'Work day — minimums active.',
      }
    case 'MARK_REST': {
      if (state.mode === 'rest') return state
      if (state.restTokens <= 0) {
        return {
          ...state,
          lastEvent: 'No rest tokens left this week. Long-work still OK.',
        }
      }
      return addXp(
        {
          ...state,
          mode: 'rest',
          restTokens: state.restTokens - 1,
          studyDone: true,
          bodyDone: true,
          streak: state.streak + 1,
        },
        5,
        'Rest day logged (streak safe, tiny XP)',
      )
    }
    case 'MARK_LONG_WORK':
      return addXp(
        {
          ...state,
          mode: 'long_work',
          studyDone: true,
          bodyDone: true,
          streak: state.streak + 1,
        },
        8,
        'Long office day — floor waived, streak safe',
      )
    case 'COMPLETE_STUDY': {
      if (state.mode !== 'work' || state.studyDone) return state
      const next = { ...state, studyDone: true }
      let s = addXp(next, 40, 'Study quest cleared')
      if (s.studyDone && s.bodyDone) {
        s = addXp({ ...s, streak: s.streak + 1 }, 25, 'Full clear bonus · streak +1')
      }
      return s
    }
    case 'COMPLETE_BODY': {
      if (state.mode !== 'work' || state.bodyDone) return state
      const next = { ...state, bodyDone: true }
      let s = addXp(next, 20, 'Body quest cleared')
      if (s.studyDone && s.bodyDone) {
        s = addXp({ ...s, streak: s.streak + 1 }, 25, 'Full clear bonus · streak +1')
      }
      return s
    }
    case 'SEND_APP':
      return addXp(
        { ...state, appsSent: state.appsSent + 1, rung: Math.max(state.rung, 3) },
        50,
        `Application #${state.appsSent + 1} sent`,
      )
    case 'ADVANCE_DAY': {
      const cleared = dayCleared(state)
      const d = new Date(state.date + 'T12:00:00')
      d.setDate(d.getDate() + 1)
      const nextDate = d.toISOString().slice(0, 10)
      const monday = d.getDay() === 1
      return {
        ...initialGame(nextDate),
        xp: state.xp,
        level: state.level,
        rung: state.rung,
        appsSent: state.appsSent,
        streak: cleared ? state.streak : 0,
        restTokens: monday ? 2 : state.restTokens,
        lastEvent: cleared
          ? `Advanced to ${nextDate}. Streak held at ${state.streak}.`
          : `Advanced to ${nextDate}. Streak broke (incomplete yesterday).`,
      }
    }
    default: {
      const _exhaustive: never = action
      return _exhaustive
    }
  }
}
