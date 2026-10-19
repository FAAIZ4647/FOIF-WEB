"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/data/categories";
import { useApp } from "@/context/AppContext";
import SearchModal from "@/components/ui/SearchModal";
import CartDrawer from "@/components/ui/CartDrawer";
import WishlistDrawer from "@/components/ui/WishlistDrawer";
import QuoteModal from "@/components/ui/QuoteModal";

export default function Header() {
  const {
    user,
    logout,
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    openQuoteModalWithItems,
  } = useApp();

  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsProductsDropdownOpen(false);
    setIsMobileCategoriesOpen(false);
  }

  useEffect(() => {
    document.body.classList.toggle("overlay-open", isMobileMenuOpen);
    return () => document.body.classList.remove("overlay-open");
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-2xl border-b border-black/[0.06] pt-[env(safe-area-inset-top)]">
        {/* Top Minimalist Operational Bar */}
        <div className="bg-[#0B1528] text-white/80 text-[11px] sm:text-[12px] border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between h-8 sm:h-9 gap-3 overflow-hidden">
            <div className="flex min-w-0 items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 text-stone-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A] animate-pulse"></span>
                <span className="font-normal whitespace-nowrap">ISO 9001:2015 Traceability</span>
              </div>
              <span className="hidden sm:inline text-white/20">/</span>
              <a
                href="tel:+917200979731"
                className="flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[14px] text-[#D6B46A]">call</span>
                <span className="whitespace-nowrap">+91 72009 79731</span>
              </a>
              <span className="hidden lg:inline text-white/20">/</span>
              <div className="hidden lg:flex items-center gap-1.5 text-stone-400">
                <span>Chennai &amp; Tirunelveli</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[10px] sm:text-[11px] shrink-0">
              <span className="hidden md:inline text-stone-400">Enterprise Procurement</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[#D6B46A] font-medium border border-white/10 whitespace-nowrap">
                EN 10204 3.1
              </span>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 flex items-center justify-between h-16 sm:h-18 gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-2xl bg-[#0F1E36] flex items-center justify-center text-[#D6B46A] font-semibold text-[19px] group-hover:scale-105 transition-transform shadow-sm border border-[#D6B46A]/20">
                F
              </div>
              <div className="flex flex-col">
                <span className="text-[19px] tracking-tight text-[#0F1E36] leading-none font-semibold">
                  FOIF
                </span>
                <span className="text-[11px] text-stone-500 tracking-normal font-normal">
                  Industrial Fasteners
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-8">
            <Link
              href="/"
              className="text-[14px] font-medium text-stone-700 hover:text-black transition-colors"
            >
              Home
            </Link>

            {/* Products Mega-Menu Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsProductsDropdownOpen(true)}
              onMouseLeave={() => setIsProductsDropdownOpen(false)}
            >
              <Link
                href="/products"
                className="flex items-center gap-1 text-[14px] font-medium text-stone-700 hover:text-black transition-colors py-2"
              >
                Catalogue
                <span
                  className={`material-symbols-outlined text-[16px] text-stone-400 transition-transform duration-200 ${
                    isProductsDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>
              </Link>

              {/* Mega-menu Panel */}
              <div
                className={`transition-all duration-200 fixed top-[110px] left-1/2 -translate-x-1/2 w-[92vw] max-w-6xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-black/[0.08] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.15)] p-8 ${
                  isProductsDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] mb-6">
                  <div>
                    <h3 className="text-[17px] font-semibold text-[#0F1E36]">
                      Master Industrial Catalogue
                    </h3>
                    <p className="text-[13px] text-stone-500 mt-0.5">
                      Engineered high-tensile hardware manufactured to DIN, ISO, ASTM &amp; IS standards.
                    </p>
                  </div>
                  <Link
                    href="/products"
                    onClick={() => setIsProductsDropdownOpen(false)}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#B68A3A] hover:text-[#0F1E36] transition-colors"
                  >
                    <span>Browse All 28 Products</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                <div className="grid grid-cols-4 lg:grid-cols-7 gap-4">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setIsProductsDropdownOpen(false)}
                      className="p-4 rounded-2xl bg-stone-50/80 hover:bg-stone-100/90 transition-all group/item border border-black/[0.04] hover:border-black/[0.1] hover:-translate-y-0.5"
                    >
                      <div className="text-[11px] font-semibold text-[#B68A3A] mb-1">
                        {cat.code}
                      </div>
                      <div className="text-[13.5px] font-semibold text-stone-900 group-hover/item:text-[#0F1E36] mb-1 leading-snug">
                        {cat.title}
                      </div>
                      <div className="text-[12px] text-stone-500 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/products"
              className="text-[14px] font-medium text-stone-700 hover:text-black transition-colors"
            >
              All Products
            </Link>
            <Link
              href="/#manufacturing"
              className="text-[14px] font-medium text-stone-700 hover:text-black transition-colors"
            >
              Manufacturing
            </Link>
            <Link
              href="/#industries"
              className="text-[14px] font-medium text-stone-700 hover:text-black transition-colors"
            >
              Sectors
            </Link>
            <Link
              href="/#quality"
              className="text-[14px] font-medium text-stone-700 hover:text-black transition-colors"
            >
              Quality Lab
            </Link>
            <Link
              href="/#contact"
              className="text-[14px] font-medium text-stone-700 hover:text-black transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Utilities (Apple-Style Quick Procurement) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search Catalogue"
              className="h-10 w-10 sm:w-auto sm:px-3.5 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-600 flex items-center justify-center gap-2 text-[13px] transition-all"
              title="Search catalogue (Ctrl+K)"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span className="hidden lg:inline font-normal text-stone-500">Search fasteners...</span>
            </button>

            {/* Wishlist Trigger */}
            <button
              type="button"
              onClick={() => setIsWishlistOpen(true)}
              className="hidden sm:flex h-10 w-10 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-700 items-center justify-center transition-all relative"
              title="Saved technical specifications"
            >
              <span className="material-symbols-outlined text-[19px]">bookmark</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B68A3A] text-white text-[10px] font-semibold flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="h-10 px-2.5 sm:px-4 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-800 flex items-center gap-2 text-[13px] font-medium transition-all"
              title="View procurement cart"
            >
              <span className="material-symbols-outlined text-[19px] text-[#B68A3A]">
                shopping_bag
              </span>
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#0F1E36] text-white text-[11px] font-medium">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Request a Quote CTA */}
            <button
              type="button"
              onClick={() => openQuoteModalWithItems()}
              className="hidden md:inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[#0F1E36] text-white hover:bg-[#182C4D] text-[13px] font-medium transition-all shadow-sm active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[16px] text-[#D6B46A]">request_quote</span>
              <span>Request Quote</span>
            </button>

            {/* User Account / Menu */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="h-10 w-10 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-800 flex items-center justify-center transition-all"
                title="Account Menu"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {user?.role === "ADMIN" ? "admin_panel_settings" : "account_circle"}
                </span>
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-black/[0.08] p-3 z-50 animate-fade-in"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  {user ? (
                    <div className="space-y-3">
                      <div className="pb-3 border-b border-black/[0.06] px-1">
                        <span className="text-[11px] font-medium text-[#B68A3A] block">
                          {user.role === "ADMIN" ? "Central Administrator" : "Enterprise Buyer"}
                        </span>
                        <div className="text-[14px] font-semibold text-stone-900 truncate mt-0.5">
                          {user.name}
                        </div>
                        <div className="text-[12px] text-stone-500 truncate">{user.company}</div>
                      </div>

                      <div className="space-y-1 text-[13px]">
                        {user.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-100 text-stone-800 transition-colors font-medium"
                          >
                            <span className="material-symbols-outlined text-[17px] text-[#B68A3A]">
                              dashboard
                            </span>
                            <span>Admin Pricing Desk</span>
                          </Link>
                        )}

                        <Link
                          href="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-100 text-stone-800 transition-colors font-medium"
                        >
                          <span className="material-symbols-outlined text-[17px] text-[#B68A3A]">
                            receipt_long
                          </span>
                          <span>Quotations &amp; Orders</span>
                        </Link>

                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-red-50 text-red-600 text-left transition-colors font-medium"
                        >
                          <span className="material-symbols-outlined text-[17px]">logout</span>
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 p-1">
                      <div className="pb-2 border-b border-black/[0.06]">
                        <span className="text-[14px] font-semibold text-stone-900 block">
                          Enterprise Portal
                        </span>
                        <span className="text-[12px] text-stone-500">
                          Access quotations, live 24h orders &amp; MTRs
                        </span>
                      </div>

                      <Link
                        href="/login"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center justify-center py-2.5 rounded-full bg-[#0F1E36] text-white text-[13px] font-medium shadow-sm hover:bg-[#182C4D] transition-all"
                      >
                        Sign In / Register
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden h-10 w-10 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center"
              aria-label="Toggle Navigation"
            >
              <span className="material-symbols-outlined text-[22px]">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-white/95 backdrop-blur-2xl border-b border-black/[0.08] px-4 sm:px-6 py-5 space-y-4 animate-fade-in max-h-[min(85vh,720px)] overflow-y-auto">
            <div className="space-y-1">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2.5 text-[15px] font-medium text-stone-800 hover:text-black"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2.5 text-[15px] font-medium text-[#0F1E36]"
              >
                Browse All 28 Products
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileCategoriesOpen((open) => !open)}
                className="w-full flex items-center justify-between py-2.5 text-[15px] font-medium text-stone-800"
              >
                <span>Catalogue disciplines</span>
                <span className={`material-symbols-outlined text-[18px] transition-transform ${isMobileCategoriesOpen ? "rotate-180" : ""}`}>
                  expand_more
                </span>
              </button>
              {isMobileCategoriesOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-xl bg-stone-50 px-3 py-2.5 text-[13px] font-medium text-stone-700"
                    >
                      <span className="block text-[10px] text-[#B68A3A] font-semibold">{cat.code}</span>
                      {cat.title}
                    </Link>
                  ))}
                </div>
              )}
              <Link
                href="/#manufacturing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-[15px] font-medium text-stone-800 hover:text-black"
              >
                OEM Manufacturing
              </Link>
              <Link
                href="/#industries"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-[15px] font-medium text-stone-800 hover:text-black"
              >
                Industry Sectors
              </Link>
              <Link
                href="/#quality"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-[15px] font-medium text-stone-800 hover:text-black"
              >
                Testing Laboratory
              </Link>
              <Link
                href="/#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-[15px] font-medium text-stone-800 hover:text-black"
              >
                Contact &amp; Plant Coordinates
              </Link>
            </div>

            <div className="pt-4 border-t border-black/[0.06] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-stone-100 px-3 py-3 text-[13px] font-medium text-stone-700"
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  Search catalogue
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsWishlistOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-stone-100 px-3 py-3 text-[13px] font-medium text-stone-700"
                >
                  <span className="material-symbols-outlined text-[18px]">bookmark</span>
                  Saved specs ({wishlistCount})
                </button>
                <Link
                  href={user ? "/dashboard" : "/login"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-stone-100 px-3 py-3 text-[13px] font-medium text-stone-700"
                >
                  <span className="material-symbols-outlined text-[18px]">account_circle</span>
                  {user ? "Client dashboard" : "Sign in / Register"}
                </Link>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openQuoteModalWithItems();
                }}
                className="w-full py-3 rounded-full bg-[#0F1E36] text-white text-[14px] font-medium flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[17px] text-[#D6B46A]">request_quote</span>
                <span>Request Enterprise Quotation</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Modals & Drawers */}
      <SearchModal />
      <CartDrawer />
      <WishlistDrawer />
      <QuoteModal />
    </>
  );
}
