import { ApiError } from "./errors"

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown
}

function resolveUrl(path: string): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  if (!baseUrl) {
    throw new ApiError(
      "VITE_API_BASE_URL is not configured. Set it in your .env file (see .env.example).",
      0
    )
  }

  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`
}

async function readErrorMessage(response: Response): Promise<{ message: string; details?: unknown }> {
  const text = await response.text().catch(() => "")

  if (!text) {
    return { message: response.statusText || `Request failed with status ${response.status}` }
  }

  try {
    const body = JSON.parse(text) as Record<string, unknown>
    const message =
      (typeof body.mensaje === "string" && body.mensaje) ||
      (typeof body.error === "string" && body.error) ||
      (typeof body.detalle === "string" && body.detalle) ||
      response.statusText ||
      `Request failed with status ${response.status}`
    return { message, details: body }
  } catch {
    return { message: response.statusText || `Request failed with status ${response.status}`, details: text }
  }
}

/**
 * Single entry point for every call to the backend API. Every service
 * function should be built on top of this - no other module should call
 * `fetch` directly against the backend.
 */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, headers, signal, ...rest } = options
  const url = resolveUrl(path)

  let response: Response
  try {
    response = await fetch(url, {
      ...rest,
      signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (cause) {
    throw new ApiError(
      "Could not reach the backend API. Check your connection or the API base URL.",
      0,
      cause
    )
  }

  if (!response.ok) {
    const { message, details } = await readErrorMessage(response)
    throw new ApiError(message, response.status, details)
  }

  const text = await response.text()
  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}
