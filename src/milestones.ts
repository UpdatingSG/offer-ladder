/**
 * Interview milestones — when to apply / mock / interview.
 * Study calendar stays date-anchored; this is the parallel track.
 */

export type Milestone = {
  id: string
  date: string
  endDate?: string
  kind: 'study' | 'apply' | 'mock' | 'interview' | 'offer'
  title: string
  detail: string
}

export const INTERVIEW_MILESTONES: Milestone[] = [
  {
    id: 'study-block',
    date: '2026-09-25',
    endDate: '2026-11-08',
    kind: 'study',
    title: 'Study block (no cold apps yet)',
    detail:
      'DSA Lesson 8 → cold mediums + HLD dry-runs. Gym/home. Do NOT wait to “feel ready” forever — apps have a fixed start.',
  },
  {
    id: 'diwali',
    date: '2026-11-06',
    endDate: '2026-11-08',
    kind: 'study',
    title: 'Diwali buffer',
    detail: 'Rest OK. Streak safe. No interview pressure.',
  },
  {
    id: 'story-bank',
    date: '2026-11-09',
    endDate: '2026-11-14',
    kind: 'apply',
    title: 'Resume + story bank week',
    detail: 'STAR bullets, LinkedIn, company shortlist. Still light DSA.',
  },
  {
    id: 'first-apps',
    date: '2026-11-15',
    kind: 'apply',
    title: 'FIRST COLD APPLICATIONS',
    detail:
      'Send 3–5 quality apps. Unlock 100xDevs after first send. This is the confidence rep — not perfection.',
  },
  {
    id: 'app-pipeline',
    date: '2026-11-16',
    endDate: '2026-12-31',
    kind: 'apply',
    title: 'Application pipeline',
    detail: '3–5 quality apps/week + follow-ups. Keep study floors. Soft goal: 20 apps.',
  },
  {
    id: 'first-mocks',
    date: '2026-12-01',
    endDate: '2026-12-31',
    kind: 'mock',
    title: 'Start mocks (Dec)',
    detail:
      '1 timed DSA mock + 1 HLD dry-run per week (Pramp / friend / self-record). Real loops may start if apps convert.',
  },
  {
    id: 'interview-season',
    date: '2027-01-01',
    endDate: '2027-03-31',
    kind: 'interview',
    title: 'Interview season',
    detail:
      'Expect screens → onsites. Weekly mock. LLD rotations. This is when “interview calendar” is active week-to-week.',
  },
  {
    id: 'offer-window',
    date: '2027-04-01',
    endDate: '2027-06-30',
    kind: 'offer',
    title: 'Offer window · join by Jun 2027',
    detail: 'Negotiate TC. Maintain light DSA. Target join by 2027-06-30.',
  },
]

export function milestonesAround(dateKey: string): Milestone[] {
  return INTERVIEW_MILESTONES.filter((m) => {
    const end = m.endDate ?? m.date
    return dateKey >= m.date && dateKey <= end
  })
}

export function nextInterviewMilestone(dateKey: string): Milestone | undefined {
  return INTERVIEW_MILESTONES.find((m) => m.date > dateKey || (m.date <= dateKey && (m.endDate ?? m.date) >= dateKey && m.kind !== 'study'))
}
