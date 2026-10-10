import React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface Step {
  num: string;
  title: string;
  tagline: string;
  description: string;
  focus: string[];
  note: string;
}

const stepsData: Step[] = [
  {
    num: "01",
    title: "DISCUSS",
    tagline: "Understand your goals.",
    description:
      "We discuss your business goals, target audience, and website requirements. We clarify what pages you need, how visitors will use the site, and what actions matter most.",
    focus: ["Audience & Goals", "Page Structure", "Brand Asset Review", "Feature Requirements"],
    note: "no assumptions",
  },
  {
    num: "02",
    title: "PLAN",
    tagline: "Agree on scope and pricing.",
    description:
      "We agree on design direction, agreed deliverables, pricing, and realistic timeline. We provide a transparent scope agreement before writing any code.",
    focus: ["Clear Project Scope", "Fixed Cost Estimate", "Agreed Timeline", "Design Direction"],
    note: "crystal clear",
  },
  {
    num: "03",
    title: "BUILD",
    tagline: "Develop and refine.",
    description:
      "We develop the website using clean, modern frontend code and share milestone progress for your review. Revisions are incorporated according to our agreed allowance.",
    focus: ["Responsive Development", "Fast Load Times", "Milestone Previews", "Agreed Revisions"],
    note: "clean code",
  },
  {
    num: "04",
    title: "LAUNCH",
    tagline: "Test, deploy and hand over.",
    description:
      "We test across desktop and mobile screens, assist with domain connection and cloud deployment, and hand over the completed website ready for your visitors.",
    focus: ["Cross-Device Testing", "Domain Connection", "Deployment Assistance", "Full Handover"],
    note: "ready for traffic",
  },
];

export function Process() {
  return (
    <section id="process" className="relative py-16 sm:py-24 lg:py-32 bg-[#050505] border-t border-[#303030] overflow-hidden text-white">
      <div className="relative w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#303030]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-[0.2em]">
                {"// HOW WE WORK"}
              </span>
              <span className="text-[#303030]">•</span>
              <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider">
                FOUR-STEP PROCESS
              </span>
            </div>

            <div className="relative inline-block">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight uppercase text-white font-display">
                HOW IT WORKS
              </h2>
              <div className="mt-2 h-0.5 w-24 bg-white" />
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-[#111111] border border-[#303030] text-xs font-mono text-white">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>From first chat to live website</span>
          </div>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
          {stepsData.map((step) => (
            <div
              key={step.num}
              className="relative bg-[#111111] border border-[#303030] hover:border-white p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1.5 rounded-none shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-3xl font-extrabold text-[#303030] group-hover:text-white transition-colors">
                    {step.num}
                  </span>

                  <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-none bg-[#050505] border border-[#303030] text-[#A3A3A3]">
                    {step.note}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-2 font-display">
                  {step.title}
                </h3>

                <p className="text-xs font-mono text-[#A3A3A3] mb-3">
                  {step.tagline}
                </p>

                <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#303030]">
                <ul className="space-y-2">
                  {step.focus.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-[11px] font-mono text-[#A3A3A3] flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Note */}
        <div className="mt-12 p-5 bg-[#111111] rounded-none border border-[#303030] text-xs text-[#A3A3A3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">TIMELINES &amp; REVISIONS:</span>
            <span>Delivery timelines typically range from 7 to 14 business days depending on agreed scope, page count, and asset readiness.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
