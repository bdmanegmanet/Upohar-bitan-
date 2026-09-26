import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { INITIAL_REVIEWS } from '../data/initialProducts';
import {
  Sparkles,
  ArrowRight,
  Star,
  ShieldCheck,
  CheckCircle2,
  Award,
  Flame,
  Send,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import platesImg from '../assets/images/category_dinner_plates_1790413613482.jpg';
import heroImg from '../assets/images/hero_luxury_dinnerware_1790413597001.jpg';

export const FeaturedSection: React.FC = () => {
  const { products, setCurrentPage, setSelectedCategoryFilter } = useStore();
  const featuredItems = products.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="py-14 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A37835]">
              Masterpiece Selection
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 mt-1">
              Featured Dinnerware & Sets
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategoryFilter('All');
              setCurrentPage('shop');
            }}
            className="text-xs font-semibold text-stone-800 hover:text-[#A37835] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export const FlashSaleSection: React.FC = () => {
  const { products, setCurrentPage } = useStore();
  const discounted = products.filter((p) => p.discountPrice && p.discountPrice < p.price).slice(0, 4);

  return (
    <section className="py-14 bg-[#FBF8F0] border-b border-[#EDE0C2]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#825B2A] bg-[#EDE0C2]/70 px-2.5 py-1 rounded-md mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-700" />
              <span>Limited Stock Special Campaign</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900">
              Exclusive Discounts & Sets
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('shop')}
            className="text-xs font-semibold text-stone-800 hover:text-[#A37835] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All Sale Items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {discounted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export const CraftsmanshipStory: React.FC = () => {
  return (
    <section className="py-16 bg-[#1C1917] text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#DFB15B]">
              Artisanal Heritage
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-white">
              Triple Kiln-Fired at 1,380°C for Flawless Translucence
            </h2>
            <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
              Every Aura plate, teacup, and serving vessel originates from mineral-rich clays combined with high bone ash percentages. Hand-inspected through seven distinct glazing stages, our crockery achieves exceptional chip-resistance while preserving delicate feather-light elegance.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="border border-stone-800 p-4 rounded-xl bg-stone-900/60">
                <Award className="w-5 h-5 text-[#DFB15B] mb-2" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                  24K Gold Gilding
                </h4>
                <p className="text-[11px] text-stone-400 mt-1">
                  Hand-applied liquid gold fired directly onto the porcelain glaze rim.
                </p>
              </div>

              <div className="border border-stone-800 p-4 rounded-xl bg-stone-900/60">
                <ShieldCheck className="w-5 h-5 text-[#DFB15B] mb-2" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                  Lead & Cadmium Free
                </h4>
                <p className="text-[11px] text-stone-400 mt-1">
                  Strictly 100% certified food contact safe for hot and cold cuisine.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <img
              src={platesImg}
              alt="Handcrafted porcelain plate making"
              referrerPolicy="no-referrer"
              className="rounded-xl object-cover aspect-4/5 w-full shadow-lg border border-stone-800"
            />
            <img
              src={heroImg}
              alt="Dinnerware firing"
              referrerPolicy="no-referrer"
              className="rounded-xl object-cover aspect-4/5 w-full shadow-lg border border-stone-800 mt-6"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const CustomerReviewsSection: React.FC = () => {
  return (
    <section className="py-14 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A37835]">
            Patron Testimonials
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 mt-1">
            Cherished by Connoisseurs
          </h2>
          <p className="text-xs text-stone-500 mt-2">
            Read verified reviews from dinner hosts, tea collectors, and newlywed couples across the country.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-xl border border-stone-200/80 bg-[#FAF8F5]/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-[#BE9346] mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-stone-700 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-200/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-900">{rev.author}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                    Verified
                  </span>
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5 truncate">
                  Purchased {rev.productName}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ContactAndNewsletter: React.FC = () => {
  const { settings, showToast, language } = useStore();
  const [emailSub, setEmailSub] = React.useState('');
  const isBn = language === 'bn';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub.trim()) {
      showToast(isBn ? 'ধন্যবাদ! উপহার বিতানের অফার তালিকায় আপনার ইমেইল যুক্ত হয়েছে।' : 'Thank you! You are now subscribed to Upohar Bitan offers.');
      setEmailSub('');
    }
  };

  return (
    <section className="py-14 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 shadow-xs">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A37835]">
              {isBn ? 'উপহার বিতান আপডেট' : 'Special Offers & Updates'}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
              {isBn ? 'নতুন ক্রোকারিজ ও গিফট আইটেমের খবর জানুন' : 'Stay Updated with New Arrivals & Offers'}
            </h3>
            <p className="text-xs text-stone-600 font-normal leading-relaxed max-w-md">
              {isBn
                ? 'নীলফামারীর উপহার বিতানের বিশেষ ডিসকাউন্ট, নতুন কালেকশন এবং উৎসবের গিফট সামগ্রীর অফার সবার আগে পেতে আপনার ইমেইল যুক্ত করুন।'
                : 'Subscribe to get the latest updates on new kitchenware arrivals, festive gift collections, and exclusive discounts from Upohar Bitan.'}
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input
                type="email"
                required
                placeholder={isBn ? 'আপনার ইমেইল অ্যাড্রেস লিখুন' : 'Enter your email address'}
                value={emailSub}
                onChange={(e) => setEmailSub(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#BE9346]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isBn ? 'যুক্ত হোন' : 'Subscribe'}</span>
                <Send className="w-3.5 h-3.5 text-[#EDE0C2]" />
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-stone-200 pt-6 lg:pt-0 lg:pl-8 space-y-3 text-xs text-stone-700">
            <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-2">
              {isBn ? 'দোকানের ঠিকানা ও সরাসরি যোগাযোগ' : 'Store Location & Direct Contact'}
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#A37835] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900">উপহার বিতান</strong>
                <span>পুরাতন স্টেশন রোড, গাছবাড়ী, নীলফামারী।</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#A37835] shrink-0" />
              <a href="tel:01712470028" className="hover:text-stone-950 font-mono font-medium">
                01712470028 (সকাল ৯টা - রাত ১০টা)
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#A37835] shrink-0" />
              <a href="mailto:upoharb@gmail.com" className="hover:text-stone-950 font-medium">
                upoharb@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
