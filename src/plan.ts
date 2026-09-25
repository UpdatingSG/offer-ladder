import { format, isAfter, isBefore, parseISO, startOfDay } from 'date-fns'
import { assignmentFor } from './curriculum'
import type { PhaseId, TaskDef } from './types'

/** Locked decisions from assessment (Sep 2026). */
export const PROFILE = {
  track: 'Backend SWE only',
  currentCtcLpa: 22,
  targetJoinBy: '2027-06-30',
  applyFrom: '2026-11-15',
  diwali: '2026-11-08',
  homeFrom: '2026-10-02',
  weekdayMinutes: '45–60',
  restDaysPerWeek: 2,
  gymDaysPerWeek: 4,
  walkDaysPerWeek: 2,
  content: 'Weekend only 60–90 min (automation runs parallel)',
  courses: '100xDevs paused until applications start',
} as const

/**
 * From D2DLearnings — do NOT restart beginner DSA/HLD/LLD.
 * Source: Desktop/Repos/D2DLearnings (dsa/hld/lld NOTES.md).
 */
export const PRIOR_LEARNING = {
  dsa: {
    done: [
      'NeetCode 150 foundations (arrays → basic DFS)',
      'Pattern Radar, Tie-Breakers, Disqualifier drills',
      'BFS, Backtracking, DP recognition, Heaps/Top-K',
      'Pattern Combos capstone (Lesson 7)',
      'Lesson 8 Sticky Gaps (Union-Find vs Dijkstra)',
      'LC 684 Redundant Connection',
      'Graph+heap basics + LC 743 Network Delay Time',
    ],
    next: 'Spaced cold mediums — Islands, Top-K, DP recognition',
    open: 'https://leetcode.com/problems/number-of-islands/',
    gap: 'Approach selection under pressure + timed cold retrieval — not topic coverage',
  },
  hld: {
    done: ['Lesson 1: 45-Minute HLD Sprint'],
    next: 'Lesson 2 Back-of-Envelope → Building Blocks → Trade-offs → URL/Twitter/YouTube/Uber dry-runs',
    open: 'open hld/lessons/0001-the-45-minute-hld-sprint.html',
    gap: 'Retrieval + sequencing under the 45-min clock (Scaler notes already exist)',
  },
  lld: {
    done: ['Full track 5/5 (Parking Lot, Library, Snake & Ladder)'],
    next: 'Timed whiteboard rotations only — no new lessons',
    open: 'open lld/lessons/0005-snake-and-ladder-capstone.html',
    gap: 'Pacing under pressure, not theory',
  },
} as const

export type Phase = {
  id: PhaseId
  name: string
  start: string
  end: string
  focus: string
}

export const PHASES: Phase[] = [
  {
    id: 'settle',
    name: 'Settle routine',
    start: '2026-09-24',
    end: '2026-10-01',
    focus: 'Install habit: tiny DSA floor + body. No course guilt.',
  },
  {
    id: 'pre_diwali',
    name: 'Home block · Pre-Diwali',
    start: '2026-10-02',
    end: '2026-11-08',
    focus: 'DSA 70% (cold mediums past Network Delay Time) · Design 30% (HLD L2+) · Gym 4 + walks 2.',
  },
  {
    id: 'apply_open',
    name: 'Apply window opens',
    start: '2026-11-09',
    end: '2026-12-31',
    focus: 'First cold apps from mid-Nov. Unlock 100xDevs after apps start. Keep floors.',
  },
  {
    id: 'interview_push',
    name: 'Interview push',
    start: '2027-01-01',
    end: '2027-03-31',
    focus: 'Mocks + real loops. LLD rotations weekly. Design dry-runs weekly.',
  },
  {
    id: 'offer_window',
    name: 'Offer window',
    start: '2027-04-01',
    end: '2027-06-30',
    focus: 'Close offers. Target join by Jun 2027. Maintain body + light DSA.',
  },
]

export function phaseFor(date: Date): Phase {
  const d = format(startOfDay(date), 'yyyy-MM-dd')
  for (const p of PHASES) {
    if (d >= p.start && d <= p.end) return p
  }
  return PHASES[PHASES.length - 1]!
}

/** Mon=1 … Sun=0 style via getDay(): 0 Sun … 6 Sat */
export function weekdayLabel(date: Date): string {
  return format(date, 'EEEE')
}

/**
 * Weekly rhythm (interview-ready, not beginner).
 * When CURRICULUM has a dated assignment, that becomes the study task label/detail.
 * Design days: Wed + Fri. Body: gym Mon/Tue/Thu/Sat, walk Wed/Fri. Sun flexible.
 */
export function tasksFor(date: Date, applicationsSent: number): TaskDef[] {
  const day = date.getDay() // 0 Sun … 6 Sat
  const dateKey = format(startOfDay(date), 'yyyy-MM-dd')
  const study = assignmentFor(dateKey)
  const weekOdd = Math.floor(
    (startOfDay(date).getTime() - parseISO('2026-09-22').getTime()) /
      (7 * 24 * 60 * 60 * 1000),
  ) % 2 === 1
  const phase = phaseFor(date)
  const applyOpen =
    !isBefore(startOfDay(date), parseISO(PROFILE.applyFrom)) ||
    applicationsSent > 0

  const tasks: TaskDef[] = []

  const studyTask = (fallback: TaskDef): TaskDef => {
    if (!study || (study.subject === 'Flex' && study.minutes === 0)) {
      return fallback
    }
    const id: TaskDef['id'] =
      study.subject === 'Content'
        ? 'content_weekend'
        : study.subject === 'HLD' || study.subject === 'LLD'
          ? 'design_minimum'
          : 'dsa_minimum'
    return {
      id,
      label: `${study.subject}: ${study.title}`,
      detail: [
        ...study.steps.map((s, i) => `${i + 1}. ${s}`),
        study.open ? `Open: ${study.open}` : '',
      ]
        .filter(Boolean)
        .join(' '),
      minutes: study.minutes || fallback.minutes,
      required: fallback.required && study.minutes > 0,
    }
  }

  if (day === 0) {
    tasks.push({
      id: 'body',
      label: 'Walk 30–45 min OR rest/tour',
      detail: 'Bike tour = rest day (counts toward weekly rest budget).',
      minutes: 40,
      required: false,
    })
    tasks.push(
      studyTask({
        id: 'dsa_minimum',
        label: 'Optional: 1 spaced review problem',
        detail: 'Skip freely if rest/tour. Never guilt.',
        minutes: 25,
        required: false,
      }),
    )
  } else if (day === 6) {
    tasks.push({
      id: 'body',
      label: 'Gym session',
      detail: 'One of 4 gym days. Miss → swap with a walk day later.',
      minutes: 60,
      required: true,
    })
    tasks.push(
      studyTask({
        id: 'content_weekend',
        label: 'Content review block 60–90 min',
        detail:
          'Twitter/YouTube automation review only — bots can run parallel. Tharun/editing lives here.',
        minutes: 75,
        required: true,
      }),
    )
  } else if (day === 3) {
    tasks.push(
      studyTask({
        id: 'design_minimum',
        label: 'HLD 25–35 min',
        detail:
          phase.id === 'settle'
            ? 'Skim HLD Lesson 1 reference; next week start Lesson 2.'
            : 'Continue HLD from Lesson 2+ OR one 25-min dry-run (URL/Twitter). Skip Scaler basics.',
        minutes: 30,
        required: true,
      }),
    )
    tasks.push({
      id: 'body',
      label: 'Walk 30–45 min',
      detail: 'One of 2 walk days.',
      minutes: 40,
      required: true,
    })
  } else if (day === 5 && weekOdd) {
    tasks.push(
      studyTask({
        id: 'design_minimum',
        label: 'LLD timed rotation 30–40 min',
        detail:
          'Parking Lot / Library / Snake & Ladder — whiteboard pace only. No new theory.',
        minutes: 35,
        required: true,
      }),
    )
    tasks.push({
      id: 'body',
      label: 'Walk 30–45 min',
      detail: 'One of 2 walk days.',
      minutes: 40,
      required: true,
    })
  } else if (day === 5) {
    tasks.push(
      studyTask({
        id: 'design_minimum',
        label: 'HLD trade-off drill 25 min',
        detail: 'One building block or CAP/consistency question out loud.',
        minutes: 25,
        required: true,
      }),
    )
    tasks.push({
      id: 'body',
      label: 'Walk 30–45 min',
      detail: 'One of 2 walk days.',
      minutes: 40,
      required: true,
    })
  } else {
    tasks.push(
      studyTask({
        id: 'dsa_minimum',
        label: 'DSA floor 35–45 min',
        detail:
          phase.id === 'settle' || phase.id === 'pre_diwali'
            ? '1 timed medium cold solve (Pattern Radar first). Sticky Gaps + Network Delay Time are done — do not replay Lesson 8.'
            : '1 timed medium/hard cold solve. Speak pattern + disqualifier before code.',
        minutes: 40,
        required: true,
      }),
    )
    tasks.push({
      id: 'body',
      label: 'Gym session',
      detail: 'Mon/Tue/Thu/Sat gym block (4x/week).',
      minutes: 60,
      required: true,
    })
  }

  // If curriculum assigned Content/DSA on a non-matching day type, still surface study when Flex with minutes
  if (study && study.subject !== 'Flex' && !tasks.some((t) => t.label.includes(study.title))) {
    // already merged via studyTask when subject matches day; for mismatch keep study detail on primary study slot
  }

  if (applyOpen && day !== 0) {
    const applyIsStudy = study?.date === dateKey && study.title.includes('APPLY')
    tasks.push({
      id: 'applications',
      label: applyIsStudy
        ? `Applications: ${study!.title}`
        : 'Applications: send or follow up (10–15 min)',
      detail: applyIsStudy
        ? study!.steps.join(' ')
        : applicationsSent < 20
          ? `Cold apps toward 20. Sent so far: ${applicationsSent}. 100xDevs stays paused until you start applying.`
          : 'Maintain pipeline: 3–5 quality apps/week + follow-ups.',
      minutes: applyIsStudy ? study!.minutes : 15,
      required: phase.id !== 'settle' && phase.id !== 'pre_diwali',
    })
  }

  return tasks
}

export function isApplyPhase(date: Date): boolean {
  return !isBefore(startOfDay(date), parseISO(PROFILE.applyFrom))
}

export function daysUntilApply(date: Date): number {
  const target = parseISO(PROFILE.applyFrom)
  if (!isBefore(startOfDay(date), target)) return 0
  return Math.ceil(
    (target.getTime() - startOfDay(date).getTime()) / (24 * 60 * 60 * 1000),
  )
}

export function isPastJoinTarget(date: Date): boolean {
  return isAfter(startOfDay(date), parseISO(PROFILE.targetJoinBy))
}
