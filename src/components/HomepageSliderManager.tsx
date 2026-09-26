import React from 'react';
import { Trash2, Plus, Power } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { normalizeImageUrl } from '../utils/imageUrl';

export const HomepageSliderManager: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const slides = settings.heroSlides || [];

  const updateSlide = (id: string, patch: Record<string, unknown>) => {
    updateSettings({
      ...settings,
      heroSlides: slides.map((slide) => slide.id === id ? { ...slide, ...patch } : slide),
    });
  };

  const addSlide = () => {
    updateSettings({
      ...settings,
      heroSlides: [
        ...slides,
        {
          id: 'SLIDE-' + Date.now(),
          image: '',
          titleBn: 'নতুন স্লাইড',
          titleEn: 'New Slide',
          subtitleBn: '',
          subtitleEn: '',
          active: true,
        },
      ],
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-5">
      <div>
        <h3 className="font-display text-xl font-semibold text-stone-900">হোমপেজ ইমেজ স্লাইডার</h3>
        <p className="text-xs text-stone-500 mt-1">
          ছবি 16:9 অনুপাতে দেখাবে এবং ৪ সেকেন্ড পরপর স্বয়ংক্রিয়ভাবে পরিবর্তিত হবে।
          Google Drive লিংক দিলে তা স্বয়ংক্রিয়ভাবে lh3.googleusercontent.com/d/ID ফরম্যাটে রূপান্তর হবে।
        </p>
      </div>

      <div className="space-y-4">
        {slides.map((slide) => (
          <div key={slide.id} className="grid grid-cols-1 lg:grid-cols-[180px_1fr_auto] gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-stone-200">
            <div className="aspect-video rounded-lg overflow-hidden bg-stone-200">
              {slide.image ? (
                <img src={normalizeImageUrl(slide.image)} alt={slide.titleBn || 'স্লাইড'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">ছবির লিংক দিন</div>
              )}
            </div>

            <div className="space-y-2">
              <input
                value={slide.image}
                onChange={(e) => updateSlide(slide.id, { image: normalizeImageUrl(e.target.value) })}
                placeholder="Google Drive / image link"
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input value={slide.titleBn || ''} onChange={(e) => updateSlide(slide.id, { titleBn: e.target.value })} placeholder="বাংলা শিরোনাম" className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg" />
                <input value={slide.titleEn || ''} onChange={(e) => updateSlide(slide.id, { titleEn: e.target.value })} placeholder="English title" className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg" />
                <input value={slide.subtitleBn || ''} onChange={(e) => updateSlide(slide.id, { subtitleBn: e.target.value })} placeholder="বাংলা সাবটাইটেল" className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg" />
                <input value={slide.subtitleEn || ''} onChange={(e) => updateSlide(slide.id, { subtitleEn: e.target.value })} placeholder="English subtitle" className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg" />
              </div>
            </div>

            <div className="flex lg:flex-col gap-2">
              <button type="button" onClick={() => updateSlide(slide.id, { active: slide.active === false })} className="px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white flex items-center gap-1.5">
                <Power className="w-3.5 h-3.5" /> {slide.active === false ? 'বন্ধ' : 'চালু'}
              </button>
              <button type="button" onClick={() => updateSettings({ ...settings, heroSlides: slides.filter((s) => s.id !== slide.id) })} className="px-3 py-2 text-xs rounded-lg bg-rose-50 text-rose-700 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" /> মুছুন
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addSlide} className="px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 rounded-lg flex items-center gap-1.5">
        <Plus className="w-4 h-4" /> নতুন স্লাইড যোগ করুন
      </button>
    </div>
  );
};
