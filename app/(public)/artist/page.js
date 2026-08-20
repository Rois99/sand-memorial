"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

function InstagramIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-sand-900 py-20 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-10">
          <div className="shrink-0 w-48 h-48 rounded-full bg-sand-700" />
          <div className="space-y-3 w-full">
            <div className="h-3 bg-sand-700 rounded w-20" />
            <div className="h-8 bg-sand-700 rounded w-48" />
            <div className="h-9 bg-sand-700 rounded w-44 mt-2" />
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 bg-sand-200 rounded w-full" />
        ))}
      </div>
    </div>
  );
}

export default function ArtistPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("artist_profile")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        setProfile(data ?? null);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSkeleton />;

  const { bio_text, image_url, instagram_url } = profile ?? {};

  return (
    <>
      {/* Dark hero */}
      <section className="bg-sand-900 py-20 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-10 text-center sm:text-start">
          {/* Photo */}
          <div className="shrink-0 w-48 h-48 rounded-full overflow-hidden bg-sand-800 border-4 border-sand-700 shadow-xl">
            {image_url ? (
              <img
                src={image_url}
                alt="האמן"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-16 h-16 text-sand-500" strokeWidth={1.2} />
              </div>
            )}
          </div>

          {/* Identity */}
          <div>
            <p className="text-sand-400 text-xs font-semibold tracking-widest uppercase mb-3">
              האמן מאחורי הפרויקט
            </p>
            <h1 className="text-4xl font-bold text-sand-50 leading-tight">
              על האמן
            </h1>
            {instagram_url && (
              <a
                href={instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:opacity-90 transition-opacity"
              >
                <InstagramIcon size={16} />
                לפרופיל באינסטגרם
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Divider accent */}
      <div className="h-1 bg-gradient-to-r from-sand-300 via-sand-200 to-sand-100" />

      {/* Bio */}
      {bio_text ? (
        <section className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-xs font-semibold text-sand-400 tracking-widest uppercase mb-8">
            קצת עלי
          </h2>
          <p className="text-sand-800 text-lg leading-loose whitespace-pre-wrap">
            {bio_text}
          </p>
        </section>
      ) : (
        <div className="max-w-3xl mx-auto px-6 py-16 text-sand-400 text-center">
          <p>אין מידע זמין כרגע.</p>
        </div>
      )}

      {/* Back */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
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
