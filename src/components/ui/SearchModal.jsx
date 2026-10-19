"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, addToCart } = useApp();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isSearchOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredProducts = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.standards.some((s) => s.toLowerCase().includes(q)) ||
          p.materials.some((m) => m.toLowerCase().includes(q))
      )
    : [];

  const filteredCategories = q
    ? categories.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.badges.some((b) => b.toLowerCase().includes(q))
      )
    : categories;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4 bg-black/40 backdrop-blur-md animate-fade-in"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-black/[0.08] overflow-hidden max-h-[min(88vh,760px)] flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-black/[0.06] bg-neutral-50/70 flex items-center gap-3">
          <span className="material-symbols-outlined text-neutral-400 text-[24px]">search</span>
          <input
            type="text"
            placeholder="Search DIN/ISO standards, alloy grades, SKU (e.g. DIN 933, Grade 10.9, Ruspert, SS316)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none outline-none text-[15px] text-neutral-900 placeholder:text-neutral-400 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-200/60 transition-colors"
              title="Clear search"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2.5 py-1 text-[11px] font-semibold tracking-wider rounded-lg bg-neutral-200/70 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6 space-y-6">
          {q && (
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] mb-3">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-neutral-500">
                  Matched Fasteners ({filteredProducts.length})
                </span>
                <span className="text-[11px] text-neutral-400">Live Index</span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-8 text-center text-neutral-500 text-[14px]">
                  No exact fastener matches found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-neutral-50/80 hover:bg-neutral-100/80 border border-black/[0.04] hover:border-black/[0.12] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3.5">
                        {p.image && (
                          <div className="relative w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0 border border-black/[0.06] shadow-sm">
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider rounded-full bg-neutral-200/70 text-neutral-700">
                              {p.categoryCode}
                            </span>
                            <span className="text-[11px] font-semibold text-accent-gold">{p.sku}</span>
                          </div>
                          <Link
                            href={`/products/${p.id}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="text-[14px] font-bold text-neutral-900 group-hover:text-accent-gold transition-colors block"
                          >
                            {p.name}
                          </Link>
                          <span className="text-[11.5px] text-neutral-500 block">
                            {p.standards.join(", ")} • {p.materials.slice(0, 2).join(", ")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => addToCart(p, 500)}
                          className="px-3 py-1.5 rounded-full bg-primary-navy text-white text-[11px] font-semibold hover:bg-neutral-800 transition-all shadow-sm flex items-center gap-1.5"
                          title="Add 500 pcs to cart"
                        >
                          <span className="material-symbols-outlined text-[14px]">add_shopping_cart</span>
                          <span>Add</span>
                        </button>
                        <Link
                          href={`/products/${p.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="p-1.5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all"
                        >
                          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Categories Quick Navigation */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] mb-3">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-neutral-500">
                Catalogue Disciplines ({filteredCategories.length})
              </span>
              <Link
                href="/products"
                onClick={() => setIsSearchOpen(false)}
                className="text-[12px] font-semibold text-accent-gold hover:underline"
              >
                View Full Catalogue →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="p-3 rounded-2xl bg-neutral-50/80 hover:bg-neutral-100/80 border border-black/[0.04] hover:border-black/[0.12] transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white border border-black/[0.08] text-neutral-800 shadow-sm">
                      {cat.code}
                    </span>
                    <span className="text-[13px] font-bold text-neutral-900 group-hover:text-accent-gold transition-colors">
                      {cat.title}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 px-4 sm:px-6 bg-neutral-50 border-t border-black/[0.06] flex items-center justify-between gap-3 text-[11px] text-neutral-500">
          <span>FOIF Material Verification Engine</span>
          <span className="hidden sm:inline">Click any item to view engineering specifications</span>
        </div>
      </div>
    </div>
  );
}
