"use client";

import { useState } from "react";
import Image from "next/image";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";

const roles = [
  {
    period: "JUN 2026 - AUG 2026",
    org: "Sony Immersive Music Studio",
    logo: "/Logos/Sony.webp",
    title: "3D Creative Engineering Intern",
    current: true,
    points: [
      "Built an AI pipeline that turns 2D concept art into fully reconstructed, immersive 3D scenes.",
      "Automated camera and object placement so environments assemble themselves with cinematic precision.",
      "Connected Blender and Unreal Engine into one workflow, taking AI-generated assets all the way to finished cinematic renders.",
    ],
  },
  {
    period: "APR 2024 - AUG 2025",
    org: "ALL3D",
    logo: "/Logos/ALL3D.png",
    title: "Lead Software Engineer",
    points: [
      "Led delivery of 3D product configurators for major brands, including Walmart, Rough Country, and Telescope Casual Furniture, cutting delivery cycles by ~20%.",
      "Made those configurators fast, improving render performance and load times even under heavy traffic.",
      "Managed a team of engineers and 3D artists, and raised the bar on code quality across the codebase.",
    ],
  },
  {
    period: "FEB 2023 - APR 2024",
    org: "ALL3D",
    logo: "/Logos/ALL3D.png",
    title: "Senior Software Engineer",
    points: [
      "Built the cloud backend powering the configurators, designed to scale smoothly and stay fast under heavy traffic.",
      "Sped up initial load times by ~35% through smarter frontend asset handling.",
    ],
  },
  {
    period: "MAY 2021 - FEB 2023",
    org: "ALL3D",
    logo: "/Logos/ALL3D.png",
    title: "Software Engineer",
    points: [
      "Built the backend APIs that powered the product as it scaled.",
      "Sped up 3D asset delivery by about 25% through smarter cloud delivery.",
    ],
  },
  {
    period: "JAN 2026 - MAY 2026",
    org: "SUNY Albany",
    title: "Graduate Grader, Discrete Structures",
    points: [
      "Graded assignments and exams, providing feedback on mathematical reasoning and problem-solving.",
      "Supported curriculum delivery through instructor coordination and insight into student challenges.",
    ],
  },
  {
    period: "JUN 2020 - OCT 2020",
    org: "Sanje Solutions",
    title: "Frontend Developer",
    points: [
      "Built responsive interfaces using React, HTML, CSS, and Bootstrap.",
      "Translated design mockups into reusable, production-ready components with cross-browser compatibility.",
      "Improved UI consistency and performance across client-facing applications.",
    ],
  },
  {
    period: "JUN 2019 - OCT 2019",
    org: "NUST",
    title: "Research Engineer, AI Systems & Web Systems",
    points: [
      "Developed web interfaces to visualize model outputs and enable interaction with AI systems.",
      "Worked with academic teams to translate research problems into technical implementations.",
      "Explored integration of machine learning workflows with lightweight web-based systems.",
    ],
  },
];

// Consecutive entries at the same org (the three ALL3D promotions) fold
// into one timeline row - one dot, one combined date range - with the
// individual titles shown as an expandable promotion path inside it,
// rather than repeating the same logo/org name three times down the page.
function groupByOrg(items) {
  const groups = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.org === item.org) {
      last.roles.push(item);
    } else {
      groups.push({ org: item.org, logo: item.logo, roles: [item] });
    }
  }
  return groups;
}

function combinedPeriod(roles) {
  const start = roles[roles.length - 1].period.split(" - ")[0];
  const end = roles[0].period.split(" - ")[1];
  return start === end ? start : `${start} - ${end}`;
}

const groups = groupByOrg(roles);

export default function Experience() {
  // Which role is expanded within each multi-role group, by group index.
  // Defaults to the most recent (index 0) - promotions read top-down, most
  // senior first.
  const [openIndex, setOpenIndex] = useState(() => groups.map(() => 0));

  function toggle(groupIndex, roleIndex) {
    setOpenIndex((prev) =>
      prev.map((open, i) => (i === groupIndex ? (open === roleIndex ? -1 : roleIndex) : open))
    );
  }

  return (
    <section id="experience" className="px-4 md:px-6 py-14 md:py-20">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <Eyebrow className="mb-4">Experience</Eyebrow>
          <h2 className="font-display font-medium tracking-[-0.02em] leading-[1.03] text-4xl md:text-6xl mb-8">
            Where the pipeline was built.
          </h2>
        </Reveal>
      </div>

      <div className="relative max-w-[1400px] mx-auto space-y-5 md:space-y-6">
        {/* Threads through the dot in each row's date column below. Sits
            behind the cards in paint order (rendered first, cards are
            opaque so they naturally occlude the middle of the line) - it
            only shows in the gaps between cards, which is what reads as
            the line "passing through" each dot rather than sitting on top
            of the card content. Positioned at padding-left + half the
            dot's width (w-1.5 = 6px), matching the dot's horizontal
            center at each breakpoint's card padding (p-7/md:p-9) - kept
            identical across the featured and compact rows below so the
            dot never drifts off the line. Update this if that padding
            ever changes. */}
        <div
          className="absolute top-8 bottom-8 left-[31px] md:left-[39px] w-px"
          style={{ background: "var(--line)" }}
          aria-hidden="true"
        />

        {groups.map((group, gi) => {
          const featured = group.roles[0].current === true;
          const period = combinedPeriod(group.roles);

          return (
            <Reveal
              key={group.org}
              delay={Math.min(gi * 0.05, 0.2)}
              className="relative glass glass-hover rounded-[10px] p-7 md:p-9"
            >
              {featured && (
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
                    {featured && (
                      <span
                        className="absolute inset-0 -m-1.5 rounded-[10px] animate-ping"
                        style={{ background: "var(--accent)", opacity: 0.5 }}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  {period}
                </p>

                <div>
                  {featured && (
                    <span
                      className="inline-flex items-center gap-1.5 mb-3 text-xs font-medium tracking-[0.1em] uppercase px-2.5 py-1 rounded-[10px]"
                      style={{ color: "var(--accent)", background: "color-mix(in srgb, var(--accent) 14%, transparent)" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-[10px]" style={{ background: "var(--accent)" }} />
                      Current role
                    </span>
                  )}

                  <div className="flex items-center gap-2.5 mb-3">
                    {group.logo && (
                      <span className="w-9 h-9 rounded-[10px] bg-white flex items-center justify-center shrink-0 p-1.5 shadow-sm ring-1 ring-black/5">
                        <Image
                          src={group.logo}
                          alt={group.org}
                          width={24}
                          height={24}
                          className="w-full h-full object-contain"
                        />
                      </span>
                    )}
                    <p className="text-dim text-sm">{group.org}</p>
                  </div>

                  {group.roles.length === 1 ? (
                    <>
                      <h3
                        className={`font-display font-medium tracking-tight mb-4 ${
                          featured ? "text-3xl md:text-4xl" : "text-2xl md:text-[1.75rem]"
                        }`}
                      >
                        {group.roles[0].title}
                      </h3>
                      <ul className="space-y-2">
                        {group.roles[0].points.map((pt) => (
                          <li key={pt} className="text-dim leading-relaxed pl-4 relative">
                            <span
                              className="absolute left-0 top-[0.6em] w-1.5 h-1.5 rounded-[10px]"
                              style={{ background: "var(--accent)" }}
                            />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <div className="mt-1">
                      {group.roles.map((role, ri) => {
                        const isOpen = openIndex[gi] === ri;
                        return (
                          <div key={role.title} className={ri > 0 ? "pt-2 mt-2 border-t hairline" : ""}>
                            <button
                              type="button"
                              onClick={() => toggle(gi, ri)}
                              aria-expanded={isOpen}
                              className="w-full flex items-center justify-between gap-4 text-left -mx-3 px-3 py-2 rounded-[10px] transition-all duration-300 hover:bg-[color-mix(in_srgb,var(--text)_6%,transparent)] hover:pl-4"
                            >
                              <span>
                                <span className="font-display text-xl md:text-2xl font-medium tracking-tight">
                                  {role.title}
                                </span>
                                <span className="block text-dim text-xs mt-0.5">{role.period}</span>
                              </span>
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className={`w-4 h-4 shrink-0 text-dim transition-transform duration-300 ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                                aria-hidden="true"
                              >
                                <path
                                  d="M6 9l6 6 6-6"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                            <div
                              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                              }`}
                            >
                              <div className="overflow-hidden">
                                <ul className="space-y-2 pt-3">
                                  {role.points.map((pt) => (
                                    <li key={pt} className="text-dim leading-relaxed pl-4 relative">
                                      <span
                                        className="absolute left-0 top-[0.6em] w-1.5 h-1.5 rounded-[10px]"
                                        style={{ background: "var(--accent)" }}
                                      />
                                      {pt}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
