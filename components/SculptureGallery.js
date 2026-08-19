"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Mountain } from "lucide-react";

function Placeholder({ date }) {
  return (
    <div className="bg-sand-100 aspect-[4/3] flex flex-col items-center justify-center relative">
      <Mountain className="w-14 h-14 text-sand-300" strokeWidth={1.2} />
      <span className="mt-2 text-xs text-sand-400 font-medium">פסל חול</span>
      {date && (
        <div className="absolute bottom-3 start-3 bg-sand-900/65 text-sand-100 text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
          {date}
        </div>
      )}
    </div>
  );
}

function MediaItem({ item }) {
  if (item.type === "video") {
    return (
      <video
        src={item.url}
        className="w-full h-full object-cover"
        muted
        playsInline
        controls
      />
    );
  }
  return (
    <img
      src={item.url}
      alt=""
      className="w-full h-full object-cover"
      loading="lazy"
    />
  );
}

/**
 * Public-facing media gallery for a sculpture card.
 * - 0 items → placeholder
 * - 1 item  → single media, no controls
 * - 2+ items → carousel with arrows and dot indicators
 */
export default function SculptureGallery({ media, date }) {
  const [current, setCurrent] = useState(0);

  const sorted = useMemo(
    () => [...(media ?? [])].sort((a, b) => a.id - b.id),
    [media]
  );

  if (sorted.length === 0) {
    return <Placeholder date={date} />;
  }

  if (sorted.length === 1) {
    return (
      <div className="aspect-[4/3] overflow-hidden relative">
        <MediaItem item={sorted[0]} />
        {date && (
          <div className="absolute bottom-3 start-3 bg-sand-900/65 text-sand-100 text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
            {date}
          </div>
        )}
      </div>
    );
  }

  const prev = (e) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + sorted.length) % sorted.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % sorted.length);
  };

  return (
    <div className="aspect-[4/3] overflow-hidden relative bg-sand-100">
      <MediaItem item={sorted[current]} />

      {/* Prev — start side (right in RTL) */}
      <button
        onClick={prev}
        className="absolute top-1/2 -translate-y-1/2 start-2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full transition-colors"
        aria-label="הקודם"
      >
        <ChevronRight size={16} />
      </button>

      {/* Next — end side (left in RTL) */}
      <button
        onClick={next}
        className="absolute top-1/2 -translate-y-1/2 end-2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full transition-colors"
        aria-label="הבא"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {sorted.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i === current ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Date badge */}
      {date && (
        <div className="absolute top-3 start-3 bg-sand-900/65 text-sand-100 text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
          {date}
        </div>
      )}

      {/* Counter */}
      <div className="absolute top-3 end-3 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
        {current + 1} / {sorted.length}
      </div>
    </div>
  );
}
