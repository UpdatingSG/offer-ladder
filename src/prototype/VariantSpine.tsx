/**
 * LIVE UI — Spine (shipped from prototype B)
 * Interview journey as the primary UI. Mounted at base host `/`.
 */
import { useEffect, type CSSProperties } from 'react'
import type { ProtoSession } from './usePrototypeSession'

export const VARIANT_B_NAME = 'Spine'

const KIND_ACCENT: Record<string, string> = {
  study: '#6ec8ff',
  apply: '#5ddea8',
  mock: '#f0c24b',
  interview: '#ff8b7a',
  offer: '#e8d5a3',
}

export function VariantSpine({ s }: { s: ProtoSession }) {
  useEffect(() => {
    const id = 'spine-fonts'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=Literata:opsz,wght@7..72,400;7..72,600&display=swap'
    document.head.appendChild(link)
  }, [])

  return (
    <div style={page}>
      <div style={hatch} aria-hidden />
      <div style={vignette} aria-hidden />

      <header style={header}>
        <div style={brandMark}>OFFER LADDER</div>
        <h1 style={h1}>
          The spine
          <span style={h1Sub}> from study floor to signed offer</span>
        </h1>
        <p style={lede}>
          Interview milestones are stations on one line. Study days attach to the
          phase you’re in — so you always see <em>when</em> interviews start, not
          only what to grind today.
        </p>

        <div style={segWrap}>
          <button
            type="button"
            style={segBtn(s.panel === 'focus')}
            onClick={() => s.setPanel('focus')}
          >
            Today
          </button>
          <button
            type="button"
            style={segBtn(s.panel === 'calendars')}
            onClick={() => s.setPanel('calendars')}
          >
            Study + interview calendar
          </button>
        </div>

        <div style={statRow}>
          <Stat
            label="To first apps"
            value={s.untilApply > 0 ? `${s.untilApply}d` : 'Open'}
          />
          <Stat label="Join target" value="Jun ’27" />
          <Stat
            label="Study done"
            value={`${Object.keys(s.studyDone).length}`}
          />
        </div>
      </header>

      {s.panel === 'focus' && (
        <section style={todayDock} className="spine-today">
          <div style={todayEyebrow}>
            <span style={pulseDot} />
            TODAY · {s.selected}
          </div>
          <h2 style={todayTitle}>{s.study?.title ?? 'Rest day'}</h2>
          <div style={todayMeta}>
            <span style={pill}>{s.study?.subject ?? 'FLEX'}</span>
            <span>~{s.study?.minutes || 0} min</span>
            {s.studyDone[s.selected] && <span style={pillDone}>Done</span>}
          </div>
          <ol style={todaySteps}>
            {(s.study?.steps ?? ['Take the rest. Come back tomorrow.']).map(
              (step) => (
                <li key={step}>{step}</li>
              ),
            )}
          </ol>
          <div style={todayActions}>
            <button
              type="button"
              style={ctaPrimary}
              onClick={() => s.study && s.completeStudy(s.study.date)}
            >
              Complete today’s study
            </button>
            <button
              type="button"
              style={ctaGhost}
              onClick={() => s.setPanel('calendars')}
            >
              Jump to calendars
            </button>
          </div>
          {s.catchUp && (
            <div style={catchStrip}>
              <div>
                <div style={catchLabel}>Catch-up · no shame</div>
                <div>
                  {s.catchUp.date.slice(5)} — {s.catchUp.title}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  style={miniBtn}
                  onClick={() => s.completeStudy(s.catchUp!.date)}
                >
                  Clear
                </button>
                <button
                  type="button"
                  style={miniGhost}
                  onClick={() => s.dismiss(s.catchUp!.date)}
                >
                  Drop
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      <div style={spineWrap}>
        <div style={rail}>
          <div style={railFill(s.today)} />
        </div>

        {s.milestones.map((m, idx) => {
          const end = m.endDate ?? m.date
          const active = s.today >= m.date && s.today <= end
          const past = s.today > end
          const accent = KIND_ACCENT[m.kind] ?? '#9fb4d9'
          const studyInPhase = s.studyRows.filter(
            (a) => a.date >= m.date && a.date <= end,
          )
          const showStudy =
            s.panel === 'calendars' || active || (past && studyInPhase.some((a) => !s.studyDone[a.date]))

          return (
            <article
              key={m.id}
              style={{
                ...station,
                animationDelay: `${idx * 60}ms`,
              }}
              className="spine-station"
            >
              <div style={stationIndex}>{String(idx + 1).padStart(2, '0')}</div>
              <div
                style={{
                  ...node,
                  borderColor: active ? accent : past ? '#3d4f6f' : '#2a3a55',
                  background: active
                    ? `linear-gradient(145deg, ${accent}22 0%, #121c30 40%)`
                    : '#0f1728',
                }}
              >
                <div style={nodeHead}>
                  <span style={{ ...kindBadge, background: accent, color: '#0b1220' }}>
                    {m.kind}
                  </span>
                  <span style={dateRange}>
                    {fmt(m.date)}
                    {m.endDate ? ` → ${fmt(m.endDate)}` : ''}
                  </span>
                </div>
                <h3 style={nodeTitle}>{m.title}</h3>
                <p style={nodeDetail}>{m.detail}</p>

                {active && (
                  <div style={{ ...youAreHere, borderColor: accent, color: accent }}>
                    You are here
                  </div>
                )}

                {showStudy && studyInPhase.length > 0 && (
                  <div style={studyNest}>
                    <div style={nestLabel}>
                      Study calendar · {studyInPhase.length} days in this station
                    </div>
                    <div style={ticketGrid}>
                      {(s.panel === 'calendars'
                        ? studyInPhase
                        : studyInPhase.slice(0, 6)
                      ).map((a) => {
                        const done = Boolean(s.studyDone[a.date])
                        const sel = s.selected === a.date
                        return (
                          <button
                            key={a.date}
                            type="button"
                            style={ticket(sel, done, accent)}
                            onClick={() => {
                              s.setSelected(a.date)
                              s.setPanel('focus')
                            }}
                          >
                            <span style={ticketDate}>{a.date.slice(5)}</span>
                            <span style={ticketSub}>{a.subject}</span>
                            <span style={ticketTitle}>
                              {done ? '✓ ' : ''}
                              {a.title}
                            </span>
                          </button>
                        )
                      })}
                      {s.panel === 'focus' && studyInPhase.length > 6 && (
                        <button
                          type="button"
                          style={moreBtn}
                          onClick={() => s.setPanel('calendars')}
                        >
                          +{studyInPhase.length - 6} more in calendar view
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </article>
          )
        })}

        <div style={endCap}>
          <div style={endDot} />
          <div>
            <div style={nestLabel}>Destination</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18 }}>
              Signed offer · join by Jun 2027
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .spine-station {
          animation: spineIn 0.55s ease both;
        }
        .spine-today {
          animation: spineIn 0.4s ease both;
        }
        @keyframes spineIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .spine-station { padding-left: 0 !important; }
        }
      `}</style>
    </div>
  )
}

function fmt(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y?.slice(2)}`
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={stat}>
      <div style={statVal}>{value}</div>
      <div style={statLabel}>{label}</div>
    </div>
  )
}

function segBtn(on: boolean): CSSProperties {
  return {
    border: 'none',
    background: on ? '#f0c24b' : 'transparent',
    color: on ? '#0b1220' : '#a8b8d6',
    padding: '11px 16px',
    borderRadius: 999,
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 13,
    fontFamily: 'Syne, sans-serif',
  }
}

function ticket(sel: boolean, done: boolean, accent: string): CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: '2.6rem 3.2rem 1fr',
    gap: 8,
    alignItems: 'start',
    textAlign: 'left',
    width: '100%',
    padding: '10px 12px',
    borderRadius: 10,
    cursor: 'pointer',
    border: sel ? `1px solid ${accent}` : '1px solid #2a3b58',
    background: sel ? `${accent}18` : done ? '#0c1422' : '#121d32',
    color: done ? '#8fd4a8' : '#d5e0f5',
    fontFamily: 'Literata, Georgia, serif',
    fontSize: 12,
  }
}

function railFill(today: string): CSSProperties {
  // rough fill: before apply vs after
  const pct = today < '2026-11-15' ? 28 : today < '2027-01-01' ? 48 : today < '2027-04-01' ? 72 : 92
  return {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 3,
    height: `${pct}%`,
    background: 'linear-gradient(180deg, #6ec8ff 0%, #f0c24b 55%, #5ddea8 100%)',
    borderRadius: 2,
  }
}

const page: CSSProperties = {
  minHeight: '100vh',
  background: '#070b14',
  color: '#e8eefc',
  fontFamily: 'Literata, Georgia, serif',
  padding: '36px 20px 130px',
  position: 'relative',
  overflow: 'hidden',
}

const hatch: CSSProperties = {
  pointerEvents: 'none',
  position: 'absolute',
  inset: 0,
  opacity: 0.35,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 60L60 0M30 60L60 30M0 30L30 0' stroke='%231a2744' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
}

const vignette: CSSProperties = {
  pointerEvents: 'none',
  position: 'absolute',
  inset: 0,
  background:
    'radial-gradient(ellipse 80% 50% at 50% -10%, #1a3a6a44 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 100% 80%, #3a2a1044 0%, transparent 50%)',
}

const header: CSSProperties = {
  position: 'relative',
  maxWidth: 720,
  margin: '0 auto 28px',
  zIndex: 1,
}

const brandMark: CSSProperties = {
  fontFamily: 'Syne, sans-serif',
  fontSize: 11,
  letterSpacing: '0.28em',
  fontWeight: 800,
  color: '#f0c24b',
}

const h1: CSSProperties = {
  margin: '12px 0 0',
  fontFamily: 'Syne, sans-serif',
  fontSize: 'clamp(40px, 8vw, 64px)',
  fontWeight: 800,
  letterSpacing: '-0.04em',
  lineHeight: 0.95,
}

const h1Sub: CSSProperties = {
  display: 'block',
  fontSize: 'clamp(16px, 3vw, 22px)',
  fontWeight: 500,
  letterSpacing: '-0.02em',
  color: '#8fa3c7',
  marginTop: 10,
  fontFamily: 'Literata, Georgia, serif',
}

const lede: CSSProperties = {
  margin: '16px 0 0',
  maxWidth: 520,
  fontSize: 15,
  lineHeight: 1.55,
  color: '#a8b8d6',
}

const segWrap: CSSProperties = {
  display: 'inline-flex',
  gap: 4,
  background: '#10192c',
  padding: 5,
  borderRadius: 999,
  marginTop: 22,
  border: '1px solid #243656',
}

const statRow: CSSProperties = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
  marginTop: 20,
}

const stat: CSSProperties = {
  background: '#0f1728cc',
  border: '1px solid #243656',
  borderRadius: 12,
  padding: '10px 14px',
  minWidth: 100,
  backdropFilter: 'blur(8px)',
}

const statVal: CSSProperties = {
  fontFamily: 'Syne, sans-serif',
  fontWeight: 800,
  fontSize: 22,
  letterSpacing: '-0.03em',
}

const statLabel: CSSProperties = {
  fontSize: 11,
  color: '#8090b0',
  marginTop: 2,
  fontFamily: 'Syne, sans-serif',
  letterSpacing: '0.04em',
}

const todayDock: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  maxWidth: 720,
  margin: '0 auto 32px',
  padding: 22,
  borderRadius: 20,
  background: 'linear-gradient(160deg, #152238 0%, #0d1526 100%)',
  border: '1px solid #3a5478',
  boxShadow: '0 24px 60px #00000066',
}

const todayEyebrow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontFamily: 'Syne, sans-serif',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.14em',
  color: '#6ec8ff',
}

const pulseDot: CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 99,
  background: '#6ec8ff',
}

const todayTitle: CSSProperties = {
  margin: '10px 0 8px',
  fontFamily: 'Syne, sans-serif',
  fontSize: 28,
  fontWeight: 700,
  letterSpacing: '-0.03em',
  lineHeight: 1.15,
}

const todayMeta: CSSProperties = {
  display: 'flex',
  gap: 10,
  alignItems: 'center',
  fontSize: 13,
  color: '#8fa3c7',
  marginBottom: 12,
  fontFamily: 'Syne, sans-serif',
}

const pill: CSSProperties = {
  background: '#1e3a5f',
  color: '#9fd0ff',
  padding: '3px 8px',
  borderRadius: 6,
  fontSize: 11,
  fontWeight: 700,
}

const pillDone: CSSProperties = {
  ...pill,
  background: '#1a3d2e',
  color: '#8fd4a8',
}

const todaySteps: CSSProperties = {
  margin: '0 0 16px',
  paddingLeft: 18,
  lineHeight: 1.55,
  color: '#c5d2ea',
  fontSize: 14,
}

const todayActions: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
}

const ctaPrimary: CSSProperties = {
  fontFamily: 'Syne, sans-serif',
  background: '#f0c24b',
  color: '#0b1220',
  border: 'none',
  borderRadius: 12,
  padding: '12px 18px',
  fontWeight: 800,
  cursor: 'pointer',
  fontSize: 14,
}

const ctaGhost: CSSProperties = {
  fontFamily: 'Syne, sans-serif',
  background: 'transparent',
  color: '#c5d2ea',
  border: '1px solid #3a5478',
  borderRadius: 12,
  padding: '12px 16px',
  fontWeight: 700,
  cursor: 'pointer',
  fontSize: 13,
}

const catchStrip: CSSProperties = {
  marginTop: 16,
  padding: 12,
  borderRadius: 12,
  background: '#1a1620',
  border: '1px solid #5a4a28',
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  alignItems: 'center',
  flexWrap: 'wrap',
  fontSize: 13,
}

const catchLabel: CSSProperties = {
  fontFamily: 'Syne, sans-serif',
  fontSize: 10,
  letterSpacing: '0.12em',
  color: '#f0c24b',
  fontWeight: 700,
  marginBottom: 2,
}

const miniBtn: CSSProperties = {
  fontFamily: 'Syne, sans-serif',
  background: '#f0c24b',
  color: '#0b1220',
  border: 'none',
  borderRadius: 8,
  padding: '8px 12px',
  fontWeight: 700,
  cursor: 'pointer',
  fontSize: 12,
}

const miniGhost: CSSProperties = {
  ...miniBtn,
  background: 'transparent',
  color: '#a8b8d6',
  border: '1px solid #3a5478',
}

const spineWrap: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  maxWidth: 720,
  margin: '0 auto',
  paddingLeft: 36,
}

const rail: CSSProperties = {
  position: 'absolute',
  left: 10,
  top: 8,
  bottom: 40,
  width: 3,
  background: '#1e2c48',
  borderRadius: 2,
}

const station: CSSProperties = {
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '36px 1fr',
  gap: 12,
  marginBottom: 22,
  paddingLeft: 8,
}

const stationIndex: CSSProperties = {
  fontFamily: 'Syne, sans-serif',
  fontWeight: 800,
  fontSize: 13,
  color: '#4a5f88',
  paddingTop: 22,
  letterSpacing: '0.04em',
}

const node: CSSProperties = {
  borderRadius: 18,
  padding: 18,
  border: '1px solid #2a3a55',
  position: 'relative',
}

const nodeHead: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 10,
  alignItems: 'center',
  flexWrap: 'wrap',
}

const kindBadge: CSSProperties = {
  fontFamily: 'Syne, sans-serif',
  fontSize: 10,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  padding: '4px 8px',
  borderRadius: 6,
}

const dateRange: CSSProperties = {
  fontFamily: 'Syne, sans-serif',
  fontSize: 11,
  color: '#7f93b8',
  letterSpacing: '0.02em',
}

const nodeTitle: CSSProperties = {
  margin: '10px 0 6px',
  fontFamily: 'Syne, sans-serif',
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: '-0.02em',
}

const nodeDetail: CSSProperties = {
  margin: 0,
  fontSize: 13.5,
  lineHeight: 1.5,
  color: '#9eb0d0',
}

const youAreHere: CSSProperties = {
  marginTop: 12,
  display: 'inline-block',
  fontFamily: 'Syne, sans-serif',
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '5px 10px',
  borderRadius: 999,
  border: '1px solid',
}

const studyNest: CSSProperties = { marginTop: 16 }

const nestLabel: CSSProperties = {
  fontFamily: 'Syne, sans-serif',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.14em',
  color: '#6b7fA8',
  marginBottom: 8,
}

const ticketGrid: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}

const ticketDate: CSSProperties = {
  fontFamily: 'Syne, sans-serif',
  fontWeight: 700,
  fontSize: 12,
}

const ticketSub: CSSProperties = {
  fontFamily: 'Syne, sans-serif',
  fontSize: 10,
  opacity: 0.55,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}

const ticketTitle: CSSProperties = { lineHeight: 1.35 }

const moreBtn: CSSProperties = {
  marginTop: 4,
  background: 'transparent',
  border: '1px dashed #3a5478',
  color: '#8fa3c7',
  borderRadius: 10,
  padding: '10px',
  cursor: 'pointer',
  fontFamily: 'Syne, sans-serif',
  fontSize: 12,
  fontWeight: 600,
}

const endCap: CSSProperties = {
  display: 'flex',
  gap: 14,
  alignItems: 'center',
  marginTop: 8,
  paddingLeft: 4,
}

const endDot: CSSProperties = {
  width: 18,
  height: 18,
  borderRadius: 99,
  background: '#5ddea8',
  marginLeft: -1,
  border: '3px solid #070b14',
}
