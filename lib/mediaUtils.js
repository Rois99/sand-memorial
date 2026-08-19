import { supabase } from "./supabase";

export const MEDIA_BUCKET = "sculpture-media";

/**
 * Uploads an array of File objects to Supabase Storage and inserts
 * corresponding rows into `sculpture_media`. Returns the inserted rows.
 *
 * @param {number} sculptureId
 * @param {File[]} files
 * @returns {Promise<object[]>}
 */
export async function uploadMediaFiles(sculptureId, files) {
  const results = await Promise.all(
    Array.from(files).map(async (file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const storagePath = `sculptures/${sculptureId}/${uniqueName}`;
      const mediaType = file.type.startsWith("video") ? "video" : "image";

      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(storagePath, file);

      if (uploadError) throw new Error(uploadError.message);

      const {
        data: { publicUrl },
      } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);

      const { data, error: dbError } = await supabase
        .from("sculpture_media")
        .insert({
          sculpture_id: sculptureId,
          url: publicUrl,
          storage_path: storagePath,
          type: mediaType,
        })
        .select()
        .single();

      if (dbError) throw new Error(dbError.message);
      return data;
    })
  );

  return results;
}

/**
 * Deletes a single media item: removes the file from Supabase Storage
 * and then deletes the row from `sculpture_media`.
 *
 * @param {{ id: number, storage_path: string }} mediaItem
 */
export async function deleteMediaFile(mediaItem) {
  const { error: storageError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .remove([mediaItem.storage_path]);

  if (storageError) throw new Error(storageError.message);

  const { error: dbError } = await supabase
    .from("sculpture_media")
    .delete()
    .eq("id", mediaItem.id);

  if (dbError) throw new Error(dbError.message);
}
