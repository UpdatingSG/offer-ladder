/**
 * PROTOTYPE UI — Variant C: Week Raid
 * Week strip is primary; today is a boss encounter with HP bars per quest.
 */
import type { CSSProperties } from 'react'
import { addDays, format, parseISO } from 'date-fns'
import { XP_PER_LEVEL, type GameAction, type GameState } from './gameReducer'

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function VariantBossWeek({
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
  const d = parseISO(state.date + 'T12:00:00')
  const day = d.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = addDays(d, mondayOffset)
  const studyHp = state.studyDone || state.mode !== 'work' ? 0 : 100
  const bodyHp = state.bodyDone || state.mode !== 'work' ? 0 : 100

  return (
    <div style={page}>
      <div style={eyebrow}>PROTOTYPE C · Week Raid</div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <h1 style={{ margin: '4px 0', fontSize: 26 }}>Raid week</h1>
        <div style={{ fontSize: 13, opacity: 0.8 }}>
          Lv {state.level} · {state.xp}/{XP_PER_LEVEL} XP · streak {state.streak} · tokens{' '}
          {state.restTokens}
        </div>
      </div>

      <div style={weekRow}>
        {WEEK_LABELS.map((label, i) => {
          const cell = addDays(monday, i)
          const key = format(cell, 'yyyy-MM-dd')
          const isToday = key === state.date
          return (
            <div
              key={label}
              style={{
                ...weekCell,
                outline: isToday ? '2px solid #e85d4c' : '1px solid #333',
                background: isToday ? '#2a1210' : '#141414',
              }}
            >
              <div style={{ fontSize: 11, opacity: 0.6 }}>{label}</div>
              <div style={{ fontWeight: 700 }}>{format(cell, 'd')}</div>
              {isToday && <div style={{ fontSize: 10, color: '#e85d4c' }}>BOSS</div>}
            </div>
          )
        })}
      </div>

      <section style={boss}>
        <div style={{ fontSize: 12, color: '#e85d4c', letterSpacing: '0.1em' }}>
          TODAY&apos;S BOSS
        </div>
        <h2 style={{ margin: '6px 0 8px', fontSize: 22 }}>{studyTitle}</h2>
        <ol style={{ margin: '0 0 16px', paddingLeft: 18, fontSize: 14 }}>
          {studySteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>

        <HpBar label="Study HP" hp={studyHp} />
        <HpBar label="Body HP" hp={bodyHp} />

        <p style={{ fontSize: 13, opacity: 0.75 }}>{state.lastEvent}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          <Fight
            label="Strike study"
            onClick={() => dispatch({ type: 'COMPLETE_STUDY' })}
            disabled={studyHp === 0}
          />
          <Fight
            label="Strike body"
            onClick={() => dispatch({ type: 'COMPLETE_BODY' })}
            disabled={bodyHp === 0}
          />
          <Fight label="Flee (rest token)" onClick={() => dispatch({ type: 'MARK_REST' })} />
          <Fight
            label="Skip fight (long office)"
            onClick={() => dispatch({ type: 'MARK_LONG_WORK' })}
          />
          <Fight label="Raid loot: send app" onClick={() => dispatch({ type: 'SEND_APP' })} />
          <Fight label="Next day" onClick={() => dispatch({ type: 'ADVANCE_DAY' })} />
        </div>
      </section>
    </div>
  )
}

function HpBar({ label, hp }: { label: string; hp: number }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 12,
          marginBottom: 4,
        }}
      >
        <span>{label}</span>
        <span>{hp === 0 ? 'DEFEATED' : `${hp}%`}</span>
      </div>
      <div style={{ height: 14, background: '#2a2a2a', borderRadius: 4, overflow: 'hidden' }}>
        <div
          style={{
            width: `${hp}%`,
            height: '100%',
            background: hp === 0 ? '#3d6b4f' : '#e85d4c',
            transition: 'width 0.2s',
          }}
        />
      </div>
    </div>
  )
}

function Fight({
  label,
  onClick,
  disabled,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: '10px 12px',
        borderRadius: 6,
        border: '1px solid #5a3030',
        background: disabled ? '#1a1a1a' : '#2a1515',
        color: '#f2e8e6',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 13,
      }}
    >
      {label}
    </button>
  )
}

const page: CSSProperties = {
  minHeight: '100vh',
  background: '#1a0505',
  color: '#f2e8e6',
  padding: '24px 16px 100px',
  fontFamily: '"Segoe UI", system-ui, sans-serif',
  maxWidth: 820,
  margin: '0 auto',
  borderTop: '6px solid #e85d4c',
}

const eyebrow: CSSProperties = {
  fontSize: 11,
  letterSpacing: '0.12em',
  color: '#e85d4c',
}

const weekRow: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 6,
  margin: '16px 0',
}

const weekCell: CSSProperties = {
  borderRadius: 8,
  padding: '8px 4px',
  textAlign: 'center',
  fontSize: 13,
}

const boss: CSSProperties = {
  border: '1px solid #4a2020',
  borderRadius: 14,
  padding: 16,
  background: '#140e0e',
}
