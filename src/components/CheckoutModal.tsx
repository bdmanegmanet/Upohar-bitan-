import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod } from '../types';
import { api } from '../services/api';
import { X, ShieldCheck, CheckCircle2, Lock, Truck, CreditCard, Tag, AlertCircle, Sparkles } from 'lucide-react';

const BANGLADESH_DIVISIONS = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh',
];

const DISTRICTS_MAP: Record<string, string[]> = {
  Dhaka: ['Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Narsingdi', 'Faridpur', 'Manikganj', 'Munshiganj'],
  Chittagong: ['Chittagong', "Cox's Bazar", 'Comilla', 'Noakhali', 'Feni', 'Brahmanbaria', 'Chandpur'],
  Sylhet: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  Rajshahi: ['Rajshahi', 'Bogra', 'Pabna', 'Sirajganj', 'Naogaon', 'Natore', 'Chapai Nawabganj'],
  Khulna: ['Khulna', 'Jessore', 'Kushtia', 'Satkhira', 'Bagerhat', 'Jhenaidah'],
  Barisal: ['Barisal', 'Patuakhali', 'Bhola', 'Pirojpur', 'Jhalokati'],
  Rangpur: ['Rangpur', 'Dinajpur', 'Kurigram', 'Gaibandha', 'Nilphamari'],
  Mymensingh: ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'],
};

export const CheckoutModal: React.FC<{ fullPage?: boolean }> = ({ fullPage = false }) => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    clearCart,
    cartSubtotal,
    coupons,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    settings,
    setLastPlacedOrder,
    refreshProducts,
    showToast,
    language,
    setCurrentPage,
  } = useStore();

  const isBn = language === 'bn';

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [division, setDivision] = useState('Rangpur');
  const [district, setDistrict] = useState('Nilphamari');
  const [fullAddress, setFullAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Coupon state in Checkout
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isCheckoutOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const trimmed = couponInput.trim();
    if (!trimmed) {
      setCouponError('Please enter a discount or promo code.');
      return;
    }
    const result = applyCoupon(trimmed);
    if (result.success) {
      setCouponSuccess(result.message);
      setCouponInput('');
    } else {
      setCouponError(result.message);
    }
  };

  const handleQuickApply = (code: string) => {
    setCouponError('');
    setCouponSuccess('');
    const result = applyCoupon(code);
    if (result.success) {
      setCouponSuccess(result.message);
    } else {
      setCouponError(result.message);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess('');
    setCouponError('');
  };

  const freeDeliveryThreshold = settings.freeDeliveryThreshold || 4000;
  const isLocalDelivery = district === 'Nilphamari' || (division === 'Rangpur' && district === 'Nilphamari') || (division === 'Dhaka' && district === 'Dhaka');
  const deliveryCharge =
    cartSubtotal >= freeDeliveryThreshold
      ? 0
      : isLocalDelivery
      ? settings.deliveryChargeInside || 60
      : settings.deliveryChargeOutside || 120;

  const finalTotal = Math.max(0, cartSubtotal - couponDiscount + deliveryCharge);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !phone.trim() || !fullAddress.trim()) {
      setErrorMessage('Please provide your name, phone number, and street address.');
      return;
    }

    if ((paymentMethod === 'bKash' || paymentMethod === 'Nagad' || paymentMethod === 'Bank Payment') && !transactionId.trim()) {
      setErrorMessage(`Please enter the ${paymentMethod} Transaction ID or reference number.`);
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        sku: item.product.sku,
        price: item.product.discountPrice ?? item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || '',
        color: item.selectedColor || item.product.color,
        size: item.selectedSize || item.product.size,
      }));

      const newOrder = await api.createOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        fullAddress: fullAddress.trim(),
        division,
        district,
        deliveryAddressNote: deliveryNotes.trim(),
        items: orderItems,
        subtotal: cartSubtotal,
        discountAmount: couponDiscount,
        deliveryCharge,
        totalPrice: finalTotal,
        paymentMethod,
        paymentTransactionId: transactionId.trim() || undefined,
        notes: appliedCoupon ? `Applied Coupon: ${appliedCoupon.code} (-৳${couponDiscount.toLocaleString()})` : undefined,
      });

      // Clear cart, close checkout, show success modal
      clearCart();
      await refreshProducts();
      setLastPlacedOrder(newOrder);
      setIsCheckoutOpen(false);
      showToast(`Order #${newOrder.id} placed successfully!`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating order. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={fullPage ? "w-full" : "fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in"}>
      <div className={fullPage ? "relative bg-white w-full rounded-2xl border border-stone-200 shadow-sm overflow-hidden" : "relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 my-auto"}>
        {/* Header */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#A37835]" />
              <h2 className="font-display text-xl font-semibold text-stone-900">
                Secure Checkout & Order Placement
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Review your tableware order details and shipping address
            </p>
          </div>
          <button
            onClick={() => { setIsCheckoutOpen(false); setCurrentPage('home'); }}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {errorMessage}
            </div>
          )}

          {/* Section 1: Customer Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Customer Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ayesha Chowdhury"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#BE9346]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +880 1712 345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#BE9346]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Email Address (for invoice & tracking updates)
                </label>
                <input
                  type="email"
                  placeholder="e.g. ayesha@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#BE9346]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Delivery Address & Location</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Division <span className="text-rose-500">*</span>
                </label>
                <select
                  value={division}
                  onChange={(e) => {
                    const nextDiv = e.target.value;
                    setDivision(nextDiv);
                    setDistrict(DISTRICTS_MAP[nextDiv]?.[0] || 'Other');
                  }}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#BE9346]"
                >
                  {BANGLADESH_DIVISIONS.map((div) => (
                    <option key={div} value={div}>
                      {div} Division
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  District <span className="text-rose-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#BE9346]"
                >
                  {(DISTRICTS_MAP[division] || [division]).map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Street Address (House, Road, Area, Landmark) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. House 42, Road 11, Block D, Banani"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#BE9346]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please ring bell twice, fragile package handle with extra care"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#BE9346]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method Selection */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">3</span>
              <span>Payment Options</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'Cash on Delivery', label: 'Cash on Delivery', desc: 'Pay when delivered' },
                { id: 'bKash', label: 'bKash', desc: 'Personal / Merchant' },
                { id: 'Nagad', label: 'Nagad', desc: 'Mobile Banking' },
                { id: 'Bank Payment', label: 'Bank Payment', desc: 'Direct Transfer' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.id as PaymentMethod)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === opt.id
                      ? 'border-[#BE9346] bg-[#FAF8F5] ring-2 ring-[#BE9346]/20'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="font-semibold text-xs text-stone-900">{opt.label}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>

            {/* Payment Details Drawer based on choice */}
            {paymentMethod === 'Cash on Delivery' && (
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-[#A37835] shrink-0" />
                <span>
                  You will pay <strong>৳{finalTotal.toLocaleString()}</strong> in cash to the courier representative after inspecting the parcel seal upon delivery.
                </span>
              </div>
            )}

            {paymentMethod === 'bKash' && (
              <div className="p-4 bg-pink-50/70 border border-pink-200 rounded-xl space-y-3 text-xs">
                <div className="font-semibold text-pink-900">bKash Payment Instructions:</div>
                <div className="text-stone-700 space-y-1 text-xs">
                  <div>1. Go to your bKash App or dial *247#</div>
                  <div>2. Send Money / Payment to: <code className="bg-pink-100 px-2 py-0.5 rounded font-mono font-bold text-pink-900">{settings.bkashMerchantNumber || '01712470028'}</code></div>
                  <div>3. Enter Amount: <strong className="tabular-nums">৳{finalTotal.toLocaleString()}</strong>, Reference: <code>UPOHAR</code></div>
                  <div>4. Enter your bKash Transaction ID (TrxID) below:</div>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. BK92837491"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  className="w-full text-xs px-3.5 py-2 bg-white border border-pink-300 rounded-lg focus:outline-none uppercase font-mono"
                />
              </div>
            )}

            {paymentMethod === 'Nagad' && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 text-xs">
                <div className="font-semibold text-amber-900">Nagad Payment Instructions:</div>
                <div className="text-stone-700 space-y-1 text-xs">
                  <div>1. Dial *167# or open Nagad App</div>
                  <div>2. Send Money / Merchant Pay to: <code className="bg-amber-100 px-2 py-0.5 rounded font-mono font-bold text-amber-900">{settings.nagadMerchantNumber || '01712470028'}</code></div>
                  <div>3. Enter Amount: <strong className="tabular-nums">৳{finalTotal.toLocaleString()}</strong></div>
                  <div>4. Enter your Nagad Transaction ID:</div>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. NG88273641"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  className="w-full text-xs px-3.5 py-2 bg-white border border-amber-300 rounded-lg focus:outline-none uppercase font-mono"
                />
              </div>
            )}

            {paymentMethod === 'Bank Payment' && (
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3 text-xs">
                <div className="font-semibold text-blue-900">Bank Transfer Account Details:</div>
                <pre className="text-xs text-stone-700 bg-white p-3 rounded border border-blue-200 font-sans whitespace-pre-wrap">
                  {settings.bankAccountDetails}
                </pre>
                <div>Enter your Bank Transfer Reference / Deposit Slip No:</div>
                <input
                  type="text"
                  required
                  placeholder="e.g. REF-CITYBANK-8829"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-white border border-blue-300 rounded-lg focus:outline-none font-mono"
                />
              </div>
            )}
          </div>

          {/* Section 4: Coupon & Promotional Discount */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#A37835]" />
                <span>Coupon & Discount Code</span>
              </h3>
              {appliedCoupon && (
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Applied</span>
                </span>
              )}
            </div>

            {appliedCoupon ? (
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Tag className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-950 flex items-center gap-1.5">
                      <span>Code: <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold text-emerald-900">{appliedCoupon.code}</code></span>
                      <span className="text-[11px] text-emerald-700 font-medium">
                        ({appliedCoupon.discountPercent ? `${appliedCoupon.discountPercent}% OFF` : `৳${appliedCoupon.discountAmount} OFF`})
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      {appliedCoupon.description} · <strong className="tabular-nums">Saved ৳{couponDiscount.toLocaleString()}</strong>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Enter promo code (e.g. GOLD10, AURA20, WELCOME500)"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError('');
                        setCouponSuccess('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleApplyCoupon(e);
                        }
                      }}
                      className="w-full uppercase text-xs pl-8 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#BE9346] font-mono tracking-wider"
                    />
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3.5" />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2.5 text-xs font-semibold text-stone-900 bg-[#EDE0C2] hover:bg-[#dfc89a] rounded-lg transition-colors cursor-pointer shrink-0 shadow-2xs"
                  >
                    Apply Coupon
                  </button>
                </div>

                {couponError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{couponError}</span>
                  </div>
                )}

                {couponSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{couponSuccess}</span>
                  </div>
                )}

                {/* Quick Promotional Codes Pill Chips */}
                {coupons.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[11px] text-stone-500 block mb-1.5 font-medium">
                      Store discount promotions (click to apply):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {coupons.map((c) => {
                        const isEligible = cartSubtotal >= c.minimumOrder;
                        return (
                          <button
                            type="button"
                            key={c.code}
                            onClick={() => handleQuickApply(c.code)}
                            className={`text-xs px-2.5 py-1 rounded-md border text-left transition-all cursor-pointer flex items-center gap-1.5 ${
                              isEligible
                                ? 'bg-amber-50/70 border-amber-300 text-stone-800 hover:bg-amber-100 hover:border-amber-400'
                                : 'bg-stone-50 border-stone-200 text-stone-400 hover:border-stone-300'
                            }`}
                            title={c.description}
                          >
                            <span className="font-mono font-bold text-[#825B2A]">{c.code}</span>
                            <span className="text-[10px] text-stone-600">
                              ({c.discountPercent ? `${c.discountPercent}% OFF` : `৳${c.discountAmount} OFF`})
                            </span>
                            {!isEligible && (
                              <span className="text-[9px] text-amber-700 bg-amber-100 px-1 rounded font-medium">
                                min ৳{c.minimumOrder.toLocaleString()}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 5: Order Summary Table */}
          <div className="pt-4 border-t border-stone-200 bg-[#FAF8F5] -mx-6 -mb-6 p-6 space-y-3">
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
              Order Items Summary ({cart.reduce((a, b) => a + b.quantity, 0)} items)
            </h4>

            <div className="max-h-36 overflow-y-auto space-y-2 pr-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center text-xs">
                  <span className="text-stone-700 truncate max-w-xs">
                    {item.quantity}× {item.product.name}
                  </span>
                  <span className="font-medium text-stone-900 tabular-nums">
                    ৳{((item.product.discountPrice ?? item.product.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 text-xs text-stone-600 pt-3 border-t border-stone-200/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900 tabular-nums">৳{cartSubtotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span className="font-medium tabular-nums">-৳{couponDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{isBn ? 'ডেলিভারি চার্জ' : 'Delivery Charge'} ({isLocalDelivery ? (isBn ? 'নীলফামারী / লোকাল' : 'Nilphamari / Local') : (isBn ? 'সারাদেশ' : 'Nationwide')})</span>
                <span className="font-medium text-stone-900 tabular-nums">
                  {deliveryCharge === 0 ? (isBn ? 'ফ্রি ডেলিভারি' : 'Free Delivery') : `৳${deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Amount Due</span>
                <span className="font-display text-xl font-bold tabular-nums">
                  ৳{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Complete Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-50 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <CheckCircle2 className="w-4 h-4 text-[#EDE0C2]" />
              <span>{isSubmitting ? 'Recording Order in Database...' : `Confirm & Place Order · ৳${finalTotal.toLocaleString()}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
