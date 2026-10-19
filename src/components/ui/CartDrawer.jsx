"use client";

import Image from "next/image";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function CartDrawer() {
  const {
    cart,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    openQuoteModalWithItems,
  } = useApp();

  if (!isCartOpen) return null;

  const totalQuantity = cart.reduce((acc, curr) => acc + (curr.quantity || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-md animate-fade-in">
      {/* Backdrop */}
      <div className="flex-1" onClick={() => setIsCartOpen(false)} />

      {/* Drawer Container */}
      <div className="drawer-panel bg-white h-full shadow-2xl border-l border-black/[0.06] flex flex-col justify-between">
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-[#B68A3A]">
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            </div>
            <div>
              <h3 className="text-[17px] font-semibold text-[#0F1E36]">Procurement Cart</h3>
              <span className="text-[12px] text-stone-500 font-normal">
                {cartCount} items • {totalQuantity.toLocaleString()} total units
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cartCount > 0 && (
              <button
                onClick={clearCart}
                className="text-[12px] text-stone-400 hover:text-red-600 px-2 py-1 font-medium transition-colors"
                title="Clear all cart items"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
              aria-label="Close cart"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {cartCount === 0 ? (
            <div className="py-24 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-300 mb-4">
                <span className="material-symbols-outlined text-[32px]">remove_shopping_cart</span>
              </div>
              <h4 className="text-[17px] font-semibold text-stone-900">Your procurement cart is empty</h4>
              <p className="text-[13.5px] text-stone-500 max-w-xs mt-1.5 leading-relaxed font-normal">
                Explore our DIN / ISO certified structural bolts, screws, anchors, and specialty hardware.
              </p>
              <Link
                href="/products"
                onClick={() => setIsCartOpen(false)}
                className="mt-6 h-11 px-6 rounded-full bg-[#0F1E36] text-white text-[13px] font-medium inline-flex items-center gap-2 shadow-sm"
              >
                <span>Browse 28 Products</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-2xl bg-stone-50 border border-black/[0.04] space-y-3"
              >
                <div className="flex items-start gap-3">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-xl object-cover bg-stone-200 shrink-0 border border-black/[0.04]"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[14px] font-semibold text-stone-900 truncate">
                      {item.name}
                    </h5>
                    {item.specs && (
                      <div className="text-[12px] text-stone-500 mt-0.5 line-clamp-1 font-normal">
                        {item.specs}
                      </div>
                    )}
                    <span className="text-[11.5px] font-medium text-[#B68A3A] mt-1 block">
                      Quotation Pricing
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                    title="Remove item"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>

                {/* Quantity Control Stepper */}
                <div className="flex items-center justify-between pt-2 border-t border-black/[0.04]">
                  <span className="text-[11.5px] text-stone-400 font-medium">Quantity:</span>
                  <div className="flex items-center bg-white rounded-full px-2 py-1 shadow-2xs border border-black/[0.04]">
                    <button
                      onClick={() => updateCartQuantity(item.id, Math.max(10, (item.quantity || 500) - 250))}
                      className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-stone-600 hover:bg-stone-100 text-[12px]"
                    >
                      -
                    </button>
                    <span className="px-3 text-[12px] font-semibold text-[#0F1E36] min-w-[60px] text-center">
                      {(item.quantity || 0).toLocaleString()} {item.unit || "pcs"}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, (item.quantity || 500) + 250)}
                      className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-stone-600 hover:bg-stone-100 text-[12px]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Actions */}
        {cartCount > 0 && (
          <div className="p-4 sm:p-6 border-t border-black/[0.06] bg-stone-50/80 space-y-3">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-stone-500">Selected Hardware</span>
              <span className="font-semibold text-stone-900">{cartCount} items / {totalQuantity.toLocaleString()} pcs</span>
            </div>

            <div className="flex items-center justify-between text-[13px] pb-1">
              <span className="text-stone-500">Commercial Terms</span>
              <span className="text-[#B68A3A] font-medium">30-Day Net / RFQ Sourced</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 pt-2">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full h-12 rounded-full bg-[#0F1E36] text-white hover:bg-[#182C4D] text-[14px] font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Proceed to Commercial Checkout</span>
                <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  openQuoteModalWithItems(cart);
                }}
                className="w-full h-11 rounded-full bg-white text-[#0F1E36] border border-black/[0.1] hover:bg-stone-100 text-[13px] font-medium flex items-center justify-center gap-2 transition-all"
              >
                <span className="material-symbols-outlined text-[17px] text-[#B68A3A]">
                  request_quote
                </span>
                <span>Convert Cart to Formal RFQ</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
