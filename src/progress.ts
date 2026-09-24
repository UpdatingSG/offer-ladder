import { CURRICULUM, type StudyAssignment } from './curriculum'

/**
 * How study progression works (fixed policy):
 *
 * 1. Calendar does NOT slide. Nov 15 is still apply day even if you skipped Oct.
 * 2. Completing day N does not rewrite day N+1 — tomorrow already has its own topic.
 * 3. Skipping a study day puts that assignment in BACKLOG (catch-up), max shown = 1.
 * 4. Flex / rest / 0-minute days never enter backlog.
 * 5. You can dismiss a backlog item (skip forever) without guilt.
 */

export function isStudyDay(a: StudyAssignment): boolean {
  return a.minutes > 0 && a.subject !== 'Flex'
}

export function backlogFor(
  todayKey: string,
  studyDone: Record<string, boolean>,
  dismissed: Record<string, boolean>,
): StudyAssignment[] {
  return CURRICULUM.filter((a) => {
    if (a.date >= todayKey) return false
    if (!isStudyDay(a)) return false
    if (studyDone[a.date]) return false
    if (dismissed[a.date]) return false
    return true
  })
}

/** One catch-up item max — oldest skipped study day. */
export function nextCatchUp(
  todayKey: string,
  studyDone: Record<string, boolean>,
  dismissed: Record<string, boolean>,
): StudyAssignment | undefined {
  return backlogFor(todayKey, studyDone, dismissed)[0]
}

export function markStudyDone(
  studyDone: Record<string, boolean>,
  dateKey: string,
): Record<string, boolean> {
  return { ...studyDone, [dateKey]: true }
}

export function dismissCatchUp(
  dismissed: Record<string, boolean>,
  dateKey: string,
): Record<string, boolean> {
  return { ...dismissed, [dateKey]: true }
}
