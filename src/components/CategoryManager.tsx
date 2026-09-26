import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CategoryItem } from '../types';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Image as ImageIcon,
  FolderPlus,
  Tag,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, showToast, products } = useStore();

  // Modal / Form state for Add/Edit Category
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const [formName, setFormName] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [subcategoriesList, setSubcategoriesList] = useState<string[]>([]);
  const [newSubcatInput, setNewSubcatInput] = useState('');

  // Inline quick add subcategory per category row
  const [inlineSubcatInputs, setInlineSubcatInputs] = useState<Record<string, string>>({});

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormName('');
    setFormImage('');
    setFormDescription('');
    setSubcategoriesList([]);
    setNewSubcatInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormImage(cat.image || '');
    setFormDescription(cat.description || '');
    setSubcategoriesList([...cat.subcategories]);
    setNewSubcatInput('');
    setIsModalOpen(true);
  };

  const handleAddSubcatToForm = () => {
    const trimmed = newSubcatInput.trim();
    if (!trimmed) return;
    if (subcategoriesList.includes(trimmed)) {
      showToast(`"${trimmed}" ইতিমধ্যে তালিকায় আছে`);
      return;
    }
    setSubcategoriesList([...subcategoriesList, trimmed]);
    setNewSubcatInput('');
  };

  const handleRemoveSubcatFromForm = (subName: string) => {
    setSubcategoriesList(subcategoriesList.filter((s) => s !== subName));
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = formName.trim();
    if (!trimmedName) {
      showToast('ক্যাটাগরির নাম দিন');
      return;
    }

    if (editingCategory) {
      // Update
      const updated: CategoryItem = {
        ...editingCategory,
        name: trimmedName,
        image: formImage.trim() || undefined,
        description: formDescription.trim() || undefined,
        subcategories: subcategoriesList,
      };
      updateCategory(updated);
      showToast(`ক্যাটাগরি "${trimmedName}" সফলভাবে আপডেট করা হয়েছে`);
    } else {
      // Create new
      const newCat: CategoryItem = {
        id: `CAT-${Date.now()}`,
        name: trimmedName,
        image: formImage.trim() || undefined,
        description: formDescription.trim() || undefined,
        subcategories: subcategoriesList.length > 0 ? subcategoriesList : ['Standard Item'],
      };
      addCategory(newCat);
      showToast(`নতুন ক্যাটাগরি "${trimmedName}" সফলভাবে যুক্ত হয়েছে`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteCategory = (cat: CategoryItem) => {
    const attachedCount = products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;
    const confirmMsg = attachedCount > 0
      ? `"${cat.name}" ক্যাটাগরির সাথে ${attachedCount}টি প্রোডাক্ট যুক্ত আছে। আপনি কি নিশ্চিত এই ক্যাটাগরি মুছতে চান?`
      : `আপনি কি নিশ্চিত "${cat.name}" ক্যাটাগরি ডিলিট করতে চান?`;

    if (window.confirm(confirmMsg)) {
      deleteCategory(cat.id);
    }
  };

  // Inline fast subcategory addition
  const handleInlineAddSubcat = (cat: CategoryItem) => {
    const val = (inlineSubcatInputs[cat.id] || '').trim();
    if (!val) return;
    if (cat.subcategories.includes(val)) {
      showToast(`"${val}" ইতিমধ্যে আছে`);
      return;
    }
    const updated: CategoryItem = {
      ...cat,
      subcategories: [...cat.subcategories, val],
    };
    updateCategory(updated);
    setInlineSubcatInputs({ ...inlineSubcatInputs, [cat.id]: '' });
  };

  const handleInlineRemoveSubcat = (cat: CategoryItem, subName: string) => {
    const updated: CategoryItem = {
      ...cat,
      subcategories: cat.subcategories.filter((s) => s !== subName),
    };
    updateCategory(updated);
    showToast(`সাব-ক্যাটাগরি "${subName}" সরানো হয়েছে`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#BE9346]" />
            <h2 className="font-serif text-lg font-bold text-stone-900">
              প্রোডাক্ট ক্যাটাগরি ও সাব-ক্যাটাগরি ম্যানেজমেন্ট
            </h2>
            <span className="text-[10px] bg-[#EDE0C2] text-stone-900 font-semibold px-2 py-0.5 rounded-full">
              {categories.length} টি ক্যাটাগরি
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 font-serif">
            ম্যানুয়ালি নতুন ক্যাটাগরি যুক্ত করুন, নাম এডিট করুন এবং সাব-ক্যাটাগরি সমূহের তালিকা কাস্টমাইজ করুন।
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#EDE0C2]" />
          <span className="font-serif font-bold">নতুন ক্যাটাগরি যুক্ত করুন</span>
        </button>
      </div>

      {/* Categories Cards / Table */}
      <div className="grid grid-cols-1 gap-4">
        {categories.map((cat, idx) => {
          const productCount = products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;
          return (
            <div
              key={cat.id || cat.name}
              className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs hover:border-[#BE9346]/40 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              {/* Category Info */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                    {productCount} টি প্রোডাক্ট
                  </span>
                  {cat.description && (
                    <span className="text-xs text-stone-400 italic">· {cat.description}</span>
                  )}
                </div>

                {/* Subcategories Badges */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5 text-[#BE9346]" />
                    <span className="font-serif text-[11px]">সাব-ক্যাটাগরি সমূহ ({cat.subcategories.length}):</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {cat.subcategories.map((sub) => (
                      <span
                        key={sub}
                        className="inline-flex items-center gap-1.5 bg-[#FAF8F5] text-stone-800 text-xs px-2.5 py-1 rounded-md border border-stone-200 hover:border-[#BE9346] transition-colors"
                      >
                        <span className="font-serif">{sub}</span>
                        <button
                          type="button"
                          onClick={() => handleInlineRemoveSubcat(cat, sub)}
                          title={`মুছুন "${sub}"`}
                          className="text-stone-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {/* Inline Quick Add Subcategory */}
                    <div className="inline-flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="+ নতুন সাব-ক্যাটাগরি"
                        value={inlineSubcatInputs[cat.id] || ''}
                        onChange={(e) =>
                          setInlineSubcatInputs({
                            ...inlineSubcatInputs,
                            [cat.id]: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleInlineAddSubcat(cat);
                          }
                        }}
                        className="text-xs px-2 py-1 bg-stone-50 border border-stone-300 rounded-md w-36 focus:bg-white focus:outline-none focus:border-[#BE9346]"
                      />
                      <button
                        type="button"
                        onClick={() => handleInlineAddSubcat(cat)}
                        className="p-1 bg-stone-100 hover:bg-[#EDE0C2] text-stone-700 rounded cursor-pointer transition-colors"
                        title="সাব-ক্যাটাগরি যোগ করুন"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#A37835]" />
                  <span className="font-serif">এডিট</span>
                </button>

                <button
                  onClick={() => handleDeleteCategory(cat)}
                  className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="font-serif">ডিলিট</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-stone-200 my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#BE9346]" />
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {editingCategory ? 'ক্যাটাগরি ও সাব-ক্যাটাগরি এডিট করুন' : 'নতুন ক্যাটাগরি তৈরি করুন'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-serif font-bold text-stone-800 mb-1">
                  ক্যাটাগরির নাম (Category Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Plates, Bowls, Luxury Glassware..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#BE9346] font-serif"
                />
              </div>

              <div>
                <label className="block font-serif font-semibold text-stone-700 mb-1">
                  সংক্ষিপ্ত বিবরণ (Short Description / Subtitle, ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: Dinner Plates, Serving Platters & Side Plates"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#BE9346]"
                />
              </div>

              <div>
                <label className="block font-serif font-semibold text-stone-700 mb-1">
                  ক্যাটাগরি ইমেজ URL (Image URL, ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  placeholder="https://... (Google Drive বা ইমেজ লিঙ্ক)"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#BE9346]"
                />
              </div>

              {/* Subcategories Management in Modal */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="block font-serif font-bold text-stone-800">
                  সাব-ক্যাটাগরি তালিকা (Subcategories List)
                </label>
                <p className="text-[11px] text-stone-500">
                  এই ক্যাটাগরির অধীনে যেসকল সাব-ক্যাটাগরি থাকবে সেগুলো নিচে যুক্ত করুন:
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="সাব-ক্যাটাগরির নাম লিখুন (যেমন: Dinner Plate)"
                    value={newSubcatInput}
                    onChange={(e) => setNewSubcatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubcatToForm();
                      }
                    }}
                    className="flex-1 text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#BE9346]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcatToForm}
                    className="px-3 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#EDE0C2]" />
                    <span>যোগ করুন</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 min-h-[48px] p-2 bg-stone-50 rounded-lg border border-stone-200">
                  {subcategoriesList.length === 0 ? (
                    <span className="text-[11px] text-stone-400 italic">
                      কোন সাব-ক্যাটাগরি যুক্ত করা হয়নি। উপরে লিখে "যোগ করুন" চাপুন।
                    </span>
                  ) : (
                    subcategoriesList.map((sub) => (
                      <span
                        key={sub}
                        className="inline-flex items-center gap-1.5 bg-white text-stone-800 text-xs px-2.5 py-1 rounded-md border border-stone-200 shadow-2xs"
                      >
                        <span className="font-serif">{sub}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcatFromForm(sub)}
                          className="text-stone-400 hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-serif font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#EDE0C2]" />
                  <span>{editingCategory ? 'পরিবর্তন সংরক্ষণ করুন' : 'ক্যাটাগরি সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
