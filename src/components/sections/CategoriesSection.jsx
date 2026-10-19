"use client";

import Image from "next/image";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function CategoriesSection() {
  const { openQuoteModalWithItems } = useApp();

  const handleCategoryRfq = (catSlug) => {
    const catProds = products.filter((p) => p.category === catSlug);
    if (catProds.length > 0) {
      openQuoteModalWithItems([
        {
          productId: catProds[0].id,
          name: catProds[0].name,
          specs: catProds[0].materials?.[0] || "Standard Grade",
          quantity: catProds[0].minOrderQuantity || 500,
          unit: catProds[0].unit || "pcs",
        },
      ]);
    } else {
      openQuoteModalWithItems();
    }
  };

  return (
    <section id="categories" className="w-full bg-[#FAF9F5] py-14 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-black/[0.06]">
          <div>
            <span className="text-[12px] font-medium text-[#B68A3A] uppercase tracking-wider block mb-2">
              Master Fastener Catalogue
            </span>
            <h2 className="text-[26px] sm:text-[32px] md:text-[42px] text-[#0F1E36] font-semibold tracking-tight leading-tight">
              Seven Core Engineering Disciplines
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#B68A3A] hover:text-[#0F1E36] transition-colors"
            >
              <span>Explore All 28 Verified Products</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Seven Disciplines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              id={cat.slug}
              className={`rounded-3xl p-5 bg-white border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group ${
                cat.wide ? "md:col-span-2 xl:col-span-2" : ""
              }`}
            >
              <div>
                {/* Product Image Container */}
                <div
                  className={`w-full rounded-2xl bg-stone-100 mb-4 overflow-hidden relative ${
                    cat.wide ? "aspect-[21/9]" : "aspect-[16/10]"
                  }`}
                >
                  <Image
                    src={cat.image}
                    alt={cat.alt}
                    fill
                    loading="lazy"
                    sizes={cat.wide
                      ? "(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 50vw"
                      : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#0F1E36]/90 backdrop-blur-md text-[#D6B46A] text-[10px] font-medium tracking-wide">
                    {cat.code}
                  </span>
                </div>

                {/* Card Title & Content */}
                <Link href={`/products?category=${cat.slug}`}>
                  <h3 className="text-[17px] text-[#0F1E36] font-semibold group-hover:text-[#B68A3A] transition-colors leading-snug">
                    {cat.title}
                  </h3>
                </Link>
                <p className="text-[13px] text-stone-500 mt-1.5 mb-4 leading-relaxed font-normal">
                  {cat.description}
                </p>

                {/* Specification Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cat.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[11px] font-medium border border-black/[0.03]"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-black/[0.05] flex items-center justify-between">
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="text-[13px] font-medium text-stone-800 hover:text-[#0F1E36] flex items-center gap-1 group/link"
                >
                  <span>View Products</span>
                  <span className="material-symbols-outlined text-[16px] text-stone-400 group-hover/link:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => handleCategoryRfq(cat.slug)}
                  className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-[#0F1E36] text-stone-700 hover:text-white text-[12px] font-medium transition-all"
                >
                  Quick RFQ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
