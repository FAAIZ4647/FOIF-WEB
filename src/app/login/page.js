"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, user } = useApp();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const loggedIn = await login(email, password);
      if (loggedIn.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register({ email, password, name, company, phone });
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCustomer = () => {
    setEmail("procurement@larsentoubro.com");
    setPassword("customer2025!");
    setMode("login");
  };

  const fillDemoAdmin = () => {
    setEmail("admin@foifind.com");
    setPassword("foifAdmin2025!");
    setMode("login");
  };

  return (
    <>
      <Header />

      <main className="w-full page-offset pb-24 bg-warm-ivory min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-black/[0.06]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary-navy text-accent-gold flex items-center justify-center font-bold text-xl mx-auto mb-3 shadow-sm">
              F
            </div>
            <h1 className="text-[24px] font-bold text-neutral-900 tracking-tight">
              Enterprise Procurement Portal
            </h1>
            <p className="text-[14px] text-neutral-500 mt-1 leading-relaxed">
              Access engineering RFQ dossiers, 24h quotation approvals &amp; MTRs
            </p>
          </div>

          {/* Pill Tab Selector */}
          <div className="flex bg-neutral-100 p-1 rounded-full mb-6">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2 text-[12px] font-semibold rounded-full transition-all ${
                mode === "login"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-2 text-[12px] font-semibold rounded-full transition-all ${
                mode === "register"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Register Enterprise
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 text-red-700 border border-red-200 text-[13px] flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-neutral-700 mb-1.5">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-black/[0.08] focus:bg-white focus:border-accent-gold outline-none text-[14px] text-neutral-900 transition-all"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-neutral-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-black/[0.08] focus:bg-white focus:border-accent-gold outline-none text-[14px] text-neutral-900 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-primary-navy text-white text-[13px] font-semibold hover:bg-neutral-800 transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                {loading ? "Authenticating..." : "Sign In to Portal"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-neutral-700 mb-1.5">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Larsen & Toubro Heavy Civil"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-black/[0.08] focus:bg-white focus:border-accent-gold outline-none text-[13.5px] text-neutral-900 transition-all"
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-black/[0.08] focus:bg-white focus:border-accent-gold outline-none text-[13.5px] text-neutral-900 transition-all"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-neutral-700 mb-1.5">
                  Corporate Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-black/[0.08] focus:bg-white focus:border-accent-gold outline-none text-[13.5px] text-neutral-900 transition-all"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-neutral-700 mb-1.5">
                  Direct Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-black/[0.08] focus:bg-white focus:border-accent-gold outline-none text-[13.5px] text-neutral-900 transition-all"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-neutral-700 mb-1.5">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-black/[0.08] focus:bg-white focus:border-accent-gold outline-none text-[13.5px] text-neutral-900 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-primary-navy text-white text-[13px] font-semibold hover:bg-neutral-800 transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                {loading ? "Registering..." : "Create Enterprise Account"}
              </button>
            </form>
          )}

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-8 pt-5 border-t border-black/[0.06] space-y-2.5">
            <span className="text-[11px] font-semibold text-neutral-400 block text-center uppercase tracking-wider">
              Quick Test Autofill
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={fillDemoCustomer}
                className="py-2 px-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11.5px] font-semibold text-center transition-colors"
              >
                Demo Customer
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="py-2 px-3 rounded-full bg-accent-gold/15 hover:bg-accent-gold/25 text-neutral-900 text-[11.5px] font-bold text-center transition-colors"
              >
                Demo Admin
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
