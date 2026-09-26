import React from 'react';
import { useStore } from '../context/StoreContext';
import { Package, ShieldCheck, Heart, Phone, Mail, MapPin, MessageCircle, ExternalLink, Facebook } from 'lucide-react';
import { ProductCategory } from '../types';

export const Footer: React.FC = () => {
  const { setCurrentPage, setSelectedCategoryFilter, settings, setIsTrackingOpen, categories, language, t } = useStore();
  const isBn = language === 'bn';

  const handleCategoryNav = (cat: ProductCategory) => {
    setSelectedCategoryFilter(cat);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageNav = (page: any) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C1917] text-stone-300 pt-16 pb-24 lg:pb-12 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-stone-800">
          {/* Brand Col (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <span className="font-display text-2xl font-bold tracking-wider text-white">
                উপহার বিতান
              </span>
              <span className="block text-[11px] tracking-[0.15em] text-[#DFB15B] font-sans mt-0.5 font-medium">
                UPOHAR BITAN · নীলফামারী
              </span>
            </div>

            <p className="text-stone-400 font-light leading-relaxed max-w-sm">
              {isBn
                ? 'নীলফামারীর বিশ্বস্ত ক্রোকারিজ ও গিফট সামগ্রীর প্রতিষ্ঠান। প্রতিদিনের প্রয়োজনীয় ও রুচিশীল ক্রোকারিজ, কিচেন সামগ্রী এবং আকর্ষণীয় গিফট আইটেম।'
                : 'Trusted crockery and luxury gift shop in Nilphamari. Supplying everyday household tableware, premium kitchen essentials, and charming gifts.'}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a href={settings.facebookUrl || 'https://www.facebook.com/share/19ga8RpbsZ/'} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon-btn !bg-stone-900 !border-stone-700 !text-stone-300 hover:!text-white">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://wa.me/8801712470028?text=Hello%20Upohar%20Bitan" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="social-icon-btn social-whatsapp !bg-stone-900 !border-stone-700">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="tel:01712470028" aria-label="Call" className="social-icon-btn social-phone !bg-stone-900 !border-stone-700">
                <Phone className="w-4 h-4" />
              </a>
            </div>

            <div className="space-y-2 text-stone-300 pt-1 text-[11px]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#DFB15B] shrink-0 mt-0.5" />
                <span className="leading-relaxed">পুরাতন স্টেশন রোড, গাছবাড়ী, নীলফামারী</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#DFB15B] shrink-0" />
                <a href="tel:01712470028" className="hover:text-white transition-colors font-mono font-medium">
                  01712470028
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/8801712470028?text=Hello%20Upohar%20Bitan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors font-medium text-emerald-400"
                >
                  WhatsApp: 01712470028
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#DFB15B] shrink-0" />
                <a href="mailto:upoharb@gmail.com" className="hover:text-white transition-colors">
                  upoharb@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Categories Col (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              {isBn ? 'ক্যাটাগরি' : 'Categories'}
            </h4>
            <ul className="space-y-2 text-stone-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id || cat.name}>
                  <button onClick={() => handleCategoryNav(cat.name)} className="hover:text-white transition-colors cursor-pointer text-left">
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service Col (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              {isBn ? 'গ্রাহক সেবা ও তথ্য' : 'Customer Care'}
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={() => setIsTrackingOpen(true)} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Package className="w-3.5 h-3.5 text-[#DFB15B]" />
                  <span>{isBn ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handlePageNav('about')} className="hover:text-white transition-colors cursor-pointer text-[#DFB15B]">
                  {isBn ? 'আমাদের সম্পর্কে (দোকান পরিচিতি)' : 'About Us (Store Info)'}
                </button>
              </li>
              <li>
                <button onClick={() => handlePageNav('delivery')} className="hover:text-white transition-colors cursor-pointer">
                  {isBn ? 'ডেলিভারি সংক্রান্ত তথ্য' : 'Delivery Rates & Timelines'}
                </button>
              </li>
              <li>
                <button onClick={() => handlePageNav('returns')} className="hover:text-white transition-colors cursor-pointer">
                  {isBn ? 'রিটার্ন ও রিপ্লেসমেন্ট পলিসি' : 'Return & Replacement Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => handlePageNav('faq')} className="hover:text-white transition-colors cursor-pointer">
                  {isBn ? 'সাধারণ প্রশ্নোত্তর (FAQ)' : 'Packaging & Care FAQs'}
                </button>
              </li>
            </ul>
          </div>

          {/* Payments & Assurance (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              {isBn ? 'মূল্য পরিশোধ মাধ্যম' : 'Payment Methods'}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-stone-900 border border-stone-800 rounded text-center text-stone-300">
                ক্যাশ অন ডেলিভারি
              </div>
              <div className="p-2 bg-stone-900 border border-stone-800 rounded text-center text-pink-400 font-medium">
                বিকাশ (bKash)
              </div>
              <div className="p-2 bg-stone-900 border border-stone-800 rounded text-center text-amber-400 font-medium">
                নগদ (Nagad)
              </div>
              <div className="p-2 bg-stone-900 border border-stone-800 rounded text-center text-blue-400 font-medium">
                ব্যাংক পেমেন্ট
              </div>
            </div>

            <div className="pt-2 text-[11px] space-y-1.5 text-stone-400">
              <div className="flex items-center gap-1.5 text-stone-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>মানসম্মত পণ্য ও শতভাগ গ্রাহক সন্তুষ্টি</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-300">
                <Heart className="w-3.5 h-3.5 text-[#DFB15B]" />
                <span>নীলফামারী সহ সারা বাংলাদেশে ডেলিভারি</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} উপহার বিতান (Upohar Bitan)। সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => handlePageNav('terms')} className="hover:text-white transition-colors cursor-pointer">
              {isBn ? 'শর্তাবলী' : 'Terms & Conditions'}
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => handlePageNav('privacy')} className="hover:text-white transition-colors cursor-pointer">
              {isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
            </button>
            <span aria-hidden="true">·</span>
            <a
              href={settings.facebookUrl || 'https://www.facebook.com/share/19ga8RpbsZ/'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Page"
              title="Facebook Page"
              className="social-icon-btn !w-7 !h-7 !bg-stone-900 !border-stone-700 !text-[#DFB15B] hover:!text-white"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
