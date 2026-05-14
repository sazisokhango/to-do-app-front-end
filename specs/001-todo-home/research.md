# Research: Todo Home Feature

**Feature**: 001-todo-home
**Date**: 2026-05-14

---

## Decision 1: Grouping Logic Location

**Decision**: Group and sort todos inside the component, not in the service.

**Rationale**: The service's job is HTTP communication only (constitution §Project Structure). Grouping is a UI concern — it belongs in the component. This also keeps the service reusable if another component ever needs the raw flat list.

**Alternatives considered**:
- Grouping in the service → rejected: violates constitution (services = HTTP and business logic, not presentation logic)
- Using a pipe → rejected: YAGNI — one component uses this, a pipe adds unnecessary abstraction

---

## Decision 2: Filtering Strategy (Client-side vs Server-side)

**Decision**: Filter client-side from the already-fetched array.

**Rationale**: The API does not support query parameters for filtering (spec Assumption). Fetching once and filtering in memory satisfies SC-005 (immediate filter response, no reload). The dataset is small (todo lists are not paginated at this scale).

**Alternatives considered**:
- Server-side filtering with query params → rejected: API does not support it
- RxJS operators on a stream → deferred: current scale does not require reactive streams

---

## Decision 3: Form Modal Strategy

**Decision**: Use a boolean flag in the home component to show/hide the form overlay. No Angular CDK Dialog.

**Rationale**: The spec requires a form for create and edit. A simple `*ngIf`/`@if` on a fixed-position overlay achieves this without adding a dependency. Constitution §V (Simplicity / YAGNI) — we do not introduce CDK for what a boolean can solve.

**Alternatives considered**:
- Angular CDK Dialog → rejected: adds dependency, unnecessary for a single modal
- Separate route for create/edit → rejected: spec §Assumptions says single-page, no multi-page routing needed

---

## Decision 4: Form Implementation

**Decision**: Angular `ReactiveFormsModule` with `FormBuilder` and custom validators.

**Rationale**: Reactive Forms give us programmatic control over validation state — required for the three validation rules (title required/max length, due date not in past). Template-driven forms cannot cleanly support the custom `notInPast` validator.

**Alternatives considered**:
- Template-driven forms → rejected: cannot cleanly add custom async/sync validators
- Third-party form library → rejected: YAGNI

---

## Decision 5: State Management

**Decision**: Component-level `signal<TodoResponse[]>` for the todos array. No NgRx, no shared service state.

**Rationale**: The spec has one page. All operations (create, edit, delete, toggle) happen on the same component. Local signals are sufficient. Constitution §Angular Constraints: "Local component state first; use services for shared state only when the spec requires it."

**Alternatives considered**:
- NgRx store → rejected: single page, no cross-component state sharing required
- BehaviorSubject in service → rejected: overkill for this scope

---

## Decision 6: Delete Confirmation

**Decision**: Browser-native `window.confirm()` dialog.

**Rationale**: Spec §Assumptions explicitly states "browser-native `confirm()` dialog for simplicity in this iteration." No custom confirm modal needed.

---

## Decision 7: Dev Proxy

**Decision**: `proxy.conf.json` configured to forward `/api` to the backend.

**Rationale**: The API base path is `api/todo` (relative). During development the Angular dev server runs on a different port from the backend. A proxy avoids CORS issues without changing the production code.

**Alternatives considered**:
- Absolute URL with environment files → deferred: adds complexity, proxy is simpler for development
