"use client";

import { useEffect, useState } from "react";
import { Check, CheckCircle2, ExternalLink, GraduationCap, Play } from "lucide-react";
import { Sheet } from "@/components/sheet";
import { Coin3D, Tilt } from "@/components/tilt";
import { Button, Card } from "@/components/ui";
import { ALL_LESSONS, COURSES, type Lesson } from "./lessons";
import { useLearnProgress } from "./progress";

const DISCLAIMER =
  "For comedy and education. The “videos” are jokes (there is no video); the notes underneath are real, simplified basics. Not financial advice. Netflix and King of Stonks belong to their owners; we only link to it.";

function Thumbnail({ lesson, done, size = "md" }: { lesson: Lesson; done: boolean; size?: "md" | "lg" }) {
  return (
    <div
      className={`relative grid aspect-video w-full place-items-center overflow-hidden rounded-xl ${size === "lg" ? "rounded-2xl" : ""}`}
      style={{
        background: `radial-gradient(120% 120% at 20% 10%, hsl(${lesson.hue} 55% 32%), hsl(${lesson.hue + 40} 45% 12%) 70%)`,
      }}
    >
      <span className={size === "lg" ? "text-7xl" : "text-5xl"} aria-hidden>
        {lesson.glyph}
      </span>
      <span className="tabular absolute right-2 bottom-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white">{lesson.duration}</span>
      {done && (
        <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-gain px-2 py-0.5 text-[11px] font-semibold text-black">
          <Check size={12} strokeWidth={3} /> Done
        </span>
      )}
    </div>
  );
}

export function LearnScreen() {
  const { done } = useLearnProgress();
  const [open, setOpen] = useState<Lesson | null>(null);
  const total = ALL_LESSONS.filter((l) => !l.netflix).length;
  const finished = ALL_LESSONS.filter((l) => !l.netflix && done.includes(l.id)).length;
  const next = ALL_LESSONS.find((l) => !l.netflix && !done.includes(l.id));

  // Deep links like /learn#options scroll to that course.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3">
            <Coin3D size={56} label="€" />
          </div>
          <p className="flex items-center gap-2 text-sm font-semibold text-accent">
            <GraduationCap size={16} /> Papertrade Academy
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight lg:text-4xl">Learn</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Short lessons on investing basics, orders and options. Every lesson has a “video”. None of the videos work. The notes do.
          </p>
        </div>
        <Card className="flex items-center gap-4 p-4 lg:w-96">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">Your progress</p>
            <p className="tabular font-semibold">
              {finished} of {total} lessons
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-accent" style={{ width: `${(finished / total) * 100}%` }} />
            </div>
          </div>
          {next && (
            <Button className="shrink-0 px-4 py-2" onClick={() => setOpen(next)}>
              <Play size={14} /> {finished ? "Continue" : "Start"}
            </Button>
          )}
        </Card>
      </header>

      {COURSES.map((course) => (
        <section key={course.id} id={course.id} className="scroll-mt-20">
          <h2 className="text-xl font-semibold">{course.title}</h2>
          <p className="mb-4 text-sm text-muted">{course.subtitle}</p>
          <div className="scrollbar-none -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:px-0 xl:grid-cols-4">
            {course.lessons.map((l) => (
              <button key={l.id} onClick={() => setOpen(l)} className="group w-64 shrink-0 snap-start text-left md:w-auto">
                <Tilt max={8} className="rounded-xl">
                  <Thumbnail lesson={l} done={done.includes(l.id)} />
                </Tilt>
                <p className="mt-2 font-semibold leading-snug group-hover:text-accent">{l.title}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {l.level} · {l.summary}
                </p>
              </button>
            ))}
          </div>
        </section>
      ))}

      <p className="text-xs text-muted">{DISCLAIMER}</p>

      <Sheet open={open !== null} onClose={() => setOpen(null)} title={open?.title} wide>
        {open && <LessonView key={open.id} lesson={open} onNext={(l) => setOpen(l)} />}
      </Sheet>
    </div>
  );
}

function LessonView({ lesson, onNext }: { lesson: Lesson; onNext: (l: Lesson) => void }) {
  const { done, quiz, markDone, answer } = useLearnProgress();
  const [state, setState] = useState<"idle" | "loading" | "played">("idle");
  const [progress, setProgress] = useState(0);
  const chosen = quiz[lesson.id];

  useEffect(() => {
    if (state !== "loading") return;
    const started = Date.now();
    const timer = setInterval(() => {
      const p = Math.min(1, (Date.now() - started) / 1800);
      setProgress(p);
      if (p >= 1) {
        clearInterval(timer);
        setState("played");
      }
    }, 50);
    return () => clearInterval(timer);
  }, [state]);

  const index = ALL_LESSONS.findIndex((l) => l.id === lesson.id);
  const next = ALL_LESSONS.slice(index + 1).find((l) => !l.netflix);

  return (
    <div className="flex flex-col gap-5">
      {/* The "video" */}
      <div className="relative">
        <Thumbnail lesson={lesson} done={false} size="lg" />
        {state === "idle" && (
          <button onClick={() => setState("loading")} className="absolute inset-0 grid place-items-center" aria-label="Play">
            <span className="grid size-16 place-items-center rounded-full bg-white/90 text-black shadow-xl transition hover:scale-105">
              <Play size={28} fill="currentColor" />
            </span>
          </button>
        )}
        {state === "loading" && (
          <div className="absolute inset-x-0 bottom-0 grid h-full place-items-center rounded-2xl bg-black/40">
            <p className="text-sm font-semibold text-white">Buffering… {Math.round(progress * 100)}%</p>
            <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden rounded-b-2xl bg-white/20">
              <div className="h-full bg-accent" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        )}
        {state === "played" && (
          <div className="absolute inset-0 grid place-items-center rounded-2xl bg-black/75 p-6 text-center">
            {lesson.netflix ? (
              <div className="flex flex-col items-center gap-3">
                <p className="max-w-md text-sm leading-relaxed text-white">{lesson.netflix.blurb}</p>
                <a
                  href={lesson.netflix.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
                >
                  Find {lesson.netflix.title} on Netflix <ExternalLink size={14} />
                </a>
              </div>
            ) : (
              <p className="max-w-md text-sm leading-relaxed text-white">{lesson.gag}</p>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-muted">
        {lesson.level} · {lesson.duration} · {lesson.summary}
      </p>

      {/* The real lesson */}
      <div className="space-y-3 text-[15px] leading-relaxed">
        {lesson.notes.map((n, i) => (
          <p key={i}>{n}</p>
        ))}
      </div>

      <div className="rounded-2xl bg-surface-2 p-4">
        <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">Key points</p>
        <ul className="space-y-1.5 text-sm">
          {lesson.keyPoints.map((k) => (
            <li key={k} className="flex gap-2">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" /> {k}
            </li>
          ))}
        </ul>
      </div>

      {lesson.quiz && (
        <div className="rounded-2xl border border-line p-4">
          <p className="mb-3 font-semibold">{lesson.quiz.question}</p>
          <div className="flex flex-col gap-2">
            {lesson.quiz.options.map((o, i) => {
              const picked = chosen === i;
              const correct = i === lesson.quiz!.answer;
              const reveal = chosen !== undefined;
              return (
                <button
                  key={o}
                  onClick={() => answer(lesson.id, i)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                    reveal && correct ? "border-gain bg-gain/10" : reveal && picked ? "border-loss bg-loss/10" : "border-line hover:bg-surface-2"
                  }`}
                >
                  {o}
                </button>
              );
            })}
          </div>
          {chosen !== undefined && (
            <p className={`mt-3 text-sm ${chosen === lesson.quiz.answer ? "text-gain" : "text-loss"}`}>
              {chosen === lesson.quiz.answer ? "Correct. " : "Not quite. "}
              <span className="text-muted">{lesson.quiz.explain}</span>
            </p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant={done.includes(lesson.id) ? "secondary" : "primary"} className="flex-1" onClick={() => markDone(lesson.id)}>
          {done.includes(lesson.id) ? (
            <>
              <Check size={16} /> Done
            </>
          ) : (
            "Mark as done"
          )}
        </Button>
        {next && (
          <Button variant="secondary" className="flex-1" onClick={() => (markDone(lesson.id), onNext(next))}>
            Next: {next.title.length > 22 ? next.title.slice(0, 22) + "…" : next.title}
          </Button>
        )}
      </div>
      <p className="text-[11px] text-muted">{DISCLAIMER}</p>
    </div>
  );
}
