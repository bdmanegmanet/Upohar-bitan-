import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, RotateCcw, HelpCircle, ArrowLeft, MapPin, Phone, Mail, MessageCircle, ExternalLink, Heart, CheckCircle2, Award } from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const { setCurrentPage, settings, language, t } = useStore();
  const isBn = language === 'bn';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => setCurrentPage('home')}
        className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1.5 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{isBn ? 'হোম পেজে ফিরে যান' : 'Back to Home'}</span>
      </button>

      <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A37835]">
        {isBn ? 'নীলফামারীর বিশ্বস্ত প্রতিষ্ঠান' : 'Trusted Local Store in Nilphamari'}
      </span>
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-1 mb-3">
        {isBn ? 'আমাদের সম্পর্কে — উপহার বিতান' : 'About Us — Upohar Bitan'}
      </h1>
      <p className="text-sm text-stone-600 mb-8 font-medium">
        {isBn
          ? 'নীলফামারীতে আধুনিক ও রুচিশীল ক্রোকারিজ, কিচেন সামগ্রী ও গিফট সামগ্রীর বিশ্বস্ত ঠিকানা।'
          : 'Your trusted store for modern crockery, kitchen essentials, and delightful gifts in Nilphamari.'}
      </p>

      {/* Main Narrative Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6 text-stone-800 leading-relaxed">
        <div className="space-y-4 text-sm sm:text-base">
          <p className="font-normal">
            <strong>উপহার বিতান</strong> হলো নীলফামারীর একটি বিশ্বস্ত ক্রোকারিজ ও গিফট সামগ্রীর প্রতিষ্ঠান। আমরা প্রতিদিনের প্রয়োজনীয় ও রুচিশীল পণ্য, আধুনিক ডিজাইনের ক্রোকারিজ, কিচেন সামগ্রী এবং প্রিয়জনকে উপহার দেওয়ার জন্য আকর্ষণীয় গিফট আইটেম সরবরাহ করে থাকি।
          </p>

          <p className="font-normal text-stone-700">
            আমাদের লক্ষ্য হলো গ্রাহকদের কাছে মানসম্মত পণ্য, সঠিক মূল্য এবং আন্তরিক সেবা পৌঁছে দেওয়া। পরিবারের জন্য প্রয়োজনীয় সামগ্রী থেকে শুরু করে বিশেষ মুহূর্তের উপহার—সবকিছু এক জায়গায় সহজে পাওয়ার সুযোগ তৈরি করাই আমাদের উদ্দেশ্য।
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="pt-4 border-t border-stone-100">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-4">
            {isBn ? 'আমাদের মূল ৩টি অঙ্গীকার' : 'Our 3 Core Pillars'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-[#825B2A]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">বিশ্বাস</h4>
                <p className="text-xs text-stone-600 mt-1">
                  প্রতিটি গ্রাহকের আস্থার প্রতি সম্মান রেখে সততার সাথে ব্যবসা পরিচালনা।
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-[#825B2A]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">গুণগত মান</h4>
                <p className="text-xs text-stone-600 mt-1">
                  টেকসই, ফুড-গ্রেড ও দৃষ্টিনন্দন ডিজাইনের প্রিমিয়াম ক্রোকারিজ ও কিচেনওয়্যার।
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-[#825B2A]">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">গ্রাহক সন্তুষ্টি</h4>
                <p className="text-xs text-stone-600 mt-1">
                  সঠিক পরামর্শ, আন্তরিক ব্যবহার এবং নিরাপদ ডেলিভারির নিশ্চয়তা।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details Card */}
        <div className="pt-6 border-t border-stone-100">
          <h3 className="font-display text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
            <span>যোগাযোগের ঠিকানা ও তথ্য</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="text-lg">🏪</span>
                <div>
                  <span className="text-[11px] text-stone-500 font-medium block">দোকানের নাম</span>
                  <strong className="text-stone-900 text-sm">উপহার বিতান</strong>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#A37835] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-stone-500 font-medium block">ঠিকানা</span>
                  <span className="text-stone-800 font-medium leading-relaxed">
                    পুরাতন স্টেশন রোড, গাছবাড়ী, নীলফামারী।
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#A37835] shrink-0" />
                <div>
                  <span className="text-[11px] text-stone-500 font-medium block">Gmail</span>
                  <a
                    href="mailto:upoharb@gmail.com"
                    className="text-stone-900 hover:text-[#A37835] font-medium"
                  >
                    upoharb@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-stone-500 font-medium block">Whatsapp / মোবাইল</span>
                  <a
                    href="tel:01712470028"
                    className="text-stone-900 font-mono font-bold text-sm hover:text-emerald-700"
                  >
                    01712470028
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-stone-500 font-medium block">ফেসবুক পেজ</span>
                  <a
                    href="https://www.facebook.com/share/19ga8RpbsZ/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline font-medium break-all"
                  >
                    facebook.com/share/19ga8RpbsZ/
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="https://wa.me/8801712470028?text=Hello%20Upohar%20Bitan%2C%20I%20would%20like%20to%20inquire%20about%20your%20crockery%20and%20gift%20items."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp-এ সরাসরি মেসেজ দিন (01712470028)</span>
            </a>

            <a
              href="https://www.facebook.com/share/19ga8RpbsZ/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>আমাদের ফেসবুক পেজ ভিজিট করুন</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FAQPage: React.FC = () => {
  const { setCurrentPage } = useStore();

  const faqs = [
    {
      q: 'How are fragile crockery orders packaged to prevent breakage during transit?',
      a: 'We use custom 5-layer shockproof air-cushion wrapping, high-density honeycomb cardboard, and reinforced outer shipping cartons. Each plate and bowl is individually separated by foam sheets. In the rare event of transit damage, we provide a 100% free immediate replacement.',
    },
    {
      q: 'Are 24K gold rim tableware sets microwave and dishwasher safe?',
      a: 'Pieces featuring genuine 24-karat gold trim contain real conductive metal and should NEVER be placed in a microwave. While gentle dishwasher cycles are possible, handwashing with a soft sponge is strongly recommended to maintain the gold sheen for generations.',
    },
    {
      q: 'What payment methods do you support?',
      a: 'We support Cash on Delivery (COD) nationwide, mobile financial payments via bKash and Nagad, and direct bank wire transfers to City Bank Ltd.',
    },
    {
      q: 'How long does delivery take inside and outside Dhaka?',
      a: 'Orders inside Dhaka are delivered within 24 to 48 hours. Orders across other divisions (Chittagong, Sylhet, Rajshahi, Khulna, etc.) are delivered via express courier within 48 to 72 hours.',
    },
    {
      q: 'Can I purchase single plates to replace a broken piece from my set?',
      a: 'Yes! We maintain open-stock availability for all our major collections including Aurum, Nordic Slate, and Kyoto. You can order individual replacement plates or bowls directly through our website.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => setCurrentPage('home')}
        className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1.5 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A37835]">
        Assistance & Care
      </span>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 mt-1 mb-6">
        Frequently Asked Questions
      </h1>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs">
            <h3 className="font-semibold text-stone-900 text-sm flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-[#A37835] shrink-0 mt-0.5" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed mt-2 pl-6">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DeliveryInfoPage: React.FC = () => {
  const { settings, setCurrentPage } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => setCurrentPage('home')}
        className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1.5 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A37835]">
        Logistics & Shipping
      </span>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 mt-1 mb-6">
        Delivery Information
      </h1>

      <div className="space-y-6 text-xs text-stone-700 leading-relaxed">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-xl border border-stone-200">
            <h3 className="font-semibold text-sm text-stone-900 mb-1">Inside Dhaka Metropolitan</h3>
            <p className="text-stone-500 mb-2">Delivered via our dedicated white-glove fragile courier team.</p>
            <div className="text-stone-900 font-bold text-sm">৳{settings.deliveryChargeInside} Flat Rate</div>
            <div className="text-[11px] text-emerald-700 mt-1 font-medium">Free for orders over ৳{settings.freeDeliveryThreshold.toLocaleString()}</div>
            <div className="text-[11px] text-stone-400 mt-1">Delivery Time: 24 - 48 Hours</div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-stone-200">
            <h3 className="font-semibold text-sm text-stone-900 mb-1">Nationwide (All Divisions)</h3>
            <p className="text-stone-500 mb-2">Chittagong, Sylhet, Rajshahi, Khulna, Barisal, Rangpur, Mymensingh.</p>
            <div className="text-stone-900 font-bold text-sm">৳{settings.deliveryChargeOutside} Flat Rate</div>
            <div className="text-[11px] text-emerald-700 mt-1 font-medium">Free for orders over ৳{settings.freeDeliveryThreshold.toLocaleString()}</div>
            <div className="text-[11px] text-stone-400 mt-1">Delivery Time: 48 - 72 Hours</div>
          </div>
        </div>

        <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-2">
          <h4 className="font-semibold text-stone-900 text-sm">Parcel Inspection Upon Delivery</h4>
          <p>
            For Cash on Delivery parcels, our delivery representatives will wait while you inspect the outer tamper-evident seal and check for any internal rattle. Should there be any sign of handling damage, simply decline the parcel or contact our concierge immediately at {settings.phone}.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ReturnPolicyPage: React.FC = () => {
  const { setCurrentPage } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => setCurrentPage('home')}
        className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1.5 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A37835]">
        Guarantee & Assurance
      </span>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 mt-1 mb-6">
        7-Day Return & Replacement Policy
      </h1>

      <div className="space-y-4 text-xs text-stone-700 leading-relaxed bg-white p-6 rounded-xl border border-stone-200">
        <p>
          We take extraordinary pride in the craftsmanship and packaging of every Aura piece. If you receive any item that is broken, chipped, or deviates from your ordered specifications, we guarantee a swift, hassle-free resolution.
        </p>

        <h3 className="font-semibold text-stone-900 text-sm pt-2">1. Breakage During Transit</h3>
        <p>
          Take a quick photo or video of the affected item along with the delivery label and WhatsApp it to our concierge within 7 days of receiving the parcel. We will dispatch a brand-new replacement immediately at no additional delivery cost.
        </p>

        <h3 className="font-semibold text-stone-900 text-sm pt-2">2. Unused Product Returns</h3>
        <p>
          If you wish to exchange a complete dinner set or unused plates for an alternate design, items must be in their original packaging, unwashed, and accompanied by the original order invoice.
        </p>

        <h3 className="font-semibold text-stone-900 text-sm pt-2">3. Refund Processing</h3>
        <p>
          For authorized refunds, payments made via bKash, Nagad, or Bank Transfer are reversed to the original payment source within 3 to 5 business days.
        </p>
      </div>
    </div>
  );
};

export const TermsPolicyPage: React.FC = () => {
  const { setCurrentPage } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => setCurrentPage('home')}
        className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1.5 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <h1 className="font-display text-3xl font-semibold text-stone-900 mb-6">
        Terms & Conditions
      </h1>

      <div className="space-y-3 text-xs text-stone-600 leading-relaxed bg-white p-6 rounded-xl border border-stone-200">
        <p>
          Welcome to Aura Tableware & Crockery. By browsing our website and placing orders, you agree to comply with our commercial terms. All prices are listed in Bangladeshi Taka (BDT) and include standard VAT. We reserve the right to correct typographical errors in product dimensions or pricing prior to order confirmation.
        </p>
        <p>
          Product imagery represents handcrafted artisanal creations. Due to natural kiln temperature variations and hand-applied glazes, minor organic variations in speckling and rim thickness are hallmark characteristics of authentic fine ceramics.
        </p>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  const { setCurrentPage } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => setCurrentPage('home')}
        className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1.5 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <h1 className="font-display text-3xl font-semibold text-stone-900 mb-6">
        Privacy Policy
      </h1>

      <div className="space-y-3 text-xs text-stone-600 leading-relaxed bg-white p-6 rounded-xl border border-stone-200">
        <p>
          At Aura Tableware, your privacy is strictly protected. Customer contact information (Name, Phone Number, Delivery Address, Email) is used exclusively to process your orders, provide dispatch tracking notifications, and coordinate logistics with verified delivery couriers.
        </p>
        <p>
          We never share, sell, or commercialize your personal data with third-party advertising brokers. All transaction IDs and payment records are handled with strict encryption and stored securely within our Google Apps Script and Sheets database.
        </p>
      </div>
    </div>
  );
};
