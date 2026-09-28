import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingBag,
  Check,
  Sparkles,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    buyNowProduct,
    toggleWishlist,
    isInWishlist,
    language,
  } = useStore();

  const isBn = language === 'bn';

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'care'>('details');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  if (!selectedProduct) return null;

  const inWishlist = isInWishlist(selectedProduct.id);
  const hasDiscount = selectedProduct.discountPrice && selectedProduct.discountPrice < selectedProduct.price;
  const variantPrice = selectedSize && selectedProduct.sizePrices?.[selectedSize];
  const currentPrice = variantPrice ?? selectedProduct.discountPrice ?? selectedProduct.price;

  const handleClose = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setSelectedImageIndex(0);
    setSelectedSize('');
    setSelectedColor('');
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, selectedColor || selectedProduct.color, selectedSize || selectedProduct.size);
  };

  const handleBuyNow = () => {
    buyNowProduct(selectedProduct, quantity, selectedColor || selectedProduct.color, selectedSize || selectedProduct.size);
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 my-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-stone-600 hover:text-stone-950 hover:bg-white shadow-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Gallery Column (5 cols) */}
          <div className="md:col-span-6 p-6 bg-[#F9F9F8] border-b md:border-b-0 md:border-r border-stone-200 flex flex-col">
            <div className="relative aspect-4/3 sm:aspect-1/1 rounded-xl overflow-hidden bg-white border border-stone-200 shadow-xs mb-4">
              <img
                src={selectedProduct.images[selectedImageIndex] || selectedProduct.images[0]}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {hasDiscount && (
                <span className="absolute top-3 left-3 bg-[#EDE0C2] text-[#825B2A] text-xs font-bold px-2.5 py-1 rounded">
                  Save ৳{(selectedProduct.price - currentPrice).toLocaleString()}
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {selectedProduct.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-[#BE9346] ring-2 ring-[#BE9346]/20'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${selectedProduct.name} ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Markers in Left Column */}
            <div className="mt-auto pt-6 border-t border-stone-200/80 space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#A37835]" />
                <span>100% Certified Bone China & High-Grade Porcelain</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#A37835]" />
                <span>5-Layer Shockproof Fragile Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#A37835]" />
                <span>Immediate 7-Day Replacement Guarantee</span>
              </div>
            </div>
          </div>

          {/* Product Purchase Module (6 cols) */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & SKU Header */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-stone-700">{selectedProduct.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedProduct.subCategory}</span>
                </div>
                <span className="font-mono text-stone-400">SKU: {selectedProduct.sku}</span>
              </div>

              {/* Title */}
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 leading-tight">
                {selectedProduct.name}
              </h2>

              {/* Rating & Stock Status */}
              <div className="flex items-center gap-3 mt-2 text-xs">
                <div className="flex items-center gap-1 text-[#BE9346]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold text-stone-900 tabular-nums">{selectedProduct.rating}</span>
                  <span className="text-stone-500">({selectedProduct.reviewCount} customer reviews)</span>
                </div>
                <span aria-hidden="true" className="text-stone-300">·</span>
                {selectedProduct.stock > 0 ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                    In Stock ({selectedProduct.stock} units)
                  </span>
                ) : (
                  <span className="text-rose-700 font-medium">Out of Stock</span>
                )}
              </div>

              {/* Price Banner */}
              <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-stone-900 tabular-nums">
                  ৳{currentPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    ৳{selectedProduct.price.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-stone-500 ml-auto">VAT included</span>
              </div>

              {(selectedProduct.sizeEnabled && (selectedProduct.sizeOptions || []).length > 0) || (selectedProduct.colorEnabled && (selectedProduct.colorOptions || []).length > 0) ? (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProduct.sizeEnabled && (selectedProduct.sizeOptions || []).length > 0 && (
                    <label className="text-xs font-medium text-stone-700">
                      Select Size
                      <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="mt-1 w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg">
                        <option value="">Select size</option>
                        {(selectedProduct.sizeOptions || []).map((s) => <option key={s} value={s}>{s}{selectedProduct.sizePrices?.[s] ? ` — ৳${selectedProduct.sizePrices[s].toLocaleString()}` : ''}</option>)}
                      </select>
                    </label>
                  )}
                  {selectedProduct.colorEnabled && (selectedProduct.colorOptions || []).length > 0 && (
                    <label className="text-xs font-medium text-stone-700">
                      Select Color
                      <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="mt-1 w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg">
                        <option value="">Select color</option>
                        {(selectedProduct.colorOptions || []).map((color) => <option key={color} value={color}>{color}</option>)}
                      </select>
                    </label>
                  )}
                </div>
              ) : null}

              {/* Short Description */}
              <p className="text-sm text-stone-600 mt-4 leading-relaxed font-light">
                {selectedProduct.shortDescription}
              </p>

              {/* Specifications Pills */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="p-2.5 rounded-lg bg-stone-100/60 border border-stone-200">
                  <span className="text-stone-400 block text-[11px]">Material</span>
                  <span className="font-medium text-stone-800">{selectedProduct.material}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-100/60 border border-stone-200">
                  <span className="text-stone-400 block text-[11px]">Dimensions / Size</span>
                  <span className="font-medium text-stone-800">{selectedProduct.size}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-100/60 border border-stone-200">
                  <span className="text-stone-400 block text-[11px]">Color Finishing</span>
                  <span className="font-medium text-stone-800">{selectedProduct.color}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-100/60 border border-stone-200">
                  <span className="text-stone-400 block text-[11px]">Food Grade</span>
                  <span className="font-medium text-stone-800">100% Certified Safe</span>
                </div>
              </div>

              {/* Tabs for Detailed Specs */}
              <div className="mt-5 border-t border-stone-200 pt-3">
                <div className="flex gap-4 text-xs font-semibold border-b border-stone-200 pb-2">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-1 cursor-pointer ${
                      activeTab === 'details'
                        ? 'text-stone-900 border-b-2 border-[#BE9346]'
                        : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    Full Story
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-1 cursor-pointer ${
                      activeTab === 'specs'
                        ? 'text-stone-900 border-b-2 border-[#BE9346]'
                        : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`pb-1 cursor-pointer ${
                      activeTab === 'care'
                        ? 'text-stone-900 border-b-2 border-[#BE9346]'
                        : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    Care & Washing
                  </button>
                </div>

                <div className="pt-3 text-xs text-stone-600 leading-relaxed min-h-[70px]">
                  {activeTab === 'details' && <p>{selectedProduct.description}</p>}
                  {activeTab === 'specs' && (
                    <ul className="space-y-1 list-disc pl-4 text-stone-700">
                      <li>Dishwasher Safe: {selectedProduct.specifications.dishwasherSafe ? 'Yes (Gentle cycle)' : 'No (Handwash recommended to protect gold rim)'}</li>
                      <li>Microwave Safe: {selectedProduct.specifications.microwaveSafe ? 'Yes' : 'No (Do not microwave items with metallic gold trim)'}</li>
                      <li>Oven Safe: {selectedProduct.specifications.ovenSafe ? 'Yes up to 220°C' : 'Not recommended'}</li>
                      {selectedProduct.specifications.weight && <li>Gross Weight: {selectedProduct.specifications.weight}</li>}
                    </ul>
                  )}
                  {activeTab === 'care' && (
                    <p>
                      To retain the 24K gold luster for decades, use a soft sponge with mild detergent. Avoid abrasive scouring pads. Dry immediately with a linen cloth to prevent water spots.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100 font-semibold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-semibold text-stone-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                    disabled={quantity >= selectedProduct.stock}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100 font-semibold disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={selectedProduct.stock <= 0}
                  className="flex-1 py-3 px-4 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4 text-[#A37835]" />
                  <span>Add to Cart</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(selectedProduct)}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    inWishlist
                      ? 'border-red-200 bg-red-50 text-red-600'
                      : 'border-stone-300 hover:border-stone-400 text-stone-600'
                  }`}
                  aria-label="Wishlist toggle"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Direct Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={selectedProduct.stock <= 0}
                className="w-full py-4 px-4 text-sm font-bold text-white bg-gradient-to-r from-stone-900 via-[#7B531F] to-stone-900 hover:from-black hover:via-[#5F3E18] hover:to-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-[#BE9346]/40 animate-btn-pulse btn-shimmer-effect"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isBn ? `সরাসরি অর্ডার করুন · ৳${(currentPrice * quantity).toLocaleString()}` : `Order Now (Instant Checkout) · ৳${(currentPrice * quantity).toLocaleString()}`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
