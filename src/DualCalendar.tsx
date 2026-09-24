import { CURRICULUM } from './curriculum'
import { INTERVIEW_MILESTONES, type Milestone } from './milestones'
import { isStudyDay } from './progress'

const kindColor: Record<Milestone['kind'], string> = {
  study: '#5c5a55',
  apply: '#1f3d2b',
  mock: '#6b4f1f',
  interview: '#6b1f2a',
  offer: '#1f3d5c',
}

export function DualCalendar({
  todayKey,
  studyDone,
  onJump,
}: {
  todayKey: string
  studyDone: Record<string, boolean>
  onJump: (date: string) => void
}) {
  const studyRows = CURRICULUM.filter(isStudyDay).slice(0, 40)

  return (
    <div className="dual-cal">
      <section className="cal-panel">
        <h2>Study calendar</h2>
        <p className="muted">
          Fixed dates. Finishing day 1 does <strong>not</strong> change day 2’s topic.
          Skips go to catch-up (max 1 shown on Today).
        </p>
        <ul className="cal-list">
          {studyRows.map((a) => {
            const done = Boolean(studyDone[a.date])
            const isToday = a.date === todayKey
            const past = a.date < todayKey
            return (
              <li key={a.date}>
                <button
                  type="button"
                  className={
                    isToday ? 'cal-row today' : done ? 'cal-row done' : past ? 'cal-row missed' : 'cal-row'
                  }
                  onClick={() => onJump(a.date)}
                >
                  <span className="cal-date">{a.date.slice(5)}</span>
                  <span className="cal-sub">{a.subject}</span>
                  <span className="cal-title">{a.title}</span>
                  <span className="cal-flag">
                    {done ? 'done' : isToday ? 'today' : past ? 'skipped' : ''}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="cal-panel">
        <h2>Interview calendar</h2>
        <p className="muted">
          When to apply, mock, and run real loops — parallel to study, not after “feeling ready.”
        </p>
        <ul className="mile-list">
          {INTERVIEW_MILESTONES.map((m) => {
            const active = todayKey >= m.date && todayKey <= (m.endDate ?? m.date)
            const upcoming = todayKey < m.date
            return (
              <li
                key={m.id}
                className={active ? 'mile active' : upcoming ? 'mile' : 'mile past'}
              >
                <div
                  className="mile-kind"
                  style={{ background: kindColor[m.kind] }}
                >
                  {m.kind}
                </div>
                <div>
                  <strong>{m.title}</strong>
                  <div className="muted">
                    {m.date}
                    {m.endDate ? ` → ${m.endDate}` : ''}
                  </div>
                  <p>{m.detail}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
