import { Plus, CheckCircle, Paperclip } from "lucide-react";

function InstagramIcon({ size = 16, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ size = 16, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
    </svg>
  );
}

const inputClass =
  "w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm text-sand-900 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-400";

export default function UploadForm({ form, handleChange, handleSubmit, uploading, uploaded }) {
  const fileCount = form.files?.length ?? 0;

  return (
    <section>
      <h2 className="text-xl font-semibold text-sand-900 mb-4">העלאת פסל חדש</h2>
      <div className="bg-white rounded-2xl border border-sand-200 p-8 shadow-sm">
        {uploaded ? (
          <div className="flex flex-col items-center justify-center py-10 text-green-600 gap-3">
            <CheckCircle size={48} strokeWidth={1.5} />
            <p className="font-semibold text-lg">הפסל הועלה בהצלחה!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">שם הנופל</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="שם מלא" className={inputClass} />
            </div>

            {/* Rank */}
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">דרגה</label>
              <input type="text" name="rank" value={form.rank} onChange={handleChange} placeholder="סרן, רב״ס, ..." className={inputClass} />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">יחידה</label>
              <input type="text" name="unit" value={form.unit} onChange={handleChange} required placeholder="שם היחידה" className={inputClass} />
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">גיל</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} required placeholder="גיל הנופל" min="18" max="60" className={inputClass} />
            </div>

            {/* Instagram URL */}
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">קישור אינסטגרם (אופציונלי)</label>
              <div className="relative">
                <InstagramIcon size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-sand-400 pointer-events-none" />
                <input type="url" name="instagram_url" value={form.instagram_url} onChange={handleChange}
                  placeholder="https://www.instagram.com/p/..." className={`${inputClass} ps-9`} dir="ltr" />
              </div>
            </div>

            {/* TikTok URL */}
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">קישור טיקטוק (אופציונלי)</label>
              <div className="relative">
                <TikTokIcon size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-sand-400 pointer-events-none" />
                <input type="url" name="tiktok_url" value={form.tiktok_url} onChange={handleChange}
                  placeholder="https://www.tiktok.com/@..." className={`${inputClass} ps-9`} dir="ltr" />
              </div>
            </div>

            {/* Yizkor URL */}
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">קישור יזכור (אופציונלי)</label>
              <div className="relative">
                <svg viewBox="0 0 24 24" fill="currentColor" width={15} height={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-amber-400 pointer-events-none">
                  <path d="M12 2C11.5 4 9.5 5.5 9.5 8C9.5 9.9 10.7 11.3 12 12C13.3 11.3 14.5 9.9 14.5 8C14.5 5.5 12.5 4 12 2Z" />
                  <rect x="9.5" y="13.5" width="5" height="7.5" rx="0.75" fillOpacity="0.85" />
                  <rect x="8" y="21" width="8" height="1.5" rx="0.75" fillOpacity="0.65" />
                </svg>
                <input type="url" name="yizkor_url" value={form.yizkor_url} onChange={handleChange}
                  placeholder="https://izkor.gov.il/..." className={`${inputClass} ps-9`} dir="ltr" />
              </div>
            </div>

            {/* Media files */}
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">קבצי מדיה (תמונות / סרטונים)</label>
              <input type="file" name="files" accept="image/*,video/*" multiple onChange={handleChange}
                className="w-full text-sm text-sand-600 file:me-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sand-100 file:text-sand-700 hover:file:bg-sand-200 cursor-pointer" />
              {fileCount > 0 && (
                <p className="mt-1.5 text-xs text-sand-500 flex items-center gap-1">
                  <Paperclip size={11} />
                  {fileCount} {fileCount === 1 ? "קובץ נבחר" : "קבצים נבחרו"}
                </p>
              )}
            </div>

            {/* has_fallen_photo checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="has_fallen_photo"
                name="has_fallen_photo"
                checked={form.has_fallen_photo}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 accent-sand-900 cursor-pointer"
              />
              <div>
                <label htmlFor="has_fallen_photo" className="text-xs font-semibold text-sand-700 cursor-pointer">
                  תמונה ראשונה היא תמונת הנופל
                </label>
                <p className="text-xs text-sand-400 mt-0.5">
                  אם מסומן, התמונה הראשונה תוצג כתמונה קטנה בפינה, והשנייה כתמונה ראשית
                </p>
              </div>
            </div>

            {/* Story */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">סיפור אישי</label>
              <textarea name="story" value={form.story} onChange={handleChange} required rows={4}
                placeholder="תיאור קצר על הנופל..." className={`${inputClass} resize-none`} />
            </div>

            <div className="sm:col-span-2">
              <button type="submit" disabled={uploading}
                className="bg-sand-900 hover:bg-sand-700 disabled:bg-sand-300 text-sand-50 font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors text-sm">
                {uploading ? "מעלה..." : <><Plus size={15} />הוספת פסל</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
