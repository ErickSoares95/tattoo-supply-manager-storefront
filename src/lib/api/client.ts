// API_BASE_URL points at the Spring Boot backend - same env var convention as the
// MVP frontend (tattoo-supply-manager-frontend), so the same .env pattern carries over.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(body?.message ?? `Request failed with status ${response.status}`, response.status);
  }

  // Checking response.status === 204 alone isn't enough: POST /notifications/reprocess
  // replies 200 with an empty body (ResponseEntity.ok().build(), no .body(...)), not
  // 204 - found live by clicking "Reprocessar" in the admin panel, where the backend
  // logged a clean 200 but the UI still showed a generic failure because .json() threw
  // on the empty string. Reading as text first and treating "no text" as "no body",
  // regardless of which 2xx status sent it, covers both cases with one check.
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
