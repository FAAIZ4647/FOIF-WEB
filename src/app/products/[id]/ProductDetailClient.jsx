"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function ProductDetailClient({ product }) {
  const { addToCart, toggleWishlist, isInWishlist, openQuoteModalWithItems } = useApp();

  const [quantity, setQuantity] = useState(product?.minOrderQuantity || 1000);
  const [selectedDiameter, setSelectedDiameter] = useState(product?.diameters?.[0] || "");
  const [selectedLength, setSelectedLength] = useState(product?.lengths?.[0] || "");
  const [selectedMaterial, setSelectedMaterial] = useState(product?.materials?.[0] || "");
  const [selectedFinish, setSelectedFinish] = useState(product?.finishes?.[0] || "");

  const isSaved = isInWishlist(product.id);

  const selectedSpecs = {
    diameter: selectedDiameter,
    length: selectedLength,
    material: selectedMaterial,
    finish: selectedFinish,
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSpecs);
  };

  const handleDirectRfq = () => {
    const specsString = [selectedDiameter, selectedLength, selectedMaterial, selectedFinish]
      .filter(Boolean)
      .join(" | ");

    openQuoteModalWithItems([
      {
        productId: product.id,
        name: product.name,
        specs: specsString || "Standard Grade Spec",
        quantity,
        unit: product.unit || "pcs",
      },
    ]);
  };

  return (
    <>
      <Header />

      <main className="w-full page-offset pb-24 bg-[#FAF9F5] min-h-screen">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-black/[0.05] py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-[13px] text-stone-500 flex items-center gap-2 overflow-x-auto scrollbar-none whitespace-nowrap">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-black transition-colors">
              Catalogue
            </Link>
            <span>/</span>
            <Link
              href={`/products?category=${product.category}`}
              className="text-[#B68A3A] hover:underline"
            >
              {product.categoryName}
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-medium truncate max-w-xs">{product.name}</span>
          </div>
        </div>

        {/* Product Inspection Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8 md:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Visual Showcase */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl p-4 bg-white border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden relative aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover rounded-2xl"
                />
                <span className="absolute top-7 left-7 px-3 py-1 rounded-full bg-[#0F1E36]/90 backdrop-blur-md text-[#D6B46A] text-[11px] font-medium">
                  {product.categoryCode} • {product.sku}
                </span>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-7 right-7 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border border-black/[0.06] hover:bg-white transition-colors ${
                    isSaved ? "text-[#B68A3A]" : "text-stone-400"
                  }`}
                  title={isSaved ? "Remove from saved" : "Save specification"}
                >
                  <span className="material-symbols-outlined text-[19px]">
                    {isSaved ? "bookmark" : "bookmark_border"}
                  </span>
                </button>
              </div>

              {/* Quality & Traceability Callout Card */}
              <div className="p-6 rounded-3xl bg-white border border-black/[0.05] shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
                  <span className="text-[13px] font-semibold text-stone-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#B68A3A]">verified</span>
                    <span>Material Traceability Level</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5EB] text-[11px] font-semibold text-[#8C6514] border border-[#B68A3A]/30">
                    EN 10204 3.1
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[12.5px]">
                  <div className="text-stone-500">Optical Inspection:</div>
                  <div className="text-stone-900 font-medium text-right">100% Go/No-Go Gauging</div>
                  <div className="text-stone-500">Heat Batch Cert:</div>
                  <div className="text-stone-900 font-medium text-right">Included per Lot</div>
                  <div className="text-stone-500">Facility Origin:</div>
                  <div className="text-stone-900 font-medium text-right">Chennai &amp; Tirunelveli</div>
                </div>
              </div>
            </div>

            {/* Right Column: Spec Matrix & Ordering Controls */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5EB] text-[#8C6514] text-[11.5px] font-semibold">
                    {product.categoryName}
                  </span>
                  {product.standards?.map((std, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[11.5px] font-medium">
                      {std}
                    </span>
                  ))}
                  <span className="text-[12px] text-stone-400 ml-auto font-medium">
                    SKU: {product.sku}
                  </span>
                </div>

                <h1 className="text-[24px] sm:text-[30px] md:text-[36px] font-semibold text-[#0F1E36] tracking-tight leading-tight">
                  {product.name}
                </h1>

                <p className="text-[15px] text-stone-600 mt-3 leading-relaxed font-normal">
                  {product.description}
                </p>
              </div>

              {/* Spec Configurator Card */}
              <div className="p-6 rounded-3xl bg-white border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-5">
                <h3 className="text-[14px] font-semibold text-stone-900 pb-3 border-b border-black/[0.05]">
                  Configure Technical Parameters
                </h3>

                {/* Diameter Selector */}
                {product.diameters && product.diameters.length > 0 && (
                  <div>
                    <label className="block text-[12px] font-medium text-stone-500 uppercase tracking-wider mb-2">
                      Diameter / Metric Thread
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.diameters.map((dia) => (
                        <button
                          key={dia}
                          type="button"
                          onClick={() => setSelectedDiameter(dia)}
                          className={`px-3.5 py-1.5 rounded-xl text-[12.5px] font-medium transition-all ${
                            selectedDiameter === dia
                              ? "bg-[#0F1E36] text-white shadow-xs"
                              : "bg-stone-100 text-stone-700 hover:bg-stone-200/80"
                          }`}
                        >
                          {dia}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Length Selector */}
                {product.lengths && product.lengths.length > 0 && (
                  <div>
                    <label className="block text-[12px] font-medium text-stone-500 uppercase tracking-wider mb-2">
                      Fastener Length
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.lengths.map((len) => (
                        <button
                          key={len}
                          type="button"
                          onClick={() => setSelectedLength(len)}
                          className={`px-3.5 py-1.5 rounded-xl text-[12.5px] font-medium transition-all ${
                            selectedLength === len
                              ? "bg-[#0F1E36] text-white shadow-xs"
                              : "bg-stone-100 text-stone-700 hover:bg-stone-200/80"
                          }`}
                        >
                          {len}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Material Grade Selector */}
                {product.materials && product.materials.length > 0 && (
                  <div>
                    <label className="block text-[12px] font-medium text-stone-500 uppercase tracking-wider mb-2">
                      Material Specification &amp; Grade
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.materials.map((mat) => (
                        <button
                          key={mat}
                          type="button"
                          onClick={() => setSelectedMaterial(mat)}
                          className={`px-3.5 py-1.5 rounded-xl text-[12.5px] font-medium transition-all ${
                            selectedMaterial === mat
                              ? "bg-[#B68A3A] text-white shadow-xs"
                              : "bg-stone-100 text-stone-700 hover:bg-stone-200/80"
                          }`}
                        >
                          {mat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Finish Selector */}
                {product.finishes && product.finishes.length > 0 && (
                  <div>
                    <label className="block text-[12px] font-medium text-stone-500 uppercase tracking-wider mb-2">
                      Surface Finish / Protective Coating
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.finishes.map((fin) => (
                        <button
                          key={fin}
                          type="button"
                          onClick={() => setSelectedFinish(fin)}
                          className={`px-3.5 py-1.5 rounded-xl text-[12.5px] font-medium transition-all ${
                            selectedFinish === fin
                              ? "bg-[#0F1E36] text-white shadow-xs"
                              : "bg-stone-100 text-stone-700 hover:bg-stone-200/80"
                          }`}
                        >
                          {fin}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lot Quantity Selection & Procurement Controls */}
                <div className="pt-4 border-t border-black/[0.05] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[12px] text-stone-400 block font-normal">Pricing</span>
                      <span className="text-[14px] font-semibold text-[#B68A3A]">
                        Quotation Based (RFQ)
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[12px] text-stone-500 font-medium">Order Lot:</span>
                      <div className="flex items-center bg-stone-100 rounded-full px-2 py-1">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(10, q - 250))}
                          className="w-7 h-7 rounded-full bg-white shadow-2xs flex items-center justify-center font-bold text-stone-700 hover:bg-stone-50 text-[14px]"
                        >
                          -
                        </button>
                        <span className="px-3 text-[13px] font-semibold text-stone-900 min-w-[70px] text-center">
                          {quantity.toLocaleString()} {product.unit || "pcs"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => q + 250)}
                          className="w-7 h-7 rounded-full bg-white shadow-2xs flex items-center justify-center font-bold text-stone-700 hover:bg-stone-50 text-[14px]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="h-12 rounded-full bg-[#0F1E36] text-white hover:bg-[#182C4D] text-[14px] font-medium flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
                    >
                      <span className="material-symbols-outlined text-[17px] text-[#D6B46A]">
                        add_shopping_cart
                      </span>
                      <span>Add to Procurement Cart</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDirectRfq}
                      className="h-12 rounded-full bg-white text-[#0F1E36] border border-black/[0.12] hover:bg-stone-50 text-[14px] font-medium flex items-center justify-center gap-2 shadow-2xs active:scale-[0.98] transition-all"
                    >
                      <span className="material-symbols-outlined text-[17px] text-[#B68A3A]">
                        request_quote
                      </span>
                      <span>Instant Technical RFQ</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Technical Spec Sheet Table */}
              <div className="p-6 rounded-3xl bg-white border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
                <h3 className="text-[16px] font-semibold text-[#0F1E36]">
                  Engineering Specification Sheet
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left table-spec">
                    <tbody>
                      <tr>
                        <th className="w-1/3">International Standards</th>
                        <td>{product.standards?.join(", ")}</td>
                      </tr>
                      {product.threadPitch && (
                        <tr>
                          <th>Thread Pitch / Fit</th>
                          <td>{product.threadPitch} ({product.tolerance || "Class 6g"})</td>
                        </tr>
                      )}
                      {product.tensileStrength && (
                        <tr>
                          <th>Tensile Strength Range</th>
                          <td>{product.tensileStrength}</td>
                        </tr>
                      )}
                      {product.hardness && (
                        <tr>
                          <th>Hardness Metrics</th>
                          <td>{product.hardness}</td>
                        </tr>
                      )}
                      {product.certifications && (
                        <tr>
                          <th>Traceability Certificates</th>
                          <td>{product.certifications.join(", ")}</td>
                        </tr>
                      )}
                      <tr>
                        <th>Minimum Order Quantity</th>
                        <td>{product.minOrderQuantity?.toLocaleString()} {product.unit || "pcs"}</td>
                      </tr>
                      <tr>
                        <th>Dispatch Feasibility</th>
                        <td>{product.inStockStatus || "Standard 48h Engineering Dispatch"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
