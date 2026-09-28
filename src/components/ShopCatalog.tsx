import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory, Product } from '../types';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search } from 'lucide-react';

export const ShopCatalog: React.FC = () => {
  const {
    products,
    categories: storeCategories,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const availableBrands = useMemo(() => {
    const values = Array.from(new Set(products.map((p) => (p.brand || '').trim()).filter(Boolean)));
    return ['All', ...values];
  }, [products]);

  // Derive distinct subcategories for current brand/category from both category config and products
  const availableSubcategories = useMemo(() => {
    const set = new Set<string>();
    if (selectedCategoryFilter !== 'All') {
      const catConfig = storeCategories.find((c) => c.name.toLowerCase() === selectedCategoryFilter.toLowerCase());
      if (catConfig && Array.isArray(catConfig.subcategories)) {
        catConfig.subcategories.forEach((s) => set.add(s));
      }
      products
        .filter((p) =>
          p.category.toLowerCase() === selectedCategoryFilter.toLowerCase() &&
          (selectedBrand === 'All' || (p.brand || '').toLowerCase() === selectedBrand.toLowerCase())
        )
        .forEach((p) => {
          if (p.subCategory) set.add(p.subCategory);
        });
    } else {
      products
        .filter((p) => selectedBrand === 'All' || (p.brand || '').toLowerCase() === selectedBrand.toLowerCase())
        .forEach((p) => { if (p.subCategory) set.add(p.subCategory); });
    }
    return ['All', ...Array.from(set)];
  }, [products, selectedBrand, selectedCategoryFilter, storeCategories]);

  // Derive distinct materials
  const availableMaterials = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const firstWord = p.material.split(' ')[0];
      if (firstWord) set.add(firstWord);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Brand -> Category -> Subcategory cascading filters
        if (selectedBrand !== 'All' && (p.brand || '') !== selectedBrand) return false;
        if (selectedCategoryFilter !== 'All' && p.category !== selectedCategoryFilter) {
          return false;
        }
        // SubCategory filter
        if (selectedSubCategory !== 'All' && p.subCategory !== selectedSubCategory) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.subCategory.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.material.toLowerCase().includes(q);
          if (!match) return false;
        }
        // Price filter
        const currentPrice = p.discountPrice ?? p.price;
        if (currentPrice > maxPrice) {
          return false;
        }
        // In-stock only
        if (inStockOnly && p.stock <= 0) {
          return false;
        }
        // Material
        if (selectedMaterial !== 'All' && !p.material.includes(selectedMaterial)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice ?? a.price;
        const priceB = b.discountPrice ?? b.price;
        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    products,
    selectedBrand,
    selectedCategoryFilter,
    selectedSubCategory,
    searchQuery,
    maxPrice,
    inStockOnly,
    selectedMaterial,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSelectedBrand('All');
    setSelectedCategoryFilter('All');
    setSelectedSubCategory('All');
    setSearchQuery('');
    setMaxPrice(30000);
    setInStockOnly(false);
    setSelectedMaterial('All');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A37835]">
            Online Tableware Catalog
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 mt-1">
            {selectedCategoryFilter === 'All' ? 'Complete Collection' : selectedCategoryFilter}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Showing <strong className="text-stone-800 tabular-nums">{filteredProducts.length}</strong> handcrafted pieces
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search plates, bowls, cutlery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-lg w-48 sm:w-64 focus:outline-none focus:border-[#BE9346]"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-stone-800 focus:outline-none text-xs cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-100 border border-stone-300 rounded-lg cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Catalog Layout (Sidebar + Product Grid) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Filter Sidebar */}
        <aside
          className={`md:col-span-3 space-y-6 ${
            isFilterDrawerOpen ? 'block' : 'hidden md:block'
          }`}
        >
          {/* Brand -> Category -> Subcategory */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-900 uppercase tracking-wider">
              <span>Brand</span>
              {selectedBrand !== 'All' && <button onClick={() => { setSelectedBrand('All'); setSelectedCategoryFilter('All'); setSelectedSubCategory('All'); }} className="text-[11px] text-[#A37835] hover:underline">Clear</button>}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availableBrands.map((brand) => (
                <button key={brand} onClick={() => { setSelectedBrand(brand); setSelectedCategoryFilter('All'); setSelectedSubCategory('All'); }} className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${selectedBrand === brand ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'}`}>
                  {brand === 'All' ? 'All Brands' : brand}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-900 uppercase tracking-wider">
              <span>Categories</span>
              {selectedCategoryFilter !== 'All' && (
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('All');
                    setSelectedSubCategory('All');
                  }}
                  className="text-[11px] text-[#A37835] hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategoryFilter('All');
                  setSelectedSubCategory('All');
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                  selectedCategoryFilter === 'All'
                    ? 'bg-[#FAF8F5] text-[#A37835] font-semibold border-l-2 border-[#BE9346]'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>All Crockery</span>
                <span className="tabular-nums text-stone-400">{products.length}</span>
              </button>

              {storeCategories
                .filter((catItem) => selectedBrand === 'All' || products.some((p) => (p.brand || '').toLowerCase() === selectedBrand.toLowerCase() && p.category.toLowerCase() === catItem.name.toLowerCase()))
                .map((catItem) => {
                const cat = catItem.name;
                const count = products.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;
                return (
                  <button
                    key={catItem.id || cat}
                    onClick={() => {
                      setSelectedCategoryFilter(cat);
                      setSelectedSubCategory('All');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategoryFilter === cat
                        ? 'bg-[#FAF8F5] text-[#A37835] font-semibold border-l-2 border-[#BE9346]'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="tabular-nums text-stone-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategory Filter (If active) */}
          {availableSubcategories.length > 2 && (
            <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-3">
              <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider block">
                Item Type
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableSubcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                      selectedSubCategory === sub
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-900 uppercase tracking-wider">
              <span>Price Range</span>
              <span className="font-mono text-[#A37835]">Up to ৳{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="30000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#BE9346] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 tabular-nums">
              <span>৳500</span>
              <span>৳30,000</span>
            </div>
          </div>

          {/* Material & In Stock Toggles */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-4 text-xs">
            <div>
              <span className="font-semibold text-stone-900 uppercase tracking-wider block mb-2">
                Craft Material
              </span>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
              >
                {availableMaterials.map((mat) => (
                  <option key={mat} value={mat}>
                    {mat === 'All' ? 'All Materials' : mat}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-stone-700 cursor-pointer pt-2 border-t border-stone-100">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-[#BE9346]"
              />
              <span>In Stock Only</span>
            </label>

            <button
              onClick={handleResetFilters}
              className="w-full py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-400 rounded-lg transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        </aside>

        {/* Right Product Grid (9 cols) */}
        <div className="md:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-medium text-stone-900">
                No tableware items match your criteria
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try loosening your price filters, selecting 'All Crockery', or clearing your search keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
