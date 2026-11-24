"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarDays, ClipboardList, Code2, GraduationCap, MapPin, MessageCircle, Palette, Users, Zap } from "lucide-react";
import { Coin3D, Tilt } from "@/components/tilt";
import { Card, SectionTitle } from "@/components/ui";
import { useDemoStore } from "@/lib/demo/store";
import { CRITERIA, EVENT, FAQ, PITCH, RULES, SCHEDULE } from "./content";

export function HackathonScreen() {
  const openDemo = useDemoStore((s) => s.setPanelOpen);

  return (
    <div className="flex flex-col gap-12">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-6 md:p-10">
        <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-accent">Event info</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-5xl">{EVENT.name}</h1>
            <p className="mt-3 text-lg text-muted">{EVENT.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <span className="flex items-center gap-2">
                <CalendarDays size={16} className="text-accent" /> {EVENT.dates}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-accent" /> {EVENT.location}
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle size={16} className="text-accent" /> {EVENT.contact}
              </span>
            </div>
          </div>
          <div className="hidden md:block">
            <Coin3D size={120} label="€" />
          </div>
        </div>
      </header>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { icon: Code2, title: "The repo", body: "Clone it, run npm install && npm run dev", href: EVENT.repo, external: true },
          { icon: BookOpen, title: "Build guide", body: "Recipes in HACKATHON.md", href: `${EVENT.repo}/blob/master/HACKATHON.md`, external: true },
          { icon: Palette, title: "Design system", body: "Colours, components, principles", href: "/design" },
          { icon: ClipboardList, title: "User testing", body: "Tasks, feedback, export", href: "/testing" },
        ].map((l) => (
          <Tilt key={l.title} max={8}>
            <Link
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="flex h-full flex-col gap-2 rounded-[var(--radius-card)] border border-line bg-surface p-4"
            >
              <span className="flex items-center justify-between">
                <l.icon size={20} className="text-accent" />
                {l.external && <ArrowUpRight size={15} className="text-muted" />}
              </span>
              <span className="font-semibold">{l.title}</span>
              <span className="text-sm text-muted">{l.body}</span>
            </Link>
          </Tilt>
        ))}
      </div>

      {/* Schedule */}
      <section>
        <SectionTitle>Schedule</SectionTitle>
        <div className="grid gap-4 lg:grid-cols-2">
          {SCHEDULE.map((d) => (
            <Card key={d.day} className="p-5">
              <p className="text-xs font-semibold tracking-wide text-accent uppercase">{d.day}</p>
              <p className="mb-4 text-lg font-semibold">{d.theme}</p>
              <ol className="relative space-y-4 border-l border-line pl-5">
                {d.slots.map((s) => (
                  <li key={s.time + s.title} className="relative">
                    <span className={`absolute top-1.5 -left-[25px] size-2.5 rounded-full ${s.traders ? "bg-accent" : "bg-line"}`} />
                    <p className="flex flex-wrap items-baseline gap-x-2">
                      <span className="tabular text-sm text-muted">{s.time}</span>
                      <span className="font-semibold">{s.title}</span>
                      {s.traders && (
                        <span className="flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">
                          <Users size={11} /> traders
                        </span>
                      )}
                    </p>
                    {s.detail && <p className="text-sm text-muted">{s.detail}</p>}
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </section>

      {/* Judging */}
      <section>
        <SectionTitle>How projects are judged</SectionTitle>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {CRITERIA.map((c) => (
            <Card key={c.name} className="flex flex-col p-5">
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <p className="font-semibold">{c.name}</p>
                <p className="tabular text-2xl font-semibold text-accent">{c.weight}%</p>
              </div>
              <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-accent" style={{ width: `${c.weight * 3}%` }} />
              </div>
              <p className="text-sm">{c.question}</p>
              <p className="mt-2 text-xs text-muted">Strong: {c.strong}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pitch */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <SectionTitle>Your 5-minute pitch</SectionTitle>
          <Card className="divide-y divide-line">
            {PITCH.map((p, i) => (
              <div key={p.minute} className="flex gap-4 px-5 py-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-sm font-semibold text-accent">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-baseline gap-2">
                    <span className="font-semibold">{p.title}</span>
                    <span className="tabular text-xs text-muted">from {p.minute}</span>
                  </p>
                  <p className="text-sm text-muted">{p.detail}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>
        <div>
          <SectionTitle>Demo tips</SectionTitle>
          <Card className="space-y-3 p-5 text-sm">
            <p>
              Open the demo controls with <kbd className="rounded bg-surface-2 px-1.5">⇧D</kbd> to pause the market, jump ahead or trigger a crash at
              exactly the right moment.
            </p>
            <p>Load a preset account (Account → Load a different account) that fits your story, e.g. the Panic Seller for a risk feature.</p>
            <p>Rehearse twice from “Back to live”. Then rehearse once more.</p>
            <button onClick={() => openDemo(true)} className="flex items-center gap-2 font-semibold text-accent">
              <Zap size={15} /> Open demo controls
            </button>
          </Card>
        </div>
      </section>

      {/* Rules + FAQ */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <SectionTitle>Ground rules</SectionTitle>
          <Card className="space-y-3 p-5">
            {RULES.map((r, i) => (
              <p key={i} className="flex gap-3 text-sm">
                <span className="tabular grid size-6 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-semibold">{i + 1}</span>
                {r}
              </p>
            ))}
          </Card>
        </div>
        <div>
          <SectionTitle>FAQ</SectionTitle>
          <Card className="divide-y divide-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold">
                  {f.q}
                  <span className="text-muted transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm text-muted">{f.a}</p>
              </details>
            ))}
          </Card>
        </div>
      </section>

      <p className="flex items-center gap-2 text-xs text-muted">
        <GraduationCap size={14} /> New to investing? The <Link href="/learn" className="font-semibold text-accent">Learn</Link> tab covers the basics in a few
        minutes.
      </p>
    </div>
  );
}
