"use client";

import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";

const links = [
  { label: "Email", value: "ainemuhammad903@gmail.com", href: "mailto:ainemuhammad903@gmail.com", icon: "mail" },
  { label: "LinkedIn", value: "linkedin.com/in/ain-m", href: "https://www.linkedin.com/in/ain-m/", icon: "linkedin" },
  { label: "GitHub", value: "github.com/ainemuhammad", href: "https://github.com/ainemuhammad", icon: "github" },
  { label: "Portfolio", value: "ainemuhammad.github.io", href: "https://ainemuhammad.github.io/portfolio", icon: "globe" },
];

const ICONS = {
  mail: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  linkedin: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="7.8" cy="8.2" r="1.2" fill="currentColor" />
      <path d="M7.8 11v6.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 17.3v-4a2 2 0 0 1 4 0v4M12 17.3v-6.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  github: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.49 2.87 8.3 6.84 9.65.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.19-1.11-1.5-1.11-1.5-.9-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.2C22 6.58 17.52 2 12 2Z" />
    </svg>
  ),
  globe: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  ),
};

export default function Contact() {
  return (
    <section id="contact" className="px-4 md:px-6 py-14 md:py-20">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <Eyebrow className="mb-3">Contact</Eyebrow>
          <h2 className="font-display font-medium tracking-[-0.02em] leading-[1.03] text-4xl md:text-6xl mb-4 max-w-xl">
            Building something spatial? Let&apos;s talk.
          </h2>
          <p className="text-dim max-w-lg mb-8 leading-relaxed">
            Open to senior and lead roles in 3D systems, generative AI pipelines,
            and full-stack engineering. Albany, NY, open to remote.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
          {links.map((l, i) => {
            const Icon = ICONS[l.icon];
            return (
              <Reveal key={l.label} as="div" delay={i * 0.06}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="glass glass-hover rounded-[10px] p-5 md:p-6 flex items-center gap-4 group"
                >
                  <span
                    className="w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0"
                    style={{ background: "color-mix(in srgb, var(--accent) 10%, var(--surface-2))" }}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium tracking-[0.14em] uppercase text-dim mb-1">
                      {l.label}
                    </p>
                    <p className="text-base md:text-lg break-all">{l.value}</p>
                  </div>
                  <span
                    className="text-lg opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0"
                    style={{ color: "var(--accent)" }}
                  >
                    →
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>

        <p className="text-dim text-xs mt-8">
          © {new Date().getFullYear()} Ain e Muhammad. All rights reserved.
        </p>
      </div>
    </section>
  );
}
