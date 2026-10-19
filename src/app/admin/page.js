"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useApp } from "@/context/AppContext";
import { products as initialProducts } from "@/data/products";
import { categories } from "@/data/categories";

export default function AdminPage() {
  const { user, login, showToast } = useApp();

  const [activeTab, setActiveTab] = useState("quotations"); // 'quotations' | 'orders' | 'products' | 'audit'
  const [quotations, setQuotations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productsList, setProductsList] = useState(initialProducts);
  const [loading, setLoading] = useState(true);

  // Admin Quick Login Form (if not logged in as Admin)
  const [adminEmail, setAdminEmail] = useState("admin@foifind.com");
  const [adminPassword, setAdminPassword] = useState("foifAdmin2025!");
  const [loginError, setLoginError] = useState(null);

  // Quote Preparation Modal State
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [pricedItems, setPricedItems] = useState([]);
  const [adminNotes, setAdminNotes] = useState("");
  const [issuingQuote, setIssuingQuote] = useState(false);

  // New Product Modal State
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("bolts");
  const [newProdSku, setNewProdSku] = useState("");
  const [newProdStandards, setNewProdStandards] = useState("DIN 933, ISO 4017");
  const [newProdMaterials, setNewProdMaterials] = useState("Grade 10.9, SS316");
  const [newProdMoq, setNewProdMoq] = useState("500");

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [qRes, oRes, pRes] = await Promise.all([
        fetch("/api/quotations"),
        fetch("/api/orders"),
        fetch("/api/products"),
      ]);
      const qData = await qRes.json();
      const oData = await oRes.json();
      const pData = await pRes.json();

      setQuotations(qData.quotations || []);
      setOrders(oData.orders || []);
      if (pData.products) setProductsList(pData.products);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    Promise.all([
      fetch("/api/quotations"),
      fetch("/api/orders"),
      fetch("/api/products"),
    ])
      .then(async ([qRes, oRes, pRes]) => {
        const [qData, oData, pData] = await Promise.all([
          qRes.json(),
          oRes.json(),
          pRes.json(),
        ]);

        if (!isActive) return;
        setQuotations(qData.quotations || []);
        setOrders(oData.orders || []);
        if (pData.products) setProductsList(pData.products);
      })
      .catch((err) => {
        console.error("Failed to load admin data:", err);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [user]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    try {
      await login(adminEmail, adminPassword);
      showToast("Admin access authenticated", "success");
    } catch (err) {
      setLoginError(err.message);
    }
  };

  // Open Prepare Quote Modal
  const openPrepareModal = (quote) => {
    setSelectedQuote(quote);
    setPricedItems(
      quote.items.map((it) => ({
        ...it,
        unitPrice: it.unitPrice || 45.0,
      }))
    );
    setAdminNotes(quote.adminNotes || "Official B2B quotation valid for 24 hours. Batch MTR 3.1 cert included.");
  };

  const handlePriceChange = (index, price) => {
    setPricedItems((prev) => {
      const updated = [...prev];
      const p = parseFloat(price) || 0;
      updated[index] = {
        ...updated[index],
        unitPrice: p,
        subtotal: p * updated[index].quantity,
      };
      return updated;
    });
  };

  const handleIssueQuotation = async () => {
    if (!selectedQuote) return;
    setIssuingQuote(true);

    const totalAmount = pricedItems.reduce((acc, curr) => acc + (curr.unitPrice * curr.quantity), 0);

    try {
      const res = await fetch(`/api/quotations/${selectedQuote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "prepare",
          pricedItems: pricedItems.map((it) => ({
            ...it,
            subtotal: it.unitPrice * it.quantity,
          })),
          totalAmount,
          adminNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(`Quotation ${selectedQuote.rfqNumber} issued with 24h validity!`, "success");
      setSelectedQuote(null);
      loadAdminData();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIssuingQuote(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const catObj = categories.find((c) => c.slug === newProdCategory);
      const payload = {
        id: `foif-${Date.now()}`,
        sku: newProdSku || `FOIF-${Date.now().toString().slice(-4)}`,
        name: newProdName,
        category: newProdCategory,
        categoryName: catObj?.title || "Industrial Fasteners",
        categoryCode: catObj?.code || "CAT-01",
        standards: newProdStandards.split(",").map((s) => s.trim()),
        materials: newProdMaterials.split(",").map((m) => m.trim()),
        minOrderQuantity: parseInt(newProdMoq, 10) || 500,
        unit: "pcs",
        pricingType: "quotation",
        inStockStatus: "Available on 48h dispatch",
        image: catObj?.image || productsList[0]?.image,
        description: `High precision ${newProdName} meeting international standards.`,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(`Product ${newProdName} added to catalogue`, "success");
      setIsNewProductOpen(false);
      loadAdminData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!confirm(`Delete ${name} from master catalogue?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast(`Removed ${name}`, "info");
        loadAdminData();
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <>
      <Header />

      <main className="w-full page-offset pb-20 bg-background min-h-screen">
        {/* Banner */}
        <div className="bg-primary text-surface-container-lowest border-b border-soft-border py-8">
          <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="badge-mono-gold text-[10px] mb-2 inline-block">
                  CENTRAL COMMAND &amp; DISPATCH DESK
                </span>
                <h1 className="font-headline text-[28px] md:text-[34px] font-bold text-white tracking-tight">
                  FOIF Administration Portal
                </h1>
                <p className="font-mono text-[12px] text-white/70 mt-1">
                  MTR 3.1 Certification Control • 24h Quotation Matrix • Dispatch Registry
                </p>
              </div>

              {user?.role === "ADMIN" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsNewProductOpen(true)}
                    className="px-4 py-2 rounded btn-tactile-gold font-mono text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_box</span>
                    <span>Add New SKU</span>
                  </button>
                </div>
              )}
            </div>

            {/* Admin Tabs */}
            {user?.role === "ADMIN" && (
              <div className="flex border-b border-white/20 mt-8 gap-4 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("quotations")}
                  className={`pb-2.5 font-mono text-[12px] uppercase font-bold tracking-wider flex items-center gap-1.5 border-b-2 transition-colors shrink-0 ${
                    activeTab === "quotations"
                      ? "text-secondary-fixed-dim border-secondary-fixed-dim"
                      : "text-white/60 border-transparent hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">request_quote</span>
                  <span>Quotations &amp; RFQs ({quotations.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className={`pb-2.5 font-mono text-[12px] uppercase font-bold tracking-wider flex items-center gap-1.5 border-b-2 transition-colors shrink-0 ${
                    activeTab === "orders"
                      ? "text-secondary-fixed-dim border-secondary-fixed-dim"
                      : "text-white/60 border-transparent hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">inventory</span>
                  <span>Orders &amp; Dispatch ({orders.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("products")}
                  className={`pb-2.5 font-mono text-[12px] uppercase font-bold tracking-wider flex items-center gap-1.5 border-b-2 transition-colors shrink-0 ${
                    activeTab === "products"
                      ? "text-secondary-fixed-dim border-secondary-fixed-dim"
                      : "text-white/60 border-transparent hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">category</span>
                  <span>Product Catalogue ({productsList.length})</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin pt-8">
          {/* If user is NOT logged in as admin, display Admin Authentication Gate */}
          {user?.role !== "ADMIN" ? (
            <div className="max-w-md mx-auto card-tactile p-6 sm:p-8 rounded-lg shadow-foif-lg text-center space-y-4">
              <div className="w-12 h-12 rounded bg-primary text-secondary flex items-center justify-center font-bold mx-auto border border-secondary">
                <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
              </div>
              <div>
                <h2 className="font-headline text-[20px] font-bold text-primary">
                  Authorized Admin Access
                </h2>
                <p className="font-body text-[13px] text-muted-grey mt-1">
                  Enforces server-side authorization. Please authenticate as FOIF Central Desk.
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded bg-error-container text-on-error-container font-mono text-[11.5px]">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-3.5 text-left">
                <div>
                  <label className="block font-mono text-[10.5px] uppercase font-bold text-primary mb-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded input-inset font-body text-[13px]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10.5px] uppercase font-bold text-primary mb-1">
                    Master Passkey
                  </label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded input-inset font-body text-[13px]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded btn-tactile-primary font-mono text-[11.5px] uppercase font-bold"
                >
                  Authenticate as Admin Desk
                </button>
              </form>
            </div>
          ) : (
            /* Admin Management Interface */
            <div className="space-y-6">
              {/* Tab 1: Quotations Management */}
              {activeTab === "quotations" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between font-mono text-[12px] text-muted-grey">
                    <span>Active Request for Quotation Registry</span>
                    <span>Server-side 24-hour Expiry Logic Active</span>
                  </div>

                  <div className="space-y-4">
                    {quotations.map((q) => (
                      <div
                        key={q.id}
                        className="card-tactile p-5 rounded-lg space-y-3.5 border border-soft-border"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-soft-border gap-2">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[14px] font-bold text-primary">
                              {q.rfqNumber}
                            </span>
                            <span className="badge-mono text-[10px] text-secondary">
                              {q.status.replace("_", " ")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {q.status === "PENDING_REVIEW" && (
                              <button
                                type="button"
                                onClick={() => openPrepareModal(q)}
                                className="px-3.5 py-1.5 rounded btn-tactile-gold font-mono text-[11px] uppercase font-bold flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-[15px]">edit_note</span>
                                <span>Prepare Quotation (24h)</span>
                              </button>
                            )}

                            {q.status === "QUOTATION_ISSUED" && (
                              <button
                                type="button"
                                onClick={() => openPrepareModal(q)}
                                className="px-3 py-1 rounded btn-tactile-surface font-mono text-[10.5px] uppercase"
                              >
                                Revise Pricing
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Client Coordinates */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 rounded bg-surface font-mono text-[11.5px]">
                          <div>
                            <span className="text-muted-grey block text-[10px] uppercase">Client Company:</span>
                            <span className="font-bold text-primary">{q.companyName}</span>
                          </div>
                          <div>
                            <span className="text-muted-grey block text-[10px] uppercase">Contact / Email:</span>
                            <span className="font-medium text-primary">{q.customerName} ({q.email})</span>
                          </div>
                          <div>
                            <span className="text-muted-grey block text-[10px] uppercase">Phone:</span>
                            <span className="font-medium text-primary">{q.phone}</span>
                          </div>
                          <div>
                            <span className="text-muted-grey block text-[10px] uppercase">Delivery Site:</span>
                            <span className="font-medium text-primary">{q.destination}</span>
                          </div>
                        </div>

                        {/* Line Items */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-left font-mono text-[12px]">
                            <thead>
                              <tr className="border-b border-soft-border text-muted-grey uppercase text-[10px]">
                                <th className="py-1.5 pr-4">Fastener Lot Specification</th>
                                <th className="py-1.5 pr-4 text-center">Quantity</th>
                                <th className="py-1.5 text-right">Unit Price (INR)</th>
                                <th className="py-1.5 text-right">Line Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {q.items.map((it, idx) => (
                                <tr key={idx} className="border-b border-soft-border/50">
                                  <td className="py-2 pr-4">
                                    <div className="font-bold text-primary">{it.name}</div>
                                    <div className="text-[11px] text-secondary">{it.specs}</div>
                                  </td>
                                  <td className="py-2 pr-4 text-center font-bold">
                                    {it.quantity?.toLocaleString()} {it.unit}
                                  </td>
                                  <td className="py-2 text-right">
                                    {it.unitPrice ? `₹${it.unitPrice.toFixed(2)}` : "—"}
                                  </td>
                                  <td className="py-2 text-right font-bold text-primary">
                                    {it.subtotal ? `₹${it.subtotal.toLocaleString()}` : "Pending"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {q.customerNotes && (
                          <div className="font-body text-[12.5px] text-muted-grey p-2.5 rounded bg-surface border border-soft-border">
                            <span className="font-mono text-[10px] text-secondary font-bold uppercase block mb-0.5">
                              Client Technical Drawing / Specification Notes:
                            </span>
                            {q.customerNotes}
                            {q.attachmentName && (
                              <span className="font-mono text-[11px] text-primary font-bold block mt-1">
                                📎 Attached Drawing: {q.attachmentName}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Orders & Dispatch Management */}
              {activeTab === "orders" && (
                <div className="space-y-4">
                  <div className="font-mono text-[12px] text-muted-grey">
                    Confirmed Orders &amp; Material Traceability Register
                  </div>

                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="card-tactile p-5 rounded-lg space-y-3.5 border border-soft-border"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-soft-border gap-2">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[14px] font-bold text-primary">
                              {ord.orderNumber}
                            </span>
                            <span className="badge-mono text-[10px] text-secondary">
                              {ord.status.replace("_", " ")}
                            </span>
                            <span className="badge-mono text-[10px]">{ord.poNumber}</span>
                          </div>

                          <div className="font-mono text-[11.5px] font-bold text-secondary">
                            MTR Dossier: {ord.mtrDossierNumber}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded bg-surface font-mono text-[11.5px]">
                          <div>
                            <span className="text-muted-grey block text-[10px] uppercase">Buyer Enterprise:</span>
                            <span className="font-bold text-primary">{ord.companyName}</span>
                          </div>
                          <div>
                            <span className="text-muted-grey block text-[10px] uppercase">Delivery Site:</span>
                            <span className="text-primary font-medium">{ord.deliveryAddress}</span>
                          </div>
                          <div>
                            <span className="text-muted-grey block text-[10px] uppercase">Dispatch Hub:</span>
                            <span className="text-primary font-medium">Tirunelveli Central Fastener Plant</span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-left font-mono text-[12px]">
                            <thead>
                              <tr className="border-b border-soft-border text-muted-grey uppercase text-[10px]">
                                <th className="py-1.5 pr-4">Fastener Lot</th>
                                <th className="py-1.5 pr-4 text-center">Quantity</th>
                                <th className="py-1.5 text-right">Invoiced Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ord.items.map((it, idx) => (
                                <tr key={idx} className="border-b border-soft-border/50">
                                  <td className="py-2 pr-4">
                                    <div className="font-bold text-primary">{it.name}</div>
                                    <div className="text-[11px] text-secondary">{it.specs}</div>
                                  </td>
                                  <td className="py-2 pr-4 text-center font-bold">
                                    {it.quantity?.toLocaleString()} {it.unit || "pcs"}
                                  </td>
                                  <td className="py-2 text-right font-bold text-primary">
                                    {it.subtotal ? `₹${it.subtotal.toLocaleString()}` : "30-Day Net Term"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Product Catalogue Management */}
              {activeTab === "products" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between font-mono text-[12px] text-muted-grey">
                    <span>Master Fastener Catalogue Index ({productsList.length} SKUs)</span>
                    <button
                      onClick={() => setIsNewProductOpen(true)}
                      className="px-3 py-1 rounded btn-tactile-primary font-mono text-[11px] uppercase font-bold"
                    >
                      + Add New Fastener SKU
                    </button>
                  </div>

                  <div className="overflow-x-auto card-tactile rounded-lg">
                    <table className="w-full text-left font-mono text-[12px]">
                      <thead className="bg-surface-container-low border-b border-soft-border uppercase text-[10px] text-muted-grey">
                        <tr>
                          <th className="p-3">SKU / Code</th>
                          <th className="p-3">Fastener Name</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Standards</th>
                          <th className="p-3">MOQ</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productsList.map((p) => (
                          <tr key={p.id} className="border-b border-soft-border hover:bg-surface/50">
                            <td className="p-3 font-bold text-secondary">{p.sku}</td>
                            <td className="p-3 font-bold text-primary">{p.name}</td>
                            <td className="p-3">
                              <span className="badge-mono text-[9.5px]">{p.categoryCode}</span>
                            </td>
                            <td className="p-3 text-muted-grey">{p.standards?.join(", ")}</td>
                            <td className="p-3">{p.minOrderQuantity} {p.unit}</td>
                            <td className="p-3 text-right space-x-2">
                              <Link
                                href={`/products/${p.id}`}
                                className="text-secondary hover:underline"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="text-error hover:underline"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Quotation Preparation Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-secondary/40 p-6 space-y-4 max-h-[90vh] overflow-y-auto card-tactile">
            <div className="flex items-center justify-between pb-3 border-b border-soft-border">
              <div>
                <h3 className="font-headline text-[18px] font-bold text-primary">
                  Prepare Commercial Quotation: {selectedQuote.rfqNumber}
                </h3>
                <span className="font-mono text-[11px] text-secondary">
                  Buyer: {selectedQuote.companyName} ({selectedQuote.customerName})
                </span>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="text-muted-grey hover:text-primary"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-[11px] font-bold uppercase text-primary block">
                Assign Unit Prices (INR) per Fastener Lot:
              </span>

              {pricedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded bg-surface border border-soft-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[12px]"
                >
                  <div>
                    <div className="font-bold text-primary">{item.name}</div>
                    <div className="text-[11px] text-secondary">{item.specs}</div>
                    <div className="text-[11px] text-muted-grey mt-0.5">
                      Lot Qty: {item.quantity?.toLocaleString()} {item.unit}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-grey">Price / Unit: ₹</span>
                    <input
                      type="number"
                      step="0.10"
                      value={item.unitPrice}
                      onChange={(e) => handlePriceChange(idx, e.target.value)}
                      className="w-24 px-2 py-1 rounded input-inset font-mono text-[12px] font-bold text-right"
                    />
                    <span className="font-bold text-primary min-w-[80px] text-right">
                      = ₹{((item.unitPrice || 0) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}

              <div>
                <label className="block font-mono text-[11px] uppercase font-bold text-primary mb-1">
                  Engineering Notes &amp; Dispatch Commitment (Included in Quote)
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded input-inset font-body text-[13px] resize-none"
                />
              </div>

              <div className="p-3 rounded bg-secondary/10 border border-secondary/30 font-mono text-[11px] text-secondary">
                ⚡ <strong>24-Hour Policy Rule:</strong> Once issued, a 24-hour countdown clock is locked in. The client can accept and convert this quote into an order within 24 hours. After 24 hours, the backend will strictly expire this quote.
              </div>
            </div>

            <div className="pt-3 border-t border-soft-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                className="px-4 py-2 rounded btn-tactile-surface font-mono text-[11px] uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleIssueQuotation}
                disabled={issuingQuote}
                className="px-5 py-2 rounded btn-tactile-primary font-mono text-[11.5px] uppercase font-bold flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">send</span>
                <span>Issue 24-Hour Quotation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Product Modal */}
      {isNewProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-secondary/40 p-6 space-y-4 card-tactile">
            <div className="flex items-center justify-between pb-3 border-b border-soft-border">
              <h3 className="font-headline text-[18px] font-bold text-primary">
                Add New Fastener SKU to Catalogue
              </h3>
              <button
                onClick={() => setIsNewProductOpen(false)}
                className="text-muted-grey hover:text-primary"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div>
                <label className="block font-mono text-[10.5px] uppercase font-bold text-primary mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metric Heavy Hex Nut DIN 934"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 rounded input-inset font-body text-[13px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10.5px] uppercase font-bold text-primary mb-1">
                    Category Discipline
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded input-inset font-body text-[13px]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.code} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10.5px] uppercase font-bold text-primary mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FOIF-N-DIN934"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    className="w-full px-3 py-2 rounded input-inset font-body text-[13px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10.5px] uppercase font-bold text-primary mb-1">
                  Standards (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="DIN 934, ISO 4032"
                  value={newProdStandards}
                  onChange={(e) => setNewProdStandards(e.target.value)}
                  className="w-full px-3 py-2 rounded input-inset font-body text-[13px]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10.5px] uppercase font-bold text-primary mb-1">
                  Materials (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Grade 8, Grade 10, SS316"
                  value={newProdMaterials}
                  onChange={(e) => setNewProdMaterials(e.target.value)}
                  className="w-full px-3 py-2 rounded input-inset font-body text-[13px]"
                />
              </div>

              <div className="pt-3 border-t border-soft-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProductOpen(false)}
                  className="px-4 py-2 rounded btn-tactile-surface font-mono text-[11px] uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded btn-tactile-primary font-mono text-[11.5px] uppercase font-bold"
                >
                  Create Product SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
