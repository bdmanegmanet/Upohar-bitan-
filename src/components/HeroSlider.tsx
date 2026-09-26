import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { normalizeImageUrl } from '../utils/imageUrl';

export const HeroSlider: React.FC = () => {
  const { settings, language } = useStore();
  const slides = (settings.heroSlides || []).filter((slide) => slide.active !== false && slide.image);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  React.useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [index, slides.length]);

  if (!slides.length) return null;
  const slide = slides[index];
  const title = language === 'bn' ? (slide.titleBn || slide.titleEn || '') : (slide.titleEn || slide.titleBn || '');
  const subtitle = language === 'bn' ? (slide.subtitleBn || slide.subtitleEn || '') : (slide.subtitleEn || slide.subtitleBn || '');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="relative overflow-hidden rounded-2xl bg-stone-900 shadow-lg aspect-video">
        <img
          src={normalizeImageUrl(slide.image)}
          alt={title || 'Upohar Bitan'}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 text-white">
          {title && <h2 className="font-serif text-2xl sm:text-4xl font-bold">{title}</h2>}
          {subtitle && <p className="mt-1.5 text-xs sm:text-sm text-white/90 max-w-2xl">{subtitle}</p>}
        </div>

        {slides.length > 1 && (
          <>
            <button type="button" aria-label={language === 'bn' ? 'আগের ছবি' : 'Previous slide'} onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button type="button" aria-label={language === 'bn' ? 'পরের ছবি' : 'Next slide'} onClick={() => setIndex((i) => (i + 1) % slides.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 right-4 flex gap-1.5">
              {slides.map((s, i) => (
                <button key={s.id} type="button" aria-label={`${language === 'bn' ? 'স্লাইড' : 'Slide'} ${i + 1}`} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
