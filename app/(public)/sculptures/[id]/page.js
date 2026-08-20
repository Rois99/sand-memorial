"use client";

import { use, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Mountain, ArrowRight, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

/* ── Candle icon ─────────────────────────────────────────── */
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

/* ── Hero gallery (full-width, taller) ───────────────────── */
function HeroGallery({ media }) {
  const [current, setCurrent] = useState(0);
  const sorted = useMemo(
    () => [...(media ?? [])].sort((a, b) => a.id - b.id),
    [media]
  );

  if (sorted.length === 0) {
    return (
      <div className="w-full h-[50vh] max-h-[500px] bg-sand-900 flex items-center justify-center">
        <Mountain className="w-20 h-20 text-sand-600" strokeWidth={1} />
      </div>
    );
  }

  const item = sorted[current];
  const prev = () => setCurrent((c) => (c - 1 + sorted.length) % sorted.length);
  const next = () => setCurrent((c) => (c + 1) % sorted.length);

  return (
    <div className="relative w-full h-[50vh] max-h-[500px] bg-sand-900 flex items-center justify-center overflow-hidden">
      {item.type === "video" ? (
        <video
          key={item.id}
          src={item.url}
          className="max-h-full max-w-full object-contain"
          controls
          playsInline
        />
      ) : (
        <img
          key={item.id}
          src={item.url}
          alt=""
          className="max-h-full max-w-full object-contain transition-opacity duration-300"
        />
      )}

      {/* Gradient overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {sorted.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute top-1/2 -translate-y-1/2 start-4 bg-black/40 hover:bg-black/65 text-white p-2.5 rounded-full transition-colors"
            aria-label="הקודם"
          >
            <ChevronRight size={22} />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 -translate-y-1/2 end-4 bg-black/40 hover:bg-black/65 text-white p-2.5 rounded-full transition-colors"
            aria-label="הבא"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {sorted.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === current ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-4 end-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
            {current + 1} / {sorted.length}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Lightbox ────────────────────────────────────────────── */
function Lightbox({ src, onClose }) {
  // Close on Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 end-4 text-white bg-white/10 hover:bg-white/25 p-2 rounded-full transition-colors"
        aria-label="סגור"
      >
        <X size={22} />
      </button>
      <img
        src={src}
        alt=""
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

/* ── Photo grid (images only, shown below story) ─────────── */
function PhotoGrid({ media }) {
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const images = useMemo(
    () => [...(media ?? [])].filter((m) => m.type === "image").sort((a, b) => a.id - b.id),
    [media]
  );

  if (images.length < 2) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 pb-20">
      <h2 className="text-lg font-semibold text-sand-800 mb-5 border-b border-sand-200 pb-3">
        גלריית תמונות
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => setLightboxSrc(img.url)}
            className="aspect-square overflow-hidden rounded-xl bg-sand-100 cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-sand-400"
          >
            <img
              src={img.url}
              alt=""
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </section>
  );
}

/* ── Skeletons & not-found ───────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-full h-[50vh] max-h-[500px] bg-sand-200" />
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-4">
        <div className="h-8 bg-sand-200 rounded w-1/2" />
        <div className="h-4 bg-sand-100 rounded w-1/3" />
        <div className="mt-8 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-sand-100 rounded w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

function NotFoundView() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-40 text-sand-400 gap-4">
      <Mountain className="w-16 h-16" strokeWidth={1} />
      <p className="text-lg font-medium text-sand-600">הפסל לא נמצא</p>
      <button
        onClick={() => router.push("/")}
        className="text-sm text-sand-500 underline"
      >
        חזרה לגלריה
      </button>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function SculpturePage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [sculpture, setSculpture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase
      .from("sculptures")
      .select("*, sculpture_media(id, url, storage_path, type, position)")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setSculpture(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (notFound) return <NotFoundView />;

  const { name, unit, age, date, story, sculpture_media } = sculpture;

  return (
    <>
      {/* Hero gallery */}
      <HeroGallery media={sculpture_media} />

      {/* Identity strip */}
      <div className="bg-sand-900 text-sand-50 py-10 px-6">
        <div className="max-w-3xl mx-auto flex items-start gap-5">
          <CandleIcon className="w-12 h-12 text-amber-300 flex-shrink-0 mt-0.5" />
          <div>
            <h1 className="text-4xl font-bold leading-tight">{name}</h1>
            <p className="text-sand-400 mt-1.5 text-sm tracking-wide">
              {unit} &middot; גיל {age} &middot; {date}
            </p>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <h2 className="text-xs font-semibold text-sand-400 tracking-widest uppercase mb-6">
          סיפורו האישי
        </h2>
        <p className="text-sand-800 text-lg leading-loose whitespace-pre-wrap">
          {story}
        </p>
      </section>

      {/* Photo grid */}
      <PhotoGrid media={sculpture_media} />

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-sand-500 hover:text-sand-800 transition-colors"
        >
          <ArrowRight size={15} />
          חזרה לגלריה
        </button>
      </div>
    </>
  );
}
