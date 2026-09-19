const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface ApiErrorPayload {
  success: false;
  code?: string;
  message?: string;
}

interface ApiSuccessPayload<T> {
  success: true;
  data?: T;
  message?: string;
}

/**
 * Thrown for every failed request. `status` is 0 for network-level failures
 * (server unreachable, offline) so callers can distinguish "can't reach the
 * server" from a real HTTP error status.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

/**
 * Shared fetch wrapper: always sends cookies (the backend uses
 * session-cookie auth), parses the backend's `{success, data}` /
 * `{success, code, message}` envelope, and normalizes every failure into an
 * `ApiError` so callers never touch raw `Response`/`fetch` objects.
 */
export const apiRequest = async <T = void>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { body, headers, ...rest } = options;

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      credentials: "include",
      headers: {
        ...(body !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Could not reach the server. Check your connection and try again.",
      0,
    );
  }

  const text = await response.text();
  let payload: unknown = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const errorPayload = payload as ApiErrorPayload | null;

    throw new ApiError(
      errorPayload?.message || `Request failed (${response.status})`,
      response.status,
      errorPayload?.code,
    );
  }

  const successPayload = payload as ApiSuccessPayload<T> | null;

  return (successPayload?.data ?? (payload as T)) as T;
};

export const apiGet = <T = void>(path: string) =>
  apiRequest<T>(path, { method: "GET" });

export const apiPost = <T = void>(path: string, body?: unknown) =>
  apiRequest<T>(path, { method: "POST", body });

export const apiPatch = <T = void>(path: string, body?: unknown) =>
  apiRequest<T>(path, { method: "PATCH", body });

export const apiPut = <T = void>(path: string, body?: unknown) =>
  apiRequest<T>(path, { method: "PUT", body });

export const apiDelete = <T = void>(path: string) =>
  apiRequest<T>(path, { method: "DELETE" });
