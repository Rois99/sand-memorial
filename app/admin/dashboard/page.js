"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { clearAuthCookie } from "@/lib/auth";
import { REQUEST_STATUS } from "@/lib/constants";
import { useSculptures } from "@/hooks/useSculptures";
import { useRequests } from "@/hooks/useRequests";
import { useUploadForm } from "@/hooks/useUploadForm";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsBar from "@/components/admin/StatsBar";
import SculpturesTable from "@/components/admin/SculpturesTable";
import RequestsTable from "@/components/admin/RequestsTable";
import UploadForm from "@/components/admin/UploadForm";
import ArtistProfileForm from "@/components/admin/ArtistProfileForm";

export default function AdminDashboard() {
  const router = useRouter();
  const {
    sculptures,
    loading: sculpturesLoading,
    error: sculpturesError,
    deleteSculpture,
    addSculpture,
    updateSculpture,
    updateSculptureMedia,
  } = useSculptures();

  const {
    requests,
    allRequests,
    loading: requestsLoading,
    error: requestsError,
    sortByDuplicates,
    toggleSort,
    markAsHandled,
  } = useRequests();

  const uploadForm = useUploadForm(addSculpture);

  const stats = useMemo(
    () => [
      { label: 'סה"כ בקשות', value: allRequests.length },
      {
        label: "ממתינות",
        value: allRequests.filter((r) => r.status === REQUEST_STATUS.PENDING).length,
      },
      {
        label: "הושלמו",
        value: allRequests.filter((r) => r.status === REQUEST_STATUS.COMPLETED).length,
      },
    ],
    [allRequests]
  );

  function handleLogout() {
    clearAuthCookie();
    router.push("/admin/login");
  }

  const loading = sculpturesLoading || requestsLoading;
  const error = sculpturesError || requestsError;

  return (
    <div className="min-h-screen bg-sand-50">
      <AdminHeader onLogout={handleLogout} />

      {error ? (
        <div className="max-w-lg mx-auto mt-20 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-8 text-center">
          <p className="font-semibold text-lg mb-2">שגיאה בטעינת הנתונים</p>
          <p className="text-sm font-mono break-all">{error}</p>
          <p className="text-xs text-red-500 mt-4">
            ודאו שה-RLS policies מוגדרים נכון ב-Supabase (ראו supabase-schema.sql).
          </p>
        </div>
      ) : loading ? (
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-12 animate-pulse">
          {/* Stats skeleton */}
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-sand-200 h-24" />
            ))}
          </div>
          {/* Table skeleton */}
          <div className="bg-white rounded-2xl border border-sand-200 h-64" />
          <div className="bg-white rounded-2xl border border-sand-200 h-64" />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
          <StatsBar stats={stats} />
          <SculpturesTable sculptures={sculptures} onDelete={deleteSculpture} onUpdate={updateSculpture} onMediaUpdated={updateSculptureMedia} />
          <RequestsTable
            requests={requests}
            sortByDuplicates={sortByDuplicates}
            onToggleSort={toggleSort}
            onMarkAsHandled={markAsHandled}
          />
          <UploadForm {...uploadForm} />
          <ArtistProfileForm />
        </div>
      )}
    </div>
  );
}
