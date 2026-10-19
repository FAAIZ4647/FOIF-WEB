"use client";

import FastenerCanvas from "@/components/three/FastenerCanvas";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function HeroSection() {
  const { openQuoteModalWithItems } = useApp();

  return (
    <section className="relative w-full bg-[#FAF9F5] overflow-hidden page-offset pb-16 md:pb-28">
      {/* Soft ambient lighting gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-white via-transparent to-transparent opacity-80 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Hero Left Column: Editorial & Apple Hierarchy */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-5 sm:space-y-6">
            {/* Credibility Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-black/[0.06] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#B68A3A]"></span>
              <span className="text-[12px] text-stone-700 font-medium tracking-normal">
                ISO 9001:2015 Traceability <span className="text-stone-300 mx-1.5">•</span> Over 5 Years Engineering Expertise
              </span>
            </div>

            {/* Master Headline */}
            <h1 className="text-[34px] sm:text-[48px] lg:text-[62px] text-[#0F1E36] tracking-tight leading-[1.08] font-semibold">
              Engineered for Precision.<br />
              <span className="text-[#B68A3A]">
                Built for Industry.
              </span>
            </h1>

            {/* Body Description */}
            <p className="text-[17px] sm:text-[19px] text-stone-600 max-w-xl leading-relaxed font-normal">
              Your trusted enterprise partner for certified industrial fasteners, custom foundation anchors, and high-tensile sourcing across critical infrastructure.
            </p>

            {/* Metric Pills Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="px-3.5 py-1.5 rounded-full bg-white border border-black/[0.06] text-[12px] font-medium text-stone-700 shadow-2xs">
                DIN / ISO / ASTM Standards
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white border border-black/[0.06] text-[12px] font-medium text-stone-700 shadow-2xs">
                EN 10204 3.1 MTR Traceable
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-[#FAF5EB] border border-[#B68A3A]/30 text-[12px] font-semibold text-[#8C6514] shadow-2xs">
                Tolerances to ±0.01mm
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Link
                href="/products"
                className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-[#0F1E36] text-white hover:bg-[#182C4D] text-[15px] font-medium shadow-sm hover:shadow-md transition-all active:scale-[0.98] group w-full sm:w-auto"
              >
                <span>Explore 28 Products</span>
                <span className="material-symbols-outlined text-[18px] ml-1.5 group-hover:translate-x-1 transition-transform text-[#D6B46A]">
                  arrow_forward
                </span>
              </Link>
              <button
                type="button"
                onClick={() => openQuoteModalWithItems()}
                className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-white text-[#0F1E36] border border-black/[0.1] hover:bg-stone-50 text-[15px] font-medium shadow-2xs hover:shadow-sm transition-all active:scale-[0.98] w-full sm:w-auto"
              >
                <span className="material-symbols-outlined text-[18px] mr-2 text-[#B68A3A]">
                  request_quote
                </span>
                <span>Request a Quote</span>
              </button>
            </div>

            {/* Subtext link */}
            <div className="pt-1">
              <a
                href="#manufacturing"
                className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-500 hover:text-[#0F1E36] transition-colors"
              >
                <span>Discuss bespoke drawing-to-part fabrication</span>
                <span className="material-symbols-outlined text-[15px] group-hover:translate-x-1 transition-transform">
                  trending_flat
                </span>
              </a>
            </div>
          </div>

          {/* Hero Right Column: 3D Fastener Interactive Showcase */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            {/* Apple-style floating showcase canvas */}
            <div className="relative w-full min-h-[320px] h-[420px] sm:h-[500px] lg:h-[560px] bg-white rounded-3xl p-3 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-black/[0.06] flex flex-col justify-between overflow-hidden group">
              {/* Top Spec Header Bar */}
              <div className="relative z-20 flex items-center justify-between px-2 pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B68A3A] animate-pulse"></span>
                  <span className="text-[12px] font-medium text-stone-800">DIN 933 Metric Hex Bolt</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-[11px] font-medium text-stone-600 border border-black/[0.04]">
                  Grade 10.9 HT Alloy
                </span>
              </div>

              {/* 3D Canvas Viewport */}
              <div className="relative w-full flex-1 my-2 rounded-2xl overflow-hidden bg-gradient-to-b from-stone-50/50 to-white flex items-center justify-center z-10 cursor-grab active:cursor-grabbing">
                <FastenerCanvas />
              </div>

              {/* Bottom Interactive Prompt Bar */}
              <div className="relative z-20 flex items-center justify-between px-2 pt-2 border-t border-black/[0.05] text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-stone-400">3d_rotation</span>
                  <span>Drag to rotate</span>
                </div>
                <span className="text-[#B68A3A] font-medium">Auto-rotate idle</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
