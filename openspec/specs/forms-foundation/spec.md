# forms-foundation Specification

## Purpose

Establishes the shared structure and building blocks for every form in this app: a documented folder layout separating form UI (`src/forms/`), backend-calling services (`src/services/`), and the API transport (`src/api/`); a `useFormState` hook that manages controlled values, validation, and submission status without an external form library; and shared presentation components (labeled field, status banner) so every form looks and behaves consistently. New forms are built by following this foundation rather than inventing their own state management or markup.

## Requirements

### Requirement: Documented folder structure for forms and services
The system SHALL establish a documented folder structure under `src/` that separates form UI (`src/forms/`), backend-calling business logic (`src/services/`), and low-level HTTP transport (`src/api/`), so a new form's files have one obvious, discoverable location.

#### Scenario: Locating where a new form belongs
- **WHEN** a developer needs to add a new form
- **THEN** the documented conventions specify that its component lives under `src/forms/<form-name>/`, its backend calls live in a `src/services/<resource>.service.ts` file, and no form component calls `fetch` or `src/api/client.ts` directly

### Requirement: Reusable controlled-form state hook
The system SHALL provide a `useFormState` hook that manages values, validation errors, and submission status for a controlled form without any external form library.

#### Scenario: Tracking field changes
- **WHEN** a form using `useFormState` calls the hook's change handler for a field
- **THEN** the hook updates that field's value in state while leaving other fields unchanged

#### Scenario: Running optional validation before submit
- **WHEN** a form using `useFormState` is submitted and an optional `validate` function is provided
- **THEN** the hook runs `validate` against current values and, if it returns any field errors, blocks submission and exposes those errors instead of calling `onSubmit`

#### Scenario: Submission lifecycle without validation errors
- **WHEN** a form using `useFormState` is submitted and validation passes (or no `validate` function is provided)
- **THEN** the hook sets status to `submitting`, calls the provided `onSubmit` with the current values, and sets status to `success` or `error` based on the outcome

#### Scenario: Surfacing a submission failure
- **WHEN** the `onSubmit` callback used by `useFormState` throws or rejects (e.g. the backing service call raised an `ApiError`)
- **THEN** the hook sets status to `error` and exposes the failure's message via `submitError` without crashing the form component

### Requirement: Reusable form presentation components
The system SHALL provide shared, shadcn-based components for a labeled field with inline error text and for a submission status banner, so every form shares the same look and behavior for these concerns.

#### Scenario: Displaying a field-level error
- **WHEN** a form renders a field using the shared field component and that field has a validation error
- **THEN** the component displays the error text next to the field without the form author writing custom error-display markup

#### Scenario: Displaying submission status
- **WHEN** a form's `useFormState` status is `submitting`, `success`, or `error`
- **THEN** the shared status banner component reflects that state to the user (e.g. a loading indicator, a success message, or the error message)

### Requirement: Reference example demonstrating the pattern
The system SHALL include one example form that wires together `useFormState`, the shared presentation components, and a service function built on `apiRequest`, so the end-to-end pattern is demonstrated without depending on a real ApiAstil endpoint being reachable.

#### Scenario: Following the example for a new form
- **WHEN** a developer builds a new form after this change is implemented
- **THEN** they can model it directly on the example form's structure (component, service call, hook usage) without inventing a new pattern
