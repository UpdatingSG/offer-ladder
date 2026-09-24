/**
 * PROTOTYPE A — "Runway"
 * Senior PD bet: calm command center. Interview countdown is the hero.
 * Dual calendars always on-screen (right rail). Not a game — a control tower.
 */
import type { CSSProperties, ReactNode } from 'react'
import type { ProtoSession } from './usePrototypeSession'

export const VARIANT_A_NAME = 'Runway'

export function VariantRunway({ s }: { s: ProtoSession }) {
  return (
    <div style={page}>
      <header style={top}>
        <div>
          <div style={brand}>OFFER LADDER</div>
          <h1 style={h1}>Interview runway</h1>
        </div>
        <div style={countdown}>
          <div style={countNum}>
            {s.untilApply > 0 ? s.untilApply : 'NOW'}
          </div>
          <div style={countLabel}>
            {s.untilApply > 0
              ? 'days to first cold applications'
              : 'applications open — keep sending'}
          </div>
        </div>
      </header>

      <div
        style={{
          ...grid,
          gridTemplateColumns:
            s.panel === 'focus'
              ? 'minmax(0, 1.2fr) minmax(280px, 0.8fr)'
              : 'minmax(0, 1fr)',
        }}
      >
        <main style={mainCol}>
          <div style={seg}>
            <SegBtn
              active={s.panel === 'focus'}
              onClick={() => s.setPanel('focus')}
              label="Today"
            />
            <SegBtn
              active={s.panel === 'calendars'}
              onClick={() => s.setPanel('calendars')}
              label="Study + interview calendar"
            />
          </div>

          {s.panel === 'calendars' ? (
            <DualRails s={s} />
          ) : (
            <>
              {s.catchUp && (
                <div style={catchBox}>
                  <div style={kicker}>CATCH-UP · skipped earlier</div>
                  <strong>
                    {s.catchUp.date} · {s.catchUp.title}
                  </strong>
                  <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      style={btnDark}
                      onClick={() => s.completeStudy(s.catchUp!.date)}
                    >
                      Done
                    </button>
                    <button
                      type="button"
                      style={btnGhost}
                      onClick={() => s.dismiss(s.catchUp!.date)}
                    >
                      Skip forever
                    </button>
                  </div>
                </div>
              )}

              <article style={mission}>
                <div style={kicker}>
                  {s.selected} · {s.study?.subject ?? 'FLEX'}
                </div>
                <h2 style={{ margin: '8px 0 12px', fontSize: 26, fontWeight: 650 }}>
                  {s.study?.title ?? 'No assignment'}
                </h2>
                <ol style={steps}>
                  {(s.study?.steps ?? []).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ol>
                <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    style={btnDark}
                    onClick={() => s.study && s.completeStudy(s.study.date)}
                  >
                    Mark study done
                  </button>
                  <button
                    type="button"
                    style={btnGhost}
                    onClick={() => s.setPanel('calendars')}
                  >
                    Open calendars →
                  </button>
                </div>
              </article>

              <div style={mileStrip}>
                {s.activeMiles.map((m) => (
                  <div key={m.id} style={mileChip}>
                    <span style={{ opacity: 0.55, fontSize: 11 }}>{m.kind}</span>
                    <div style={{ fontWeight: 600 }}>{m.title}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        {s.panel === 'focus' && (
          <aside style={rail}>
            <h3 style={railH}>Study + interview</h3>
            <p style={railP}>Always visible. Scroll either track.</p>
            <DualRails s={s} compact />
          </aside>
        )}
      </div>
    </div>
  )
}

function DualRails({ s, compact }: { s: ProtoSession; compact?: boolean }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: compact ? '1fr' : '1fr 1fr',
        gap: 12,
      }}
    >
      <CalBlock title="Study calendar">
        {s.studyRows.slice(0, compact ? 12 : 25).map((a) => (
          <button
            key={a.date}
            type="button"
            style={row(a.date === s.selected, Boolean(s.studyDone[a.date]))}
            onClick={() => {
              s.setSelected(a.date)
              s.setPanel('focus')
            }}
          >
            <span>{a.date.slice(5)}</span>
            <span style={{ opacity: 0.55 }}>{a.subject}</span>
            <span>
              {s.studyDone[a.date] ? '✓ ' : ''}
              {a.title}
            </span>
          </button>
        ))}
      </CalBlock>
      <CalBlock title="Interview calendar">
        {s.milestones.map((m) => (
          <div key={m.id} style={mileRow}>
            <div style={kind(m.kind)}>{m.kind}</div>
            <div>
              <strong style={{ fontSize: 13 }}>{m.title}</strong>
              <div style={{ fontSize: 11, opacity: 0.55, marginTop: 2 }}>
                {m.date}
                {m.endDate ? ` → ${m.endDate}` : ''}
              </div>
              {!compact && (
                <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.8 }}>
                  {m.detail}
                </p>
              )}
            </div>
          </div>
        ))}
      </CalBlock>
    </div>
  )
}

function CalBlock({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section style={calCard}>
      <h4 style={{ margin: '0 0 8px', fontSize: 13, letterSpacing: '0.06em' }}>
        {title.toUpperCase()}
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 360, overflow: 'auto' }}>
        {children}
      </div>
    </section>
  )
}

function SegBtn({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: 'none',
        background: active ? '#111' : 'transparent',
        color: active ? '#fff' : '#444',
        padding: '10px 14px',
        borderRadius: 8,
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: 13,
      }}
    >
      {label}
    </button>
  )
}

function row(sel: boolean, done: boolean): CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: '2.6rem 2.8rem 1fr',
    gap: 6,
    textAlign: 'left',
    padding: '8px 8px',
    borderRadius: 8,
    border: sel ? '1px solid #111' : '1px solid transparent',
    background: sel ? '#eceae4' : done ? '#f3f3f0' : '#fafaf8',
    cursor: 'pointer',
    fontSize: 12,
  }
}

function kind(k: string): CSSProperties {
  const map: Record<string, string> = {
    study: '#6b6b6b',
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
    padding: '6px 4px',
    borderRadius: 6,
    textAlign: 'center',
    height: 'fit-content',
  }
}

const page: CSSProperties = {
  minHeight: '100vh',
  background: '#e8e6e1',
  color: '#141414',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  padding: '28px 24px 110px',
}
const top: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 24,
  alignItems: 'flex-end',
  maxWidth: 1100,
  margin: '0 auto 28px',
  flexWrap: 'wrap',
}
const brand: CSSProperties = {
  fontSize: 11,
  letterSpacing: '0.18em',
  fontWeight: 700,
  opacity: 0.45,
}
const h1: CSSProperties = { margin: '6px 0 0', fontSize: 42, fontWeight: 650, letterSpacing: '-0.03em' }
const countdown: CSSProperties = {
  background: '#111',
  color: '#f5f5f5',
  padding: '16px 20px',
  borderRadius: 14,
  minWidth: 200,
}
const countNum: CSSProperties = { fontSize: 48, fontWeight: 700, lineHeight: 1 }
const countLabel: CSSProperties = { fontSize: 12, opacity: 0.7, marginTop: 6, maxWidth: 180 }
const grid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: 20,
  maxWidth: 1100,
  margin: '0 auto',
}
const mainCol: CSSProperties = { minWidth: 0 }
const rail: CSSProperties = {
  background: '#f7f6f3',
  borderRadius: 16,
  padding: 14,
  border: '1px solid #d9d6cf',
  height: 'fit-content',
  position: 'sticky',
  top: 16,
}
const railH: CSSProperties = { margin: 0, fontSize: 14 }
const railP: CSSProperties = { margin: '4px 0 12px', fontSize: 12, opacity: 0.55 }
const seg: CSSProperties = {
  display: 'inline-flex',
  background: '#dddad3',
  padding: 4,
  borderRadius: 10,
  marginBottom: 16,
}
const mission: CSSProperties = {
  background: '#f7f6f3',
  borderRadius: 16,
  padding: 22,
  border: '1px solid #d9d6cf',
}
const kicker: CSSProperties = {
  fontSize: 11,
  letterSpacing: '0.1em',
  fontWeight: 700,
  opacity: 0.45,
}
const steps: CSSProperties = { margin: 0, paddingLeft: 18, lineHeight: 1.55, fontSize: 14 }
const btnDark: CSSProperties = {
  background: '#111',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 14px',
  cursor: 'pointer',
  fontWeight: 600,
}
const btnGhost: CSSProperties = {
  background: 'transparent',
  border: '1px solid #bbb',
  borderRadius: 8,
  padding: '10px 14px',
  cursor: 'pointer',
}
const catchBox: CSSProperties = {
  background: '#f3ead9',
  borderRadius: 12,
  padding: 14,
  marginBottom: 12,
  border: '1px solid #e0cda8',
}
const mileStrip: CSSProperties = { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }
const mileChip: CSSProperties = {
  background: '#f7f6f3',
  border: '1px solid #d9d6cf',
  borderRadius: 10,
  padding: '8px 10px',
  fontSize: 12,
  maxWidth: 240,
}
const calCard: CSSProperties = {
  background: '#f7f6f3',
  borderRadius: 12,
  padding: 12,
  border: '1px solid #d9d6cf',
}
const mileRow: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '3.6rem 1fr',
  gap: 8,
  padding: '8px 4px',
  borderBottom: '1px solid #e8e6e1',
}
