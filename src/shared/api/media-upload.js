import { API_BASE_URL } from "@/shared/api/admin-api";
import { useAdminAuthStore } from "@/shared/stores/admin-auth-store";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export class MediaUploadError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "MediaUploadError";
    this.status = status;
    this.data = data;
  }
}

function validateFiles(files) {
  for (const file of files) {
    if (!file.type?.startsWith("image/")) {
      throw new MediaUploadError(`Tệp "${file.name}" không phải là hình ảnh.`);
    }
    if (file.size > MAX_FILE_BYTES) {
      throw new MediaUploadError(`Tệp "${file.name}" vượt quá 10MB.`);
    }
  }
}

async function postMultipart(path, formData) {
  const accessToken = useAdminAuthStore.getState().accessToken;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    body: formData,
  });
  const envelope = await response.json().catch(() => null);

  if (!response.ok || envelope?.code !== 1000) {
    throw new MediaUploadError(envelope?.message || "Tải ảnh lên thất bại.", {
      status: response.status,
      data: envelope?.data,
    });
  }

  return envelope.data;
}

export async function uploadOne(file, folder) {
  validateFiles([file]);
  const formData = new FormData();
  formData.append("file", file);
  if (folder) formData.append("folder", folder);
  const data = await postMultipart("/media/upload", formData);
  return data.url;
}

export async function uploadMany(files, folder) {
  const list = Array.from(files);
  validateFiles(list);
  const formData = new FormData();
  list.forEach((file) => formData.append("files", file));
  if (folder) formData.append("folder", folder);
  const data = await postMultipart("/media/upload-multiple", formData);
  return data.map((item) => item.url);
}
