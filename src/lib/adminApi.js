export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

export class AdminApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.data = data;
  }
}

const buildUrl = (path, query) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

const parseResponse = async (response) => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

export async function adminRequest(path, options = {}) {
  const { query, body, headers, ...init } = options;
  const isFormData = body instanceof FormData;

  const response = await fetch(buildUrl(path, query), {
    credentials: "include",
    ...init,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      (response.status === 401
        ? "Phiên đăng nhập đã hết hạn."
        : "Không thể hoàn tất yêu cầu.");

    throw new AdminApiError(Array.isArray(message) ? message.join(", ") : message, {
      status: response.status,
      data,
    });
  }

  return data;
}

export const adminApi = {
  get: (path, query) => adminRequest(path, { method: "GET", query }),
  post: (path, body) => adminRequest(path, { method: "POST", body }),
  put: (path, body) => adminRequest(path, { method: "PUT", body }),
  patch: (path, body) => adminRequest(path, { method: "PATCH", body }),
  delete: (path) => adminRequest(path, { method: "DELETE" }),
  upload: (path, formData) => adminRequest(path, { method: "POST", body: formData }),
};

export function normalizeCollection(payload) {
  if (Array.isArray(payload)) {
    return { items: payload, total: payload.length };
  }

  const items =
    payload?.items ||
    payload?.data ||
    payload?.results ||
    payload?.rows ||
    payload?.products ||
    payload?.orders ||
    [];

  return {
    items: Array.isArray(items) ? items : [],
    total: payload?.total ?? payload?.count ?? (Array.isArray(items) ? items.length : 0),
    raw: payload,
  };
}

export function formatVnd(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(number);
}

export function parseVnd(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(String(value).replace(/[^\d-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export function getValueByPath(row, path) {
  if (!path) {
    return undefined;
  }

  return path.split(".").reduce((value, key) => value?.[key], row);
}
