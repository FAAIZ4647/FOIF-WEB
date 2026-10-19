import { qualityKpis, testingLabs } from "@/data/testingLabs";

export default function QualitySection() {
  return (
    <section id="quality" className="w-full bg-white py-14 md:py-28 border-t border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Top Title and Micro-stats Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 pb-12 border-b border-black/[0.06] items-end">
          <div className="lg:col-span-7">
            <span className="text-[12px] font-medium text-[#B68A3A] uppercase tracking-wider block mb-2">
              Quality Assurance &amp; Metallurgy
            </span>
            <h2 className="text-[26px] sm:text-[32px] md:text-[42px] text-[#0F1E36] font-semibold tracking-tight leading-tight">
              Rigorous Verification Behind Every Thread
            </h2>
            <p className="text-[16px] text-stone-600 mt-3 max-w-2xl font-normal leading-relaxed">
              At FOIF, quality assurance isn&apos;t an afterthought. Every fastener undergoes dimensional, mechanical, and surface corrosion testing before dispatch, maintaining EN 10204 3.1 certification protocols.
            </p>
          </div>

          {/* 3 Quantitative Metrics KPI Tiles */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-3 items-center">
            {qualityKpis.map((kpi, idx) => (
              <div
                key={idx}
                className="p-4 rounded-3xl bg-stone-50 border border-black/[0.04] flex flex-col text-center"
              >
                <span
                  className={`text-[28px] md:text-[34px] font-bold tracking-tight leading-none ${
                    kpi.highlight ? "text-[#B68A3A]" : "text-[#0F1E36]"
                  }`}
                >
                  {kpi.value}
                </span>
                <span className="text-[11px] text-stone-900 font-semibold mt-1.5">
                  {kpi.label}
                </span>
                <span className="text-[10px] text-stone-500 font-normal mt-0.5">
                  {kpi.subtext}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Testing Methodology 4-Column Array */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testingLabs.map((lab) => (
            <div
              key={lab.id}
              className="p-6 rounded-3xl bg-stone-50/60 border border-black/[0.05] hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-[#B68A3A] shadow-2xs border border-black/[0.04] mb-4">
                  <span className="material-symbols-outlined text-[22px]">{lab.icon}</span>
                </div>
                <h3 className="text-[17px] font-semibold text-[#0F1E36]">
                  {lab.title}
                </h3>
                <p className="text-[13px] text-stone-500 mt-2 leading-relaxed font-normal">
                  {lab.description}
                </p>
              </div>

              <div className="pt-3 mt-5 border-t border-black/[0.05] flex items-center justify-between text-[11px] font-medium text-[#B68A3A]">
                <span>{lab.standard}</span>
                <span className="material-symbols-outlined text-[16px] text-emerald-600">done_all</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
