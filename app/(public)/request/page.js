"use client";

import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Send, User, Phone, Star, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";

const initialState = {
  requesterName: "",
  contactInfo: "",
  fallenName: "",
  story: "",
};

export default function RequestPage() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.requesterName || !form.contactInfo || !form.fallenName || !form.story) {
      toast.error("נא למלא את כל השדות");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("requests").insert({
      requester_name: form.requesterName,
      contact_info: form.contactInfo,
      fallen_name: form.fallenName,
      story: form.story,
    });

    setSubmitting(false);

    if (error) {
      toast.error("שגיאה בשליחת הבקשה. אנא נסו שוב.", {
        style: {
          background: "#7f1d1d",
          color: "#fef2f2",
          borderRadius: "12px",
          direction: "rtl",
        },
      });
      return;
    }

    toast.success("הבקשה התקבלה! נחזור אליכם בהקדם.", {
      duration: 5000,
      style: {
        background: "#1c1714",
        color: "#f3ece1",
        borderRadius: "12px",
        padding: "14px 18px",
        direction: "rtl",
      },
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
          <div>
            <label className="block text-sm font-semibold text-sand-800 mb-2">
              <User size={14} className="inline me-1 mb-0.5" />
              שם הפונה
            </label>
            <input
              type="text"
              name="requesterName"
              value={form.requesterName}
              onChange={handleChange}
              placeholder="שם מלא"
              className="w-full border border-sand-200 rounded-xl px-4 py-3 text-sm text-sand-900 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-400 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-sand-800 mb-2">
              <Phone size={14} className="inline me-1 mb-0.5" />
              פרטי קשר
            </label>
            <input
              type="text"
              name="contactInfo"
              value={form.contactInfo}
              onChange={handleChange}
              placeholder="מייל או מספר טלפון"
              className="w-full border border-sand-200 rounded-xl px-4 py-3 text-sm text-sand-900 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-400 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-sand-800 mb-2">
              <Star size={14} className="inline me-1 mb-0.5" />
              שם הנופל / הנופלת
            </label>
            <input
              type="text"
              name="fallenName"
              value={form.fallenName}
              onChange={handleChange}
              placeholder="שם מלא של הנופל"
              className="w-full border border-sand-200 rounded-xl px-4 py-3 text-sm text-sand-900 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-400 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-sand-800 mb-2">
              <FileText size={14} className="inline me-1 mb-0.5" />
              רקע וסיפור אישי
            </label>
            <textarea
              name="story"
              value={form.story}
              onChange={handleChange}
              placeholder="ספרו לנו על יקירכם — מי היה/הייתה, מה אהב/אהבה, מה תרצו שהפסל יבטא..."
              rows={6}
              className="w-full border border-sand-200 rounded-xl px-4 py-3 text-sm text-sand-900 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-400 focus:border-transparent transition-shadow resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-sand-900 hover:bg-sand-700 disabled:bg-sand-300 text-sand-50 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 text-sm"
          >
            {submitting ? (
              "שולח..."
            ) : (
              <>
                <Send size={15} />
                שליחת הבקשה
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-sand-400 mt-6 leading-relaxed">
          הפרטים נשמרים בפרטיות מלאה ולא יועברו לגורמים חיצוניים
        </p>
      </section>
    </>
  );
}
