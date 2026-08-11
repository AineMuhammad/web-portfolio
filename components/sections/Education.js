"use client";

import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";

const school = [
  {
    period: "EXPECTED MAY 2027",
    org: "State University of New York (SUNY), Albany",
    title: "M.S. Computer Science, Concentration in AI",
    body: "Machine Learning, Computer Vision, Advanced Algorithms and Data Structures.",
    inProgress: true,
  },
  {
    period: "JULY 2021",
    org: "National University of Sciences and Technology (NUST)",
    title: "B.S. Software Engineering",
    body: "Artificial Intelligence, Data Warehousing and Mining, Database Systems, Digital Image Processing, Software Architecture.",
  },
];

export default function Education() {
  return (
    <section id="education" className="px-4 md:px-6 py-14 md:py-20">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <Eyebrow className="mb-4">Education</Eyebrow>
          <h2 className="font-display font-medium tracking-[-0.02em] leading-[1.03] text-4xl md:text-6xl mb-8">
            Formal footing.
          </h2>
        </Reveal>

        <div className="relative space-y-5 md:space-y-6">
          {/* Threads through the dot in each card's date column, same
              technique (and same offset) as the Experience timeline -
              rendered first so the opaque cards below occlude the middle
              of it, only showing through in the gaps between cards.
              Positioned at padding-left + half the dot's width (w-1.5 =
              6px), matching the card padding (p-7/md:p-9) below. */}
          <div
            className="absolute top-8 bottom-8 left-[31px] md:left-[39px] w-px"
            style={{ background: "var(--line)" }}
            aria-hidden="true"
          />

          {school.map((s, i) => (
            <Reveal
              key={s.title}
              delay={i * 0.08}
              className="relative glass glass-hover rounded-[10px] p-7 md:p-9"
            >
              {s.inProgress && (
                <div
                  className="absolute inset-0 rounded-[10px] pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(ellipse 90% 60% at 12% 0%, color-mix(in srgb, var(--accent) 10%, transparent), transparent)",
                  }}
                  aria-hidden="true"
                />
              )}
              <div className="relative grid md:grid-cols-[200px_1fr] gap-3 md:gap-10">
                <p className="relative inline-flex items-center gap-2 text-dim text-sm pt-1 w-fit">
                  <span
                    className="relative w-1.5 h-1.5 rounded-[10px] shrink-0"
                    style={{ background: "var(--accent)" }}
                  >
                    {s.inProgress && (
                      <span
                        className="absolute inset-0 -m-1.5 rounded-[10px] animate-ping"
                        style={{ background: "var(--accent)", opacity: 0.5 }}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  {s.period}
                </p>
                <div>
                  {s.inProgress && (
                    <span
                      className="inline-flex items-center gap-1.5 mb-3 text-xs font-medium tracking-[0.1em] uppercase px-2.5 py-1 rounded-[10px]"
                      style={{ color: "var(--accent)", background: "color-mix(in srgb, var(--accent) 14%, transparent)" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-[10px]" style={{ background: "var(--accent)" }} />
                      In progress
                    </span>
                  )}
                  <h3 className="font-display font-medium text-2xl md:text-[1.75rem] tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-dim text-sm mt-1 mb-2">{s.org}</p>
                  <p className="text-dim leading-relaxed">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
