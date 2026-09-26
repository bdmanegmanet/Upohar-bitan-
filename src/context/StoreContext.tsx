import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product, CartItem, Order, Customer, StoreSettings, Coupon, ProductCategory, CategoryItem, Language } from '../types';
import { api } from '../services/api';
import { normalizeImageUrl } from '../utils/imageUrl';
import { INITIAL_COUPONS } from '../data/initialProducts';
import { translations } from '../utils/translations';

interface StoreContextType {
  products: Product[];
  isLoading: boolean;
  refreshProducts: () => Promise<void>;
  
  // Language & Translation
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;

  // Categories & Subcategories
  categories: CategoryItem[];
  refreshCategories: () => void;
  addCategory: (cat: CategoryItem) => void;
  updateCategory: (cat: CategoryItem) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Coupon & Discount System
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string; discount?: number };
  validateCoupon: (code: string, customSubtotal?: number) => { valid: boolean; message: string; discountAmount: number; coupon?: Coupon };
  removeCoupon: () => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Active views / modals
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  buyNowProduct: (product: Product, quantity?: number) => void;
  
  // Navigation / Page Routing (custom SPA router with #admin hash support)
  currentPage: 'home' | 'shop' | 'cart' | 'checkout' | 'wishlist' | 'orders' | 'admin' | 'about' | 'faq' | 'delivery' | 'returns' | 'terms' | 'privacy';
  setCurrentPage: (page: any) => void;
  selectedCategoryFilter: ProductCategory | 'All';
  setSelectedCategoryFilter: (category: ProductCategory | 'All') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Settings
  settings: StoreSettings;
  updateSettings: (newSettings: StoreSettings) => void;

  // Tracking
  trackingOrderId: string;
  setTrackingOrderId: (id: string) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;

  // Last Placed Order for Success Screen
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Admin Auth
  isAdminLoggedIn: boolean;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryItem[]>(() => api.getCategories());

  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upohar_bitan_lang_v1');
      if (saved === 'en' || saved === 'bn') return saved;
    }
    return 'bn'; // Default to Bangla!
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('upohar_bitan_lang_v1', lang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === 'bn' ? 'en' : 'bn';
      if (typeof window !== 'undefined') {
        localStorage.setItem('upohar_bitan_lang_v1', next);
      }
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string): string => {
      const langDict = (translations as any)[language];
      if (langDict && langDict[key]) {
        return langDict[key];
      }
      const fallbackDict = (translations as any)['bn'];
      return fallbackDict && fallbackDict[key] ? fallbackDict[key] : key;
    },
    [language]
  );

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura_crockery_cart_v1');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [coupons, setCoupons] = useState<Coupon[]>(() => api.getCoupons());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura_crockery_wishlist_v1');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Initial page checks URL hash (e.g. #admin)
  const [currentPage, setPageState] = useState<'home' | 'shop' | 'cart' | 'checkout' | 'wishlist' | 'orders' | 'admin' | 'about' | 'faq' | 'delivery' | 'returns' | 'terms' | 'privacy'>(() => {
    if (typeof window !== 'undefined' && window.location.hash.toLowerCase() === '#admin') {
      return 'admin';
    }
    return 'home';
  });

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const base = api.getSettings();
    return {
      ...base,
      heroSlides: (base.heroSlides || []).map((slide) => ({
        ...slide,
        image: normalizeImageUrl(slide.image),
      })),
    };
  });
  
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aura_crockery_admin_session') === 'true';
    }
    return false;
  });

  // Synced Page setter that also updates window hash when navigating to or away from admin
  const setCurrentPage = useCallback((page: any) => {
    setPageState(page);
    if (typeof window !== 'undefined') {
      if (page === 'admin') {
        if (window.location.hash !== '#admin') {
          window.location.hash = 'admin';
        }
      } else {
        if (window.location.hash === '#admin') {
          // Remove #admin hash without reloading
          history.pushState(null, '', window.location.pathname);
        }
      }
    }
  }, []);

  // Listen to hash changes (e.g., user types #admin or clicks a direct link)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin') {
        setPageState('admin');
      } else if (hash === '#shop' || hash === '#products') {
        setPageState('shop');
      } else if (hash === '#wishlist') {
        setPageState('wishlist');
      } else if (hash === '#cart') {
        setPageState('home');
        setIsCartOpen(true);
      } else if (hash === '#track' || hash === '#tracking') {
        setPageState('home');
        setIsTrackingOpen(true);
      } else if (hash === '' || hash === '#/' || hash === '#home') {
        setPageState((prev) => (prev === 'admin' ? 'home' : prev));
      }
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      const list = await api.getProducts();
      setProducts(list);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCategories = useCallback(() => {
    const fresh = api.getCategories();
    setCategories(fresh);
  }, []);

  const addCategory = useCallback((cat: CategoryItem) => {
    const updated = api.addCategory(cat);
    setCategories([...updated]);
    showToast(`Category "${cat.name}" added successfully`);
  }, []);

  const updateCategory = useCallback((cat: CategoryItem) => {
    const updated = api.updateCategory(cat);
    setCategories([...updated]);
    refreshProducts(); // refresh products if category was renamed
    showToast(`Category "${cat.name}" updated successfully`);
  }, []);

  const deleteCategory = useCallback((id: string) => {
    const target = categories.find((c) => c.id === id);
    const updated = api.deleteCategory(id);
    setCategories([...updated]);
    showToast(`Category "${target?.name || ''}" removed`);
  }, [categories]);

  useEffect(() => {
    refreshProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('aura_crockery_cart_v1', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aura_crockery_wishlist_v1', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addToCart = (product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
    const requested = Math.max(1, Math.floor(quantity));
    if (product.status === 'Out of Stock' || product.stock <= 0) {
      showToast(`"${product.name}" is out of stock`);
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      const existingQuantity = existingIndex > -1 ? prev[existingIndex].quantity : 0;
      const nextQuantity = Math.min(product.stock, existingQuantity + requested);

      if (nextQuantity <= existingQuantity) {
        showToast(`Only ${product.stock} unit(s) available for "${product.name}"`);
        return prev;
      }

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: nextQuantity,
          product,
        };
        return next;
      }

      return [
        ...prev,
        {
          product,
          quantity: Math.min(requested, product.stock),
          selectedColor: selectedColor || product.color,
          selectedSize: selectedSize || product.size,
        },
      ];
    });
    showToast(`Added "${product.name}" to cart`);
  };

  const buyNowProduct = (product: Product, quantity = 1) => {
    addToCart(product, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id !== productId) return item;
        const maxStock = Math.max(0, item.product.stock);
        const nextQuantity = Math.min(Math.floor(quantity), maxStock);
        if (nextQuantity <= 0) return item;
        return { ...item, quantity: nextQuantity };
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cart.reduce((acc, item) => {
    const unitPrice = item.product.discountPrice ?? item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (cartSubtotal < appliedCoupon.minimumOrder) return 0;
    if (appliedCoupon.discountPercent) {
      return Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    }
    if (appliedCoupon.discountAmount) {
      return Math.min(cartSubtotal, appliedCoupon.discountAmount);
    }
    return 0;
  }, [appliedCoupon, cartSubtotal]);

  const validateCoupon = useCallback((code: string, customSubtotal?: number) => {
    const subtotalToUse = typeof customSubtotal === 'number' ? customSubtotal : cartSubtotal;
    return api.validateCoupon(code, subtotalToUse);
  }, [cartSubtotal]);

  const applyCoupon = useCallback((code: string) => {
    const res = api.validateCoupon(code, cartSubtotal);
    if (!res.valid || !res.coupon) {
      return { success: false, message: res.message };
    }
    setAppliedCoupon(res.coupon);
    showToast(res.message);
    return { success: true, message: res.message, discount: res.discountAmount };
  }, [cartSubtotal]);

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed from wishlist`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Added "${product.name}" to wishlist`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const updateSettings = (newSettings: StoreSettings) => {
    const normalized = {
      ...newSettings,
      heroSlides: (newSettings.heroSlides || []).map((slide) => ({
        ...slide,
        image: normalizeImageUrl(slide.image),
      })),
    };
    setSettings(normalized);
    api.saveSettings(normalized);
    showToast(language === 'bn' ? 'সাইটের সেটিংস সংরক্ষণ হয়েছে' : 'Store settings saved successfully');
  };

  const loginAdmin = (user: string, pass: string): boolean => {
    // Default credentials
    if ((user === 'admin' && pass === 'aura@admin2026') || (user === 'admin' && pass === 'admin123')) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('aura_crockery_admin_session', 'true');
      showToast('Admin logged in successfully');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('aura_crockery_admin_session');
    showToast('Admin logged out');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        isLoading,
        refreshProducts,
        language,
        setLanguage,
        toggleLanguage,
        t,
        categories,
        refreshCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        coupons,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        validateCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        selectedProduct,
        setSelectedProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        buyNowProduct,
        currentPage,
        setCurrentPage,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        searchQuery,
        setSearchQuery,
        settings,
        updateSettings,
        trackingOrderId,
        setTrackingOrderId,
        isTrackingOpen,
        setIsTrackingOpen,
        lastPlacedOrder,
        setLastPlacedOrder,
        toastMessage,
        showToast,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
