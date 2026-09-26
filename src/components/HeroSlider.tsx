import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { normalizeImageUrl } from '../utils/imageUrl';

export const HeroSlider: React.FC = () => {
  const { settings, language, setCurrentPage } = useStore();
  const rawSlides = (settings.heroSlides || []).filter((slide) => slide.active !== false && slide.image);
  
  // Fallback slides if none configured yet
  const slides = rawSlides.length > 0 ? rawSlides : [
    {
      id: 'SLIDE-DEFAULT-1',
      image: 'https://lh3.googleusercontent.com/d/1uoe21Lcjwz1DkWc-k2D5LyMsBwti5gdZ',
      titleBn: 'উপহার বিতান — আধুনিক ক্রোকারিজ ও কিচেন সামগ্রী',
      titleEn: 'Upohar Bitan — Modern Tableware & Kitchenware',
      subtitleBn: 'নীলফামারীতে মানসম্মত পণ্য, সঠিক মূল্য ও নির্ভরযোগ্য সেবার প্রতিশ্রুতি',
      subtitleEn: 'Quality tableware, fair pricing, and trustworthy service in Nilphamari',
      active: true,
    }
  ];

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || isPaused) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [slides.length, isPaused]);

  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [index, slides.length]);

  if (!slides.length) return null;
  const currentSlide = slides[index];
  const isBn = language === 'bn';
  const title = isBn
    ? (currentSlide.titleBn || currentSlide.titleEn || '')
    : (currentSlide.titleEn || currentSlide.titleBn || '');
  const subtitle = isBn
    ? (currentSlide.subtitleBn || currentSlide.subtitleEn || '')
    : (currentSlide.subtitleEn || currentSlide.subtitleBn || '');

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-2 w-full max-w-full overflow-hidden">
      <div
        className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-stone-900 shadow-lg h-[240px] sm:h-[340px] md:h-[420px] lg:h-[460px] w-full group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {slides.map((s, idx) => (
          <div
            key={s.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={normalizeImageUrl(s.image)}
              alt={s.titleBn || s.titleEn || 'Upohar Bitan Banner'}
              className="absolute inset-0 h-full w-full object-cover object-center transform scale-100 group-hover:scale-102 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/15" />
            
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-7 md:p-10 text-white z-20">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#F7F1E1] bg-black/50 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/20">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#DFB15B]" />
                  <span>{isBn ? 'বিশেষ কালেকশন' : 'Featured Collection'}</span>
                </span>
                <span className="text-[9px] sm:text-[10px] text-stone-300 font-mono bg-black/50 px-1.5 sm:px-2 py-0.5 rounded-full border border-white/10">
                  {index + 1} / {slides.length}
                </span>
              </div>

              {title && (
                <h2 className="font-display text-base sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white text-balance drop-shadow-sm max-w-3xl leading-snug line-clamp-2">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-1 text-[11px] sm:text-xs md:text-sm text-stone-200 max-w-2xl font-light line-clamp-1 sm:line-clamp-2">
                  {subtitle}
                </p>
              )}

              <div className="mt-2.5 sm:mt-4 flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage('shop')}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold bg-[#BE9346] hover:bg-[#a37835] text-stone-950 rounded-lg shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5 font-sans"
                >
                  <span>{isBn ? 'কালেকশন দেখুন' : 'Explore Catalog'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label={isBn ? 'আগের ছবি' : 'Previous slide'}
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer border border-white/20"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              aria-label={isBn ? 'পরের ছবি' : 'Next slide'}
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer border border-white/20"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="absolute bottom-2.5 right-3 sm:bottom-4 sm:right-5 z-30 flex items-center gap-1 sm:gap-1.5 bg-black/50 backdrop-blur-md px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/15">
              {slides.map((s, i) => (
                <button
                  key={s.id || i}
                  type="button"
                  aria-label={`${isBn ? 'স্লাইড' : 'Slide'} ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                    i === index ? 'w-5 sm:w-7 bg-[#BE9346]' : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

