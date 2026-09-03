/**
 * Normalized error shape thrown by `apiRequest` for every failure case
 * (missing config, non-2xx response, or network failure), regardless of
 * the backend's actual response format.
 */
export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}
