/**
 * Spine session — used by live app at `/` (prototype B, shipped).
 * Persists study progress in localStorage.
 */
import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { assignmentFor, CURRICULUM } from '../curriculum'
import { INTERVIEW_MILESTONES, milestonesAround } from '../milestones'
import { daysUntilApply, PROFILE } from '../plan'
import { isStudyDay, nextCatchUp } from '../progress'
import { loadState, saveState } from '../storage'

const PANEL_KEY = 'offer-ladder-panel'

export function useSpineSession() {
  const [today] = useState(() => format(new Date(), 'yyyy-MM-dd'))
  const [appState, setAppState] = useState(() => loadState())
  const [selected, setSelected] = useState(today)
  const [panel, setPanel] = useState<'focus' | 'calendars'>(() => {
    const p = localStorage.getItem(PANEL_KEY)
    return p === 'calendars' ? 'calendars' : 'focus'
  })

  useEffect(() => {
    saveState(appState)
  }, [appState])

  useEffect(() => {
    localStorage.setItem(PANEL_KEY, panel)
  }, [panel])

  const studyDone = appState.studyDone
  const dismissed = appState.studyDismissed
  const study = assignmentFor(selected)
  const catchUp = useMemo(
    () => nextCatchUp(today, studyDone, dismissed),
    [today, studyDone, dismissed],
  )
  const untilApply = daysUntilApply(new Date())
  const activeMiles = milestonesAround(today)
  const studyRows = CURRICULUM.filter(isStudyDay)

  function completeStudy(dateKey: string) {
    setAppState((s) => ({
      ...s,
      studyDone: { ...s.studyDone, [dateKey]: true },
    }))
  }

  function dismiss(dateKey: string) {
    setAppState((s) => ({
      ...s,
      studyDismissed: { ...s.studyDismissed, [dateKey]: true },
    }))
  }

  return {
    today,
    selected,
    setSelected,
    study,
    studyDone,
    catchUp,
    untilApply,
    activeMiles,
    studyRows,
    milestones: INTERVIEW_MILESTONES,
    panel,
    setPanel,
    completeStudy,
    dismiss,
    profile: PROFILE,
  }
}

/** @deprecated alias — same as useSpineSession */
export const usePrototypeSession = useSpineSession

export type ProtoSession = ReturnType<typeof useSpineSession>
export type SpineSession = ProtoSession
