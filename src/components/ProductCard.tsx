import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setSelectedProduct, buyNowProduct } = useStore();
  const inWishlist = isInWishlist(product.id);

  const displayImage = product.images[0] || '';
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="group bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Visual Canvas (65%-70% visual presence) */}
      <div className="relative aspect-4/3 sm:aspect-1/1 bg-[#F9F9F8] overflow-hidden">
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 text-xs">
            Artisanal Tableware
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
            inWishlist
              ? 'bg-red-50 text-red-600'
              : 'bg-white/80 text-stone-600 hover:text-red-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Status / Discount Text Label (Quiet, no pill sandwich) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.stock <= 0 ? (
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-50/90 px-2 py-0.5 rounded">
              Out of Stock
            </span>
          ) : hasDiscount ? (
            <span className="text-[11px] font-semibold text-[#825B2A] bg-[#EDE0C2]/90 px-2 py-0.5 rounded">
              Save ৳{((product.price - (product.discountPrice ?? 0))).toLocaleString()}
            </span>
          ) : product.isNewArrival ? (
            <span className="text-[11px] font-semibold text-stone-800 bg-white/90 px-2 py-0.5 rounded">
              New Arrival
            </span>
          ) : null}
        </div>

        {/* Hover Quick Action Drawer */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2">
          <button
            onClick={() => setSelectedProduct(product)}
            className="flex-1 py-2 px-3 text-xs font-medium text-stone-800 bg-white/95 backdrop-blur-xs hover:bg-white rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className="py-2 px-3 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-50 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Category & Subcategory unboxed with · */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.subCategory}</span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="font-medium text-sm text-stone-900 line-clamp-1 group-hover:text-[#A37835] transition-colors cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Quiet Rating */}
          <div className="flex items-center gap-1 mt-1 text-xs text-stone-500">
            <Star className="w-3.5 h-3.5 fill-[#BE9346] text-[#BE9346]" />
            <span className="font-medium text-stone-800 tabular-nums">{product.rating}</span>
            <span className="text-stone-400">({product.reviewCount})</span>
            <span aria-hidden="true" className="mx-1">·</span>
            <span className="truncate text-stone-500 text-[11px]">{product.material.split(' ')[0]}</span>
          </div>
        </div>

        {/* Pricing & Buy Controls */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-stone-900 text-base tabular-nums">
              ৳{(product.discountPrice ?? product.price).toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                ৳{product.price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={() => buyNowProduct(product, 1)}
            disabled={product.stock <= 0}
            className="text-xs font-semibold text-[#A37835] hover:text-[#825B2A] transition-colors disabled:opacity-40 cursor-pointer"
          >
            Buy Now →
          </button>
        </div>
      </div>
    </div>
  );
};
