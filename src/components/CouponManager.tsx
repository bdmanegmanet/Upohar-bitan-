import React, { useState } from 'react';
import { Tag, Plus, Edit, Trash2, Check, X, Copy, Percent, DollarSign, ToggleLeft, ToggleRight, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Coupon } from '../types';

export const CouponManager: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, language, showToast } = useStore();
  const isBn = language === 'bn';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minimumOrder, setMinimumOrder] = useState<number>(1500);
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [formError, setFormError] = useState('');

  // Simulation test state
  const [testSubtotal, setTestSubtotal] = useState<number>(2500);

  const openAddModal = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountType('percent');
    setDiscountValue(10);
    setMinimumOrder(1500);
    setDescription('');
    setActive(true);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    if (coupon.discountAmount && !coupon.discountPercent) {
      setDiscountType('amount');
      setDiscountValue(coupon.discountAmount);
    } else {
      setDiscountType('percent');
      setDiscountValue(coupon.discountPercent || 10);
    }
    setMinimumOrder(coupon.minimumOrder || 0);
    setDescription(coupon.description || '');
    setActive(coupon.active !== false);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase().replace(/\s+/g, '');
    if (!cleanCode) {
      setFormError(isBn ? 'অনুগ্রহ করে কুপন কোড লিখুন' : 'Please provide a coupon code');
      return;
    }

    if (discountValue <= 0) {
      setFormError(isBn ? 'ডিসকাউন্টের পরিমাণ ০ এর বেশি হতে হবে' : 'Discount value must be greater than 0');
      return;
    }

    if (discountType === 'percent' && discountValue > 90) {
      setFormError(isBn ? 'শতকরা ডিসকাউন্ট সর্বোচ্চ ৯০% হতে পারে' : 'Percentage discount cannot exceed 90%');
      return;
    }

    const payload: Coupon = {
      code: cleanCode,
      minimumOrder: Math.max(0, Number(minimumOrder) || 0),
      description: description.trim() || (discountType === 'percent' ? `${discountValue}% OFF` : `৳${discountValue} OFF`),
      active,
      ...(discountType === 'percent'
        ? { discountPercent: Number(discountValue), discountAmount: undefined }
        : { discountAmount: Number(discountValue), discountPercent: undefined }),
    };

    if (editingCoupon) {
      updateCoupon(payload);
    } else {
      addCoupon(payload);
    }

    setIsModalOpen(false);
  };

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    showToast(isBn ? `কুপন কোড "${couponCode}" কপি হয়েছে!` : `Copied "${couponCode}" to clipboard!`);
  };

  const handleToggleActive = (coupon: Coupon) => {
    updateCoupon({
      ...coupon,
      active: coupon.active === false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700">
              <Tag className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-900">
              {isBn ? 'কুপন ও ছাড় পরিচালনা' : 'Coupon & Discount Management'}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            {isBn
              ? 'গ্রাহকদের জন্য আকর্ষণীয় প্রোমো কোড তৈরি ও এডিট করুন। শতকরা বা নির্দিষ্ট টাকার ছাড় দিন, নূন্যতম অর্ডারের শর্ত নির্ধারণ করুন।'
              : 'Create, update, and manage discount promo codes for customers. Offer percentage or fixed discounts with minimum order thresholds.'}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>{isBn ? '+ নতুন কুপন যোগ করুন' : '+ Add New Coupon'}</span>
        </button>
      </div>

      {/* Coupons List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => {
          const isActive = coupon.active !== false;
          return (
            <div
              key={coupon.code}
              className={`p-5 rounded-2xl border transition-all ${
                isActive
                  ? 'bg-white border-stone-200 hover:border-amber-400 hover:shadow-md'
                  : 'bg-stone-50/80 border-stone-200/70 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base px-2.5 py-0.5 rounded-lg bg-amber-100 text-stone-900 border border-amber-300">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      title="Copy code"
                      className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      {coupon.discountPercent
                        ? `${coupon.discountPercent}% ${isBn ? 'ছাড়' : 'OFF'}`
                        : `৳${coupon.discountAmount} ${isBn ? 'ছাড়' : 'OFF'}`}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleActive(coupon)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                  }`}
                  title={isActive ? 'Click to disable' : 'Click to enable'}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                  <span>{isActive ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'নিষ্ক্রিয়' : 'Disabled')}</span>
                </button>
              </div>

              <p className="text-xs text-stone-600 mt-3 line-clamp-2 min-h-8">
                {coupon.description || (isBn ? 'কোনো বিবরণ নেই' : 'No description')}
              </p>

              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span>
                  {isBn ? 'সর্বনিম্ন অর্ডার:' : 'Min Order:'}{' '}
                  <strong className="text-stone-800 tabular-nums">৳{(coupon.minimumOrder || 0).toLocaleString()}</strong>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(coupon)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                    title={isBn ? 'এডিট করুন' : 'Edit coupon'}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(isBn ? `আপনি কি "${coupon.code}" কুপনটি মুছে ফেলতে চান?` : `Are you sure you want to delete "${coupon.code}"?`)) {
                        deleteCoupon(coupon.code);
                      }
                    }}
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title={isBn ? 'মুছে ফেলুন' : 'Delete coupon'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {coupons.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8">
          <Tag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-semibold text-stone-800 text-sm">{isBn ? 'কোনো কুপন পাওয়া যায়নি' : 'No coupons available'}</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {isBn ? 'নতুন কুপন যোগ করে গ্রাহকদের ছাড়ের সুবিধা দিন।' : 'Add your first coupon to offer discounts to your customers.'}
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold"
          >
            {isBn ? 'কুপন তৈরি করুন' : 'Create Coupon'}
          </button>
        </div>
      )}

      {/* Real-time Coupon Discount Simulator */}
      <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{isBn ? 'কুপন ডিসকাউন্ট ক্যালকুলেটর (টেস্টিং)' : 'Coupon Discount Calculator (Live Preview)'}</span>
        </h4>
        <p className="text-xs text-stone-500 mb-4">
          {isBn
            ? 'নির্দিষ্ট পরিমাণ টাকার অর্ডারে কুপন কত টাকা ছাড় দিবে তা সাথে সাথে পরীক্ষা করুন:'
            : 'Test how much discount will be applied for a sample order subtotal:'}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs">
            <span className="text-stone-500">{isBn ? 'অর্ডার সাবটোটাল:' : 'Order Subtotal:'}</span>
            <span className="font-bold text-stone-900">৳</span>
            <input
              type="number"
              min="0"
              step="100"
              value={testSubtotal}
              onChange={(e) => setTestSubtotal(Math.max(0, Number(e.target.value)))}
              className="w-24 font-bold text-stone-900 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {coupons.map((c) => {
              const meetsMin = testSubtotal >= (c.minimumOrder || 0);
              const isActive = c.active !== false;
              let discount = 0;
              if (meetsMin && isActive) {
                discount = c.discountPercent
                  ? Math.round((testSubtotal * c.discountPercent) / 100)
                  : Math.min(testSubtotal, c.discountAmount || 0);
              }

              return (
                <div
                  key={c.code}
                  className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${
                    meetsMin && isActive
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-white border-stone-200 text-stone-400'
                  }`}
                >
                  <span className="font-mono font-bold">{c.code}:</span>
                  {meetsMin && isActive ? (
                    <span className="font-bold text-emerald-700">-৳{discount.toLocaleString()}</span>
                  ) : !isActive ? (
                    <span className="text-[10px] text-stone-400">নিষ্ক্রিয়</span>
                  ) : (
                    <span className="text-[10px] text-amber-600">min ৳{(c.minimumOrder || 0).toLocaleString()}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-slide-up space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-display text-lg font-bold text-stone-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-600" />
                <span>{editingCoupon ? (isBn ? 'কুপন এডিট করুন' : 'Edit Coupon') : (isBn ? 'নতুন কুপন যোগ করুন' : 'Add New Coupon')}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  {isBn ? 'কুপন কোড (বড় হাতের অক্ষরে)' : 'Coupon Code (UPPERCASE)'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EID2026, DISCOUNT10"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 font-mono text-sm font-bold bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {isBn ? 'ছাড়ের ধরন' : 'Discount Type'}
                  </label>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-stone-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setDiscountType('percent')}
                      className={`py-2 rounded-lg font-medium transition-all ${
                        discountType === 'percent'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      শতকরা (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiscountType('amount')}
                      className={`py-2 rounded-lg font-medium transition-all ${
                        discountType === 'amount'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      টাকা (৳)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {discountType === 'percent' ? (isBn ? 'ছাড়ের হার (%)' : 'Percentage (%)') : (isBn ? 'ছাড়ের পরিমাণ (৳)' : 'Fixed Amount (৳)')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={discountType === 'percent' ? 90 : 100000}
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 font-bold bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  {isBn ? 'সর্বনিম্ন অর্ডারের পরিমাণ (৳)' : 'Minimum Order Requirement (৳)'}
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={minimumOrder}
                  onChange={(e) => setMinimumOrder(Number(e.target.value))}
                  placeholder="0 means no minimum requirement"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  {isBn ? 'কত টাকার বেশি অর্ডার করলে কুপনটি প্রযোজ্য হবে (০ দিলে যেকোনো অর্ডারে প্রযোজ্য)' : 'Minimum cart subtotal required to apply this coupon.'}
                </span>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  {isBn ? 'বিবরণ / বার্তা' : 'Description / Offer Note'}
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. ১০% ছাড় ২০০০ টাকার অধিক অর্ডারে"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-stone-800">{isBn ? 'কুপনটি সক্রিয় থাকবে' : 'Coupon is active'}</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium cursor-pointer"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold cursor-pointer shadow-sm"
                  >
                    {isBn ? 'সংরক্ষণ করুন' : 'Save Coupon'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
