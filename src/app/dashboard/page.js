"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { user, authLoading, showToast, openQuoteModalWithItems } = useApp();

  const [activeTab, setActiveTab] = useState("quotations"); // 'quotations' | 'orders'
  const [quotations, setQuotations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => setNow(Date.now()), 0);
    const interval = window.setInterval(() => setNow(Date.now()), 60_000);

    async function loadData() {
      try {
        const [qRes, oRes] = await Promise.all([
          fetch("/api/quotations"),
          fetch("/api/orders"),
        ]);
        const qData = await qRes.json();
        const oData = await oRes.json();
        setQuotations(qData.quotations || []);
        setOrders(oData.orders || []);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, []);

  const handleAcceptQuote = async (rfqId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/quotations/${rfqId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "accept",
          customerInfo: {
            customerName: user?.name,
            companyName: user?.company,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to accept quotation");
      }

      showToast(data.message, "success");
      setQuotations((prev) =>
        prev.map((q) => (q.id === rfqId ? data.quotation : q))
      );
      if (data.order) {
        setOrders((prev) => [data.order, ...prev]);
        setActiveTab("orders");
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectQuote = async (rfqId) => {
    if (!confirm("Are you sure you want to decline this commercial quotation?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/quotations/${rfqId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", reason: "Declined from customer portal" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast("Quotation marked as declined", "info");
      setQuotations((prev) =>
        prev.map((q) => (q.id === rfqId ? data.quotation : q))
      );
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const calculateHoursLeft = (expiresAt) => {
    if (!expiresAt || !now) return null;
    const diffMs = expiresAt - now;
    if (diffMs <= 0) return "Expired";
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m remaining`;
  };

  return (
    <>
      <Header />

      <main className="w-full page-offset pb-24 bg-warm-ivory min-h-screen">
        {/* Banner */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[12px] font-semibold text-accent-gold uppercase tracking-wider block mb-1">
                Enterprise Client Portal
              </span>
              <h1 className="text-[26px] sm:text-[34px] md:text-[44px] font-bold text-neutral-900 tracking-tight">
                {user ? user.company : "Procurement Portal"}
              </h1>
              <p className="text-[15px] text-neutral-500 mt-1">
                Logged in as {user ? `${user.name} (${user.email})` : "Guest Client"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => openQuoteModalWithItems()}
                className="px-6 py-3 rounded-full bg-primary-navy text-white text-[13px] font-semibold hover:bg-neutral-800 transition-all shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span className="material-symbols-outlined text-[18px] text-accent-gold">add</span>
                <span>New RFQ Dossier</span>
              </button>
            </div>
          </div>

          {/* Pill Tabs */}
          <div className="flex bg-neutral-200/60 p-1.5 rounded-full mt-8 max-w-md overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("quotations")}
              className={`flex-1 py-2.5 px-4 rounded-full text-[12.5px] font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === "quotations"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              <span>Quotations ({quotations.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`flex-1 py-2.5 px-4 rounded-full text-[12.5px] font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === "orders"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              <span>Orders &amp; MTRs ({orders.length})</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
          {loading ? (
            <div className="py-20 text-center text-[14px] text-neutral-500">
              Loading procurement register...
            </div>
          ) : activeTab === "quotations" ? (
            <div className="space-y-6">
              {quotations.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-black/[0.06] max-w-xl mx-auto">
                  <span className="material-symbols-outlined text-[48px] text-neutral-300 mb-3">
                    receipt_long
                  </span>
                  <h3 className="text-[20px] font-bold text-neutral-900">No RFQs recorded yet</h3>
                  <p className="text-[14px] text-neutral-500 mt-1 leading-relaxed">
                    Submit your multi-item fastener specifications to receive a verified 24-hour commercial quote.
                  </p>
                </div>
              ) : (
                quotations.map((q) => {
                  const timeLeft = calculateHoursLeft(q.expiresAt);
                  const isExpired = q.status === "EXPIRED" || (q.expiresAt && now > q.expiresAt);

                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/[0.06] space-y-6"
                    >
                      {/* Quote Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black/[0.06] gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[17px] font-bold text-neutral-900">
                            {q.rfqNumber}
                          </span>
                          {q.status === "QUOTATION_ISSUED" && !isExpired && (
                            <span className="px-3 py-1 rounded-full bg-accent-gold/15 text-neutral-900 text-[11px] font-bold border border-accent-gold/30 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[14px] text-accent-gold">schedule</span>
                              <span>QUOTATION READY • {timeLeft}</span>
                            </span>
                          )}
                          {q.status === "PENDING_REVIEW" && (
                            <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-semibold">
                              PENDING ENGINEERING REVIEW
                            </span>
                          )}
                          {q.status === "ACCEPTED" && (
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                              ACCEPTED • ORDER BOOKED
                            </span>
                          )}
                          {isExpired && (
                            <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-[11px] font-bold border border-red-200">
                              EXPIRED (24H WINDOW ELAPSED)
                            </span>
                          )}
                          {q.status === "REJECTED" && (
                            <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-500 text-[11px] font-semibold">
                              DECLINED
                            </span>
                          )}
                        </div>

                        <div className="text-[12.5px] text-neutral-500">
                          Submitted: {new Date(q.createdAt).toLocaleDateString()} • Destination: {q.destination}
                        </div>
                      </div>

                      {/* Line Items Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[13px]">
                          <thead>
                            <tr className="border-b border-black/[0.06] text-neutral-500 uppercase text-[11px] font-semibold tracking-wider">
                              <th className="py-2.5 pr-4">Fastener Specification</th>
                              <th className="py-2.5 pr-4 text-center">Quantity</th>
                              <th className="py-2.5 pr-4 text-right">Unit Price (INR)</th>
                              <th className="py-2.5 text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black/[0.04]">
                            {q.items.map((it, idx) => (
                              <tr key={idx}>
                                <td className="py-3.5 pr-4">
                                  <div className="font-bold text-neutral-900 text-[14px]">
                                    {it.name}
                                  </div>
                                  <div className="text-accent-gold text-[12px]">{it.specs}</div>
                                </td>
                                <td className="py-3.5 pr-4 text-center font-bold text-neutral-800">
                                  {it.quantity.toLocaleString()} {it.unit}
                                </td>
                                <td className="py-3.5 pr-4 text-right text-neutral-500">
                                  {it.unitPrice ? `₹${it.unitPrice.toFixed(2)}` : "Awaiting Quote"}
                                </td>
                                <td className="py-3.5 text-right font-bold text-neutral-900">
                                  {it.subtotal ? `₹${it.subtotal.toLocaleString()}` : "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Admin Notes & Quotation Total */}
                      {q.totalAmount && (
                        <div className="p-5 rounded-2xl bg-neutral-50 border border-black/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <span className="text-[12px] font-bold uppercase text-accent-gold block">
                              Engineering Specification &amp; Dispatch Note:
                            </span>
                            <p className="text-[13.5px] text-neutral-600 mt-1 leading-relaxed">
                              {q.adminNotes || "Includes full EN 10204 3.1 certification. Pricing valid for 24 hours."}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[12px] uppercase text-neutral-400 block font-semibold">
                              Commercial Lot Total:
                            </span>
                            <span className="text-[26px] font-bold text-neutral-900">
                              ₹{q.totalAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Actions: Accept or Reject within 24h */}
                      {q.status === "QUOTATION_ISSUED" && !isExpired && (
                        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-black/[0.06] gap-4">
                          <div className="text-[13px] text-accent-gold font-semibold flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">schedule</span>
                            <span>24-Hour Policy Window: {timeLeft}</span>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => handleRejectQuote(q.id)}
                              disabled={actionLoading}
                              className="w-1/2 sm:w-auto px-5 py-2.5 rounded-full bg-white border border-black/[0.12] text-neutral-700 text-[12.5px] font-semibold hover:bg-neutral-50 transition-colors"
                            >
                              Decline
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAcceptQuote(q.id)}
                              disabled={actionLoading}
                              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-full bg-primary-navy text-white text-[12.5px] font-semibold hover:bg-neutral-800 transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[17px] text-accent-gold">
                                check_circle
                              </span>
                              <span>Accept Quotation &amp; Generate Order</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {isExpired && q.status === "EXPIRED" && (
                        <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between text-[13px] text-neutral-500">
                          <span>Quotation expired after 24-hour metal commodity indexing window.</span>
                          <button
                            type="button"
                            onClick={() => openQuoteModalWithItems(q.items)}
                            className="text-accent-gold font-semibold hover:underline flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[16px]">refresh</span>
                            <span>Request Price Refresh</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* Orders Tab */
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-black/[0.06] max-w-xl mx-auto">
                  <span className="material-symbols-outlined text-[48px] text-neutral-300 mb-3">
                    local_shipping
                  </span>
                  <h3 className="text-[20px] font-bold text-neutral-900">No confirmed orders yet</h3>
                  <p className="text-[14px] text-neutral-500 mt-1 leading-relaxed">
                    Accept an issued quotation or proceed through B2B checkout to place an order.
                  </p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/[0.06] space-y-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black/[0.06] gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[17px] font-bold text-neutral-900">
                          {ord.orderNumber}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-semibold">
                          {ord.status.replace("_", " ")}
                        </span>
                        {ord.poNumber && (
                          <span className="px-3 py-1 rounded-full bg-accent-gold/15 text-neutral-900 text-[11px] font-semibold">
                            {ord.poNumber}
                          </span>
                        )}
                      </div>
                      <div className="text-[12.5px] text-neutral-500">
                        Booked: {new Date(ord.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px] p-4 rounded-2xl bg-neutral-50 border border-black/[0.04]">
                      <div>
                        <span className="text-neutral-400 block text-[11px] uppercase font-semibold">Destination:</span>
                        <span className="font-semibold text-neutral-900">{ord.deliveryAddress}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[11px] uppercase font-semibold">MTR Dossier Ref:</span>
                        <span className="font-bold text-accent-gold">{ord.mtrDossierNumber}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[11px] uppercase font-semibold">Scheduled Dispatch:</span>
                        <span className="font-bold text-primary-navy">{ord.dispatchDate}</span>
                      </div>
                    </div>

                    {/* Order Line Items */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[13px]">
                        <thead>
                          <tr className="border-b border-black/[0.06] text-neutral-500 uppercase text-[11px] font-semibold tracking-wider">
                            <th className="py-2.5 pr-4">Fastener Lot</th>
                            <th className="py-2.5 pr-4 text-center">Lot Quantity</th>
                            <th className="py-2.5 text-right">Invoiced Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.04]">
                          {ord.items.map((it, idx) => (
                            <tr key={idx}>
                              <td className="py-3.5 pr-4">
                                <div className="font-bold text-neutral-900 text-[14px]">
                                  {it.name}
                                </div>
                                <div className="text-accent-gold text-[12px]">{it.specs}</div>
                              </td>
                              <td className="py-3.5 pr-4 text-center font-bold text-neutral-800">
                                {it.quantity?.toLocaleString()} {it.unit || "pcs"}
                              </td>
                              <td className="py-3.5 text-right font-bold text-neutral-900">
                                {it.subtotal ? `₹${it.subtotal.toLocaleString()}` : "30-Day Net Term"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
