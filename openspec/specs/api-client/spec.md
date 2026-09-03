# api-client Specification

## Purpose

Provides the single, centralized way this app talks to the backend API (ApiAstil) over HTTP: resolving the base URL from configuration, attaching default headers, and normalizing every failure - missing configuration, non-2xx responses in whatever shape the backend returns, or a network-level failure - into one `ApiError` shape. Every service function is built on top of this capability instead of calling `fetch` directly, so error handling and request construction stay consistent as more backend-calling forms are added.

## Requirements

### Requirement: Centralized request function
The system SHALL provide a single function, `apiRequest<T>(path, options)`, that every service uses to call the backend API. No other module SHALL call `fetch` directly against the backend.

#### Scenario: Building the request URL
- **WHEN** `apiRequest` is called with a relative `path` (e.g. `/facturacion/procesar`)
- **THEN** it resolves the full URL by joining the configured base URL (from `VITE_API_BASE_URL`) with `path`

#### Scenario: Default JSON headers
- **WHEN** `apiRequest` is called without explicit headers
- **THEN** it sends `Content-Type: application/json` and `Accept: application/json` by default, and allows callers to override or add headers via `options`

#### Scenario: Missing base URL configuration
- **WHEN** `apiRequest` is invoked and `VITE_API_BASE_URL` is not configured
- **THEN** it throws an `ApiError` describing the missing configuration instead of sending a request to an invalid URL

#### Scenario: Optional cancellation
- **WHEN** a caller passes an `AbortSignal` via `options.signal`
- **THEN** `apiRequest` forwards it to the underlying `fetch` call so the request can be cancelled

### Requirement: Normalized error handling
The system SHALL normalize every non-2xx response into a single `ApiError` shape, regardless of the backend's response body format.

#### Scenario: Backend returns a structured error object
- **WHEN** the backend responds with a non-2xx status and a JSON body containing `mensaje` and/or `detalle` fields
- **THEN** `apiRequest` throws an `ApiError` whose `message` is derived from those fields and whose `status` matches the HTTP status code

#### Scenario: Backend returns a non-JSON or unrecognized error body
- **WHEN** the backend responds with a non-2xx status and a body that is not JSON, or JSON without recognizable error fields
- **THEN** `apiRequest` throws an `ApiError` whose `message` falls back to the response's status text, without throwing a secondary parsing error

#### Scenario: Network-level failure
- **WHEN** the underlying `fetch` call rejects (e.g. network unreachable)
- **THEN** `apiRequest` throws an `ApiError` describing the connection failure rather than letting the raw `fetch` rejection propagate

### Requirement: Successful response parsing
The system SHALL parse successful JSON responses and return typed data to the caller.

#### Scenario: Successful JSON response
- **WHEN** the backend responds with a 2xx status and a JSON body
- **THEN** `apiRequest<T>` resolves with the parsed body typed as `T`

#### Scenario: Successful empty response
- **WHEN** the backend responds with a 2xx status and an empty body (e.g. 204 No Content)
- **THEN** `apiRequest` resolves without throwing a JSON-parsing error
