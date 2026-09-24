/**
 * PROTOTYPE UI — Variant A: Ladder Climb
 * Vertical rungs; today sits on the current rung; XP fills toward the next.
 */
import type { CSSProperties } from 'react'
import { XP_PER_LEVEL, RUNGS, type GameAction, type GameState } from './gameReducer'

export function VariantLadder({
  state,
  dispatch,
  studyTitle,
  studySteps,
}: {
  state: GameState
  dispatch: (a: GameAction) => void
  studyTitle: string
  studySteps: string[]
}) {
  const pct = Math.min(100, (state.xp / XP_PER_LEVEL) * 100)

  return (
    <div style={page}>
      <header style={{ marginBottom: 20 }}>
        <div style={eyebrow}>PROTOTYPE A · Ladder Climb</div>
        <h1 style={{ margin: '4px 0 0', fontSize: 28 }}>Offer Ladder</h1>
        <p style={{ margin: '6px 0 0', opacity: 0.75 }}>
          {state.date} · Lv {state.level} · Streak {state.streak} · Rest tokens{' '}
          {state.restTokens}
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 20 }}>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {[...RUNGS].reverse().map((name, revIdx) => {
            const idx = RUNGS.length - 1 - revIdx
            const active = idx === state.rung
            const done = idx < state.rung
            return (
              <li
                key={name}
                style={{
                  borderLeft: active ? '3px solid #c4a35a' : '3px solid #333',
                  padding: '10px 12px',
                  marginBottom: 6,
                  background: active ? '#2a2418' : done ? '#1a1a1a' : '#121212',
                  color: active ? '#f0e6d2' : done ? '#8a8a8a' : '#555',
                  fontWeight: active ? 700 : 400,
                  fontSize: 13,
                }}
              >
                {done ? '●' : active ? '◆' : '○'} {name}
              </li>
            )
          })}
        </ol>

        <div>
          <div style={xpTrack}>
            <div style={{ ...xpFill, width: `${pct}%` }} />
          </div>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 16 }}>
            {state.xp}/{XP_PER_LEVEL} XP · {state.lastEvent}
          </div>

          <section style={mission}>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', opacity: 0.6 }}>
              TODAY&apos;S RUNG QUEST
            </div>
            <h2 style={{ margin: '6px 0 10px', fontSize: 20 }}>{studyTitle}</h2>
            <ol style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.5 }}>
              {studySteps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </section>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            <Btn
              done={state.studyDone}
              onClick={() => dispatch({ type: 'COMPLETE_STUDY' })}
              label="Clear study (+40 XP)"
            />
            <Btn
              done={state.bodyDone}
              onClick={() => dispatch({ type: 'COMPLETE_BODY' })}
              label="Clear body (+20 XP)"
            />
            <Btn onClick={() => dispatch({ type: 'MARK_REST' })} label="Spend rest token" />
            <Btn
              onClick={() => dispatch({ type: 'MARK_LONG_WORK' })}
              label="10–12h office"
            />
            <Btn onClick={() => dispatch({ type: 'SEND_APP' })} label="Send app (+50)" />
            <Btn onClick={() => dispatch({ type: 'ADVANCE_DAY' })} label="Next day →" />
            <Btn onClick={() => dispatch({ type: 'RESET' })} label="Reset" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Btn({
  label,
  onClick,
  done,
}: {
  label: string
  onClick: () => void
  done?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={done}
      style={{
        padding: '10px 14px',
        borderRadius: 8,
        border: '1px solid #444',
        background: done ? '#1f3d2b' : '#222',
        color: done ? '#b8e0c8' : '#eee',
        cursor: done ? 'default' : 'pointer',
        fontSize: 13,
      }}
    >
      {done ? '✓ ' : ''}
      {label}
    </button>
  )
}

const page: CSSProperties = {
  minHeight: '100vh',
  background: '#0d0d0d',
  color: '#e8e4dc',
  padding: '24px 20px 100px',
  fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
  maxWidth: 900,
  margin: '0 auto',
  borderTop: '6px solid #c4a35a',
}

const eyebrow: CSSProperties = {
  fontSize: 11,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#c4a35a',
}

const xpTrack: CSSProperties = {
  height: 10,
  background: '#222',
  borderRadius: 999,
  overflow: 'hidden',
  marginBottom: 6,
}

const xpFill: CSSProperties = {
  height: '100%',
  background: '#c4a35a',
}

const mission: CSSProperties = {
  border: '1px solid #3a3428',
  borderRadius: 12,
  padding: 16,
  background: '#16140f',
}
