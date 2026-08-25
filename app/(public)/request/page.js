"use client";

import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Send, User, Phone, Star, FileText, Shield, Layers } from "lucide-react";
import { supabase } from "@/lib/supabase";

const initialState = {
  requesterName: "",
  contactInfo: "",
  fallenName: "",
  rank: "",
  unit: "",
  story: "",
};

const fieldClass =
  "w-full border border-sand-200 rounded-xl px-4 py-3 text-sm text-sand-900 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-400 focus:border-transparent transition-shadow";

export default function RequestPage() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.requesterName || !form.contactInfo || !form.fallenName || !form.story) {
      toast.error("נא למלא את כל השדות החובה");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("requests").insert({
      requester_name: form.requesterName,
      contact_info: form.contactInfo,
      fallen_name: form.fallenName,
      rank: form.rank.trim() || null,
      unit: form.unit.trim() || null,
      story: form.story,
    });

    setSubmitting(false);

    if (error) {
      toast.error("שגיאה בשליחת הבקשה. אנא נסו שוב.", {
        style: { background: "#7f1d1d", color: "#fef2f2", borderRadius: "12px", direction: "rtl" },
      });
      return;
    }

    toast.success("הבקשה התקבלה! נחזור אליכם בהקדם.", {
      duration: 5000,
      style: { background: "#1c1714", color: "#f3ece1", borderRadius: "12px", padding: "14px 18px", direction: "rtl" },
    });

    setForm(initialState);
  }

  return (
    <>
      <Toaster position="top-center" />

      {/* Page header */}
      <section className="bg-sand-100 border-b border-sand-200 py-14 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sand-500 text-xs font-semibold tracking-widest uppercase mb-3">
            בקשת פסל
          </p>
          <h1 className="text-4xl font-bold text-sand-900 mb-4">הגשת בקשה</h1>
          <p className="text-sand-600 leading-relaxed">
            האמן יוצר פסלי חול לכבוד חיילים ואזרחים שנפלו. כאן תוכלו להגיש בקשה
            להנצחת יקירכם. כל פנייה מטופלת באישית ובכבוד.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-sand-200 p-8 shadow-sm space-y-6"
        >
          {/* Requester name */}
          <div>
            <label className="block text-sm font-semibold text-sand-800 mb-2">
              <User size={14} className="inline me-1 mb-0.5" />
              שם הפונה <span className="text-red-400">*</span>
            </label>
            <input type="text" name="requesterName" value={form.requesterName}
              onChange={handleChange} placeholder="שם מלא" className={fieldClass} />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-semibold text-sand-800 mb-2">
              <Phone size={14} className="inline me-1 mb-0.5" />
              פרטי קשר <span className="text-red-400">*</span>
            </label>
            <input type="text" name="contactInfo" value={form.contactInfo}
              onChange={handleChange} placeholder="מייל או מספר טלפון" className={fieldClass} />
          </div>

          {/* Fallen name */}
          <div>
            <label className="block text-sm font-semibold text-sand-800 mb-2">
              <Star size={14} className="inline me-1 mb-0.5" />
              שם הנופל / הנופלת <span className="text-red-400">*</span>
            </label>
            <input type="text" name="fallenName" value={form.fallenName}
              onChange={handleChange} placeholder="שם מלא של הנופל" className={fieldClass} />
          </div>

          {/* Rank + Unit — side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-sand-800 mb-2">
                <Shield size={14} className="inline me-1 mb-0.5" />
                דרגה
              </label>
              <input type="text" name="rank" value={form.rank}
                onChange={handleChange} placeholder="סרן, רס, טוראי..." className={fieldClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-sand-800 mb-2">
                <Layers size={14} className="inline me-1 mb-0.5" />
                יחידה
              </label>
              <input type="text" name="unit" value={form.unit}
                onChange={handleChange} placeholder="שם היחידה" className={fieldClass} />
            </div>
          </div>

          {/* Story */}
          <div>
            <label className="block text-sm font-semibold text-sand-800 mb-2">
              <FileText size={14} className="inline me-1 mb-0.5" />
              רקע וסיפור אישי <span className="text-red-400">*</span>
            </label>
            <textarea name="story" value={form.story} onChange={handleChange}
              placeholder="ספרו לנו על יקירכם — מי היה/הייתה, מה אהב/אהבה, מה תרצו שהפסל יבטא..."
              rows={6} className={`${fieldClass} resize-none`} />
          </div>

          <button type="submit" disabled={submitting}
            className="w-full bg-sand-900 hover:bg-sand-700 disabled:bg-sand-300 text-sand-50 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 text-sm">
            {submitting ? "שולח..." : <><Send size={15} />שליחת הבקשה</>}
          </button>
        </form>

        <p className="text-center text-xs text-sand-400 mt-6 leading-relaxed">
          הפרטים נשמרים בפרטיות מלאה ולא יועברו לגורמים חיצוניים
        </p>
      </section>
    </>
  );
}
