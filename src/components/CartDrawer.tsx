import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    coupons,
    setIsCheckoutOpen,
    setCurrentPage,
    settings,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = settings.freeDeliveryThreshold || 5000;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const deliveryCharge =
    cartSubtotal >= freeDeliveryThreshold
      ? 0
      : (settings.deliveryChargeInside || 80);
  const finalTotal = Math.max(0, cartSubtotal - couponDiscount + deliveryCharge);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleQuickApply = (code: string) => {
    setCouponError('');
    const res = applyCoupon(code);
    if (!res.success) {
      setCouponError(res.message);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('checkout');
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#A37835]" />
            <h2 className="font-display text-xl font-semibold text-stone-900">
              Your Tableware Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#F7F1E1]/60 px-6 py-3 border-b border-[#EDE0C2]">
          <div className="flex items-center justify-between text-xs text-stone-700 mb-1.5">
            <span>
              {remainingForFreeDelivery === 0 ? (
                <span className="font-semibold text-emerald-800">
                  🎉 Congratulations! You have unlocked Free Delivery!
                </span>
              ) : (
                <span>
                  Add <strong className="tabular-nums">৳{remainingForFreeDelivery.toLocaleString()}</strong> more for Free Delivery
                </span>
              )}
            </span>
            <span className="font-mono text-[11px] text-stone-500">
              {Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100))}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#BE9346] transition-all duration-300"
              style={{
                width: `${Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-display text-lg font-medium text-stone-900">Your bag is empty</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our fine bone china collections, handcrafted soup bowls, and gold cutlery.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
              >
                Start Browsing
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const unitPrice = item.product.discountPrice ?? item.product.price;
              return (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 rounded-xl border border-stone-200/80 bg-[#FAF8F5]/50 hover:bg-[#FAF8F5] transition-colors"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-lg object-cover bg-white border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-medium text-stone-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {item.product.material.split(' ')[0]} · {item.selectedSize || item.product.size}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden text-xs">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 font-semibold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 font-medium tabular-nums text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 font-semibold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-stone-900 tabular-nums">
                          ৳{(unitPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Order Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-[#FAF8F5] space-y-4">
            {/* Coupon Code Section */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-emerald-700" />
                  <span>
                    Coupon <strong>{appliedCoupon.code}</strong> applied (-৳{couponDiscount.toLocaleString()})
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. GOLD10, AURA20)"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    className="flex-1 uppercase text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#BE9346] font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-semibold text-stone-800 bg-stone-200 hover:bg-stone-300 rounded-lg transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                
                {/* Quick Coupon Chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {coupons.map((c) => (
                    <button
                      type="button"
                      key={c.code}
                      onClick={() => handleQuickApply(c.code)}
                      className="text-[10px] px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-stone-800 hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      <strong className="text-[#825B2A]">{c.code}</strong> ({c.discountPercent ? `${c.discountPercent}%` : `৳${c.discountAmount}`})
                    </button>
                  ))}
                </div>
              </form>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200/80 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900 tabular-nums">
                  ৳{cartSubtotal.toLocaleString()}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-medium tabular-nums">-৳{couponDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="font-medium text-stone-900 tabular-nums">
                  {deliveryCharge === 0 ? 'Free' : `৳${deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Amount</span>
                <span className="font-display text-lg font-bold tabular-nums">
                  ৳{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#EDE0C2]" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A37835]" />
                <span>Zero-risk ordering with Cash on Delivery or Secure Mobile Banking</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
