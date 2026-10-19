import Image from "next/image";
import { industries } from "@/data/industries";

export default function IndustriesSection() {
  return (
    <section id="industries" className="w-full bg-[#FAF9F5] py-14 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[12px] font-medium text-[#B68A3A] uppercase tracking-wider block mb-2">
            Sector Specialization
          </span>
          <h2 className="text-[26px] sm:text-[32px] md:text-[42px] text-[#0F1E36] font-semibold tracking-tight leading-tight">
            Trusted Hardware in Critical Deployments
          </h2>
          <p className="text-[16px] text-stone-600 mt-3 font-normal leading-relaxed">
            From heavy civil structures to high-vibration automotive powertrains, FOIF provides certified fastening systems designed to withstand demanding environments.
          </p>
        </div>

        {/* 8 Industrial Sectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind) => (
            <div
              key={ind.id}
              className="group bg-white rounded-3xl overflow-hidden border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="w-full aspect-[4/3] bg-stone-100 relative overflow-hidden">
                <Image
                  src={ind.image}
                  alt={ind.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <span className="absolute bottom-3 left-4 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10.5px] font-medium">
                  {ind.tag}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#0F1E36] group-hover:text-[#B68A3A] transition-colors leading-snug">
                    {ind.title}
                  </h3>
                  <p className="text-[13px] text-stone-500 mt-1.5 leading-relaxed font-normal">
                    {ind.description}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-black/[0.05] flex items-center justify-between text-[11px] text-stone-500 font-medium">
                  <span>{ind.spec}</span>
                  <a
                    href="#request-a-quote"
                    className="text-[#B68A3A] hover:text-[#0F1E36] group-hover:translate-x-1 transition-transform flex items-center"
                    aria-label={`Enquire for ${ind.title}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
