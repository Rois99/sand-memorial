"use client";

import { useRouter } from "next/navigation";
import SculptureGallery from "./SculptureGallery";

function CandleIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Flame */}
      <path d="M12 2C11.5 4 9.5 5.5 9.5 8C9.5 9.9 10.7 11.3 12 12C13.3 11.3 14.5 9.9 14.5 8C14.5 5.5 12.5 4 12 2Z" />
      {/* Wick */}
      <line x1="12" y1="12" x2="12" y2="13.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      {/* Candle body */}
      <rect x="9.5" y="13.5" width="5" height="7.5" rx="0.75" fillOpacity="0.85" />
      {/* Base */}
      <rect x="8" y="21" width="8" height="1.5" rx="0.75" fillOpacity="0.65" />
    </svg>
  );
}

export default function SculptureCard({ sculpture }) {
  const router = useRouter();

  return (
    <article
      onClick={() => router.push(`/sculptures/${sculpture.id}`)}
      className="group bg-white rounded-2xl border border-sand-200 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
    >
      <div className="relative">
        <SculptureGallery
          media={sculpture.sculpture_media}
          date={sculpture.date}
        />
        {/* Memorial candle — fades out on card hover so it never obscures the image */}
        <div className="absolute bottom-3 end-3 z-20 pointer-events-none">
          <CandleIcon className="w-7 h-7 text-amber-300 drop-shadow-lg group-hover:opacity-0 transition-opacity duration-300" />
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-sand-900 mb-0.5">
          {sculpture.name}
        </h3>
        <p className="text-xs text-sand-500 font-medium mb-3">
          {sculpture.unit} &middot; גיל {sculpture.age}
        </p>
        <p className="text-sm text-sand-700 leading-relaxed line-clamp-3">
          {sculpture.story}
        </p>
      </div>
    </article>
  );
}
