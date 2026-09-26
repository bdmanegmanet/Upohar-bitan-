import React from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart, buyNowProduct, setCurrentPage } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A37835]">
            Curated Favorites
          </span>
          <h1 className="font-display text-3xl font-semibold text-stone-900 mt-1">
            My Wishlist ({wishlist.length})
          </h1>
        </div>
        <button
          onClick={() => setCurrentPage('shop')}
          className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1 cursor-pointer"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-300">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-display text-xl font-medium text-stone-900">Your wishlist is empty</h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Save your favorite dinnerware sets, bone china cups, and artisanal accessories while browsing.
          </p>
          <button
            onClick={() => setCurrentPage('shop')}
            className="mt-2 px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer"
          >
            Explore Tableware Collections
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => {
            const hasDiscount = product.discountPrice && product.discountPrice < product.price;
            const currentPrice = product.discountPrice ?? product.price;

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-1/1 bg-[#F9F9F8]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-red-600 hover:bg-white shadow-xs cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs text-stone-500">
                      {product.category} · {product.subCategory}
                    </div>
                    <h3 className="font-medium text-sm text-stone-900 mt-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-semibold text-stone-900 text-sm tabular-nums">
                        ৳{currentPrice.toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-stone-400 line-through tabular-nums">
                          ৳{product.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="flex-1 py-2 px-3 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#A37835]" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => buyNowProduct(product, 1)}
                      className="py-2 px-3 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
