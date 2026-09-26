import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Heart,
  Search,
  Package,
  Menu,
  X,
  Phone,
  Layers,
  ArrowRight,
  Tag,
  Sparkles,
  Globe,
  MessageCircle,
} from 'lucide-react';
import { ProductCategory, Product } from '../types';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    wishlist,
    setCurrentPage,
    currentPage,
    categories,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
    setIsTrackingOpen,
    settings,
    products,
    setSelectedProduct,
    language,
    toggleLanguage,
    t,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isBn = language === 'bn';

  // Dynamic nav links created from store categories & pages
  const dynamicLinks = [
    { label: isBn ? 'হোম' : 'Home', page: 'home', category: 'All' },
    { label: isBn ? 'সকল পণ্য' : 'All Products', page: 'shop', category: 'All' },
    ...categories.slice(0, 4).map((c) => ({
      label: c.name,
      page: 'shop',
      category: c.name,
    })),
    { label: isBn ? 'আমাদের সম্পর্কে' : 'About Us', page: 'about', category: undefined },
    { label: isBn ? 'ডেলিভারি' : 'Delivery', page: 'delivery', category: undefined },
  ];

  // Real-time matching products
  const matchingProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
      );
    });
  }, [products, searchQuery]);

  const searchSuggestions = useMemo(() => {
    return matchingProducts.slice(0, 5);
  }, [matchingProducts]);

  // Click outside to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (page: any, category: any) => {
    setCurrentPage(page);
    if (category) {
      setSelectedCategoryFilter(category as ProductCategory | 'All');
    }
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage('shop');
      setSelectedCategoryFilter('All');
      setIsDropdownOpen(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDropdownOpen(false);
    setIsSearchOpen(false);
  };

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      setCurrentPage('shop');
      setSelectedCategoryFilter('All');
      setIsDropdownOpen(false);
    }
  };

  // Helper to highlight matching text in title
  const highlightMatch = (text: string, query: string) => {
    const q = query.trim();
    if (!q) return text;
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={index} className="bg-[#DFB15B]/30 text-stone-900 font-bold px-0.5 rounded-xs">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <>
      {/* Top Banner Notice */}
      <div className="bg-[#1C1917] text-[#EDE0C2] text-xs py-2 px-4 border-b border-[#BE9346]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="truncate text-center w-full sm:text-left sm:w-auto font-medium tracking-wide">
            {settings.bannerNotice || '✨ উপহার বিতান - নীলফামারীর বিশ্বস্ত ক্রোকারিজ ও গিফট সামগ্রীর প্রতিষ্ঠান | কল বা WhatsApp: 01712470028'}
          </div>
          <div className="hidden sm:flex items-center gap-4 text-stone-300 text-xs shrink-0">
            <a
              href="https://wa.me/8801712470028?text=Hello%20Upohar%20Bitan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-300 transition-colors flex items-center gap-1 text-emerald-400 font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: 01712470028</span>
            </a>
            <span className="text-stone-600">|</span>
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="hover:text-[#EDE0C2] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-[#BE9346]" />
              <span>{isBn ? 'অর্ডার ট্র্যাকিং' : 'Track Order'}</span>
            </button>
            <span className="text-stone-600">|</span>
            <a
              href="tel:01712470028"
              className="hover:text-[#EDE0C2] transition-colors flex items-center gap-1.5 font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-[#BE9346]" />
              <span>01712470028</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Top Bar (3-Zone Top Bar Contract) */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Zone 1: Single Text Element Wordmark */}
          <button
            onClick={() => handleNavClick('home', 'All')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 group-hover:text-[#A37835] transition-colors">
              উপহার বিতান
            </span>
            <span className="block text-[10px] tracking-wider text-[#A37835] font-sans -mt-0.5 font-semibold">
              UPOHAR BITAN · নীলফামারী
            </span>
          </button>

          {/* Zone 2: Clean Dynamic Text Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700">
            {dynamicLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.page, link.category)}
                className={`transition-colors relative py-1 hover:text-stone-950 cursor-pointer ${
                  currentPage === link.page && (link.category === 'All' ? selectedCategoryFilter === 'All' : selectedCategoryFilter === link.category)
                    ? 'text-stone-950 font-semibold'
                    : ''
                }`}
              >
                {link.label}
                {currentPage === link.page && (link.category === 'All' ? selectedCategoryFilter === 'All' : selectedCategoryFilter === link.category) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#BE9346]" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Button (বাংলা / English) */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs font-semibold rounded-full border border-stone-300 hover:border-[#BE9346] bg-white text-stone-800 hover:text-stone-950 transition-all flex items-center gap-1 cursor-pointer shadow-2xs shrink-0"
              title={isBn ? 'Switch to English' : 'বাংলা ভার্সনে দেখুন'}
            >
              <Globe className="w-3.5 h-3.5 text-[#A37835]" />
              <span>{isBn ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Search Input Toggle & Real-time Suggestions */}
            <div className="relative" ref={searchContainerRef}>
              {isSearchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-white border border-[#BE9346]/60 rounded-full px-3 py-1.5 shadow-sm text-xs ring-1 ring-[#BE9346]/30 transition-all"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={isBn ? 'প্লেট, বাটি, ডিনার সেট খুঁজুন...' : 'Search dinner plates, bowls...'}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => {
                      if (searchQuery.trim().length > 0) {
                        setIsDropdownOpen(true);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setIsDropdownOpen(false);
                      }
                    }}
                    autoFocus
                    className="w-40 sm:w-64 focus:outline-none text-stone-900 text-xs"
                  />
                  <button type="submit" className="text-stone-500 hover:text-stone-900 ml-1 cursor-pointer">
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      setIsDropdownOpen(false);
                    }}
                    className="text-stone-400 hover:text-stone-700 ml-2 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsDropdownOpen(true);
                  }}
                  aria-label="Search items"
                  className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}

              {/* REAL-TIME SEARCH SUGGESTION DROPDOWN */}
              {isSearchOpen && isDropdownOpen && searchQuery.trim().length > 0 && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-stone-200/90 z-50 overflow-hidden divide-y divide-stone-100 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Top Bar with result count */}
                  <div className="px-4 py-2.5 bg-[#FAF8F5] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-[#BE9346]" />
                      <span>
                        {matchingProducts.length > 0
                          ? `Found ${matchingProducts.length} match${matchingProducts.length === 1 ? '' : 'es'}`
                          : 'No exact matches'}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400">Press Enter for all</span>
                  </div>

                  {/* List of matched products */}
                  {searchSuggestions.length > 0 ? (
                    <div className="max-h-[360px] overflow-y-auto divide-y divide-stone-50">
                      {searchSuggestions.map((prod) => {
                        const currentPrice = prod.discountPrice ?? prod.price;
                        return (
                          <div
                            key={prod.id}
                            onClick={() => handleSelectProduct(prod)}
                            className="p-3 hover:bg-[#FAF8F5] cursor-pointer transition-colors flex items-center gap-3 group"
                          >
                            {/* Product Thumbnail */}
                            <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200/60">
                              <img
                                src={prod.images[0]}
                                alt={prod.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-stone-900 truncate group-hover:text-[#A37835] transition-colors">
                                {highlightMatch(prod.name, searchQuery)}
                              </h4>
                              
                              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-stone-500">
                                <span className="font-serif">{prod.category}</span>
                                <span>·</span>
                                <span className="text-stone-400 truncate">{prod.subCategory}</span>
                              </div>

                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-bold font-mono text-stone-900">
                                  ৳{currentPrice.toLocaleString()}
                                </span>
                                {prod.discountPrice && (
                                  <span className="text-[10px] text-stone-400 line-through font-mono">
                                    ৳{prod.price.toLocaleString()}
                                  </span>
                                )}
                                {prod.stock > 0 && prod.stock <= 5 && (
                                  <span className="text-[9px] bg-amber-50 text-amber-800 font-semibold px-1 rounded">
                                    Only {prod.stock} left
                                  </span>
                                )}
                              </div>
                            </div>

                            <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#A37835] group-hover:translate-x-0.5 transition-all shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Zero results state with helpful category chips */
                    <div className="p-5 text-center space-y-2">
                      <p className="text-xs font-semibold text-stone-800">
                        No tableware found matching "{searchQuery}"
                      </p>
                      <p className="text-[11px] text-stone-500 font-light">
                        Try searching by category, material (e.g. Bone China, Gold Rim), or piece name.
                      </p>
                      <div className="pt-2">
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1.5 font-medium">
                          Browse Popular Collections:
                        </span>
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {categories.slice(0, 5).map((cat) => (
                            <button
                              key={cat.id || cat.name}
                              type="button"
                              onClick={() => {
                                setSelectedCategoryFilter(cat.name);
                                setCurrentPage('shop');
                                setIsDropdownOpen(false);
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-[#EDE0C2] text-stone-800 text-[11px] rounded-md transition-colors cursor-pointer"
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Footer: "View all X results in catalog" */}
                  {matchingProducts.length > 0 && (
                    <button
                      type="button"
                      onClick={handleViewAllResults}
                      className="w-full py-2.5 px-4 bg-[#FAF8F5] hover:bg-[#EDE0C2]/50 text-xs font-semibold text-stone-800 hover:text-stone-950 transition-colors flex items-center justify-between cursor-pointer border-t border-stone-200"
                    >
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#BE9346]" />
                        <span>View all {matchingProducts.length} results in catalog</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => setCurrentPage('wishlist')}
              aria-label="View Wishlist"
              className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-full transition-colors relative cursor-pointer hidden sm:flex items-center justify-center"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#BE9346] text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              className="p-2 sm:px-3 sm:py-2 text-stone-900 bg-stone-100 hover:bg-[#EDE0C2]/60 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-stone-900" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#BE9346] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold tracking-wide">Cart</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-950 rounded-lg cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-[#FAF8F5] px-4 pt-3 pb-6 shadow-lg">
            <div className="flex flex-col space-y-3">
              {dynamicLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.page, link.category)}
                  className="text-left py-2 px-3 text-stone-800 hover:bg-stone-100 rounded-md font-medium text-sm flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-stone-400 text-xs">→</span>
                </button>
              ))}
              <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsTrackingOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 text-sm text-[#A37835] font-medium flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Track Your Order</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('wishlist');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 text-sm text-stone-700 font-medium flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 text-[#BE9346]" />
                  <span>Wishlist ({wishlist.length})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar without visible Admin button */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 lg:hidden flex items-center justify-around py-2 px-3">
        <button
          onClick={() => handleNavClick('home', 'All')}
          className={`flex flex-col items-center gap-0.5 text-xs ${
            currentPage === 'home' ? 'text-[#BE9346] font-semibold' : 'text-stone-500'
          }`}
        >
          <span className="text-base font-serif">✦</span>
          <span>{isBn ? 'হোম' : 'Home'}</span>
        </button>

        <button
          onClick={() => handleNavClick('shop', 'All')}
          className={`flex flex-col items-center gap-0.5 text-xs ${
            currentPage === 'shop' ? 'text-[#BE9346] font-semibold' : 'text-stone-500'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>{isBn ? 'শপ' : 'Shop'}</span>
        </button>

        <button
          onClick={() => handleNavClick('wishlist', null)}
          className={`flex flex-col items-center gap-0.5 text-xs relative ${
            currentPage === 'wishlist' ? 'text-[#BE9346] font-semibold' : 'text-stone-500'
          }`}
        >
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#BE9346] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
              {wishlist.length}
            </span>
          )}
          <span>{isBn ? 'পছন্দ' : 'Wishlist'}</span>
        </button>

        <button
          onClick={() => setIsTrackingOpen(true)}
          className="flex flex-col items-center gap-0.5 text-xs text-stone-500"
        >
          <Package className="w-5 h-5" />
          <span>{isBn ? 'ট্র্যাক' : 'Track'}</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-0.5 text-xs text-stone-500 relative"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#BE9346] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
          <span>{isBn ? 'ব্যাগ' : 'Cart'}</span>
        </button>
      </nav>
    </>
  );
};
