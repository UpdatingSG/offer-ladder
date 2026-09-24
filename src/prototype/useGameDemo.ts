import { useReducer } from 'react'
import { assignmentFor } from '../curriculum'
import {
  initialGame,
  reduceGame,
  type GameAction,
  type GameState,
} from './gameReducer'

/** In-memory only — PROTOTYPE. */
export function useGameDemo(date = '2026-09-25') {
  const [state, dispatch] = useReducer(
    reduceGame,
    date,
    (d) => initialGame(d),
  )
  const study = assignmentFor(state.date)
  return { state, dispatch, study }
}

export type DemoProps = {
  state: GameState
  dispatch: (a: GameAction) => void
  studyTitle: string
  studySteps: string[]
}
