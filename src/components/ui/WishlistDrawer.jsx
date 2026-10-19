"use client";

import Image from "next/image";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function WishlistDrawer() {
  const {
    wishlist,
    wishlistCount,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
  } = useApp();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-md animate-fade-in">
      {/* Backdrop */}
      <div className="flex-1" onClick={() => setIsWishlistOpen(false)} />

      {/* Drawer Container */}
      <div className="drawer-panel bg-white h-full shadow-2xl border-l border-black/[0.06] flex flex-col justify-between">
        {/* Header */}
        <div className="p-6 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-[#B68A3A]">
              <span className="material-symbols-outlined text-[22px]">bookmark</span>
            </div>
            <div>
              <h3 className="text-[17px] font-semibold text-[#0F1E36]">Saved Fasteners</h3>
              <span className="text-[12px] text-stone-500 font-normal">
                {wishlistCount} technical specifications bookmarked
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
            aria-label="Close saved items"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistCount === 0 ? (
            <div className="py-24 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-300 mb-4">
                <span className="material-symbols-outlined text-[32px]">bookmark_border</span>
              </div>
              <h4 className="text-[17px] font-semibold text-stone-900">No saved fasteners</h4>
              <p className="text-[13.5px] text-stone-500 max-w-xs mt-1.5 leading-relaxed font-normal">
                Bookmark critical fastener standards or exotic alloys for rapid procurement review.
              </p>
              <Link
                href="/products"
                onClick={() => setIsWishlistOpen(false)}
                className="mt-6 h-11 px-6 rounded-full bg-[#0F1E36] text-white text-[13px] font-medium inline-flex items-center gap-2 shadow-sm"
              >
                <span>Browse Products</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-stone-50 border border-black/[0.04] flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-3">
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
                    <div>
                      <span className="text-[11px] text-[#B68A3A] font-semibold block">
                        {item.sku || "FOIF SPEC"}
                      </span>
                      <Link
                        href={`/products/${item.id}`}
                        onClick={() => setIsWishlistOpen(false)}
                        className="text-[14px] font-semibold text-stone-900 hover:text-[#0F1E36] line-clamp-1 mt-0.5"
                      >
                        {item.name}
                      </Link>
                      <div className="text-[12px] text-stone-500 line-clamp-1 mt-0.5 font-normal">
                        {item.standards?.join(", ") || item.categoryName}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleWishlist(item)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                    title="Remove from saved"
                  >
                    <span className="material-symbols-outlined text-[18px]">bookmark_remove</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-black/[0.04]">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(item, item.minOrderQuantity || 500);
                    }}
                    className="flex-1 h-9 rounded-full bg-[#0F1E36] text-white hover:bg-[#182C4D] text-[12px] font-medium flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                  >
                    <span className="material-symbols-outlined text-[14px] text-[#D6B46A]">
                      add_shopping_cart
                    </span>
                    <span>Add to Cart</span>
                  </button>

                  <Link
                    href={`/products/${item.id}`}
                    onClick={() => setIsWishlistOpen(false)}
                    className="h-9 px-4 rounded-full bg-white hover:bg-stone-100 text-stone-700 text-[12px] font-medium flex items-center justify-center border border-black/[0.06] transition-all"
                  >
                    Specs
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
