/**
 * PROTOTYPE C — "Pulse"
 * Senior PD bet: anti-shame, human, mobile-first. One breath at a time.
 * Interview runway as a 5-beat ribbon. Calendars as a dedicated full view.
 */
import type { CSSProperties } from 'react'
import type { ProtoSession } from './usePrototypeSession'

export const VARIANT_C_NAME = 'Pulse'

const PHASES = [
  { key: 'study', label: 'Study', until: '2026-11-08' },
  { key: 'apply', label: 'Apply', until: '2026-12-31' },
  { key: 'mock', label: 'Mocks', until: '2026-12-31' },
  { key: 'loop', label: 'Loops', until: '2027-03-31' },
  { key: 'offer', label: 'Offer', until: '2027-06-30' },
] as const

export function VariantPulse({ s }: { s: ProtoSession }) {
  const phaseIdx =
    s.today <= '2026-11-08'
      ? 0
      : s.today <= '2026-11-14'
        ? 1
        : s.today <= '2026-12-31'
          ? 2
          : s.today <= '2027-03-31'
            ? 3
            : 4

  return (
    <div style={page}>
      <div style={shell}>
        <div style={topRow}>
          <div>
            <div style={brand}>pulse</div>
            <div style={{ fontSize: 13, opacity: 0.55 }}>{s.today}</div>
          </div>
          <button
            type="button"
            style={calLink}
            onClick={() =>
              s.setPanel(s.panel === 'calendars' ? 'focus' : 'calendars')
            }
          >
            {s.panel === 'calendars' ? '← Today' : 'Study + interview calendar'}
          </button>
        </div>

        <div style={ribbon}>
          {PHASES.map((p, i) => (
            <div key={p.key} style={beat(i <= phaseIdx, i === phaseIdx)}>
              <div style={beatDot(i <= phaseIdx)} />
              <div style={beatLabel}>{p.label}</div>
            </div>
          ))}
        </div>
        <p style={ribbonHint}>
          {s.untilApply > 0
            ? `${s.untilApply} days until you start applying — study is the job until then.`
            : 'You’re in the apply / interview runway. Keep the floor; send apps.'}
        </p>

        {s.panel === 'calendars' ? (
          <div style={calView}>
            <section>
              <h2 style={h2}>Study</h2>
              <div style={list}>
                {s.studyRows.map((a) => (
                  <button
                    key={a.date}
                    type="button"
                    style={item(s.selected === a.date)}
                    onClick={() => {
                      s.setSelected(a.date)
                      s.setPanel('focus')
                    }}
                  >
                    <strong>{a.date.slice(5)}</strong>
                    <span style={{ opacity: 0.5 }}>{a.subject}</span>
                    <span>
                      {s.studyDone[a.date] ? '✓ ' : ''}
                      {a.title}
                    </span>
                  </button>
                ))}
              </div>
            </section>
            <section>
              <h2 style={h2}>Interview</h2>
              <div style={list}>
                {s.milestones.map((m) => (
                  <div key={m.id} style={mile}>
                    <div style={tag}>{m.kind}</div>
                    <div>
                      <strong>{m.title}</strong>
                      <div style={{ fontSize: 12, opacity: 0.5, marginTop: 2 }}>
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
          <>
            <section style={hero}>
              <div style={whisper}>What matters today</div>
              <h1 style={title}>{s.study?.title ?? 'Rest is allowed'}</h1>
              <p style={meta}>
                {s.study?.subject} · ~{s.study?.minutes || 0} min · stop when the
                list ends
              </p>
              <ol style={steps}>
                {(s.study?.steps ?? ['Take a walk. Come back tomorrow.']).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ol>
              <button
                type="button"
                style={primary}
                onClick={() => s.study && s.completeStudy(s.study.date)}
              >
                I did today’s minimum
              </button>
            </section>

            {s.catchUp && (
              <section style={soft}>
                <div style={whisper}>Still open from earlier (no shame)</div>
                <p style={{ margin: '6px 0 10px' }}>
                  {s.catchUp.date.slice(5)} — {s.catchUp.title}
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    style={secondary}
                    onClick={() => s.completeStudy(s.catchUp!.date)}
                  >
                    Do catch-up
                  </button>
                  <button
                    type="button"
                    style={textBtn}
                    onClick={() => s.dismiss(s.catchUp!.date)}
                  >
                    Let it go
                  </button>
                </div>
              </section>
            )}

            <section style={soft}>
              <div style={whisper}>Active on the interview calendar</div>
              {s.activeMiles.map((m) => (
                <p key={m.id} style={{ margin: '8px 0 0', fontSize: 14 }}>
                  <strong>{m.title}</strong> — {m.detail}
                </p>
              ))}
            </section>
          </>
        )}
      </div>
    </div>
  )
}

function beat(done: boolean, current: boolean): CSSProperties {
  return {
    flex: 1,
    textAlign: 'center',
    opacity: done || current ? 1 : 0.35,
  }
}
function beatDot(on: boolean): CSSProperties {
  return {
    width: 12,
    height: 12,
    borderRadius: 999,
    margin: '0 auto 6px',
    background: on ? '#c45c26' : '#d5c4b0',
  }
}

const page: CSSProperties = {
  minHeight: '100vh',
  background: '#f6efe6',
  color: '#2a2118',
  fontFamily: 'Georgia, "Iowan Old Style", serif',
  padding: '20px 16px 110px',
}
const shell: CSSProperties = { maxWidth: 440, margin: '0 auto' }
const topRow: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 18,
}
const brand: CSSProperties = {
  fontFamily: 'system-ui, sans-serif',
  fontSize: 12,
  letterSpacing: '0.2em',
  textTransform: 'lowercase',
  fontWeight: 700,
}
const calLink: CSSProperties = {
  fontFamily: 'system-ui, sans-serif',
  fontSize: 12,
  fontWeight: 600,
  background: '#2a2118',
  color: '#f6efe6',
  border: 'none',
  borderRadius: 999,
  padding: '8px 12px',
  cursor: 'pointer',
}
const ribbon: CSSProperties = {
  display: 'flex',
  gap: 4,
  padding: '14px 8px',
  background: '#fff9f2',
  borderRadius: 16,
  border: '1px solid #e8dccf',
}
const beatLabel: CSSProperties = {
  fontFamily: 'system-ui, sans-serif',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.04em',
}
const ribbonHint: CSSProperties = {
  fontSize: 13,
  opacity: 0.65,
  lineHeight: 1.45,
  margin: '12px 0 20px',
}
const hero: CSSProperties = {
  background: '#fff9f2',
  borderRadius: 20,
  padding: 22,
  border: '1px solid #e8dccf',
}
const whisper: CSSProperties = {
  fontFamily: 'system-ui, sans-serif',
  fontSize: 11,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  opacity: 0.45,
  fontWeight: 700,
}
const title: CSSProperties = {
  margin: '10px 0 6px',
  fontSize: 30,
  lineHeight: 1.15,
  fontWeight: 500,
}
const meta: CSSProperties = {
  fontFamily: 'system-ui, sans-serif',
  fontSize: 12,
  opacity: 0.5,
  marginBottom: 14,
}
const steps: CSSProperties = {
  margin: '0 0 18px',
  paddingLeft: 18,
  fontSize: 15,
  lineHeight: 1.5,
}
const primary: CSSProperties = {
  width: '100%',
  fontFamily: 'system-ui, sans-serif',
  background: '#c45c26',
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  padding: '14px 16px',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
}
const soft: CSSProperties = {
  marginTop: 14,
  padding: 16,
  borderRadius: 16,
  background: '#efe6da',
}
const secondary: CSSProperties = {
  fontFamily: 'system-ui, sans-serif',
  background: '#2a2118',
  color: '#f6efe6',
  border: 'none',
  borderRadius: 10,
  padding: '10px 12px',
  cursor: 'pointer',
  fontWeight: 600,
}
const textBtn: CSSProperties = {
  fontFamily: 'system-ui, sans-serif',
  background: 'none',
  border: 'none',
  textDecoration: 'underline',
  cursor: 'pointer',
  opacity: 0.7,
}
const calView: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 18 }
const h2: CSSProperties = { fontSize: 22, margin: '0 0 10px', fontWeight: 500 }
const list: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6 }
function item(sel: boolean): CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: '2.8rem 3rem 1fr',
    gap: 6,
    textAlign: 'left',
    fontFamily: 'system-ui, sans-serif',
    fontSize: 12,
    padding: '10px',
    borderRadius: 12,
    border: sel ? '1px solid #c45c26' : '1px solid #e8dccf',
    background: '#fff9f2',
    cursor: 'pointer',
    color: '#2a2118',
  }
}
const mile: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '4rem 1fr',
  gap: 10,
  padding: 12,
  background: '#fff9f2',
  borderRadius: 12,
  border: '1px solid #e8dccf',
  marginBottom: 8,
}
const tag: CSSProperties = {
  fontFamily: 'system-ui, sans-serif',
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  background: '#2a2118',
  color: '#f6efe6',
  borderRadius: 8,
  padding: '8px 4px',
  textAlign: 'center',
  height: 'fit-content',
}
