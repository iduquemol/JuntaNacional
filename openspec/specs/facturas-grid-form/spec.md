# facturas-grid-form Specification

## Purpose

The first real form built on the `api-client`/`forms-foundation` architecture: lets a user query ApiAstil's facturas by date range, review them in a table, select which ones to act on via checkboxes (including a select-all control), and prepares that selection for a future "procesar" action - the actual processing backend call is not implemented yet and is deferred to a later change.

## Requirements

### Requirement: Query facturas by date range
The system SHALL provide two date inputs (fecha inicial, fecha final) and a "Consultar" action that fetches facturas from the backend for that range and displays them in a table.

#### Scenario: Successful query
- **WHEN** the user enters a valid fecha inicial and fecha final and activates "Consultar"
- **THEN** the system calls the facturas service with those dates and renders the returned facturas as table rows

#### Scenario: Missing dates
- **WHEN** the user activates "Consultar" without both dates filled in
- **THEN** the system shows a validation error next to the missing field(s) and does not call the backend

#### Scenario: Inverted date range
- **WHEN** the user activates "Consultar" with fecha inicial later than fecha final
- **THEN** the system shows a validation error and does not call the backend

#### Scenario: Backend error
- **WHEN** the facturas service call fails (e.g. the backend is unreachable or returns an error)
- **THEN** the system shows the error to the user and the table is not populated with stale or partial data

#### Scenario: Empty result
- **WHEN** the query succeeds but no facturas match the range
- **THEN** the system shows the table in an empty state rather than an error

### Requirement: Row selection via checkboxes
The system SHALL let the user select individual facturas rows via a checkbox in the first column, independent of the `marca` value returned by the backend (which is always unset).

#### Scenario: Selecting a single row
- **WHEN** the user checks a row's checkbox
- **THEN** that row becomes selected, and other rows' selection state is unchanged

#### Scenario: Deselecting a single row
- **WHEN** the user unchecks a previously selected row's checkbox
- **THEN** that row becomes unselected, and other rows' selection state is unchanged

#### Scenario: New query clears selection
- **WHEN** a new "Consultar" query successfully returns results
- **THEN** any previously selected rows are no longer considered selected

### Requirement: Select-all control
The system SHALL provide a control in the table header to select or deselect all currently loaded rows at once.

#### Scenario: Selecting all
- **WHEN** the user activates the select-all control while not every row is selected
- **THEN** every currently loaded row becomes selected

#### Scenario: Deselecting all
- **WHEN** the user activates the select-all control while every row is selected
- **THEN** every row becomes unselected

#### Scenario: Partial selection indicator
- **WHEN** some but not all currently loaded rows are selected
- **THEN** the select-all control visually reflects a partial (indeterminate) selection state rather than appearing fully checked or fully unchecked

### Requirement: Procesar and Cancelar actions
The system SHALL provide a "Procesar" action gated on having at least one selected row, and a "Cancelar" action that resets the form to its initial state.

#### Scenario: Procesar disabled with no selection
- **WHEN** no row is selected
- **THEN** the "Procesar" action is disabled

#### Scenario: Procesar enabled with a selection
- **WHEN** at least one row is selected
- **THEN** the "Procesar" action is enabled

#### Scenario: Cancelar resets the form
- **WHEN** the user activates "Cancelar"
- **THEN** the date fields are cleared, the results table is emptied, and any row selection is cleared
