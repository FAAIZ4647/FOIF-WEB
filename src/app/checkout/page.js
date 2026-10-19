"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, user, showToast } = useApp();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Form Fields
  const [companyName, setCompanyName] = useState(user?.company || "");
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.location || "");
  const [poNumber, setPoNumber] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  const totalLotUnits = cart.reduce((acc, curr) => acc + (curr.quantity || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError("Your cart is empty. Add fastener lots before proceeding.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        companyName,
        customerName,
        email,
        phone,
        deliveryAddress: address,
        poNumber: poNumber || `PO-${Date.now().toString().slice(-6)}`,
        items: cart,
        notes: orderNotes,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order placement failed");
      }

      setOrderConfirmed(data.order);
      clearCart();
      showToast(`Order ${data.order.orderNumber} successfully booked!`, "success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="w-full page-offset pb-24 bg-warm-ivory min-h-screen">
        {/* Banner */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 mb-8">
          <div className="flex items-center gap-2 text-[12px] text-neutral-400 mb-3">
            <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-neutral-900 transition-colors">Catalogue</Link>
            <span>/</span>
            <span className="text-neutral-900 font-semibold">B2B Checkout</span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] md:text-[44px] font-bold text-neutral-900 tracking-tight">
            Enterprise Checkout
          </h1>
          <p className="text-[15px] text-neutral-500 mt-1 max-w-xl">
            Commercial purchase order dispatch with EN 10204 3.1 inspection certification and 30-day corporate terms.
          </p>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
          {orderConfirmed ? (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-black/[0.06] text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-accent-gold/10 border-2 border-accent-gold flex items-center justify-center text-accent-gold mx-auto shadow-sm">
                <span className="material-symbols-outlined text-[42px]">verified</span>
              </div>
              <h2 className="text-[28px] font-bold text-neutral-900 tracking-tight">
                Commercial Order Confirmed
              </h2>
              <p className="text-[15px] text-neutral-600 max-w-md mx-auto leading-relaxed">
                Your order has been recorded in the FOIF procurement dispatch register. Our metallurgical inspection team will issue the batch MTR 3.1 certification.
              </p>

              <div className="p-5 rounded-2xl bg-neutral-50 border border-black/[0.06] text-left text-[13px] space-y-3 max-w-md mx-auto">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Order Reference:</span>
                  <span className="font-bold text-accent-gold">{orderConfirmed.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">PO Reference:</span>
                  <span className="font-semibold text-neutral-900">{orderConfirmed.poNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">MTR Batch Dossier:</span>
                  <span className="font-semibold text-neutral-900">{orderConfirmed.mtrDossierNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Payment Terms:</span>
                  <span className="text-neutral-900 font-medium">{orderConfirmed.paymentTerms}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-black/[0.06]">
                  <span className="text-neutral-500">Scheduled Dispatch:</span>
                  <span className="text-primary-navy font-bold">{orderConfirmed.dispatchDate}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3 justify-center">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 rounded-full bg-primary-navy text-white text-[13px] font-semibold hover:bg-neutral-800 transition-all shadow-sm"
                >
                  View Order in Dashboard
                </Link>
                <Link
                  href="/products"
                  className="px-6 py-3 rounded-full bg-white border border-black/[0.12] text-neutral-800 text-[13px] font-semibold hover:bg-neutral-50 transition-all shadow-sm"
                >
                  Return to Catalogue
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Form Column */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
                {error && (
                  <div className="p-4 rounded-2xl bg-red-50 text-red-700 border border-red-200 text-[13px] flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">error</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Company & Contact */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/[0.06] space-y-5">
                  <h3 className="text-[16px] font-bold text-neutral-900 pb-3 border-b border-black/[0.06] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-700 text-[12px] font-bold flex items-center justify-center">1</span>
                    <span>Corporate Buyer Coordinates</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-neutral-700 mb-1.5">
                        Enterprise Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Larsen & Toubro, BHEL, Tata Motors"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-black/[0.08] focus:bg-white focus:border-accent-gold outline-none text-[14px] text-neutral-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-neutral-700 mb-1.5">
                        Procurement Officer Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-black/[0.08] focus:bg-white focus:border-accent-gold outline-none text-[14px] text-neutral-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-neutral-700 mb-1.5">
                        Corporate Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="procurement@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-black/[0.08] focus:bg-white focus:border-accent-gold outline-none text-[14px] text-neutral-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-neutral-700 mb-1.5">
                        Direct Phone / Hotline *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-black/[0.08] focus:bg-white focus:border-accent-gold outline-none text-[14px] text-neutral-900 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Destination & PO */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/[0.06] space-y-5">
                  <h3 className="text-[16px] font-bold text-neutral-900 pb-3 border-b border-black/[0.06] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-700 text-[12px] font-bold flex items-center justify-center">2</span>
                    <span>Plant Destination &amp; PO Reference</span>
                  </h3>
                  <div>
                    <label className="block text-[12px] font-semibold text-neutral-700 mb-1.5">
                      Project Site Delivery Address *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Detailed delivery address, Gate Number, Warehouse dock, City, State, PIN"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-black/[0.08] focus:bg-white focus:border-accent-gold outline-none text-[14px] text-neutral-900 transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-neutral-700 mb-1.5">
                        Client Purchase Order Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. PO-LNT-2025-098"
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-black/[0.08] focus:bg-white focus:border-accent-gold outline-none text-[14px] text-neutral-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-neutral-700 mb-1.5">
                        Commercial Payment Terms
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="30-Day B2B Invoicing (Net on MTR)"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-100 border border-black/[0.06] text-neutral-500 cursor-not-allowed text-[14px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-neutral-700 mb-1.5">
                      Dispatch &amp; Packaging Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Export seaworthy crates, gunny bags with metal tags, color coded markings"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-black/[0.08] focus:bg-white focus:border-accent-gold outline-none text-[14px] text-neutral-900 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  className="w-full py-4 px-8 rounded-full bg-primary-navy text-white text-[14px] font-semibold hover:bg-neutral-800 transition-all shadow-md flex items-center justify-center gap-2.5 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Processing Commercial Order...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px] text-accent-gold">
                        assignment_turned_in
                      </span>
                      <span>Confirm &amp; Place Enterprise Order</span>
                    </>
                  )}
                </button>
              </form>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/[0.06] space-y-5 sticky top-28">
                  <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
                    <h3 className="text-[16px] font-bold text-neutral-900">
                      Order Lot Summary
                    </h3>
                    <span className="px-3 py-1 text-[11px] font-semibold rounded-full bg-neutral-100 text-neutral-700">
                      {cart.length} Line Items
                    </span>
                  </div>

                  {cart.length === 0 ? (
                    <div className="py-8 text-center text-neutral-400 text-[14px]">
                      Cart is empty
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-2xl bg-neutral-50 border border-black/[0.04] flex items-center justify-between gap-3"
                        >
                          <div>
                            <h4 className="text-[13.5px] font-bold text-neutral-900">
                              {item.name}
                            </h4>
                            <span className="text-[11.5px] text-accent-gold block">
                              {item.specs}
                            </span>
                          </div>
                          <span className="text-[12px] font-bold text-neutral-900 shrink-0 px-2.5 py-1 rounded-full bg-white border border-black/[0.06] shadow-sm">
                            {item.quantity?.toLocaleString()} {item.unit || "pcs"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-black/[0.06] space-y-2.5 text-[13px]">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500">Total Units:</span>
                      <span className="font-bold text-neutral-900">{totalLotUnits.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500">Payment Processing:</span>
                      <span className="text-neutral-900 font-semibold">Commercial B2B Invoice</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500">Traceability Dossier:</span>
                      <span className="text-accent-gold font-semibold">Included (EN 10204 3.1)</span>
                    </div>
                  </div>

                  <div className="p-4 bg-accent-gold/[0.08] rounded-2xl border border-accent-gold/20 text-[12px] text-neutral-700 leading-relaxed">
                    Online payments are not processed directly at checkout. B2B orders generate a legally binding Commercial Purchase Order for 30-day net settlement.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
