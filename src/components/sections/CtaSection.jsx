"use client";

import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function CtaSection({ onOpenQuoteModal }) {
  const { openQuoteModalWithItems } = useApp();

  const handleQuoteClick = () => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal();
    } else {
      openQuoteModalWithItems();
    }
  };

  return (
    <section id="request-a-quote" className="w-full bg-[#0F1E36] text-white py-16 md:py-32 relative overflow-hidden">
      {/* Subtle lighting overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-60 pointer-events-none rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#D6B46A]"></span>
            <span className="text-[12px] text-stone-200 font-medium">
              Enterprise Supply Desk
            </span>
          </div>

          {/* Master Statement */}
          <h2 className="text-[28px] sm:text-[36px] md:text-[54px] text-white font-semibold tracking-tight leading-tight">
            Let’s Build Your Supply Solution.
          </h2>

          {/* Description */}
          <p className="text-[16px] md:text-[18px] text-stone-300 mt-4 max-w-2xl leading-relaxed font-normal">
            Connect directly with our senior technical procurement specialists in Chennai and Tirunelveli for multi-ton contract pricing, drawing reviews, and custom bolt fabrication.
          </p>

          {/* Direct Contact Pill */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-4 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-stone-200 text-[13px]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[17px] text-[#D6B46A]">phone_in_talk</span>
              <span>
                Direct Line:{" "}
                <a className="font-semibold text-white hover:underline" href="tel:+917200979731">
                  +91 72009 79731
                </a>
              </span>
            </div>
            <span className="hidden sm:inline text-white/30">•</span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[17px] text-[#D6B46A]">mail</span>
              <span>
                Procurement:{" "}
                <a className="font-semibold text-white hover:underline" href="mailto:sales@foifind.com">
                  sales@foifind.com
                </a>
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full">
            <Link
              href="/products"
              className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-white text-[#0F1E36] hover:bg-stone-100 text-[15px] font-medium shadow-sm transition-all active:scale-[0.98] w-full sm:w-auto"
            >
              <span>Explore All Products</span>
              <span className="material-symbols-outlined text-[18px] ml-2 text-[#B68A3A]">
                inventory_2
              </span>
            </Link>

            <button
              type="button"
              onClick={handleQuoteClick}
              className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-[#B68A3A] hover:bg-[#C5A059] text-white text-[15px] font-medium shadow-sm transition-all active:scale-[0.98] cursor-pointer w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-[18px] mr-2">
                request_quote
              </span>
              <span>Request Fast Quotation</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
