import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Lock, Truck } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';
import { useStore } from '../context/StoreContext';

export const CheckoutPage: React.FC = () => {
  const { setCurrentPage, cart, language } = useStore();
  const [showForm, setShowForm] = useState(false);
  const isBn = language === 'bn';

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> {isBn ? 'শপিংয়ে ফিরে যান' : 'Back to shopping'}
      </button>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-[#A37835] uppercase">
            {isBn ? 'অর্ডার কনফার্মেশন' : 'Order Confirmation'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
            {isBn ? 'আপনার অর্ডারটি সম্পন্ন করুন' : 'Complete your order'}
          </h1>
          <p className="text-sm text-stone-500 mt-3 max-w-2xl">
            {isBn ? 'আপনার নাম, মোবাইল, ঠিকানা ও পেমেন্ট তথ্য দিয়ে অর্ডারটি নিশ্চিত করুন।' : 'Enter your contact, delivery and payment information to confirm your order.'}
          </p>

          {!showForm && (
            <button onClick={() => setShowForm(true)} disabled={!cart.length} className="mt-8 w-full sm:w-auto px-7 py-3.5 rounded-xl bg-stone-900 text-white font-semibold text-sm shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-40">
              {isBn ? 'তথ্য দিয়ে অর্ডার করুন →' : 'Continue to order →'}
            </button>
          )}
          {showForm && <CheckoutModal />}
        </div>

        <div className="bg-[#F7F1E1] rounded-2xl border border-[#EDE0C2] p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-900"><Lock className="w-4 h-4 text-[#A37835]" /> {isBn ? 'নিরাপদ অর্ডার' : 'Secure order'}</div>
          <div className="mt-5 space-y-4 text-xs text-stone-600">
            <p className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />{isBn ? 'আপনার তথ্য অর্ডারের জন্য ব্যবহার হবে।' : 'Your details are used for order processing.'}</p>
            <p className="flex gap-2"><Truck className="w-4 h-4 text-[#A37835] shrink-0" />{isBn ? 'ডেলিভারি ঠিকানা যাচাই করে পাঠানো হবে।' : 'Your delivery address will be verified.'}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
