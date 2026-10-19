"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Cart State (Persisted in localStorage + synced with /api/cart)
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Search & Quote Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteInitialItems, setQuoteInitialItems] = useState(null);

  // Toast Notifications
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Fetch Current User on mount
  useEffect(() => {
    async function loadAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setAuthLoading(false);
      }
    }
    loadAuth();
  }, []);

  // Load Cart & Wishlist on mount
  useEffect(() => {
    let isActive = true;

    queueMicrotask(() => {
      if (!isActive) return;

      try {
        const localCart = localStorage.getItem("foif_cart");
        if (localCart) {
          const parsed = JSON.parse(localCart);
          if (Array.isArray(parsed)) setCart(parsed);
        }

        const localWishlist = localStorage.getItem("foif_wishlist");
        if (localWishlist) {
          setWishlist(JSON.parse(localWishlist));
        }
      } catch (err) {
        console.error("Failed to load saved procurement data:", err);
      }
    });

    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setCart(data.items);
          localStorage.setItem("foif_cart", JSON.stringify(data.items));
        }
      })
      .catch(() => {});

    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setWishlist(data.items);
          localStorage.setItem("foif_wishlist", JSON.stringify(data.items));
        }
      })
      .catch(() => {});

    return () => {
      isActive = false;
    };
  }, []);

  // Save Cart helper
  const syncCart = useCallback((newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem("foif_cart", JSON.stringify(newCart));
    } catch {}
    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: newCart }),
    }).catch(() => {});
  }, []);

  // Add to Cart with quantity & custom specs
  const addToCart = useCallback(
    (product, quantity = 500, selectedSpecs = {}) => {
      const qty = parseInt(quantity, 10) || product.minOrderQuantity || 500;
      let specsText = "";
      if (typeof selectedSpecs === "string") {
        specsText = selectedSpecs;
      } else {
        const parts = [];
        if (selectedSpecs.diameter) parts.push(selectedSpecs.diameter);
        if (selectedSpecs.length) parts.push(selectedSpecs.length);
        if (selectedSpecs.material) parts.push(selectedSpecs.material);
        if (selectedSpecs.finish) parts.push(selectedSpecs.finish);
        specsText = parts.length > 0 ? parts.join(" | ") : (product.materials?.[0] || "Standard Grade");
      }

      setCart((prev) => {
        const existingIdx = prev.findIndex(
          (item) => item.productId === product.id && item.specs === specsText
        );
        let updated;
        if (existingIdx > -1) {
          updated = [...prev];
          updated[existingIdx].quantity += qty;
        } else {
          updated = [
            ...prev,
            {
              id: `${product.id}-${Date.now()}`,
              productId: product.id,
              name: product.name,
              specs: specsText,
              quantity: qty,
              unit: product.unit || "pcs",
              unitPrice: product.indicativePricePer100 ? product.indicativePricePer100 / 100 : null,
              image: product.image,
            },
          ];
        }
        syncCart(updated);
        return updated;
      });

      showToast(`Added ${qty.toLocaleString()} ${product.unit || "pcs"} of ${product.name} to Cart`, "success");
    },
    [syncCart, showToast]
  );

  const updateCartQuantity = useCallback(
    (id, delta) => {
      setCart((prev) => {
        const updated = prev
          .map((item) => {
            if (item.id === id || item.productId === id) {
              const newQty = Math.max(10, item.quantity + delta);
              return { ...item, quantity: newQty };
            }
            return item;
          })
          .filter((item) => item.quantity > 0);
        syncCart(updated);
        return updated;
      });
    },
    [syncCart]
  );

  const removeFromCart = useCallback(
    (id) => {
      setCart((prev) => {
        const updated = prev.filter((item) => item.id !== id && item.productId !== id);
        syncCart(updated);
        return updated;
      });
      showToast("Item removed from Cart", "info");
    },
    [syncCart, showToast]
  );

  const clearCart = useCallback(() => {
    syncCart([]);
  }, [syncCart]);

  // Wishlist Actions
  const toggleWishlist = useCallback(
    (product) => {
      setWishlist((prev) => {
        const exists = prev.some((p) => p.id === product.id);
        let updated;
        if (exists) {
          updated = prev.filter((p) => p.id !== product.id);
          showToast(`Removed ${product.name} from Wishlist`, "info");
        } else {
          updated = [
            ...prev,
            {
              id: product.id,
              name: product.name,
              sku: product.sku,
              categoryName: product.categoryName,
              image: product.image,
              materials: product.materials,
            },
          ];
          showToast(`Saved ${product.name} to Wishlist`, "success");
        }
        try {
          localStorage.setItem("foif_wishlist", JSON.stringify(updated));
        } catch {}
        fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: updated }),
        }).catch(() => {});
        return updated;
      });
    },
    [showToast]
  );

  const isInWishlist = useCallback(
    (productId) => wishlist.some((item) => item.id === productId),
    [wishlist]
  );

  // Authentication Actions
  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }
    setUser(data.user);
    showToast(`Welcome back, ${data.user.name}`, "success");
    return data.user;
  };

  const register = async (formData) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Registration failed");
    }
    setUser(data.user);
    showToast(`Account registered for ${data.user.company}`, "success");
    return data.user;
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    showToast("Logged out successfully", "info");
  };

  const openQuoteModalWithItems = useCallback((items = null) => {
    setQuoteInitialItems(items || cart);
    setIsQuoteOpen(true);
  }, [cart]);

  const cartCount = cart.length;
  const wishlistCount = wishlist.length;
  const overlayOpen = isCartOpen || isWishlistOpen || isSearchOpen || isQuoteOpen;

  useEffect(() => {
    document.body.classList.toggle("overlay-open", overlayOpen);
    return () => document.body.classList.remove("overlay-open");
  }, [overlayOpen]);

  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        login,
        register,
        logout,
        cart,
        cartCount,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        wishlistCount,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        isQuoteOpen,
        setIsQuoteOpen,
        quoteInitialItems,
        openQuoteModalWithItems,
        showToast,
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0F1E36] text-white border border-[#D6B46A]/30 shadow-foif-lg animate-fade-in text-[13px] max-w-lg mx-auto sm:mx-0">
          <span className="material-symbols-outlined text-[#D6B46A] text-[20px]">
            {toast.type === "success" ? "check_circle" : toast.type === "error" ? "error" : "info"}
          </span>
          <span className="leading-snug">{toast.message}</span>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
