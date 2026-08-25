"use client";

import { useState } from "react";

const INITIAL_FORM = {
  name: "",
  unit: "",
  rank: "",
  age: "",
  story: "",
  instagram_url: "",
  tiktok_url: "",
  has_fallen_photo: false,
  files: [],
};

export function useUploadForm(onSuccess) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  function handleChange(e) {
    const { name, value, files, type, checked } = e.target;
    if (name === "files") {
      setForm((prev) => ({ ...prev, files: Array.from(files) }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
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
      rank: form.rank.trim() || null,
      age: Number(form.age),
      story: form.story,
      instagram_url: form.instagram_url.trim() || null,
      tiktok_url: form.tiktok_url.trim() || null,
      has_fallen_photo: form.has_fallen_photo,
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
