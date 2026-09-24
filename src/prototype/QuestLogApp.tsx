/**
 * LIVE UI — Quest Log (original prototype B)
 * Character sheet + main/side quests + study/interview calendars.
 */
import { useEffect, useMemo, useReducer, useState, type CSSProperties } from 'react'
import { format } from 'date-fns'
import { assignmentFor, CURRICULUM } from '../curriculum'
import { INTERVIEW_MILESTONES } from '../milestones'
import { daysUntilApply, PROFILE } from '../plan'
import { isStudyDay, nextCatchUp } from '../progress'
import {
  XP_PER_LEVEL,
  initialGame,
  reduceGame,
  type GameState,
} from './gameReducer'

const GAME_KEY = 'offer-ladder-questlog-game'
const PROGRESS_KEY = 'offer-ladder-v1'

type ProgressBits = {
  studyDone: Record<string, boolean>
  studyDismissed: Record<string, boolean>
}

function loadGame(): GameState {
  try {
    const raw = localStorage.getItem(GAME_KEY)
    if (!raw) return initialGame(format(new Date(), 'yyyy-MM-dd'))
    return { ...initialGame(), ...JSON.parse(raw), date: format(new Date(), 'yyyy-MM-dd') }
  } catch {
    return initialGame(format(new Date(), 'yyyy-MM-dd'))
  }
}

function loadProgress(): ProgressBits {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return { studyDone: {}, studyDismissed: {} }
    const p = JSON.parse(raw) as ProgressBits
    return {
      studyDone: p.studyDone ?? {},
      studyDismissed: p.studyDismissed ?? {},
    }
  } catch {
    return { studyDone: {}, studyDismissed: {} }
  }
}

function saveProgress(bits: ProgressBits) {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    const base = raw ? JSON.parse(raw) : {}
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ ...base, studyDone: bits.studyDone, studyDismissed: bits.studyDismissed }),
    )
  } catch {
    /* ignore */
  }
}

export function QuestLogApp() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const [state, dispatch] = useReducer(reduceGame, undefined, loadGame)
  const [progress, setProgress] = useState(loadProgress)
  const [selected, setSelected] = useState(today)
  const [panel, setPanel] = useState<'quests' | 'calendars'>('quests')

  useEffect(() => {
    localStorage.setItem(GAME_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  useEffect(() => {
    const id = 'questlog-fonts'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=DM+Sans:wght@400;600;700&display=swap'
    document.head.appendChild(link)
  }, [])

  const study = assignmentFor(selected)
  const studyRows = useMemo(() => CURRICULUM.filter(isStudyDay), [])
  const catchUp = useMemo(
    () => nextCatchUp(today, progress.studyDone, progress.studyDismissed),
    [today, progress],
  )
  const untilApply = daysUntilApply(new Date())

  function completeStudyQuest() {
    dispatch({ type: 'COMPLETE_STUDY' })
    if (study && isStudyDay(study)) {
      setProgress((p) => ({
        ...p,
        studyDone: { ...p.studyDone, [study.date]: true },
      }))
    }
  }

  function markCatchUpDone(dateKey: string) {
    setProgress((p) => ({
      ...p,
      studyDone: { ...p.studyDone, [dateKey]: true },
    }))
  }

  function dismissCatchUp(dateKey: string) {
    setProgress((p) => ({
      ...p,
      studyDismissed: { ...p.studyDismissed, [dateKey]: true },
    }))
  }

  return (
    <div style={page}>
      <header style={header}>
        <div>
          <div style={brand}>OFFER LADDER</div>
          <h1 style={h1}>Quest log</h1>
          <p style={sub}>
            Main quest = today’s study. Side quest = body. Interview calendar sits
            beside the grind so mid-Nov apps stay real.
          </p>
        </div>
        <div style={countdown}>
          <div style={countNum}>{untilApply > 0 ? untilApply : 'GO'}</div>
          <div style={countLabel}>
            {untilApply > 0 ? 'days to first applications' : 'apply window open'}
          </div>
        </div>
      </header>

      <div style={seg}>
        <button
          type="button"
          style={segBtn(panel === 'quests')}
          onClick={() => setPanel('quests')}
        >
          Today’s quests
        </button>
        <button
          type="button"
          style={segBtn(panel === 'calendars')}
          onClick={() => setPanel('calendars')}
        >
          Study + interview calendar
        </button>
      </div>

      {panel === 'calendars' ? (
        <div style={calGrid}>
          <section style={calCard}>
            <h2 style={calH}>Study calendar</h2>
            <div style={calList}>
              {studyRows.map((a) => (
                <button
                  key={a.date}
                  type="button"
                  style={calRow(selected === a.date, Boolean(progress.studyDone[a.date]))}
                  onClick={() => {
                    setSelected(a.date)
                    setPanel('quests')
                  }}
                >
                  <span>{a.date.slice(5)}</span>
                  <span style={{ opacity: 0.55 }}>{a.subject}</span>
                  <span>
                    {progress.studyDone[a.date] ? '✓ ' : ''}
                    {a.title}
                  </span>
                </button>
              ))}
            </div>
          </section>
          <section style={calCard}>
            <h2 style={calH}>Interview calendar</h2>
            <div style={calList}>
              {INTERVIEW_MILESTONES.map((m) => (
                <div key={m.id} style={mile}>
                  <div style={kind(m.kind)}>{m.kind}</div>
                  <div>
                    <strong>{m.title}</strong>
                    <div style={{ fontSize: 12, opacity: 0.55, marginTop: 2 }}>
                      {m.date}
                      {m.endDate ? ` → ${m.endDate}` : ''}
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: 13, lineHeight: 1.45 }}>
                      {m.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div style={grid}>
          <aside style={sheet}>
            <div style={{ fontSize: 12, opacity: 0.55, letterSpacing: '0.08em' }}>
              ADVENTURER
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, margin: '4px 0 14px', fontFamily: 'Fraunces, serif' }}>
              Backend SWE
            </div>
            <Stat label="Level" value={String(state.level)} />
            <Stat label="XP" value={`${state.xp}/${XP_PER_LEVEL}`} />
            <Stat label="Streak flame" value={`${state.streak} days`} />
            <Stat
              label="Rest tokens"
              value={state.restTokens > 0 ? '◆'.repeat(state.restTokens) : '—'}
            />
            <Stat label="Apps sent" value={String(state.appsSent)} />
            <Stat label="Join target" value="Jun ’27" />
            <div style={eventBox}>{state.lastEvent}</div>
            <button type="button" style={ghost} onClick={() => dispatch({ type: 'ADVANCE_DAY' })}>
              Sleep → next day
            </button>
            <button
              type="button"
              style={ghost}
              onClick={() => {
                dispatch({ type: 'RESET' })
              }}
            >
              Reset run
            </button>
            <p style={{ fontSize: 11, opacity: 0.5, marginTop: 12, lineHeight: 1.4 }}>
              Track: {PROFILE.track}. 100xDevs paused until first app.
            </p>
          </aside>

          <main style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
            <div style={dateLine}>
              <button type="button" style={navBtn} onClick={() => setSelected(shift(selected, -1))}>
                ←
              </button>
              <span>
                {selected}
                {selected !== today && (
                  <button type="button" style={linkBtn} onClick={() => setSelected(today)}>
                    · today
                  </button>
                )}
              </span>
              <button type="button" style={navBtn} onClick={() => setSelected(shift(selected, 1))}>
                →
              </button>
            </div>

            {catchUp && (
              <div style={catchBox}>
                <div>
                  <div style={catchLabel}>CATCH-UP · skipped earlier</div>
                  <strong>
                    {catchUp.date.slice(5)} — {catchUp.title}
                  </strong>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    style={chipDark}
                    onClick={() => markCatchUpDone(catchUp.date)}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    style={chip}
                    onClick={() => dismissCatchUp(catchUp.date)}
                  >
                    Drop
                  </button>
                </div>
              </div>
            )}

            <QuestCard
              kind="MAIN"
              title={study?.title ?? 'No study assignment'}
              steps={study?.steps ?? ['Rest or pick a day from the calendar.']}
              done={
                Boolean(study && progress.studyDone[study.date]) ||
                state.studyDone ||
                state.mode !== 'work'
              }
              reward="+40 XP"
              open={study?.open}
              onClear={completeStudyQuest}
            />
            <QuestCard
              kind="SIDE"
              title="Body — gym or walk"
              steps={['Hit today’s body floor (gym or 30–45 min walk).']}
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
                Send application (+50)
              </button>
              <button type="button" style={chip} onClick={() => setPanel('calendars')}>
                Open calendars →
              </button>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}

function shift(dateKey: string, days: number) {
  const d = new Date(dateKey + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return format(d, 'yyyy-MM-dd')
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={statRow}>
      <span style={{ opacity: 0.55 }}>{label}</span>
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
  open,
  onClear,
}: {
  kind: string
  title: string
  steps: string[]
  done: boolean
  reward: string
  open?: string
  onClear: () => void
}) {
  return (
    <article style={questCard(done)}>
      <div style={questTop}>
        <span style={{ color: kind === 'MAIN' ? '#2f6b4f' : '#5a6b5e' }}>{kind} QUEST</span>
        <span>{reward}</span>
      </div>
      <h2 style={{ margin: '0 0 8px', fontSize: 20, fontFamily: 'Fraunces, serif' }}>{title}</h2>
      <ol style={{ margin: '0 0 12px', paddingLeft: 18, fontSize: 14, lineHeight: 1.5 }}>
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      {open && (
        <p style={{ fontSize: 12, opacity: 0.6, margin: '0 0 10px' }}>
          Open: <code style={code}>{open}</code>
        </p>
      )}
      <button type="button" style={chipDark} disabled={done} onClick={onClear}>
        {done ? 'Cleared' : 'Complete quest'}
      </button>
    </article>
  )
}

function segBtn(on: boolean): CSSProperties {
  return {
    border: 'none',
    background: on ? '#1c241c' : 'transparent',
    color: on ? '#f3efe4' : '#1c241c',
    padding: '10px 14px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 13,
    fontFamily: 'DM Sans, sans-serif',
  }
}

function calRow(sel: boolean, done: boolean): CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: '2.8rem 3rem 1fr',
    gap: 6,
    textAlign: 'left',
    padding: '8px',
    borderRadius: 8,
    border: sel ? '2px solid #1c241c' : '1px solid #d8d0c0',
    background: sel ? '#e7f0e9' : done ? '#efeae0' : '#fffdf6',
    cursor: 'pointer',
    fontSize: 12,
    fontFamily: 'DM Sans, sans-serif',
    color: '#1c241c',
  }
}

function kind(k: string): CSSProperties {
  const map: Record<string, string> = {
    study: '#5c5a55',
    apply: '#1a5c3a',
    mock: '#8a5a12',
    interview: '#8a2030',
    offer: '#1a3a5c',
  }
  return {
    background: map[k] ?? '#444',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '8px 4px',
    borderRadius: 6,
    textAlign: 'center',
    height: 'fit-content',
    fontFamily: 'DM Sans, sans-serif',
  }
}

function questCard(done: boolean): CSSProperties {
  return {
    border: done ? '2px solid #2f6b4f' : '2px solid #1c241c',
    background: done ? '#e7f0e9' : '#fffdf6',
    borderRadius: 4,
    padding: 16,
  }
}

const page: CSSProperties = {
  minHeight: '100vh',
  background: '#f3efe4',
  color: '#1c241c',
  fontFamily: 'DM Sans, system-ui, sans-serif',
  padding: '28px 20px 64px',
}
const header: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 20,
  alignItems: 'flex-end',
  maxWidth: 980,
  margin: '0 auto 20px',
  flexWrap: 'wrap',
}
const brand: CSSProperties = {
  fontSize: 11,
  letterSpacing: '0.2em',
  fontWeight: 700,
  opacity: 0.5,
}
const h1: CSSProperties = {
  margin: '6px 0 0',
  fontSize: 42,
  fontFamily: 'Fraunces, serif',
  fontWeight: 700,
  letterSpacing: '-0.03em',
}
const sub: CSSProperties = {
  margin: '8px 0 0',
  maxWidth: 420,
  fontSize: 14,
  lineHeight: 1.45,
  opacity: 0.7,
}
const countdown: CSSProperties = {
  background: '#1c241c',
  color: '#f3efe4',
  padding: '14px 18px',
  borderRadius: 12,
  minWidth: 160,
}
const countNum: CSSProperties = {
  fontSize: 40,
  fontWeight: 700,
  fontFamily: 'Fraunces, serif',
  lineHeight: 1,
}
const countLabel: CSSProperties = { fontSize: 12, opacity: 0.65, marginTop: 6 }
const seg: CSSProperties = {
  display: 'inline-flex',
  background: '#e0d9cb',
  padding: 4,
  borderRadius: 10,
  margin: '0 auto 18px',
  maxWidth: 980,
  width: '100%',
  boxSizing: 'border-box',
}
const grid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(200px, 240px) 1fr',
  gap: 16,
  maxWidth: 980,
  margin: '0 auto',
}
const sheet: CSSProperties = {
  background: '#fffdf6',
  border: '2px solid #1c241c',
  borderRadius: 4,
  padding: 14,
  height: 'fit-content',
}
const statRow: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 13,
  padding: '7px 0',
  borderBottom: '1px solid #ddd4c4',
}
const eventBox: CSSProperties = {
  marginTop: 14,
  padding: 10,
  background: '#efeae0',
  borderRadius: 8,
  fontSize: 12,
  lineHeight: 1.4,
}
const ghost: CSSProperties = {
  width: '100%',
  marginTop: 8,
  padding: '8px 12px',
  borderRadius: 4,
  border: '2px solid #1c241c',
  background: 'transparent',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 13,
}
const chip: CSSProperties = {
  padding: '8px 12px',
  borderRadius: 4,
  border: '2px solid #1c241c',
  background: '#e7f0e9',
  color: '#1c241c',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
}
const chipDark: CSSProperties = {
  ...chip,
  background: '#1c241c',
  color: '#f3efe4',
}
const questTop: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 11,
  letterSpacing: '0.08em',
  marginBottom: 6,
  fontWeight: 700,
}
const code: CSSProperties = {
  fontSize: 11,
  background: '#efeae0',
  padding: '2px 5px',
  borderRadius: 4,
}
const dateLine: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 700,
  fontSize: 13,
}
const navBtn: CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 4,
  border: '2px solid #1c241c',
  background: '#fffdf6',
  cursor: 'pointer',
}
const linkBtn: CSSProperties = {
  border: 'none',
  background: 'none',
  textDecoration: 'underline',
  cursor: 'pointer',
  marginLeft: 6,
  font: 'inherit',
}
const catchBox: CSSProperties = {
  background: '#f3ead9',
  border: '2px solid #c4a35a',
  borderRadius: 4,
  padding: 12,
  display: 'flex',
  justifyContent: 'space-between',
  gap: 10,
  flexWrap: 'wrap',
  alignItems: 'center',
}
const catchLabel: CSSProperties = {
  fontSize: 10,
  letterSpacing: '0.1em',
  fontWeight: 700,
  opacity: 0.65,
  marginBottom: 2,
}
const calGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 14,
  maxWidth: 980,
  margin: '0 auto',
}
const calCard: CSSProperties = {
  background: '#fffdf6',
  border: '2px solid #1c241c',
  borderRadius: 4,
  padding: 14,
}
const calH: CSSProperties = {
  margin: '0 0 10px',
  fontFamily: 'Fraunces, serif',
  fontSize: 22,
}
const calList: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  maxHeight: 520,
  overflow: 'auto',
}
const mile: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '4rem 1fr',
  gap: 10,
  padding: '8px 0',
  borderBottom: '1px solid #e5dccf',
}
