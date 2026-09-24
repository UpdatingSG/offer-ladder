/**
 * PROTOTYPE UI — Variant B: Quest Log
 * Left: character sheet. Right: main quest + side quests as cards.
 */
import type { CSSProperties } from 'react'
import { XP_PER_LEVEL, type GameAction, type GameState } from './gameReducer'

export function VariantQuestLog({
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
  return (
    <div style={page}>
      <div style={eyebrow}>PROTOTYPE B · Quest Log</div>
      <h1 style={{ margin: '4px 0 16px', fontSize: 26 }}>Daily quests</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(200px, 240px) 1fr',
          gap: 16,
        }}
      >
        <aside style={sheet}>
          <div style={{ fontSize: 12, opacity: 0.6 }}>ADVENTURER</div>
          <div style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 12px' }}>
            Backend SWE
          </div>
          <Stat label="Level" value={String(state.level)} />
          <Stat label="XP" value={`${state.xp}/${XP_PER_LEVEL}`} />
          <Stat label="Streak flame" value={`${state.streak} days`} />
          <Stat label="Rest tokens" value={'◆'.repeat(state.restTokens) || '—'} />
          <Stat label="Apps sent" value={String(state.appsSent)} />
          <div
            style={{
              marginTop: 14,
              padding: 10,
              background: '#0f1410',
              borderRadius: 8,
              fontSize: 12,
              lineHeight: 1.4,
            }}
          >
            {state.lastEvent}
          </div>
          <button type="button" style={ghost} onClick={() => dispatch({ type: 'ADVANCE_DAY' })}>
            Sleep → next day
          </button>
          <button type="button" style={ghost} onClick={() => dispatch({ type: 'RESET' })}>
            Reset run
          </button>
        </aside>

        <main style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <QuestCard
            kind="MAIN"
            title={studyTitle}
            steps={studySteps}
            done={state.studyDone || state.mode !== 'work'}
            reward="+40 XP"
            onClear={() => dispatch({ type: 'COMPLETE_STUDY' })}
          />
          <QuestCard
            kind="SIDE"
            title="Body — gym or walk"
            steps={['Hit the scheduled body floor for today']}
            done={state.bodyDone || state.mode !== 'work'}
            reward="+20 XP"
            onClear={() => dispatch({ type: 'COMPLETE_BODY' })}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button type="button" style={chip} onClick={() => dispatch({ type: 'MARK_REST' })}>
              Use rest token (tour OK)
            </button>
            <button
              type="button"
              style={chip}
              onClick={() => dispatch({ type: 'MARK_LONG_WORK' })}
            >
              Claim long-office waiver
            </button>
            <button type="button" style={chip} onClick={() => dispatch({ type: 'SEND_APP' })}>
              Loot: send application (+50)
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 13,
        padding: '6px 0',
        borderBottom: '1px solid #243028',
      }}
    >
      <span style={{ opacity: 0.65 }}>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function QuestCard({
  kind,
  title,
  steps,
  done,
  reward,
  onClear,
}: {
  kind: string
  title: string
  steps: string[]
  done: boolean
  reward: string
  onClear: () => void
}) {
  return (
    <article style={questCardStyle(done)}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          letterSpacing: '0.08em',
          marginBottom: 6,
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 700,
        }}
      >
        <span style={{ color: kind === 'MAIN' ? '#2f6b4f' : '#5a6b5e' }}>{kind} QUEST</span>
        <span>{reward}</span>
      </div>
      <h2 style={{ margin: '0 0 8px', fontSize: 17 }}>{title}</h2>
      <ul style={{ margin: '0 0 12px', paddingLeft: 18, fontSize: 13, lineHeight: 1.45 }}>
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <button type="button" style={chip} disabled={done} onClick={onClear}>
        {done ? 'Cleared' : 'Complete quest'}
      </button>
    </article>
  )
}

function questCardStyle(done: boolean): CSSProperties {
  return {
    border: done ? '2px solid #2f6b4f' : '2px solid #1c241c',
    background: done ? '#e7f0e9' : '#fffdf6',
    borderRadius: 4,
    padding: 14,
    opacity: 1,
  }
}

const page: CSSProperties = {
  minHeight: '100vh',
  background: '#f3efe4',
  color: '#1c241c',
  padding: '24px 20px 100px',
  fontFamily: 'Georgia, "Times New Roman", serif',
  maxWidth: 960,
  margin: '0 auto',
  borderTop: '6px solid #2f6b4f',
}

const eyebrow: CSSProperties = {
  fontFamily: 'system-ui, sans-serif',
  fontSize: 11,
  letterSpacing: '0.12em',
  color: '#2f6b4f',
  fontWeight: 700,
}

const sheet: CSSProperties = {
  background: '#fffdf6',
  border: '2px solid #1c241c',
  borderRadius: 4,
  padding: 14,
  height: 'fit-content',
  fontFamily: 'system-ui, sans-serif',
}

const chip: CSSProperties = {
  fontFamily: 'system-ui, sans-serif',
  padding: '8px 12px',
  borderRadius: 4,
  border: '2px solid #1c241c',
  background: '#e7f0e9',
  color: '#1c241c',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
}

const ghost: CSSProperties = {
  ...chip,
  width: '100%',
  marginTop: 8,
  background: 'transparent',
}
