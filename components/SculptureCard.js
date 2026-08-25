"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Mountain } from "lucide-react";

/* ── Icons ───────────────────────────────────────────────── */
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

function InstagramIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
    </svg>
  );
}

/* ── Card image with optional fallen-photo thumbnail ─────── */
function CardImage({ media, hasFallenPhoto }) {
  const sorted = useMemo(
    () => [...(media ?? [])].sort((a, b) => a.id - b.id),
    [media]
  );

  // When hasFallenPhoto: images[0] = fallen portrait, images[1] = sculpture
  const mainItem = hasFallenPhoto ? sorted[1] : sorted[0];
  const thumbItem = hasFallenPhoto ? sorted[0] : null;

  if (!mainItem) {
    return (
      <div className="aspect-[4/3] bg-sand-100 flex items-center justify-center">
        <Mountain className="w-14 h-14 text-sand-300" strokeWidth={1.2} />
      </div>
    );
  }

  return (
    <div className="aspect-[4/3] relative overflow-hidden bg-sand-900">
      {mainItem.type === "video" ? (
        <video src={mainItem.url} className="w-full h-full object-cover" muted playsInline />
      ) : (
        <img src={mainItem.url} alt="" className="w-full h-full object-cover" loading="lazy" />
      )}
      {thumbItem && (
        <div className="absolute bottom-3 end-3 w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-lg ring-1 ring-black/10">
          <img src={thumbItem.url} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
    </div>
  );
}

/* ── Card ────────────────────────────────────────────────── */
export default function SculptureCard({ sculpture }) {
  const router = useRouter();
  const { id, name, rank, unit, age, story, instagram_url, tiktok_url, has_fallen_photo, sculpture_media } = sculpture;

  const metaLine = [rank, unit, age != null ? `גיל ${age}` : null].filter(Boolean).join(" · ");
  const hasSocialLinks = instagram_url || tiktok_url;

  return (
    <article
      onClick={() => router.push(`/sculptures/${id}`)}
      className="group bg-white rounded-2xl border border-sand-200 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative">
        <CardImage media={sculpture_media} hasFallenPhoto={has_fallen_photo} />
        {/* Memorial candle — opposite corner from thumbnail to avoid overlap */}
        <div className={`absolute bottom-3 z-20 pointer-events-none ${has_fallen_photo ? "start-3" : "end-3"}`}>
          <CandleIcon className="w-7 h-7 text-amber-300 drop-shadow-lg group-hover:opacity-0 transition-opacity duration-300" />
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-sand-900 mb-0.5">{name}</h3>
        <p className="text-xs text-sand-500 font-medium mb-3">{metaLine}</p>
        <p className="text-sm text-sand-700 leading-relaxed line-clamp-3">{story}</p>

        {/* Social + Yizkor bar */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-sand-100">
          {/* Yizkor candle — decorative memorial symbol, always shown */}
          <span title="יזכור" className="text-amber-400/80">
            <CandleIcon className="w-4 h-4" />
          </span>

          {instagram_url && (
            <a
              href={instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="פוסט באינסטגרם"
              className="text-sand-400 hover:text-pink-500 transition-colors"
            >
              <InstagramIcon size={15} />
            </a>
          )}

          {tiktok_url && (
            <a
              href={tiktok_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="סרטון בטיקטוק"
              className="text-sand-400 hover:text-sand-900 transition-colors"
            >
              <TikTokIcon size={15} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
