"use client";

import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";

const inputClass =
  "w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm text-sand-900 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-400";

function InstagramIcon({ className }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ className }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
    </svg>
  );
}

export default function EditModal({ sculpture, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: sculpture.name ?? "",
    rank: sculpture.rank ?? "",
    unit: sculpture.unit ?? "",
    age: sculpture.age ?? "",
    story: sculpture.story ?? "",
    instagram_url: sculpture.instagram_url ?? "",
    tiktok_url: sculpture.tiktok_url ?? "",
    yizkor_url: sculpture.yizkor_url ?? "",
    has_fallen_photo: sculpture.has_fallen_photo ?? false,
  });
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await onUpdate(sculpture.id, {
      name: form.name,
      rank: form.rank.trim() || null,
      unit: form.unit,
      age: Number(form.age),
      story: form.story,
      instagram_url: form.instagram_url.trim() || null,
      tiktok_url: form.tiktok_url.trim() || null,
      yizkor_url: form.yizkor_url.trim() || null,
      has_fallen_photo: form.has_fallen_photo,
    });
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand-200 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-sand-900">עריכת פסל</h2>
            <p className="text-sm text-sand-500 mt-0.5">{sculpture.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-sand-100 rounded-lg transition-colors">
            <X size={20} className="text-sand-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">שם הנופל</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">דרגה</label>
              <input type="text" name="rank" value={form.rank} onChange={handleChange} placeholder="סרן, רב״ס, ..." className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">יחידה</label>
              <input type="text" name="unit" value={form.unit} onChange={handleChange} required className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">גיל</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} required min="18" max="60" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">קישור אינסטגרם</label>
              <div className="relative">
                <InstagramIcon className="absolute top-1/2 -translate-y-1/2 start-3 text-sand-400 pointer-events-none" />
                <input type="url" name="instagram_url" value={form.instagram_url} onChange={handleChange}
                  placeholder="https://www.instagram.com/p/..." className={`${inputClass} ps-9`} dir="ltr" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">קישור טיקטוק</label>
              <div className="relative">
                <TikTokIcon className="absolute top-1/2 -translate-y-1/2 start-3 text-sand-400 pointer-events-none" />
                <input type="url" name="tiktok_url" value={form.tiktok_url} onChange={handleChange}
                  placeholder="https://www.tiktok.com/..." className={`${inputClass} ps-9`} dir="ltr" />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">קישור יזכור</label>
              <div className="relative">
                <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14} className="absolute top-1/2 -translate-y-1/2 start-3 text-amber-400 pointer-events-none">
                  <path d="M12 2C11.5 4 9.5 5.5 9.5 8C9.5 9.9 10.7 11.3 12 12C13.3 11.3 14.5 9.9 14.5 8C14.5 5.5 12.5 4 12 2Z" />
                  <rect x="9.5" y="13.5" width="5" height="7.5" rx="0.75" fillOpacity="0.85" />
                  <rect x="8" y="21" width="8" height="1.5" rx="0.75" fillOpacity="0.65" />
                </svg>
                <input type="url" name="yizkor_url" value={form.yizkor_url} onChange={handleChange}
                  placeholder="https://izkor.gov.il/..." className={`${inputClass} ps-9`} dir="ltr" />
              </div>
            </div>
          </div>

          {/* has_fallen_photo checkbox */}
          <div className="flex items-start gap-3 bg-sand-50 rounded-xl p-3">
            <input
              type="checkbox"
              id="edit_has_fallen_photo"
              name="has_fallen_photo"
              checked={form.has_fallen_photo}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 accent-sand-900 cursor-pointer"
            />
            <div>
              <label htmlFor="edit_has_fallen_photo" className="text-xs font-semibold text-sand-700 cursor-pointer">
                תמונה ראשונה היא תמונת הנופל
              </label>
              <p className="text-xs text-sand-400 mt-0.5">
                אם מסומן, התמונה הראשונה תוצג כתמונה קטנה בפינה, והשנייה כתמונה ראשית
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-sand-700 mb-1.5">סיפור אישי</label>
            <textarea name="story" value={form.story} onChange={handleChange} required rows={5} className={`${inputClass} resize-none`} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-sand-600 hover:text-sand-900 transition-colors">
              ביטול
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 bg-sand-900 hover:bg-sand-700 disabled:bg-sand-300 text-sand-50 font-semibold px-5 py-2 rounded-xl text-sm transition-colors">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? "שומר..." : "שמור שינויים"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
