"use client";

import { useState } from "react";
import { initialRfqItems } from "@/data/rfqBasket";

export default function RfqDrawer({ isOpen, onClose }) {
  const [items, setItems] = useState(initialRfqItems);

  if (!isOpen) return null;

  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalQuantity = items.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-primary/60 backdrop-blur-sm animate-fade-in-up">
      {/* Backdrop click */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="w-full max-w-md bg-surface-container-lowest h-full shadow-2xl border-l border-secondary/30 flex flex-col justify-between">
        {/* Header */}
        <div className="p-space-md border-b border-surface-container-highest flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">receipt_long</span>
            <div>
              <h3 className="font-headline-md text-[17px] font-bold text-primary">RFQ Basket</h3>
              <span className="font-label-mono-sm text-[11px] text-on-surface-variant">
                {items.length} line items ready for quotation
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-outline hover:text-primary hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-space-md space-y-3">
          {items.length === 0 ? (
            <div className="py-16 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] text-outline mb-2">remove_shopping_cart</span>
              <p className="font-headline-md text-[16px] text-primary">Your RFQ basket is empty</p>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">
                Browse our master fastener catalogue to add items for quote.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-surface border border-secondary/20 flex flex-col justify-between gap-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-mono-sm text-[10px] text-secondary font-bold uppercase tracking-wider block">
                      {item.partNumber}
                    </span>
                    <h4 className="font-headline-md text-[14px] font-bold text-primary mt-0.5">
                      {item.name}
                    </h4>
                    <span className="font-body-sm text-[11px] text-on-surface-variant block mt-0.5">
                      {item.specs}
                    </span>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-outline hover:text-error p-1 transition-colors"
                    title="Remove item"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-surface-container-highest">
                  <span className="font-label-mono-sm text-[11px] text-on-surface-variant">
                    Requested Quantity:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -500)}
                      className="w-6 h-6 rounded bg-surface-container flex items-center justify-center text-primary font-bold hover:bg-secondary/20"
                    >
                      -
                    </button>
                    <span className="font-label-mono-sm text-[12px] font-bold text-primary min-w-[60px] text-center">
                      {item.quantity.toLocaleString()} {item.unit}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 500)}
                      className="w-6 h-6 rounded bg-surface-container flex items-center justify-center text-primary font-bold hover:bg-secondary/20"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-space-md border-t border-surface-container-highest bg-surface-container-low space-y-3">
            <div className="flex items-center justify-between font-label-mono-sm text-[12px]">
              <span className="text-on-surface-variant">Total Quantity Across Lots:</span>
              <span className="font-bold text-primary">{totalQuantity.toLocaleString()} Units</span>
            </div>
            <div className="text-[11px] font-body-sm text-outline">
              * Official B2B quotations include volume discounting, MTR 3.1 certification, and guaranteed dispatch schedule within 24 hours.
            </div>
            <a
              href="#request-a-quote"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded bg-primary-container text-on-primary font-label-mono-lg text-label-mono-lg uppercase tracking-wider border border-secondary/50 hover:bg-primary transition-all shadow-md"
            >
              <span>Submit RFQ for Quotation</span>
              <span className="material-symbols-outlined text-[18px] text-secondary-fixed-dim">
                arrow_forward
              </span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
