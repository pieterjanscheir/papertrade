/**
 * Hackathon info page content. Organisers: edit this file. Everything on /hackathon
 * comes from here, so you never need to touch the page layout.
 */

export const EVENT = {
  name: "Papertrade Hackathon",
  tagline: "Two days to turn what traders told you into something they want to use.",
  /** Replace the placeholders below with your real details. */
  dates: "Day 1 & Day 2 (dates to be announced)",
  location: "Location to be announced",
  contact: "Ask any organiser, or the #help channel",
  repo: "https://github.com/pieterjanscheir/papertrade",
};

export interface Slot {
  time: string;
  title: string;
  detail?: string;
  /** Highlights a slot with traders in the room. */
  traders?: boolean;
}

export const SCHEDULE: { day: string; theme: string; slots: Slot[] }[] = [
  {
    day: "Day 1",
    theme: "Understand, then build the core",
    slots: [
      { time: "09:00", title: "Welcome & coffee", detail: "Teams sit together, laptops open, repo running." },
      { time: "09:30", title: "Design-thinking workshop with traders", detail: "Interviews, pain points, “How might we…” questions.", traders: true },
      { time: "12:00", title: "Lunch" },
      { time: "13:00", title: "Pick one problem", detail: "Each team writes its problem statement and one trader quote." },
      { time: "13:30", title: "Build", detail: "Aim for one end-to-end flow by the end of the day, rough is fine." },
      { time: "16:30", title: "First user test (15 min per team)", detail: "Use /testing: 2–3 tasks, one trader, think aloud.", traders: true },
      { time: "17:30", title: "Stand-up & wrap", detail: "Each team: what we learned, what we change tomorrow." },
    ],
  },
  {
    day: "Day 2",
    theme: "Test, improve, tell the story",
    slots: [
      { time: "09:00", title: "Build on yesterday's findings" },
      { time: "11:00", title: "Second user test round", detail: "Same tasks as yesterday if you can, so you can compare.", traders: true },
      { time: "12:00", title: "Lunch" },
      { time: "13:00", title: "Polish & prepare the demo", detail: "Script it with demo controls (⇧D). Rehearse from “Back to live”." },
      { time: "15:00", title: "Code freeze" },
      { time: "15:15", title: "Pitches: 5 minutes + 3 minutes questions", traders: true },
      { time: "17:00", title: "Jury deliberation, awards & drinks" },
    ],
  },
];

export const CRITERIA: { name: string; weight: number; question: string; strong: string }[] = [
  {
    name: "Problem fit",
    weight: 30,
    question: "Does it solve a real problem that came out of the workshop?",
    strong: "Opens with a trader's quote and a clear problem statement; the solution addresses exactly that.",
  },
  {
    name: "Evidence",
    weight: 25,
    question: "Did they test it with traders, and did it change anything?",
    strong: "Shows task results or feedback from /testing, and one thing they changed because of it.",
  },
  {
    name: "Experience",
    weight: 20,
    question: "Is it easy and pleasant to use?",
    strong: "Feels like part of the app (uses the design system), no explanation needed to use it.",
  },
  {
    name: "Demo & story",
    weight: 15,
    question: "Is the pitch clear and does the demo work?",
    strong: "A scripted demo (e.g. a crash via demo controls) that makes the value obvious in under a minute.",
  },
  {
    name: "Craft",
    weight: 10,
    question: "Is it built well enough to take further?",
    strong: "Typecheck, lint and tests pass; the feature lives in its own folder.",
  },
];

export const PITCH: { minute: string; title: string; detail: string }[] = [
  { minute: "0:00", title: "The trader", detail: "Who they are and what they told you. Use a real quote." },
  { minute: "0:45", title: "The problem", detail: "One sentence. Show it happening in the app, if you can." },
  { minute: "1:30", title: "The demo", detail: "Your solution, live. Trigger a scenario so the moment matters." },
  { minute: "3:30", title: "The evidence", detail: "What testing showed, and what you changed because of it." },
  { minute: "4:30", title: "What's next", detail: "What you'd build with another week, and what you'd test." },
];

export const RULES = [
  "Play money and simulated prices only. No real brokers, payments or personal data.",
  "Build on the base repo. Put your work in its own folder under src/features where you can.",
  "Prices are a formula of time, so the future can be computed. Don't use that to win anything ;-)",
  "AI coding tools are welcome. Read AGENTS.md together with your tool of choice.",
  "Jokes in news or content: about situations, never about real people or groups.",
  "Be kind to the traders: they're giving you their time. Thank them, and listen more than you talk.",
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Do I need to know how to code?",
    a: "No. Teams are mixed. Designers and traders shape the problem, the flows and the tests; AI coding tools help everyone build. The /design page shows the building blocks.",
  },
  {
    q: "Can we use real market data?",
    a: "The README explains how, but check the data provider's terms first. For a two-day prototype, simulated prices are usually the better choice: they're free and the same for everyone, and you can trigger scenarios on demand.",
  },
  {
    q: "How do we show our feature reacting to a crash?",
    a: "Open the demo controls with Shift + D, pick a scenario (Crash, Flash dip, Crypto winter…) and the market reacts instantly. Use “Back to live” to reset.",
  },
  {
    q: "Where do we put our code?",
    a: "In src/features/<your-feature>, registered in src/features/index.ts. HACKATHON.md in the repo has step-by-step recipes.",
  },
  {
    q: "We broke something. Help?",
    a: "Run npm run typecheck: it usually points at the exact line. Otherwise git stash, or ask a mentor.",
  },
];
