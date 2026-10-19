"use client";

import { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageFallback() {
  return (
    <>
      <Header />
      <main className="w-full page-offset pb-24 bg-[#FAF9F5] min-h-screen flex items-center justify-center">
        <span className="text-stone-500 text-sm">Loading catalogue…</span>
      </main>
      <Footer />
    </>
  );
}

function ProductsPageContent() {
  const { addToCart, toggleWishlist, isInWishlist, openQuoteModalWithItems } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedCategory = searchParams.get("category") || "all";
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [quantities, setQuantities] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  const selectCategory = (slug) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!slug || slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    const query = params.toString();
    router.replace(query ? `/products?${query}` : "/products", { scroll: false });
  };

  // Collect unique materials across verified products
  const allMaterials = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      p.materials?.forEach((m) => set.add(m));
    });
    return Array.from(set);
  }, []);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
        if (selectedMaterial !== "all" && !p.materials?.includes(selectedMaterial)) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchStd = p.standards.some((s) => s.toLowerCase().includes(q));
          const matchMat = p.materials.some((m) => m.toLowerCase().includes(q));
          if (!matchName && !matchSku && !matchStd && !matchMat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "name-desc") return b.name.localeCompare(a.name);
        if (sortBy === "category") return a.categoryCode.localeCompare(b.categoryCode);
        return 0;
      });
  }, [selectedCategory, selectedMaterial, searchQuery, sortBy]);

  const handleQtyChange = (productId, delta) => {
    setQuantities((prev) => {
      const current = prev[productId] || 500;
      const next = Math.max(10, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const getQty = (productId, defaultMin = 500) => {
    return quantities[productId] || defaultMin;
  };

  return (
    <>
      <Header />

      <main className="w-full page-offset pb-24 bg-[#FAF9F5] min-h-screen">
        {/* Top Header Banner */}
        <div className="bg-white border-b border-black/[0.06] py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2.5 text-[12px] text-[#B68A3A] font-medium tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-[#B68A3A]"></span>
                  <span>ISO 9001:2015 Verified • EN 10204 3.1 Traceable</span>
                </div>
                <h1 className="text-[28px] sm:text-[36px] md:text-[46px] font-semibold text-[#0F1E36] tracking-tight leading-tight">
                  Master Fastener Repository
                </h1>
                <p className="text-[16px] text-stone-500 max-w-2xl mt-2 font-normal leading-relaxed">
                  Precision engineered hardware catalogued across seven core engineering disciplines with complete material heat traceability.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => openQuoteModalWithItems()}
                  className="h-11 px-6 rounded-full bg-[#0F1E36] text-white hover:bg-[#182C4D] text-[13px] font-medium flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] w-full sm:w-auto"
                >
                  <span className="material-symbols-outlined text-[17px] text-[#D6B46A]">request_quote</span>
                  <span>Submit Custom RFQ</span>
                </button>
              </div>
            </div>

            {/* Apple Pill Tabs Category Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pt-8 pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                type="button"
                onClick={() => selectCategory("all")}
                className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${
                  selectedCategory === "all"
                    ? "bg-[#0F1E36] text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
                }`}
              >
                All 28 Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => selectCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.slug
                      ? "bg-[#0F1E36] text-white shadow-sm"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8 md:pt-10">
          <div className="lg:hidden mb-4">
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className="w-full h-11 rounded-2xl bg-white border border-black/[0.06] px-4 text-[13px] font-medium text-stone-800 flex items-center justify-between"
            >
              <span>Filters{selectedMaterial !== "all" ? " • 1 active" : ""}</span>
              <span className="material-symbols-outlined text-[18px]">
                {filtersOpen ? "expand_less" : "tune"}
              </span>
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar Filters */}
            <aside className={`${filtersOpen ? "block" : "hidden"} lg:block lg:col-span-3 space-y-6`}>
              {/* Search Box */}
              <div className="bg-white p-5 rounded-3xl border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-2">
                <label className="block text-[12px] font-medium text-stone-500 uppercase tracking-wider">
                  Filter by Keyword
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="DIN standard, alloy, grade..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-100 border border-black/[0.05] text-[13.5px] text-stone-900 focus:bg-white focus:border-[#B68A3A] focus:outline-none transition-all"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-3 text-[18px] text-stone-400">
                    search
                  </span>
                </div>
              </div>

              {/* Material Filter */}
              <div className="bg-white p-5 rounded-3xl border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
                <h3 className="text-[12px] font-semibold text-stone-500 uppercase tracking-wider pb-2 border-b border-black/[0.06]">
                  Material / Alloy Grade
                </h3>
                <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                  <button
                    onClick={() => setSelectedMaterial("all")}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-[13px] font-medium transition-colors ${
                      selectedMaterial === "all"
                        ? "bg-[#0F1E36] text-white"
                        : "text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    All Materials
                  </button>
                  {allMaterials.map((mat) => (
                    <button
                      key={mat}
                      onClick={() => setSelectedMaterial(mat)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-[12.5px] truncate block transition-colors ${
                        selectedMaterial === mat
                          ? "bg-[#0F1E36] text-white font-medium"
                          : "text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality & Traceability Callout */}
              <div className="p-5 rounded-3xl bg-[#0F1E36] text-white space-y-2">
                <div className="flex items-center gap-2 text-[#D6B46A] text-[12px] font-semibold uppercase">
                  <span className="material-symbols-outlined text-[17px]">verified</span>
                  <span>EN 10204 3.1 Traceable</span>
                </div>
                <p className="text-[12.5px] text-stone-300 leading-relaxed font-normal">
                  All fasteners shipped with heat-number spectrometry, mechanical tensile, and Rockwell hardness test certificates.
                </p>
              </div>
            </aside>

            {/* Right Product Grid */}
            <div className="lg:col-span-9 space-y-6">
              {/* Results & Sorting Bar */}
              <div className="bg-white p-4 rounded-2xl border border-black/[0.05] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px]">
                <div className="text-stone-500">
                  Showing <span className="font-semibold text-stone-900">{filteredProducts.length}</span> verified fasteners
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-stone-400 text-[12px]">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 border border-black/[0.05] text-[12.5px] font-medium text-stone-800 focus:outline-none"
                  >
                    <option value="default">Catalogue Order</option>
                    <option value="name-asc">Name (A → Z)</option>
                    <option value="name-desc">Name (Z → A)</option>
                    <option value="category">Discipline Code</option>
                  </select>
                </div>
              </div>

              {/* Product Cards Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border border-black/[0.05]">
                  <span className="material-symbols-outlined text-[48px] text-stone-300 mb-2">search_off</span>
                  <h3 className="text-[18px] font-semibold text-stone-800">No fasteners found</h3>
                  <p className="text-[13.5px] text-stone-500 mt-1">
                    Try clearing your search term or switching back to &ldquo;All 28 Products&rdquo;.
                  </p>
                  <button
                    onClick={() => {
                      selectCategory("all");
                      setSelectedMaterial("all");
                      setSearchQuery("");
                    }}
                    className="mt-4 px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-[13px] font-medium transition-all"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((p) => {
                    const currentQty = getQty(p.id, p.minOrderQuantity);
                    const isSaved = isInWishlist(p.id);

                    return (
                      <div
                        key={p.id}
                        className="bg-white rounded-3xl overflow-hidden border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                      >
                        {/* Image Preview with Badges */}
                        <div className="relative aspect-[16/11] bg-stone-100 overflow-hidden">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#0F1E36]/90 backdrop-blur-md text-[#D6B46A] text-[10px] font-medium">
                            {p.categoryCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(p)}
                            className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border border-black/[0.06] hover:bg-white transition-colors ${
                              isSaved ? "text-[#B68A3A]" : "text-stone-400"
                            }`}
                            title={isSaved ? "Remove from saved" : "Save specification"}
                          >
                            <span className="material-symbols-outlined text-[17px]">
                              {isSaved ? "bookmark" : "bookmark_border"}
                            </span>
                          </button>
                        </div>

                        {/* Content Body */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5 text-[11px] text-stone-400 font-medium">
                              <span className="text-[#B68A3A] font-semibold">{p.sku}</span>
                              <span>•</span>
                              <span>{p.standards.slice(0, 2).join(", ")}</span>
                            </div>

                            <Link href={`/products/${p.id}`}>
                              <h3 className="text-[16px] font-semibold text-[#0F1E36] group-hover:text-[#B68A3A] transition-colors leading-snug">
                                {p.name}
                              </h3>
                            </Link>

                            <p className="text-[13px] text-stone-500 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                              {p.description}
                            </p>

                            {/* Standard Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {p.materials?.slice(0, 3).map((mat, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[11px] font-medium"
                                >
                                  {mat}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Order & Lot Quantity Actions */}
                          <div className="mt-5 pt-4 border-t border-black/[0.05] space-y-3">
                            <div className="flex items-center justify-between text-[12px]">
                              <span className="text-stone-400 font-normal">Pricing</span>
                              <span className="text-[#B68A3A] font-semibold">Engineering Quote (RFQ)</span>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center justify-between bg-stone-50 px-3 py-1.5 rounded-2xl border border-black/[0.04]">
                              <span className="text-[11px] text-stone-500 font-medium">Lot Size:</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleQtyChange(p.id, -250)}
                                  className="w-6 h-6 rounded-full bg-white shadow-2xs flex items-center justify-center font-bold text-stone-700 hover:bg-stone-100 text-[13px]"
                                >
                                  -
                                </button>
                                <span className="text-[12px] font-semibold text-[#0F1E36] min-w-[55px] text-center">
                                  {currentQty.toLocaleString()} {p.unit || "pcs"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleQtyChange(p.id, 250)}
                                  className="w-6 h-6 rounded-full bg-white shadow-2xs flex items-center justify-center font-bold text-stone-700 hover:bg-stone-100 text-[13px]"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Actions Row */}
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => addToCart(p, currentQty)}
                                className="h-10 rounded-full bg-[#0F1E36] text-white hover:bg-[#182C4D] text-[12.5px] font-medium flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
                              >
                                <span className="material-symbols-outlined text-[15px] text-[#D6B46A]">
                                  add_shopping_cart
                                </span>
                                <span>Add to Cart</span>
                              </button>

                              <Link
                                href={`/products/${p.id}`}
                                className="h-10 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-[12.5px] font-medium flex items-center justify-center gap-1 transition-all"
                              >
                                <span>Inspect Specs</span>
                                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
