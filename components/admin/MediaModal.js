"use client";

import { useState } from "react";
import { X, Trash2, Upload, Loader2, Film, Image } from "lucide-react";
import { uploadMediaFiles, deleteMediaFile } from "@/lib/mediaUtils";

function MediaThumbnail({ item, onDelete, isDeleting }) {
  return (
    <div className="relative group aspect-square rounded-xl overflow-hidden bg-sand-100">
      {item.type === "video" ? (
        <video
          src={item.url}
          className="w-full h-full object-cover"
          muted
          playsInline
        />
      ) : (
        <img
          src={item.url}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}

      {/* Type badge */}
      <span className="absolute top-2 start-2 flex items-center gap-1 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
        {item.type === "video" ? (
          <Film size={10} />
        ) : (
          <Image size={10} />
        )}
        {item.type === "video" ? "וידאו" : "תמונה"}
      </span>

      {/* Delete button — visible on hover */}
      <button
        onClick={() => onDelete(item)}
        disabled={isDeleting}
        title="מחיקת קובץ"
        className="absolute top-2 end-2 p-1.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {isDeleting ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <Trash2 size={13} />
        )}
      </button>
    </div>
  );
}

/**
 * Admin modal for managing the media of a single sculpture.
 * Handles upload (multiple files) and per-item delete,
 * syncing changes back via `onMediaUpdated`.
 */
export default function MediaModal({ sculpture, onClose, onMediaUpdated }) {
  const [media, setMedia] = useState(
    [...(sculpture.sculpture_media ?? [])].sort((a, b) => a.id - b.id)
  );
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function handleUpload(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newItems = await uploadMediaFiles(sculpture.id, files);
      const updated = [...media, ...newItems];
      setMedia(updated);
      onMediaUpdated(sculpture.id, updated);
    } catch (err) {
      alert("שגיאה בהעלאה: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      "האם למחוק קובץ מדיה זה?\nהקובץ יימחק לצמיתות מהאחסון."
    );
    if (!confirmed) return;

    setDeletingId(item.id);
    try {
      await deleteMediaFile(item);
      const updated = media.filter((m) => m.id !== item.id);
      setMedia(updated);
      onMediaUpdated(sculpture.id, updated);
    } catch (err) {
      alert("שגיאה במחיקה: " + err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand-200 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-sand-900">ניהול מדיה</h2>
            <p className="text-sm text-sand-500 mt-0.5">{sculpture.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sand-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-sand-600" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Media grid */}
          {media.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {media.map((item) => (
                <MediaThumbnail
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  isDeleting={deletingId === item.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-sand-400">
              <Image size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">אין קבצי מדיה עדיין</p>
            </div>
          )}

          {/* Upload zone */}
          <label
            className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              uploading
                ? "border-sand-200 bg-sand-50 cursor-not-allowed"
                : "border-sand-300 hover:border-sand-400 hover:bg-sand-50"
            }`}
          >
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
              className="sr-only"
            />
            {uploading ? (
              <>
                <Loader2 size={24} className="text-sand-400 animate-spin" />
                <p className="text-sm text-sand-500 font-medium">מעלה קבצים...</p>
              </>
            ) : (
              <>
                <Upload size={24} className="text-sand-400" />
                <p className="text-sm font-semibold text-sand-700">
                  לחץ להעלאת קבצים
                </p>
                <p className="text-xs text-sand-400">
                  תמונות וסרטונים · מספר קבצים בו-זמנית
                </p>
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}
