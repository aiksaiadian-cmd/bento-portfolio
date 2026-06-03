const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function getFileType(base64: string): "image" | "video" | "gif" {
  if (base64.startsWith("data:image/gif")) return "gif";
  if (base64.startsWith("data:image/")) return "image";
  if (base64.startsWith("data:video/")) return "video";
  return "image";
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return { valid: false, error: "Unsupported file type. Allowed: jpg, png, webp, gif, mp4, webm" };
  }

  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
  if (file.size > maxSize) {
    const sizeMB = Math.round(maxSize / 1024 / 1024);
    return { valid: false, error: `File too large. Maximum size: ${sizeMB}MB` };
  }

  return { valid: true };
}

export function getFileSize(base64: string): number {
  const raw = base64.replace(/^data:[^;]+;base64,/, "");
  return (raw.length * 3) / 4 / 1024 / 1024;
}
