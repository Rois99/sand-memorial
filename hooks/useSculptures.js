"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { uploadMediaFiles, deleteMediaFile, MEDIA_BUCKET } from "@/lib/mediaUtils";

export function useSculptures() {
  const [sculptures, setSculptures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from("sculptures")
      .select("*, sculpture_media(id, url, storage_path, type, position)")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setSculptures(data ?? []);
        setLoading(false);
      });
  }, []);

  async function deleteSculpture(id) {
    const target = sculptures.find((s) => s.id === id);
    if (!target) return;

    const confirmed = window.confirm(
      `האם למחוק את הפסל של ${target.name}?\nכל קבצי המדיה המשויכים יימחקו לצמיתות.`
    );
    if (!confirmed) return;

    // Delete all associated storage files before the DB row.
    const mediaPaths = (target.sculpture_media ?? []).map((m) => m.storage_path);
    if (mediaPaths.length > 0) {
      await supabase.storage.from(MEDIA_BUCKET).remove(mediaPaths);
      // Non-blocking: proceed with DB delete even if storage delete partially fails.
    }

    const { error } = await supabase.from("sculptures").delete().eq("id", id);
    if (error) {
      alert("שגיאה במחיקה: " + error.message);
      return;
    }
    setSculptures((prev) => prev.filter((s) => s.id !== id));
  }

  async function addSculpture({ files, ...sculptureData }) {
    const { data: newSculpture, error } = await supabase
      .from("sculptures")
      .insert(sculptureData)
      .select()
      .single();

    if (error) {
      alert("שגיאה בהוספת פסל: " + error.message);
      return { success: false };
    }

    let uploadedMedia = [];
    if (files && files.length > 0) {
      try {
        uploadedMedia = await uploadMediaFiles(newSculpture.id, files);
      } catch (err) {
        alert("הפסל נוסף, אך העלאת המדיה נכשלה: " + err.message);
      }
    }

    setSculptures((prev) => [
      { ...newSculpture, sculpture_media: uploadedMedia },
      ...prev,
    ]);
    return { success: true };
  }

  async function updateSculpture(id, fields) {
    const { error } = await supabase
      .from("sculptures")
      .update(fields)
      .eq("id", id);
    if (error) {
      alert("שגיאה בעדכון: " + error.message);
      return;
    }
    setSculptures((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...fields } : s))
    );
  }

  /** Called by MediaModal after upload or delete to sync state. */
  function updateSculptureMedia(sculptureId, media) {
    setSculptures((prev) =>
      prev.map((s) =>
        s.id === sculptureId ? { ...s, sculpture_media: media } : s
      )
    );
  }

  return {
    sculptures,
    loading,
    error,
    deleteSculpture,
    addSculpture,
    updateSculpture,
    updateSculptureMedia,
  };
}
