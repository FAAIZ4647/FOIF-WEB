import { capabilities } from "@/data/capabilities";

export default function TrustStrip() {
  return (
    <section className="w-full bg-white border-y border-black/[0.05] py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {capabilities.map((cap) => (
            <div
              key={cap.number}
              className="flex flex-col p-5 rounded-2xl bg-stone-50/70 hover:bg-white hover:shadow-sm border border-black/[0.04] transition-all duration-200"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#B68A3A] shadow-2xs border border-black/[0.04]">
                  <span className="material-symbols-outlined text-[18px]">{cap.icon}</span>
                </div>
                <span className="text-[11px] font-medium text-stone-500">
                  Step 0{cap.number}
                </span>
              </div>
              <h3 className="text-[15px] font-semibold text-[#0F1E36] leading-snug">
                {cap.title}
              </h3>
              <p className="text-[12.5px] text-stone-500 mt-1.5 leading-relaxed font-normal">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
