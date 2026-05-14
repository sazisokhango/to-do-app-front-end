# Component Contracts: Todo Home Feature

**Feature**: 001-todo-home
**Date**: 2026-05-14

---

## HomeComponent

**Selector**: `app-home`
**Role**: Orchestrator — owns all state, makes all API calls via TodoService, renders child components.

| | |
|---|---|
| **Inputs** | None — fetches its own data on init |
| **Outputs** | None — top-level routed component |

**Responsibilities**:
- Fetch all todos from `TodoService.getAll()` on init
- Hold `signal<TodoResponse[]>` as single source of truth
- Transform flat list → `DateGroup[]` for rendering (see data-model.md)
- Apply active filters before grouping
- Handle create, edit, delete, toggle by calling the relevant service method and updating the signal
- Show/hide `TodoFormComponent` via a boolean flag

---

## TodoItemComponent

**Selector**: `app-todo-item`
**Role**: Presentational — displays one todo, emits user actions upward. No API calls.

| | Type | Description |
|---|---|---|
| **Input** `todo` | `TodoResponse` | The todo to display (required) |
| **Output** `toggled` | `EventEmitter<number>` | Emits todo `id` when toggle is clicked |
| **Output** `editRequested` | `EventEmitter<TodoResponse>` | Emits the full todo when edit is clicked |
| **Output** `deleteRequested` | `EventEmitter<number>` | Emits todo `id` when delete is clicked |

**Responsibilities**:
- Display title, description, priority badge, due date
- Show visual overdue indicator if `dueDate` is past and `completed` is false
- Apply priority colour coding (HIGH=red, MEDIUM=amber, LOW=green)
- Apply completed styling (muted, struck through)

---

## TodoFormComponent

**Selector**: `app-todo-form`
**Role**: Form — handles create and edit mode. No API calls.

| | Type | Description |
|---|---|---|
| **Input** `todo` | `TodoResponse \| null` | `null` = create mode, value = edit mode |
| **Output** `saved` | `EventEmitter<TodoRequest>` | Emits validated form data on submit |
| **Output** `cancelled` | `EventEmitter<void>` | Emits when user cancels |

**Responsibilities**:
- When `todo` is null: render empty form with priority defaulted to MEDIUM
- When `todo` has a value: pre-fill all fields from the todo
- Enforce all validation rules (FR-010, FR-011, FR-012)
- Emit `saved` only when form is valid
- Never call the API directly

---

## Service Contract

### TodoService

**Provided in**: root

| Method | Signature | Description |
|--------|-----------|-------------|
| `getAll` | `(): Observable<TodoResponse[]>` | GET api/todo |
| `create` | `(req: TodoRequest): Observable<TodoResponse>` | POST api/todo |
| `update` | `(id: number, req: TodoRequest): Observable<TodoResponse>` | PUT api/todo/{id} |
| `toggle` | `(id: number): Observable<TodoResponse>` | PATCH api/todo/{id}/toggle |
| `delete` | `(id: number): Observable<void>` | DELETE api/todo/{id} |
