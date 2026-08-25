"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import SculptureCard from "@/components/SculptureCard";
import { supabase } from "@/lib/supabase";

const SORT_OPTIONS = [
  { value: "default", label: "ברירת מחדל" },
  { value: "name",    label: "שם א–ת" },
  { value: "unit",    label: "יחידה" },
];

export default function HomePage() {
  const [sculptures, setSculptures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    supabase
      .from("sculptures")
      .select("*, sculpture_media(id, url, storage_path, type, position)")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error) setSculptures(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? sculptures.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.unit?.toLowerCase().includes(q) ||
            s.story?.toLowerCase().includes(q) ||
            s.rank?.toLowerCase().includes(q)
        )
      : sculptures;

    if (sortBy === "name") return [...base].sort((a, b) => a.name.localeCompare(b.name, "he"));
    if (sortBy === "unit") return [...base].sort((a, b) => (a.unit ?? "").localeCompare(b.unit ?? "", "he"));
    return base;
  }, [query, sortBy, sculptures]);

  return (
    <>
      {/* Hero — background image with dark overlay */}
      <section
        className="relative bg-cover bg-center py-24 px-6"
        style={{ backgroundImage: "url('/sand-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-sand-900/80" />
        <div className="relative z-10 max-w-3xl mx-auto text-center text-sand-100">
          <p className="text-sand-400 text-sm font-medium tracking-widest uppercase mb-4">
            פרויקט הנצחה
          </p>
          <h1 className="text-5xl font-bold leading-tight mb-6 text-sand-50">
            זיכרון בחול
          </h1>
          <p className="text-sand-300 text-lg leading-relaxed max-w-2xl mx-auto">
            כל גרגר חול מספר סיפור. הפרויקט הזה מנציח את חללי ישראל באמצעות
            פסלי חול מופלאים שיוצר האמן ביד ובלב — כדי שלא יישכחו.
          </p>
          <div className="mt-8 flex justify-center gap-4 text-sm">
            <span className="flex items-center gap-2 bg-sand-800/70 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-sand-400 inline-block" />
              {loading ? "..." : `${sculptures.length} פסלים`}
            </span>
            <span className="flex items-center gap-2 bg-sand-800/70 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-sand-400 inline-block" />
              נצח ישראל לא ישקר
            </span>
          </div>
        </div>
      </section>

      {/* Search + Sort + Grid */}
      <section className="max-w-5xl mx-auto px-6 py-16">

        {/* Search */}
        <div className="relative max-w-lg mx-auto mb-6">
          <Search className="absolute top-1/2 -translate-y-1/2 end-4 text-sand-400 pointer-events-none" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חיפוש לפי שם, יחידה, דרגה או סיפור..."
            className="w-full bg-white border border-sand-200 rounded-xl py-3 px-4 pe-11 text-sand-900 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-400 focus:border-transparent transition-shadow shadow-sm text-sm"
          />
        </div>

        {/* Sort controls */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <span className="text-xs text-sand-400 font-medium me-1">מיון:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
                sortBy === opt.value
                  ? "bg-sand-900 text-sand-50"
                  : "bg-sand-100 text-sand-600 hover:bg-sand-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-sand-200 overflow-hidden animate-pulse">
                <div className="bg-sand-200 aspect-[4/3]" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-sand-200 rounded w-1/2" />
                  <div className="h-3 bg-sand-100 rounded w-1/3" />
                  <div className="h-3 bg-sand-100 rounded w-full" />
                  <div className="h-3 bg-sand-100 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {query && (
              <p className="text-center text-sm text-sand-500 mb-8">
                {filtered.length === 0 ? "לא נמצאו תוצאות" : `נמצאו ${filtered.length} פסלים`}
              </p>
            )}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((sculpture) => (
                  <SculptureCard key={sculpture.id} sculpture={sculpture} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-sand-400">
                <p className="text-lg">לא נמצאו פסלים התואמים את החיפוש</p>
                <button onClick={() => setQuery("")} className="mt-4 text-sm text-sand-600 underline">
                  נקה חיפוש
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
