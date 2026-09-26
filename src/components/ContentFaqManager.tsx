import React, { useMemo, useState } from 'react';
import { Plus, Save, RefreshCw, Trash2, UploadCloud, Database, CheckCircle2, AlertCircle, Clock3 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { FAQItem } from '../types';

export const ContentFaqManager: React.FC = () => {
  const { settings, updateSettings, refreshAllData, language, showToast } = useStore();
  const isBn = language === 'bn';
  const content = settings.content || { aboutBn:'', aboutEn:'', deliveryBn:'', deliveryEn:'', returnsBn:'', returnsEn:'', faq:[] };
  const [draft, setDraft] = useState(content);
  const [busy, setBusy] = useState(false);
  const [syncState, setSyncState] = useState<'idle'|'success'|'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  React.useEffect(() => setDraft(content), [content]);

  const save = async () => {
    if (busy) return;
    setBusy(true); setSyncState('idle'); setSyncMessage('');
    try {
      const nextSettings = { ...settings, content: draft };
      updateSettings(nextSettings);
      const result = await api.syncAllToSheets(nextSettings);
      setSyncState('success');
      setLastSyncedAt(result.syncedAt);
      setSyncMessage(isBn ? 'সব তথ্য সফলভাবে Google Sheets-এ Push হয়েছে।' : 'All data was successfully pushed to Google Sheets.');
      showToast(isBn ? 'Google Sheets Push সফল হয়েছে' : 'Google Sheets push completed');
    } catch (error: any) {
      setSyncState('error');
      setSyncMessage(error?.message || (isBn ? 'Push ব্যর্থ হয়েছে' : 'Push failed'));
    } finally { setBusy(false); }
  };

  const pull = async () => {
    if (busy) return;
    setBusy(true); setSyncState('idle'); setSyncMessage('');
    try {
      await refreshAllData();
      setSyncState('success');
      setLastSyncedAt(new Date().toISOString());
      setSyncMessage(isBn ? 'Google Sheets থেকে সর্বশেষ তথ্য সফলভাবে Sync হয়েছে।' : 'Latest data was successfully synced from Google Sheets.');
      showToast(isBn ? 'Sheets Sync সফল হয়েছে' : 'Sheets sync completed');
    } catch (error: any) {
      setSyncState('error');
      setSyncMessage(error?.message || (isBn ? 'Sync ব্যর্থ হয়েছে' : 'Sync failed'));
    } finally { setBusy(false); }
  };

  const updateFaq = (id: string, patch: Partial<FAQItem>) =>
    setDraft((d) => ({ ...d, faq: (d.faq || []).map((f) => f.id === id ? { ...f, ...patch } : f) }));

  const addFaq = () =>
    setDraft((d) => ({
      ...d,
      faq: [...(d.faq || []), {
        id: 'FAQ-' + Date.now(),
        questionBn: 'নতুন প্রশ্ন',
        answerBn: 'নতুন উত্তরের লেখা',
        questionEn: 'New question',
        answerEn: 'New answer',
        active: true,
        sortOrder: (d.faq || []).length + 1,
      }],
    }));

  const removeFaq = (id: string) =>
    setDraft((d) => ({ ...d, faq: (d.faq || []).filter((f) => f.id !== id) }));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-display text-xl font-semibold text-stone-900">দোকান পরিচিতি ও নীতিমালা</h3>
            <p className="text-xs text-stone-500 mt-1">বাংলা ও English—দুই ভাষার কনটেন্ট এখান থেকেই নিয়ন্ত্রণ করুন।</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={pull} disabled={busy} className="group px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold flex items-center gap-2 disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${busy ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`} />
              {busy ? 'Sync হচ্ছে…' : 'Sheets থেকে Sync'}
            </button>
            <button onClick={save} disabled={busy} className="group px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-2 disabled:opacity-50">
              <UploadCloud className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              {busy ? 'Push হচ্ছে…' : 'Sheets-এ Push'}
            </button>
          </div>
        </div>

        {[
          ['aboutBn','aboutEn','আমাদের সম্পর্কে / দোকান পরিচিতি','About / Store Introduction'],
          ['deliveryBn','deliveryEn','ডেলিভারি সংক্রান্ত তথ্য','Delivery Information'],
          ['returnsBn','returnsEn','রিটার্ন ও রিপ্লেসমেন্ট পলিসি','Return & Replacement Policy'],
        ].map(([bnKey,enKey,bnLabel,enLabel]) => (
          <div key={bnKey} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 mb-3 rounded-xl bg-[#FAF8F5] border border-stone-200">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{bnLabel}</label>
              <textarea rows={5} value={(draft as any)[bnKey]} onChange={(e) => setDraft({ ...draft, [(bnKey as string)]: e.target.value })} className="w-full p-3 text-xs border border-stone-300 rounded-lg bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{enLabel}</label>
              <textarea rows={5} value={(draft as any)[enKey]} onChange={(e) => setDraft({ ...draft, [(enKey as string)]: e.target.value })} className="w-full p-3 text-xs border border-stone-300 rounded-lg bg-white" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-display text-xl font-semibold text-stone-900">FAQ Manager</h3>
            <p className="text-xs text-stone-500 mt-1">FAQ যোগ, সম্পাদনা, সক্রিয়/নিষ্ক্রিয় এবং Google Sheets sync করুন।</p>
          </div>
          <button onClick={addFaq} className="px-3 py-2 rounded-lg bg-[#A37835] text-white text-xs flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> FAQ যোগ করুন
          </button>
        </div>

        <div className="space-y-3">
          {(draft.faq || []).map((faq) => (
            <div key={faq.id} className="p-4 rounded-xl border border-stone-200 bg-[#FAF8F5]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={faq.questionBn} onChange={(e) => updateFaq(faq.id, { questionBn: e.target.value })} placeholder="বাংলা প্রশ্ন" className="p-2.5 text-xs border rounded-lg bg-white" />
                <input value={faq.questionEn || ''} onChange={(e) => updateFaq(faq.id, { questionEn: e.target.value })} placeholder="English question" className="p-2.5 text-xs border rounded-lg bg-white" />
                <textarea rows={3} value={faq.answerBn} onChange={(e) => updateFaq(faq.id, { answerBn: e.target.value })} placeholder="বাংলা উত্তর" className="p-2.5 text-xs border rounded-lg bg-white" />
                <textarea rows={3} value={faq.answerEn || ''} onChange={(e) => updateFaq(faq.id, { answerEn: e.target.value })} placeholder="English answer" className="p-2.5 text-xs border rounded-lg bg-white" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <label className="text-xs flex items-center gap-2">
                  <input type="checkbox" checked={faq.active !== false} onChange={(e) => updateFaq(faq.id, { active: e.target.checked })} />
                  FAQ চালু
                </label>
                <button onClick={() => removeFaq(faq.id)} className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> মুছুন
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={save} disabled={busy} className="mt-5 w-full py-3 rounded-xl bg-stone-900 text-white text-sm font-semibold flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> {busy ? 'Sync হচ্ছে…' : 'সব কনটেন্ট ও FAQ সংরক্ষণ + Sync'}
        </button>
      </div>

      <div className={`flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border ${syncState==='success'?'bg-emerald-50 border-emerald-200':syncState==='error'?'bg-rose-50 border-rose-200':'bg-stone-50 border-stone-200'}`}>
        <div className="flex items-start gap-2">
          {syncState==='success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" /> : syncState==='error' ? <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5" /> : <Database className="w-4 h-4 text-stone-500 mt-0.5" />}
          <div>
            <p className="text-xs font-semibold text-stone-800">{syncState==='success'?'Sync সফল':syncState==='error'?'Sync ব্যর্থ':'Google Sheets Sync Center'}</p>
            <p className="text-[11px] text-stone-600 mt-0.5">{syncMessage || 'Push করলে website-এর settings, content, FAQ, slider ও coupons Sheets-এ যাচাই করে সংরক্ষণ হবে।'}</p>
          </div>
        </div>
        {lastSyncedAt && <div className="text-[10px] text-stone-500 flex items-center gap-1"><Clock3 className="w-3 h-3" /> {new Date(lastSyncedAt).toLocaleString()}</div>}
      </div>

      <div className="p-4 rounded-xl bg-[#F7F1E1] border border-[#EDE0C2] text-xs text-stone-700 flex gap-2">
        <Database className="w-4 h-4 text-[#A37835] shrink-0" />
        <span>Google Apps Script-এর <b>Content</b> ও <b>FAQ</b> sheet-এ তথ্য সংরক্ষিত হবে। Admin থেকে Push এবং Sheets থেকে Pull—দুই দিকেই sync করা যাবে।</span>
      </div>
    </div>
  );
};
