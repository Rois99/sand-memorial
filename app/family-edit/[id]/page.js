"use client";

import { use, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, Mountain, Paperclip } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadMediaFiles } from "@/lib/mediaUtils";

const inputClass =
  "w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm text-sand-900 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-400";

function CandleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2C11.5 4 9.5 5.5 9.5 8C9.5 9.9 10.7 11.3 12 12C13.3 11.3 14.5 9.9 14.5 8C14.5 5.5 12.5 4 12 2Z" />
      <line x1="12" y1="12" x2="12" y2="13.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <rect x="9.5" y="13.5" width="5" height="7.5" rx="0.75" fillOpacity="0.85" />
      <rect x="8" y="21" width="8" height="1.5" rx="0.75" fillOpacity="0.65" />
    </svg>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-sand-50 animate-pulse">
      <div className="h-1.5 bg-amber-300" />
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-5">
        <div className="h-10 bg-sand-200 rounded w-1/2" />
        <div className="h-4 bg-sand-100 rounded w-1/3" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-11 bg-sand-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function InvalidTokenView() {
  return (
    <div className="min-h-screen bg-sand-50 flex flex-col items-center justify-center px-6 text-center gap-6">
      <div className="h-1.5 w-full bg-amber-300 fixed top-0 inset-x-0" />
      <Mountain className="w-16 h-16 text-sand-300" strokeWidth={1} />
      <div className="max-w-sm">
        <h1 className="text-2xl font-bold text-sand-900 mb-3">הקישור אינו תקין</h1>
        <p className="text-sand-500 text-sm leading-relaxed">
          קישור העריכה שנשלח אינו תקין או שפג תוקפו.
          <br />
          אנא פנו לאמן לקבלת קישור עדכני.
        </p>
      </div>
    </div>
  );
}

function SavedView({ name }) {
  return (
    <div className="min-h-screen bg-sand-50 flex flex-col items-center justify-center px-6 text-center gap-6">
      <div className="h-1.5 w-full bg-amber-300 fixed top-0 inset-x-0" />
      <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={1.5} />
      <div className="max-w-sm">
        <h1 className="text-2xl font-bold text-sand-900 mb-2">הפרטים עודכנו בהצלחה</h1>
        <p className="text-sand-500 text-sm leading-relaxed">
          תודה שעזרתם לנו לשמור את זכרו של {name}.
          <br />
          השינויים יוצגו באתר בקרוב.
        </p>
      </div>
    </div>
  );
}

/* ── Inner component (needs Suspense for useSearchParams) ── */
function FamilyEditInner({ id }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading | valid | invalid | saved
  const [sculpture, setSculpture] = useState(null);
  const [form, setForm] = useState({
    name: "", rank: "", unit: "", age: "",
    story: "", instagram_url: "", tiktok_url: "", yizkor_url: "",
  });
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    supabase
      .from("sculptures")
      .select("*, sculpture_media(id, url, type)")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        // Verify token matches — application-level check since token is the secret
        if (error || !data || data.edit_token !== token) {
          setStatus("invalid");
          return;
        }
        setSculpture(data);
        setForm({
          name: data.name ?? "",
          rank: data.rank ?? "",
          unit: data.unit ?? "",
          age: data.age ?? "",
          story: data.story ?? "",
          instagram_url: data.instagram_url ?? "",
          tiktok_url: data.tiktok_url ?? "",
          yizkor_url: data.yizkor_url ?? "",
        });
        setStatus("valid");
      });
  }, [id, token]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    // Upload any new media files (non-blocking — form saves even if upload fails)
    if (newFiles.length > 0) {
      try {
        await uploadMediaFiles(id, newFiles);
      } catch {
        // continue
      }
    }

    const { error } = await supabase
      .from("sculptures")
      .update({
        name: form.name,
        rank: form.rank.trim() || null,
        unit: form.unit,
        age: Number(form.age),
        story: form.story,
        instagram_url: form.instagram_url.trim() || null,
        tiktok_url: form.tiktok_url.trim() || null,
        yizkor_url: form.yizkor_url.trim() || null,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert("שגיאה בשמירה: " + error.message);
      return;
    }

    setStatus("saved");
  }

  if (status === "loading") return <LoadingSkeleton />;
  if (status === "invalid") return <InvalidTokenView />;
  if (status === "saved") return <SavedView name={form.name} />;

  const existingImages = (sculpture.sculpture_media ?? []).filter((m) => m.type === "image");

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-amber-300 to-amber-500" />

      <div className="max-w-2xl mx-auto px-6 py-12 pb-20">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <CandleIcon className="w-10 h-10 text-amber-400 flex-shrink-0" />
          <div>
            <h1 className="text-2xl font-bold text-sand-900">עריכת פרטי הזיכרון</h1>
            <p className="text-sand-500 text-sm mt-0.5">{sculpture.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name + Rank */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">שם הנופל</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">דרגה</label>
              <input type="text" name="rank" value={form.rank} onChange={handleChange}
                placeholder="סרן, רס, ..." className={inputClass} />
            </div>
          </div>

          {/* Unit + Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">יחידה</label>
              <input type="text" name="unit" value={form.unit} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">גיל</label>
              <input type="number" name="age" value={form.age} onChange={handleChange}
                required min="18" max="60" className={inputClass} />
            </div>
          </div>

          {/* Story */}
          <div>
            <label className="block text-xs font-semibold text-sand-700 mb-1.5">סיפור אישי</label>
            <textarea name="story" value={form.story} onChange={handleChange} required rows={8}
              className={`${inputClass} resize-none`} />
          </div>

          {/* Links */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">
                קישור יזכור
                <span className="font-normal text-sand-400 mr-1">(אופציונלי)</span>
              </label>
              <input type="url" name="yizkor_url" value={form.yizkor_url} onChange={handleChange}
                placeholder="https://izkor.gov.il/..." className={inputClass} dir="ltr" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">
                קישור אינסטגרם
                <span className="font-normal text-sand-400 mr-1">(אופציונלי)</span>
              </label>
              <input type="url" name="instagram_url" value={form.instagram_url} onChange={handleChange}
                placeholder="https://www.instagram.com/p/..." className={inputClass} dir="ltr" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">
                קישור טיקטוק
                <span className="font-normal text-sand-400 mr-1">(אופציונלי)</span>
              </label>
              <input type="url" name="tiktok_url" value={form.tiktok_url} onChange={handleChange}
                placeholder="https://www.tiktok.com/..." className={inputClass} dir="ltr" />
            </div>
          </div>

          {/* Existing photos */}
          {existingImages.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-sand-700 mb-2">תמונות קיימות</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {existingImages.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt=""
                    className="aspect-square object-cover rounded-lg border border-sand-200"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Add new photos */}
          <div>
            <label className="block text-xs font-semibold text-sand-700 mb-1.5">הוספת תמונות או סרטונים</label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => setNewFiles(Array.from(e.target.files))}
              className="w-full text-sm text-sand-600 file:me-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sand-100 file:text-sand-700 hover:file:bg-sand-200 cursor-pointer"
            />
            {newFiles.length > 0 && (
              <p className="mt-1.5 text-xs text-sand-500 flex items-center gap-1">
                <Paperclip size={11} />
                {newFiles.length} {newFiles.length === 1 ? "קובץ נבחר" : "קבצים נבחרו"}
              </p>
            )}
          </div>

          {/* Note */}
          <p className="text-xs text-sand-400 bg-sand-100 rounded-xl px-4 py-3 leading-relaxed">
            בכל שאלה או בקשה מיוחדת, ניתן לפנות לאמן ישירות. אנו מכבדים את הפרטיות שלכם ושל יקיריכם.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-sand-900 hover:bg-sand-700 disabled:bg-sand-300 text-sand-50 font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
          >
            {saving ? (
              <><Loader2 size={16} className="animate-spin" /> שומר...</>
            ) : (
              "שמירת שינויים"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-sand-300 mt-12">זיכרון בחול — לזכר הנופלים</p>
      </div>
    </div>
  );
}

/* ── Page wrapper — provides Suspense for useSearchParams ── */
export default function FamilyEditPage({ params }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <FamilyEditInner id={id} />
    </Suspense>
  );
}
