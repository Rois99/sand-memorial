"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Upload, User, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ARTIST_ID = 1;
const BUCKET = "sculpture-media";

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

export default function ArtistProfileForm() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ bio_text: "", instagram_url: "", tiktok_url: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from("artist_profile")
      .select("*")
      .eq("id", ARTIST_ID)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          setForm({
            bio_text: data.bio_text ?? "",
            instagram_url: data.instagram_url ?? "",
            tiktok_url: data.tiktok_url ?? "",
          });
        }
        setLoading(false);
      });
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    let image_url = profile?.image_url ?? null;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop().toLowerCase();
      const storagePath = `artist/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, imageFile);

      if (uploadError) {
        alert("שגיאה בהעלאת תמונה: " + uploadError.message);
        setSaving(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
      image_url = publicUrl;
    }

    const { error } = await supabase
      .from("artist_profile")
      .update({
        bio_text: form.bio_text,
        instagram_url: form.instagram_url.trim() || null,
        tiktok_url: form.tiktok_url.trim() || null,
        image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", ARTIST_ID);

    if (error) {
      alert("שגיאה בשמירה: " + error.message);
    } else {
      setProfile((prev) => ({ ...prev, bio_text: form.bio_text, instagram_url: form.instagram_url.trim() || null, tiktok_url: form.tiktok_url.trim() || null, image_url }));
      setImageFile(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <section>
        <h2 className="text-xl font-semibold text-sand-900 mb-4">פרופיל האמן</h2>
        <div className="bg-white rounded-2xl border border-sand-200 h-64 animate-pulse shadow-sm" />
      </section>
    );
  }

  const displayImage = imagePreview ?? profile?.image_url;

  return (
    <section>
      <h2 className="text-xl font-semibold text-sand-900 mb-4">פרופיל האמן</h2>
      <div className="bg-white rounded-2xl border border-sand-200 p-8 shadow-sm">
        {saved ? (
          <div className="flex flex-col items-center justify-center py-10 text-green-600 gap-3">
            <CheckCircle size={48} strokeWidth={1.5} />
            <p className="font-semibold text-lg">הפרופיל עודכן בהצלחה!</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Photo row */}
            <div className="flex items-start gap-6">
              <div className="shrink-0 w-28 h-28 rounded-2xl bg-sand-100 overflow-hidden border border-sand-200">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-10 h-10 text-sand-300" strokeWidth={1.2} />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-sand-700 mb-2">
                  תמונת האמן
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer bg-sand-100 hover:bg-sand-200 text-sand-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                  <Upload size={14} />
                  {imageFile ? imageFile.name : "בחר תמונה חדשה"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                <p className="text-xs text-sand-400 mt-1.5">JPG, PNG, WEBP</p>
              </div>
            </div>

            {/* Instagram URL */}
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">
                קישור אינסטגרם
              </label>
              <div className="relative">
                <InstagramIcon className="absolute top-1/2 -translate-y-1/2 start-3 text-sand-400 pointer-events-none" />
                <input
                  type="url"
                  name="instagram_url"
                  value={form.instagram_url}
                  onChange={handleChange}
                  placeholder="https://www.instagram.com/..."
                  className={`${inputClass} ps-9`}
                  dir="ltr"
                />
              </div>
            </div>

            {/* TikTok URL */}
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">
                קישור טיקטוק
              </label>
              <div className="relative">
                <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 -translate-y-1/2 start-3 text-sand-400 pointer-events-none">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
                </svg>
                <input
                  type="url"
                  name="tiktok_url"
                  value={form.tiktok_url}
                  onChange={handleChange}
                  placeholder="https://www.tiktok.com/@..."
                  className={`${inputClass} ps-9`}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-sand-700 mb-1.5">
                ביוגרפיה
              </label>
              <textarea
                name="bio_text"
                value={form.bio_text}
                onChange={handleChange}
                rows={7}
                placeholder="ספר על האמן, הפרויקט, והמניע..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-sand-900 hover:bg-sand-700 disabled:bg-sand-300 text-sand-50 font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {saving ? "שומר..." : "שמור שינויים"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
