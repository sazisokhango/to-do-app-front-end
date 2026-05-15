# Component Contracts: Soft Delete UI Feature

**Feature**: 002-soft-delete-ui
**Date**: 2026-05-15

---

## Changed Components

### HomeComponent — Updated

New signals and methods added. Existing `onDelete()` updated.

| Addition | Type | Description |
|----------|------|-------------|
| `deletedTodos` | `signal<TodoResponse[]>` | Holds soft-deleted todos (lazy-loaded) |
| `showTrash` | `signal<boolean>` | Controls active/trash view toggle |
| `trashLoaded` | `signal<boolean>` | Tracks whether trash has been fetched |
| `openTrash()` | method | Sets `showTrash(true)`, fetches deleted todos if not yet loaded |
| `closeTrash()` | method | Sets `showTrash(false)` |
| `onDelete(id)` | method (updated) | Removes `window.confirm()`, calls `todoService.delete(id)`, moves item from `todos` to `deletedTodos` |
| `onRestore(id)` | method | Calls `todoService.restore(id)`, moves item from `deletedTodos` back to `todos` |

---

### TodoItemComponent — Unchanged

No changes. Already emits `deleteRequested` — the parent (`HomeComponent`) handles the new behaviour. The component itself does not need to know about soft vs hard delete.

---

## New Components

### TrashItemComponent

**Selector**: `app-trash-item`
**Role**: Presentational — displays one soft-deleted todo in the trash view. No API calls.

| | Type | Description |
|---|---|---|
| **Input** `todo` | `TodoResponse` | The deleted todo to display (required) |
| **Output** `restoreRequested` | `EventEmitter<number>` | Emits todo `id` when restore is clicked |

**Responsibilities**:
- Display title, priority badge (colour-coded), due date, deleted date (`deletedAt`)
- Show a Restore button
- No toggle, no edit, no delete buttons

---

## Service Contract

### TodoService — Updated

Two new methods added:

| Method | Signature | Description |
|--------|-----------|-------------|
| `getDeleted` | `(): Observable<TodoResponse[]>` | GET api/todo/deleted |
| `restore` | `(id: number): Observable<TodoResponse>` | PATCH api/todo/{id}/restore |

All existing methods unchanged.
