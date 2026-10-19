"use client";

import { useState } from "react";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function QuoteModal() {
  const { isQuoteOpen, setIsQuoteOpen, quoteInitialItems, user, showToast } = useApp();

  if (!isQuoteOpen) return null;

  return (
    <QuoteModalForm
      setIsQuoteOpen={setIsQuoteOpen}
      quoteInitialItems={quoteInitialItems}
      user={user}
      showToast={showToast}
    />
  );
}

function QuoteModalForm({ setIsQuoteOpen, quoteInitialItems, user, showToast }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  // Form Fields
  const [companyName, setCompanyName] = useState(user?.company || "");
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [destination, setDestination] = useState(user?.location || "Chennai / All-India Site");
  const [customerNotes, setCustomerNotes] = useState("");
  const [attachmentName, setAttachmentName] = useState("");

  // Multi-item Line Items in RFQ
  const defaultItems = [
    {
      productId: "foif-din933-hex-bolt",
      name: "Hex Head Structural Bolt (Full Thread)",
      specs: "M16 x 80mm | Grade 10.9 HT Alloy Steel",
      quantity: 5000,
      unit: "pcs",
    },
  ];
  const [items, setItems] = useState(
    quoteInitialItems?.length
      ? quoteInitialItems.map((item) => ({
          productId: item.productId || item.id,
          name: item.name,
          specs: item.specs || "Standard Specification",
          quantity: item.quantity || 500,
          unit: item.unit || "pcs",
        }))
      : defaultItems
  );

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        productId: products[0].id,
        name: products[0].name,
        specs: products[0].materials[0] || "Grade 8.8",
        quantity: 1000,
        unit: "pcs",
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) {
      showToast("An RFQ requires at least one line item", "info");
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleProductSelect = (index, selectedProductId) => {
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        productId: prod.id,
        name: prod.name,
        specs: prod.materials?.[0] || "Standard Grade",
        unit: prod.unit || "pcs",
      };
      return updated;
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
      showToast(`Attached drawing: ${file.name}`, "info");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        companyName,
        customerName,
        email,
        phone,
        destination,
        customerNotes,
        attachmentName: attachmentName || null,
        items,
      };

      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit quotation request");
      }

      setSubmittedData(data.quotation);
      showToast(`RFQ ${data.quotation.rfqNumber} generated successfully!`, "success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmittedData(null);
    setError(null);
    setIsQuoteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-black/[0.08] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-black/[0.06] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F1E36] text-[#D6B46A] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">request_quote</span>
            </div>
            <div>
              <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#0F1E36] leading-snug">
                Enterprise Fastener Quotation
              </h3>
              <span className="text-[12px] text-stone-500 font-normal hidden sm:block">
                Multi-Product Line Item Request • 24h Quoting Policy
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {submittedData ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#FAF5EB] border-2 border-[#B68A3A] flex items-center justify-center text-[#B68A3A] mb-4">
                <span className="material-symbols-outlined text-[36px]">verified</span>
              </div>
              <h4 className="text-[22px] font-semibold text-[#0F1E36]">
                Quotation Request Transmitted
              </h4>
              <p className="text-[14.5px] text-stone-600 max-w-lg mt-2 leading-relaxed font-normal">
                Thank you, <span className="font-semibold text-stone-900">{submittedData.customerName}</span> from{" "}
                <span className="font-semibold text-stone-900">{submittedData.companyName}</span>. Your technical requirement has been queued for engineering review.
              </p>

              {/* Reference Details Box */}
              <div className="mt-6 p-5 rounded-3xl bg-stone-50 border border-black/[0.05] text-left w-full max-w-lg space-y-2.5">
                <div className="flex justify-between items-center pb-2.5 border-b border-black/[0.05]">
                  <span className="text-[12px] text-stone-500">RFQ Reference</span>
                  <span className="text-[14px] font-bold text-[#B68A3A]">{submittedData.rfqNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-stone-500">Line Items</span>
                  <span className="text-[13px] font-semibold text-stone-900">{submittedData.items?.length} Fasteners</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-stone-500">Status</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5EB] text-[#8C6514] text-[11px] font-semibold">
                    PENDING ENGINEERING PRICING
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2.5 border-t border-black/[0.05]">
                  <span className="text-[12px] text-stone-500">Site Destination</span>
                  <span className="text-[13px] text-stone-900 font-medium">{submittedData.destination}</span>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-[#FAF5EB] border border-[#B68A3A]/25 max-w-lg text-left text-[12px] text-[#8C6514]">
                <span className="font-semibold">24-Hour Policy Notice: </span>
                Once the engineering desk issues your quote with Mill Test Certificates, pricing is guaranteed for 24 hours to protect against base raw metal commodity volatility.
              </div>

              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <Link
                  href="/dashboard"
                  onClick={handleClose}
                  className="h-11 px-6 rounded-full bg-[#0F1E36] text-white hover:bg-[#182C4D] text-[13px] font-medium flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#D6B46A]">account_circle</span>
                  <span>View in Customer Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-11 px-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-[13px] font-medium"
                >
                  Return to Catalogue
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3.5 rounded-2xl bg-red-50 text-red-700 border border-red-200 flex items-center gap-2 text-[13px]">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Section 1: Enterprise Credentials */}
              <div className="space-y-3">
                <h4 className="text-[13px] font-semibold text-[#0F1E36] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B68A3A]"></span>
                  1. Company &amp; Contact Credentials
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[12px] font-medium text-stone-600 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Larsen & Toubro, BHEL, Tata Projects"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 border border-black/[0.05] text-[13.5px] focus:bg-white focus:border-[#B68A3A] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-stone-600 mb-1">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Procurement Officer / Structural Specifier"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 border border-black/[0.05] text-[13.5px] focus:bg-white focus:border-[#B68A3A] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-stone-600 mb-1">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="procurement@enterprise.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 border border-black/[0.05] text-[13.5px] focus:bg-white focus:border-[#B68A3A] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-stone-600 mb-1">
                      Direct Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 border border-black/[0.05] text-[13.5px] focus:bg-white focus:border-[#B68A3A] focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Line Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[13px] font-semibold text-[#0F1E36] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B68A3A]"></span>
                    2. Line Items for Quotation ({items.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-[12.5px] text-[#B68A3A] hover:text-[#0F1E36] font-medium flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px]">add_circle</span>
                    <span>Add Another Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-stone-50 border border-black/[0.05] space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-black/[0.05]">
                        <span className="text-[12px] font-semibold text-[#B68A3A]">
                          Item #{idx + 1}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-stone-400 hover:text-red-600 text-[12px] flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[15px]">delete</span>
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-5">
                          <label className="block text-[11px] font-medium text-stone-500 mb-1">
                            Discipline / Product:
                          </label>
                          <select
                            value={item.productId}
                            onChange={(e) => handleProductSelect(idx, e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-black/[0.06] text-[13px] font-medium text-stone-800 focus:outline-none"
                          >
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                [{p.categoryCode}] {p.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-4">
                          <label className="block text-[11px] font-medium text-stone-500 mb-1">
                            Specification / Grade:
                          </label>
                          <input
                            type="text"
                            value={item.specs}
                            onChange={(e) => handleItemChange(idx, "specs", e.target.value)}
                            placeholder="e.g. M16 x 80mm Grade 10.9 HDG"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-black/[0.06] text-[13px] text-stone-800 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-medium text-stone-500 mb-1">
                            Quantity:
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              type="number"
                              required
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                              className="w-2/3 px-2.5 py-2 rounded-xl bg-white border border-black/[0.06] text-[13px] font-semibold text-stone-900 focus:outline-none"
                            />
                            <select
                              value={item.unit}
                              onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                              className="w-1/3 px-1.5 py-2 rounded-xl bg-white border border-black/[0.06] text-[12px] text-stone-600 focus:outline-none"
                            >
                              <option value="pcs">pcs</option>
                              <option value="sets">sets</option>
                              <option value="kg">kg</option>
                              <option value="tons">tons</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Delivery Location & Technical Drawing */}
              <div className="space-y-3">
                <h4 className="text-[13px] font-semibold text-[#0F1E36] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B68A3A]"></span>
                  3. Logistics &amp; Engineering Documents
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[12px] font-medium text-stone-600 mb-1">
                      Delivery Destination / Project Site
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ennore Thermal Station, Chennai 600057"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 border border-black/[0.05] text-[13.5px] focus:bg-white focus:border-[#B68A3A] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-stone-600 mb-1">
                      Upload Technical Drawing / CAD (Optional)
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-black/[0.05] text-[12.5px] text-stone-500 cursor-pointer flex items-center gap-2 overflow-hidden truncate hover:bg-stone-200/60 transition-colors">
                        <span className="material-symbols-outlined text-[17px] text-[#B68A3A] shrink-0">upload_file</span>
                        <span className="truncate">{attachmentName || "Select PDF, DWG, DXF, STEP..."}</span>
                        <input
                          type="file"
                          accept=".pdf,.dwg,.dxf,.step,.stp,.iges,.igs,.png,.jpg"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      {attachmentName && (
                        <button
                          type="button"
                          onClick={() => setAttachmentName("")}
                          className="p-2 text-stone-400 hover:text-red-600"
                          title="Remove file"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[12px] font-medium text-stone-600 mb-1">
                    Special Engineering Specifications / Tolerances
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Specify custom thread pitches, ASTM coating specs (e.g. ASTM A153 HDG), inspection levels (100% optical), or mill requirements."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 border border-black/[0.05] text-[13px] resize-none focus:bg-white focus:border-[#B68A3A] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[12px] text-stone-400 text-center sm:text-left">
                  🔒 Strictly protected under FOIF OEM Non-Disclosure protocols.
                </span>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-1/2 sm:w-auto h-11 px-5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-[13px] font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-1/2 sm:w-auto h-11 px-7 rounded-full bg-[#0F1E36] text-white hover:bg-[#182C4D] text-[13px] font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    {loading ? (
                      <span>Transmitting...</span>
                    ) : (
                      <>
                        <span>Submit RFQ</span>
                        <span className="material-symbols-outlined text-[16px] text-[#D6B46A]">send</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
