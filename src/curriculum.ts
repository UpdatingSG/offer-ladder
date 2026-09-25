/**
 * Concrete day-by-day study assignments.
 * Starts from your D2D progress — no beginner restarts.
 * Dates without an entry fall back to the weekly rhythm in plan.ts.
 */

export type StudyAssignment = {
  date: string
  subject: 'DSA' | 'HLD' | 'LLD' | 'Content' | 'Flex'
  title: string
  /** Exact actions for the session (do these, then stop). */
  steps: string[]
  /** Optional D2D / LeetCode pointer */
  open?: string
  minutes: number
}

/** Inclusive cutoff: DSA finished through Network Delay Time. */
export const DSA_COMPLETED_THROUGH = '2026-09-30'

export const CURRICULUM: StudyAssignment[] = [
  // ——— Completed through Network Delay Time (kept for calendar history) ———
  {
    date: '2026-09-25',
    subject: 'DSA',
    title: 'Lesson 8 — Sticky Gaps quiz',
    steps: [
      'Open sticky-gap drills lesson',
      'Do the 6-question gap-pattern quiz only (Union-Find vs Dijkstra vs BFS)',
      'Write 1 line: when Union-Find wins vs when Dijkstra wins',
      'Stop at 40 min even if unfinished',
    ],
    open: 'D2DLearnings/dsa/lessons/0011-sticky-gap-drills.html',
    minutes: 40,
  },
  {
    date: '2026-09-26',
    subject: 'HLD',
    title: 'HLD Lesson 1 recall (no new theory)',
    steps: [
      'Re-open 45-Minute HLD Sprint lesson OR your notes',
      'Out loud: list the 45-min phases in order (2 min)',
      'Pick URL Shortener — write only: requirements + APIs + data model (15 min)',
      'Do NOT design full scale today',
    ],
    open: 'D2DLearnings/hld/lessons/0001-the-45-minute-hld-sprint.html',
    minutes: 30,
  },
  {
    date: '2026-09-27',
    subject: 'Content',
    title: 'Weekend content review block',
    steps: [
      'Check X autopilot / reply queue (15–20 min)',
      'YouTube automation: review 1 draft or pipeline status',
      'Tharun / editing: only if notification started — else skip',
      'Hard stop at 90 min',
    ],
    minutes: 75,
  },
  {
    date: '2026-09-28',
    subject: 'Flex',
    title: 'Rest / tour day (optional light review)',
    steps: [
      'Default: full rest — log Rest in the app',
      'Optional only: skim pattern-signals.html for 10 min',
    ],
    open: 'D2DLearnings/dsa/reference/pattern-signals.html',
    minutes: 0,
  },
  {
    date: '2026-09-29',
    subject: 'DSA',
    title: 'Cold solve — Redundant Connection (Union-Find)',
    steps: [
      '90s Pattern Radar: INPUT / GOAL / CONSTRAINT → pick pattern',
      'Solve LC 684 Redundant Connection timed (≤35 min)',
      'If stuck 12 min: peek approach only, finish yourself',
      'Log: did Union-Find feel automatic? Y/N',
    ],
    open: 'https://leetcode.com/problems/redundant-connection/',
    minutes: 40,
  },
  {
    date: '2026-09-30',
    subject: 'DSA',
    title: 'Graph+heap basics → Network Delay Time',
    steps: [
      'Skim graph-and-heap-basics.html (10 min max)',
      'Solve LC 743 Network Delay Time (Dijkstra) timed',
      'Say aloud: “BFS where queue is a min-heap on distance”',
    ],
    open: 'D2DLearnings/dsa/reference/graph-and-heap-basics.html',
    minutes: 45,
  },
  {
    date: '2026-10-01',
    subject: 'HLD',
    title: 'Back-of-envelope that matters',
    steps: [
      'From Scaler HLD notes: pick 3 formulas you already know (QPS, storage, bandwidth)',
      'For URL Shortener: estimate 5y reads/writes + storage on paper',
      'Mark which estimates you would skip in a real interview',
    ],
    minutes: 30,
  },

  // ——— Home block week 1 (Oct 2–8) ———
  {
    date: '2026-10-02',
    subject: 'DSA',
    title: 'Number of Islands — BFS review cold',
    steps: [
      'Pattern Radar first (no coding 90s)',
      'LC 200 Number of Islands — multi-source BFS/DFS',
      'Compare to Lesson 3 template for 5 min after',
    ],
    open: 'https://leetcode.com/problems/number-of-islands/',
    minutes: 40,
  },
  {
    date: '2026-10-03',
    subject: 'DSA',
    title: 'Top-K heap medium',
    steps: [
      'LC 347 Top K Frequent Elements — heap not full sort',
      'If easy: also LC 215 Kth Largest (20 min)',
    ],
    open: 'https://leetcode.com/problems/top-k-frequent-elements/',
    minutes: 40,
  },
  {
    date: '2026-10-04',
    subject: 'LLD',
    title: 'Timed LLD — Parking Lot (30 min clock)',
    steps: [
      'Phone timer 30:00',
      'Entities → relationships → core APIs → one pattern choice',
      'Stop when timer ends — note what you skipped (scope control)',
    ],
    open: 'D2DLearnings/lld/lessons/0003-parking-lot-capstone.html',
    minutes: 35,
  },
  {
    date: '2026-10-05',
    subject: 'DSA',
    title: 'DP recognition cold — House Robber / Coin Change',
    steps: [
      'Pick ONE: LC 198 House Robber OR LC 322 Coin Change',
      'Write state → recurrence before code',
      'No solution video',
    ],
    minutes: 40,
  },
  {
    date: '2026-10-06',
    subject: 'HLD',
    title: 'Building blocks radar',
    steps: [
      'List LB / Cache / DB / Queue — one sentence each when to use',
      'For Twitter feed: choose fanout-on-write vs read and defend (10 min)',
    ],
    minutes: 30,
  },
  {
    date: '2026-10-07',
    subject: 'Content',
    title: 'Weekend content + optional DSA',
    steps: [
      'X + YouTube review 60–75 min',
      'Optional: 1 easy spaced review if energy left',
    ],
    minutes: 75,
  },
  {
    date: '2026-10-08',
    subject: 'Flex',
    title: 'Rest / family / tour',
    steps: ['Log Rest. No guilt. Gym optional walk only.'],
    minutes: 0,
  },

  // ——— Home week 2 (Oct 9–15) ———
  {
    date: '2026-10-09',
    subject: 'DSA',
    title: 'Backtracking cold — Subsets / Combination Sum',
    steps: [
      'LC 78 Subsets OR LC 39 Combination Sum',
      'Use choose → explore → unchoose template from Lesson 4',
    ],
    minutes: 40,
  },
  {
    date: '2026-10-10',
    subject: 'DSA',
    title: 'Tie-breaker drill day',
    steps: [
      'Open tiebreaker-rules.html',
      'Pick 2 NeetCode mediums you failed before — only do Pattern Radar + disqualifier (no full code if time)',
      'Or full-solve one medium with verbal tie-break',
    ],
    open: 'D2DLearnings/dsa/reference/tiebreaker-rules.html',
    minutes: 40,
  },
  {
    date: '2026-10-11',
    subject: 'HLD',
    title: 'URL Shortener dry-run (25 min)',
    steps: [
      'Timer 25: requirements → API → data → hash vs counter → scale sketch',
      'Record yourself or speak aloud',
    ],
    minutes: 30,
  },
  {
    date: '2026-10-12',
    subject: 'DSA',
    title: 'Graphs — Course Schedule / Clone Graph',
    steps: [
      'LC 207 Course Schedule OR LC 133 Clone Graph',
      'Name BFS vs DFS reason before coding',
    ],
    minutes: 40,
  },
  {
    date: '2026-10-13',
    subject: 'LLD',
    title: 'Timed LLD — Library',
    steps: [
      'Timer 30 — Library management OOD',
      'Focus: scope cuts + one pattern (Factory/Strategy/Singleton sparingly)',
    ],
    minutes: 35,
  },
  {
    date: '2026-10-14',
    subject: 'Content',
    title: 'Weekend content block',
    steps: ['Automation review + Tharun/editing if active', 'Hard stop 90 min'],
    minutes: 75,
  },
  {
    date: '2026-10-15',
    subject: 'Flex',
    title: 'Rest / tour',
    steps: ['Log Rest.'],
    minutes: 0,
  },

  // ——— Home week 3 (Oct 16–22) ———
  {
    date: '2026-10-16',
    subject: 'DSA',
    title: 'Sliding window / two pointers medium (fluency)',
    steps: [
      'LC 3 Longest Substring Without Repeating OR LC 424',
      'Not learning — speed + clean code',
    ],
    minutes: 40,
  },
  {
    date: '2026-10-17',
    subject: 'DSA',
    title: 'Binary search on answer',
    steps: [
      'LC 875 Koko Eating Bananas OR LC 410 Split Array',
      'State the monotonic predicate before code',
    ],
    minutes: 45,
  },
  {
    date: '2026-10-18',
    subject: 'HLD',
    title: 'Trade-off theater — CAP & consistency',
    steps: [
      'Pick: feed timeline vs payments vs URL redirect',
      'Say aloud: consistency need + failure mode + what you sacrifice',
    ],
    minutes: 30,
  },
  {
    date: '2026-10-19',
    subject: 'DSA',
    title: 'Trees medium cold',
    steps: [
      'LC 236 LCA OR LC 124 Binary Tree Max Path Sum',
      'Pattern Radar mandatory',
    ],
    minutes: 40,
  },
  {
    date: '2026-10-20',
    subject: 'HLD',
    title: 'Twitter / news feed dry-run',
    steps: [
      'Timer 35: fanout, cache, celebrity problem',
      'End with “what I’d deepen if I had 10 more min”',
    ],
    minutes: 35,
  },
  {
    date: '2026-10-21',
    subject: 'Content',
    title: 'Weekend content block',
    steps: ['Review bots + one content improvement', 'Optional 1 DSA review'],
    minutes: 75,
  },
  {
    date: '2026-10-22',
    subject: 'Flex',
    title: 'Rest / tour',
    steps: ['Log Rest.'],
    minutes: 0,
  },

  // ——— Home week 4 (Oct 23–29) ———
  {
    date: '2026-10-23',
    subject: 'DSA',
    title: 'Heap + graph combo',
    steps: [
      'LC 787 Cheapest Flights Within K Stops OR revisit 743',
      'Explain heap choice in 2 sentences after',
    ],
    minutes: 45,
  },
  {
    date: '2026-10-24',
    subject: 'DSA',
    title: 'Union-Find spaced repeat',
    steps: [
      'LC 547 Number of Provinces OR LC 721 Accounts Merge',
      'No notes open for first 15 min',
    ],
    minutes: 40,
  },
  {
    date: '2026-10-25',
    subject: 'LLD',
    title: 'Timed LLD — Snake & Ladder',
    steps: ['Timer 30', 'Emphasize clean state machine / board model'],
    minutes: 35,
  },
  {
    date: '2026-10-26',
    subject: 'DSA',
    title: 'DP 2D — Unique Paths / Edit Distance lite',
    steps: [
      'LC 62 Unique Paths OR LC 1143 LCS',
      'Table on paper first',
    ],
    minutes: 40,
  },
  {
    date: '2026-10-27',
    subject: 'HLD',
    title: 'YouTube / video dry-run sketch',
    steps: [
      'Timer 30: upload path, CDN, metadata DB, transcoding queue',
      'Name 2 bottlenecks only',
    ],
    minutes: 30,
  },
  {
    date: '2026-10-28',
    subject: 'Content',
    title: 'Weekend content block',
    steps: ['Full review block 60–90 min'],
    minutes: 75,
  },
  {
    date: '2026-10-29',
    subject: 'Flex',
    title: 'Rest / tour',
    steps: ['Log Rest.'],
    minutes: 0,
  },

  // ——— Home week 5 → Diwali (Oct 30 – Nov 8) ———
  {
    date: '2026-10-30',
    subject: 'DSA',
    title: 'Mixed medium mock (interview sim)',
    steps: [
      'Pick a random NeetCode medium you haven’t done in 30 days',
      'Full ritual: Radar → code → complexity',
      '45 min hard cap',
    ],
    minutes: 45,
  },
  {
    date: '2026-10-31',
    subject: 'DSA',
    title: 'Hard lite — or 2 mediums',
    steps: [
      'Option A: one Hard for 45 min',
      'Option B: two Mediums at 20 min each',
    ],
    minutes: 45,
  },
  {
    date: '2026-11-01',
    subject: 'HLD',
    title: 'Uber / location dry-run',
    steps: [
      'Timer 35: matching, ETA, geo index high-level',
      'Skip deep GIS — interview-level only',
    ],
    minutes: 35,
  },
  {
    date: '2026-11-02',
    subject: 'DSA',
    title: 'Weak-topic fix from your notes',
    steps: [
      'Open last 2 weeks of Offer Ladder notes',
      'Re-solve the problem you marked N on Union-Find/Dijkstra',
    ],
    minutes: 40,
  },
  {
    date: '2026-11-03',
    subject: 'LLD',
    title: 'Surprise LLD — interviewer picks vibe',
    steps: [
      'Randomize: Parking / Library / Snake',
      'Timer 25 — faster rotation',
    ],
    minutes: 30,
  },
  {
    date: '2026-11-04',
    subject: 'Content',
    title: 'Weekend content (light before Diwali)',
    steps: ['60 min review max', 'Protect sleep'],
    minutes: 60,
  },
  {
    date: '2026-11-05',
    subject: 'Flex',
    title: 'Pre-Diwali buffer',
    steps: ['Rest or light walk', 'Optional: skim resume bullets for apps'],
    minutes: 20,
  },
  {
    date: '2026-11-06',
    subject: 'Flex',
    title: 'Dhanteras / family — rest OK',
    steps: ['Log Rest if celebrating', 'No study guilt'],
    minutes: 0,
  },
  {
    date: '2026-11-07',
    subject: 'Flex',
    title: 'Choti Diwali — rest OK',
    steps: ['Log Rest'],
    minutes: 0,
  },
  {
    date: '2026-11-08',
    subject: 'Flex',
    title: 'Diwali — rest',
    steps: ['Celebrate. Streak safe.'],
    minutes: 0,
  },

  // ——— Apply open (first 2 weeks) ———
  {
    date: '2026-11-09',
    subject: 'HLD',
    title: 'Resume + story bank (not new HLD theory)',
    steps: [
      'Write 5 STAR bullets: Temporal, ingestion, observability, FastAPI, scale',
      'One system you can draw in 10 min',
    ],
    minutes: 40,
  },
  {
    date: '2026-11-10',
    subject: 'DSA',
    title: 'DSA + first application prep',
    steps: [
      '1 medium cold solve (30 min)',
      'Polish LinkedIn + resume PDF (15 min)',
    ],
    minutes: 45,
  },
  {
    date: '2026-11-11',
    subject: 'LLD',
    title: 'LLD rotation + company shortlist',
    steps: [
      '20 min LLD timer',
      'List 15 target companies (Meta/Google/Apple/Uber/MS/Adobe/Atlassian/PhonePe/CRED…)',
    ],
    minutes: 40,
  },
  {
    date: '2026-11-12',
    subject: 'DSA',
    title: 'Medium cold + apply checklist',
    steps: [
      '1 medium',
      'Prepare referral+cold message templates',
    ],
    minutes: 40,
  },
  {
    date: '2026-11-13',
    subject: 'HLD',
    title: 'Full URL Shortener 45-min mock',
    steps: ['Record or notebook full sprint', 'Self-score phases'],
    minutes: 45,
  },
  {
    date: '2026-11-14',
    subject: 'Content',
    title: 'Weekend content',
    steps: ['Normal weekend block'],
    minutes: 75,
  },
  {
    date: '2026-11-15',
    subject: 'Flex',
    title: 'APPLY DAY — first cold applications',
    steps: [
      'Send 3–5 quality applications (not 20 spam)',
      'Log +1 in Offer Ladder apps counter per send',
      '100xDevs unlocks after first logged app',
      'Optional: 1 easy DSA if energy',
    ],
    minutes: 60,
  },
]

const byDate = new Map(CURRICULUM.map((c) => [c.date, c]))

export function assignmentFor(dateKey: string): StudyAssignment | undefined {
  return byDate.get(dateKey)
}

export function upcomingAssignments(
  fromDateKey: string,
  count: number,
): StudyAssignment[] {
  const start = fromDateKey
  return CURRICULUM.filter((c) => c.date >= start).slice(0, count)
}
