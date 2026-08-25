"use client";

import { useState } from "react";
import { Trash2, Images, Pencil, Share2 } from "lucide-react";
import { toast } from "react-hot-toast";
import MediaModal from "./MediaModal";
import EditModal from "./EditModal";

export default function SculpturesTable({ sculptures, onDelete, onUpdate, onMediaUpdated, onShareLink }) {
  const [editingMedia, setEditingMedia] = useState(null);
  const [editingSculpture, setEditingSculpture] = useState(null);

  function handleMediaUpdated(sculptureId, media) {
    onMediaUpdated(sculptureId, media);
    // Keep the modal's sculpture reference fresh so re-opening feels instant.
    setEditingMedia((prev) =>
      prev?.id === sculptureId ? { ...prev, sculpture_media: media } : prev
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold text-sand-900 mb-4">פסלים קיימים</h2>
      <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand-100 border-b border-sand-200 text-sand-600 text-right">
                <th className="px-5 py-3 font-semibold">שם הנופל</th>
                <th className="px-5 py-3 font-semibold">יחידה</th>
                <th className="px-5 py-3 font-semibold">גיל</th>
                <th className="px-5 py-3 font-semibold">תאריך</th>
                <th className="px-5 py-3 font-semibold">מדיה</th>
                <th className="px-5 py-3 font-semibold">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {sculptures.map((s) => (
                <tr key={s.id} className="hover:bg-sand-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-sand-900">{s.name}</td>
                  <td className="px-5 py-4 text-sand-700">{s.unit}</td>
                  <td className="px-5 py-4 text-sand-600">{s.age}</td>
                  <td className="px-5 py-4 text-sand-500 text-xs whitespace-nowrap">
                    {s.date}
                  </td>
                  <td className="px-5 py-4 text-sand-500 text-xs">
                    {(s.sculpture_media ?? []).length} קבצים
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingSculpture(s)}
                        title="עריכת פרטים"
                        className="text-sand-500 hover:text-sand-800 hover:bg-sand-100 p-1.5 rounded-lg transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setEditingMedia(s)}
                        title="עריכת מדיה"
                        className="text-sand-500 hover:text-sand-800 hover:bg-sand-100 p-1.5 rounded-lg transition-colors"
                      >
                        <Images size={15} />
                      </button>
                      <button
                        onClick={async () => {
                          const url = await onShareLink(s.id);
                          if (url) {
                            await navigator.clipboard.writeText(url);
                            toast.success("קישור המשפחה הועתק ללוח!");
                          } else {
                            toast.error("שגיאה ביצירת הקישור");
                          }
                        }}
                        title="שיתוף קישור עריכה למשפחה"
                        className="text-sand-500 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                      >
                        <Share2 size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(s.id)}
                        title="מחיקת פסל"
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sculptures.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sand-400">
                    אין פסלים במערכת
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingMedia && (
        <MediaModal
          sculpture={editingMedia}
          onClose={() => setEditingMedia(null)}
          onMediaUpdated={handleMediaUpdated}
        />
      )}

      {editingSculpture && (
        <EditModal
          sculpture={editingSculpture}
          onClose={() => setEditingSculpture(null)}
          onUpdate={onUpdate}
        />
      )}
    </section>
  );
}
