import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RotateCcw, MapPin, Phone, MessageCircle } from 'lucide-react';
import heroImg from '../assets/images/hero_luxury_dinnerware_1790413597001.jpg';

export const Hero: React.FC = () => {
  const { setCurrentPage, setSelectedCategoryFilter, language } = useStore();
  const isBn = language === 'bn';

  const handleExplore = (category = 'All') => {
    setSelectedCategoryFilter(category as any);
    setCurrentPage('shop');
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-6 pb-14 lg:py-16 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#A37835]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isBn
                  ? 'উপহার বিতান · নীলফামারী'
                  : 'Upohar Bitan · Nilphamari'}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-[1.2] text-balance">
              {isBn
                ? 'রুচিশীল ক্রোকারিজ ও মনকাড়া গিফট সামগ্রীর নির্ভরযোগ্য প্রতিষ্ঠান'
                : 'Fine Crockery, Modern Kitchenware & Exquisite Gift Corner'}
            </h1>

            <p className="text-sm sm:text-base text-stone-600 font-normal leading-relaxed max-w-xl">
              {isBn
                ? 'উপহার বিতানে পাচ্ছেন প্রতিদিনের প্রয়োজনীয় ও আধুনিক ডিজাইনের ক্রোকারিজ, টেকসই কিচেন সামগ্রী এবং প্রিয়জনকে উপহার দেওয়ার জন্য আকর্ষণীয় সব গিফট আইটেম। মানসম্মত পণ্য, সঠিক মূল্য ও আন্তরিক সেবাই আমাদের লক্ষ্য।'
                : 'Upohar Bitan is your trusted destination in Nilphamari for tasteful everyday tableware, durable kitchenware essentials, and delightful gifts for your loved ones.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleExplore('All')}
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>{isBn ? 'পণ্যসমূহ দেখুন' : 'Explore Catalog'}</span>
                <ArrowRight className="w-4 h-4 text-[#EDE0C2]" />
              </button>

              <button
                onClick={() => setCurrentPage('about')}
                className="px-5 py-3.5 text-xs sm:text-sm font-semibold text-stone-800 bg-[#FAF8F5] border border-stone-300 rounded-lg hover:bg-stone-100 hover:border-stone-400 transition-colors cursor-pointer"
              >
                {isBn ? 'আমাদের সম্পর্কে' : 'About Us'}
              </button>

              <a
                href="https://wa.me/8801712470028?text=Hello%20Upohar%20Bitan%2C%20I%20want%20to%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp অর্ডার</span>
              </a>
            </div>

            {/* Local Store Highlights */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-1 min-[380px]:grid-cols-3 gap-4 text-left">
              <div>
                <div className="font-display text-base sm:text-xl font-bold text-stone-900 flex items-center gap-1 min-w-0">
                  <MapPin className="w-4 h-4 text-[#A37835]" />
                  <span>গাছবাড়ী</span>
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  {isBn ? 'নীলফামারী সদর' : 'Nilphamari'}
                </div>
              </div>
              <div>
                <div className="font-display text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-1">
                  <Phone className="w-4 h-4 text-[#A37835]" />
                  <a href="tel:01712470028" className="hover:text-[#A37835] transition-colors whitespace-nowrap">01712470028</a>
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  {isBn ? 'কল / হোয়াটসঅ্যাপ' : 'Direct Support'}
                </div>
              </div>
              <div>
                <div className="font-display text-lg sm:text-xl font-bold text-stone-900 tabular-nums">100%</div>
                <div className="text-xs text-stone-500 mt-0.5">
                  {isBn ? 'গ্রাহক সন্তুষ্টি' : 'Satisfaction'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-16/11 sm:aspect-16/10 bg-stone-100 border border-stone-200">
              <img
                src={heroImg}
                alt="উপহার বিতান - মানসম্মত ক্রোকারিজ ও ডিনার সেট"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating Overlay Badge */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md rounded-xl p-4 border border-white/60 shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A37835]">
                    {isBn ? 'উপহার বিতান স্পেশাল' : 'Upohar Bitan Special'}
                  </span>
                  <h3 className="font-display text-base sm:text-lg font-bold text-stone-900">
                    {isBn ? 'রয়্যাল বোন চায়না ৩২-পিস ডিনার সেট' : 'Royal 32-Piece Bone China Dinner Set'}
                  </h3>
                  <div className="text-xs text-stone-600 mt-0.5 font-light">
                    {isBn ? '৬ জনের পরিবেশন · গিফট বক্স সহ' : 'Service for 6 · Premium Gift Box'}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className="text-xs text-stone-400 line-through">৳28,500</div>
                  <div className="text-base sm:text-lg font-bold text-stone-900 tabular-nums font-mono">
                    ৳24,900
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Propositions Strip */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EDE0C2]/50 flex items-center justify-center text-[#A37835] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-stone-900">
                {isBn ? 'বিশ্বাস ও গুণগত মান' : 'Trust & Top Quality'}
              </div>
              <div className="text-xs text-stone-500">
                {isBn ? 'টেকসই, নিরাপদ ও ফুড গ্রেড পণ্য সামগ্রী' : 'Durable, safe and food-grade items'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EDE0C2]/50 flex items-center justify-center text-[#A37835] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-stone-900">
                {isBn ? 'সঠিক মূল্য ও দ্রুত ডেলিভারি' : 'Fair Price & Fast Delivery'}
              </div>
              <div className="text-xs text-stone-500">
                {isBn ? 'নীলফামারী সহ সারা বাংলাদেশে ডেলিভারি' : 'Prompt delivery in Nilphamari & nationwide'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EDE0C2]/50 flex items-center justify-center text-[#A37835] shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-stone-900">
                {isBn ? 'আন্তরিক গ্রাহক সেবা' : 'Caring Customer Service'}
              </div>
              <div className="text-xs text-stone-500">
                {isBn ? 'যেকোনো প্রয়োজনে সরাসরি কল বা মেসেজ দিন' : 'Direct WhatsApp & phone assistance'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
