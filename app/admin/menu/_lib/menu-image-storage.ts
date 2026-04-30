import { createServiceRoleClient } from "@/lib/supabase/server";

const MENU_IMAGE_BUCKET = "menu-images";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type UploadMenuImageResult =
  | { publicUrl: string; path: string }
  | { error: string };

export function parseStoragePathFromPublicUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  const plainMarker = `/storage/v1/object/public/${MENU_IMAGE_BUCKET}/`;
  const renderMarker = `/storage/v1/render/image/public/${MENU_IMAGE_BUCKET}/`;
  const marker = trimmed.includes(renderMarker) ? renderMarker : plainMarker;
  const markerIndex = trimmed.indexOf(marker);
  if (markerIndex < 0) return null;

  const start = markerIndex + marker.length;
  const rest = trimmed.slice(start);
  const end = rest.indexOf("?");
  return decodeURIComponent(end >= 0 ? rest.slice(0, end) : rest);
}

export async function removeMenuImage(path: string) {
  if (!path.trim()) return;
  const supabase = createServiceRoleClient();
  await supabase.storage.from(MENU_IMAGE_BUCKET).remove([path]);
}

export async function uploadMenuImage(file: File): Promise<UploadMenuImageResult> {
  if (file.size <= 0) {
    return { error: "Selected image is empty." };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { error: "Image size must be 5MB or less." };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: "Only JPG, PNG, and WebP images are allowed." };
  }

  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const now = Date.now();
  const random = Math.random().toString(36).slice(2, 10);
  const path = `items/${now}-${random}.${extension}`;

  const bytes = Buffer.from(await file.arrayBuffer());
  const supabase = createServiceRoleClient();
  const { error: uploadError } = await supabase.storage
    .from(MENU_IMAGE_BUCKET)
    .upload(path, bytes, {
      contentType: file.type,
      upsert: false,
      cacheControl: "31536000",
    });

  if (uploadError) {
    return { error: "Image upload failed. Check storage bucket configuration." };
  }

  const { data } = supabase.storage.from(MENU_IMAGE_BUCKET).getPublicUrl(path, {
    transform: { width: 1200, quality: 80, resize: "contain" },
  });
  return { publicUrl: data.publicUrl, path };
}
