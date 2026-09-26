import React from 'react';

export const LoadingScreen: React.FC<{ storeName: string }> = ({ storeName }) => (
  <div className="fixed inset-0 z-[100] bg-[#FAF8F5] flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 opacity-40">
      <div className="absolute w-72 h-72 rounded-full bg-[#EDE0C2] blur-3xl -top-24 -left-24 animate-pulse" />
      <div className="absolute w-80 h-80 rounded-full bg-[#BE9346]/15 blur-3xl -bottom-32 -right-24 animate-pulse" />
    </div>
    <div className="relative text-center px-6">
      <div className="mx-auto w-20 h-20 rounded-3xl bg-stone-900 text-[#EDE0C2] flex items-center justify-center shadow-2xl mb-6">
        <span className="font-serif text-3xl font-bold">উ</span>
      </div>
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">{storeName}</h1>
      <p className="mt-2 text-xs text-[#8A612D] tracking-[0.2em]">ক্রোকারিজ • কিচেন • উপহার</p>
      <div className="mt-8 w-56 mx-auto">
        <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#8A612D] via-[#BE9346] to-[#A37835] rounded-full animate-loading-progress" />
        </div>
        <p className="mt-3 text-xs text-stone-500 animate-pulse">সর্বশেষ তথ্য লোড হচ্ছে…</p>
      </div>
    </div>
  </div>
);
