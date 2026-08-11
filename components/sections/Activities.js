"use client";

import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";

const activities = [
  {
    title: "Soccer",
    body: "Weekly pickup games — the one place a race condition is somebody else's problem.",
    icon: "soccer",
  },
  {
    title: "Chess",
    body: "Openings, endgames, and the occasional blunder. Same pattern-matching brain as debugging, slower clock.",
    icon: "chess",
  },
  {
    title: "Golf",
    body: "Chasing consistency on the range — a good swing, like good code, is mostly about repeatable form.",
    icon: "golf",
  },
  {
    title: "Video Games",
    body: "From competitive shooters to open-world sandboxes — as much a study of interaction design as it is downtime.",
    icon: "controller",
  },
];

const ICONS = {
  soccer: (props) => (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M24 14l7 5-2.7 8.2h-8.6L17 19l7-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M24 14V8M17 19l-5.5-1.8M31 19l5.5-1.8M19.3 27.2 15 33M28.7 27.2 33 33"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  chess: (props) => (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M20 10c0 2 1.5 2.6 1.5 4.5 0 1.3-.9 2-.9 2l8 3.5s-2.1 1.3-2.1 3.3c0 1.4 1 2.2 1 2.2l-6.5 3-6.5-3s1-.8 1-2.2c0-2-2.1-3.3-2.1-3.3l6-2.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M15 38l1.5-9.5h15L33 38"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 38h24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 33h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  golf: (props) => (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M14 40h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17 40V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M17 9l14 5.5L17 20V9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="33" cy="35" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 35c2-1.5 5-1.5 7 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  controller: (props) => (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M13 16h22a7 7 0 0 1 6.9 8.1l-1.6 10a5 5 0 0 1-8.6 2.6L28 32.5a5.7 5.7 0 0 0-4-1.7 5.7 5.7 0 0 0-4 1.7L16.3 36.7a5 5 0 0 1-8.6-2.6l-1.6-10A7 7 0 0 1 13 16Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14 22v7M10.5 25.5h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="34" cy="22" r="1.6" fill="currentColor" />
      <circle cx="29.5" cy="26.5" r="1.6" fill="currentColor" />
    </svg>
  ),
};

export default function Activities() {
  return (
    <section id="activities" className="px-4 md:px-6 py-14 md:py-20">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <Eyebrow className="mb-4">Beyond the code</Eyebrow>
          <h2 className="font-display font-medium tracking-[-0.02em] leading-[1.03] text-4xl md:text-6xl max-w-2xl mb-8">
            What I do when I&apos;m away from the keyboard.
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {activities.map((a, i) => {
            const Icon = ICONS[a.icon];
            return (
              <Reveal
                key={a.title}
                delay={Math.min(i * 0.06, 0.24)}
                className="glass glass-hover rounded-[10px] p-6 md:p-7 flex flex-col items-start"
              >
                <span
                  className="w-12 h-12 md:w-14 md:h-14 rounded-[10px] flex items-center justify-center mb-5 shrink-0"
                  style={{
                    background: "color-mix(in srgb, var(--accent) 14%, transparent)",
                    color: "var(--accent)",
                  }}
                >
                  {Icon && <Icon className="w-7 h-7 md:w-8 md:h-8" />}
                </span>
                <h3 className="font-display font-medium tracking-tight text-lg md:text-xl mb-2">{a.title}</h3>
                <p className="text-dim text-sm leading-relaxed">{a.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
