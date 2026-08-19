"use client";

import { useState } from "react";

const INITIAL_FORM = { name: "", unit: "", age: "", story: "", files: [] };

/**
 * Manages the "upload new sculpture" form state and submission.
 * Passes `files` to `onSuccess(sculpture)` so `useSculptures.addSculpture`
 * can handle the Supabase Storage upload. `onSuccess` must return `{ success }`.
 */
export function useUploadForm(onSuccess) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "files") {
      setForm((prev) => ({ ...prev, files: Array.from(files) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setUploading(true);

    const result = await onSuccess({
      name: form.name,
      unit: form.unit,
      age: Number(form.age),
      story: form.story,
      date: new Date().toLocaleDateString("he-IL", {
        month: "long",
        year: "numeric",
      }),
      files: form.files,
    });

    setUploading(false);

    if (result?.success === false) return;

    setUploaded(true);
    setForm(INITIAL_FORM);
    setTimeout(() => setUploaded(false), 4000);
  }

  return { form, handleChange, handleSubmit, uploading, uploaded };
}
