"use client";

import Image from "next/image";
import { useApp } from "@/context/AppContext";

export default function CustomManufacturingSection() {
  const { openQuoteModalWithItems } = useApp();

  return (
    <section id="manufacturing" className="w-full bg-white py-14 md:py-28 border-y border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Blueprint & Machining Visual Stack */}
          <div className="lg:col-span-6 relative">
            <div className="relative bg-stone-50 rounded-3xl p-6 shadow-sm border border-black/[0.06] overflow-hidden">
              {/* Header Spec Pill */}
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#B68A3A] text-[20px]">architecture</span>
                  <span className="text-[13px] font-semibold text-stone-900">
                    OEM Drawing-To-Part Facility
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#B68A3A] bg-[#FAF5EB] px-3 py-1 rounded-full border border-[#B68A3A]/25">
                  Tirunelveli Plant
                </span>
              </div>

              {/* Image Mosaic */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-200">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqHEED8VN41XAagH96kkwgWv9rABdh7zuGxnNUPnnwgGgTXZPUjlv28Ho8dsSVqrod8v7WuP9-M5w2v04XaKfUtwIndG0pDpKEkrb3Me6r17eeEZ4KqSFpakrvIZTfgL6PWuVr6Sr0aVXeJt_QdhAQLlMuqB92HO-zUUHQNRtdiwBPTJk7US27B35HPalSnitw2izsS3KPjclbhtjkAmWdm76Ppe_O6nqw3Z2fzr72bdfmPbVTt2Jxjg"
                    alt="CAD engineering drafting blueprint with detailed metric dimensions"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-200">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzZa8wdrIAFl510v6wkqKiu1E4897ovjCcc5rl0K4m1JqIkb8q2IRFf6koXJGR14tjLC1hS4nLytYGaqfGv5CZN3Gp2Y6nVXt0CDqIWisxVdZMQZ_GebQsHpK81fwLCZ79EymxlV_J2S4Wo1aNGJdGQ9-vfPYOX0OOZOXU7XtRqaTxyaadAue7YMa91AfTPFcEx_nugCGbqdJWcImwLioizaGLSFmybZkIKA3WK2ZleH6WQgqQg-rZRw"
                    alt="Macro close-up photo of CNC turned high tensile alloy foundation bolt"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Data Box Overlap */}
              <div className="mt-4 p-4 bg-[#0F1E36] text-white rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#D6B46A]">
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  </div>
                  <div>
                    <span className="text-[13px] font-semibold block text-white">
                      CAD &amp; STEP Model Ingestion
                    </span>
                    <span className="text-[11.5px] text-stone-300">
                      Native support for SolidWorks, AutoCAD &amp; STEP
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-[#D6B46A] font-medium bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  48h Feasibility
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Description & Capabilities Checklist */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF5EB] border border-[#B68A3A]/25">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B68A3A]"></span>
              <span className="text-[11px] text-[#8C6514] font-semibold tracking-wide">
                Bespoke Industrial Fabrication
              </span>
            </div>

            <h2 className="text-[34px] md:text-[44px] text-[#0F1E36] font-semibold tracking-tight leading-tight">
              Built Around Your Specifications
            </h2>

            <p className="text-[16px] text-stone-600 leading-relaxed font-normal">
              When standard catalogues fall short of critical project tolerances, FOIF deploys high-precision CNC turning, automated thread rolling, and forging capabilities. We manufacture from customer blueprints, CAD models, or reverse-engineered sample specimens from M3 up to M100+ diameters.
            </p>

            <p className="text-[14px] text-stone-500 leading-relaxed font-normal">
              Specialized in high-integrity alloys including Monel 400, Inconel 625/718, Hastelloy, Super Duplex 2507, Phosphor Bronze, and customized High Tensile core materials.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-stone-50 border border-black/[0.04]">
                <span className="material-symbols-outlined text-[18px] text-[#B68A3A]">check_circle</span>
                <span className="text-[13px] font-medium text-stone-800">±0.01mm Precision Tolerance</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-stone-50 border border-black/[0.04]">
                <span className="material-symbols-outlined text-[18px] text-[#B68A3A]">check_circle</span>
                <span className="text-[13px] font-medium text-stone-800">EN 10204 3.1 Traceable Heat</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-stone-50 border border-black/[0.04]">
                <span className="material-symbols-outlined text-[18px] text-[#B68A3A]">check_circle</span>
                <span className="text-[13px] font-medium text-stone-800">Batch Heat Treating (HRC)</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-stone-50 border border-black/[0.04]">
                <span className="material-symbols-outlined text-[18px] text-[#B68A3A]">check_circle</span>
                <span className="text-[13px] font-medium text-stone-800">100% Optical Go/No-Go Gauges</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => openQuoteModalWithItems()}
                className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-[#0F1E36] text-white hover:bg-[#182C4D] text-[14px] font-medium transition-all shadow-sm active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[17px] text-[#D6B46A]">upload_file</span>
                <span>Submit Technical Drawing / CAD</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
