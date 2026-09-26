import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';
import platesImg from '../assets/images/category_dinner_plates_1790413613482.jpg';
import bowlsImg from '../assets/images/category_ceramic_bowls_1790413629883.jpg';
import drinkwareImg from '../assets/images/category_tea_drinkware_1790413646812.jpg';
import heroImg from '../assets/images/hero_luxury_dinnerware_1790413597001.jpg';
import cutleryAccessoriesImg from '../assets/images/category_cutlery_accessories_1790413661730.jpg';

interface CategoryCardInfo {
  name: ProductCategory;
  subcategories: string;
  image: string;
  count: number;
}

export const CategoryShowcase: React.FC = () => {
  const { setCurrentPage, setSelectedCategoryFilter, products, categories: storeCategories } = useStore();

  const defaultImages: Record<string, string> = {
    Plates: platesImg,
    Bowls: bowlsImg,
    'Cups & Drinkware': drinkwareImg,
    'Dinner Sets': heroImg,
    Cutlery: cutleryAccessoriesImg,
    'Kitchen Accessories': cutleryAccessoriesImg,
  };

  const categories = storeCategories.map((cat) => ({
    name: cat.name,
    subcategories: cat.subcategories.join(' · ') || 'Artisanal collection items',
    image: cat.image || defaultImages[cat.name] || platesImg,
    count: products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length,
  }));

  const handleSelectCategory = (cat: ProductCategory) => {
    setSelectedCategoryFilter(cat);
    setCurrentPage('shop');
  };

  return (
    <section className="py-14 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A37835]">
            Artisanal Collections
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 mt-1">
            Curated Tableware Categories
          </h2>
          <p className="text-sm text-stone-600 mt-2 font-light">
            Discover dinnerware engineered for everyday longevity and lavish dinner parties.
          </p>
        </div>

        {/* 6-Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleSelectCategory(cat.name)}
              className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-stone-950/15 group-hover:bg-stone-950/10 transition-colors" />
                <span className="absolute top-3 right-3 text-xs font-semibold bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-stone-900 tabular-nums">
                  {cat.count} Items
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold text-stone-900 group-hover:text-[#A37835] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                    {cat.subcategories}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-stone-700 group-hover:text-[#A37835]">
                  <span>View All {cat.name}</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
