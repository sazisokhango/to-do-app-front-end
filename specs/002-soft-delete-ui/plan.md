# Implementation Plan: Soft Delete UI

**Branch**: `feature/soft-delete-ui` | **Date**: 2026-05-15 | **Spec**: specs/002-soft-delete-ui/spec.md

---

## Summary

Extend the existing Todo Home feature with soft-delete behaviour. The Delete button now moves todos to a trash instead of permanently removing them. A trash toggle reveals deleted todos, each with a Restore button. Three files change (model, service, home component + template), and one new component is added (`TrashItemComponent`).

---

## Technical Context

| | |
|---|---|
| **Language/Version** | TypeScript, Angular 21 |
| **Changed files** | `todo-response.model.ts`, `todo.service.ts`, `home.component.ts`, `home.component.html` |
| **New files** | `trash-item.component.ts`, `trash-item.component.html` |
| **Testing** | Karma + Jasmine |
| **Performance** | Trash loaded lazily on first open (SC-003) |
| **Constraints** | Standalone only, Tailwind only, max 200 lines per component |
| **Deferred** | US4 (permanent delete) and US5 (empty trash) — no backend endpoint yet |

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec First | ✅ | spec.md approved, all NEEDS CLARIFICATION resolved |
| II. Standalone Components | ✅ | TrashItemComponent uses standalone pattern |
| III. Tailwind CSS Only | ✅ | No component CSS files |
| IV. Spec-Driven Testing | ✅ | Each FR maps to a test case in tasks.md |
| V. Simplicity (YAGNI) | ✅ | Separate TrashItemComponent avoids conditional complexity; no extra routes |
| VII. Branch-First | ✅ | Branch created before spec was written |
| Project Structure | ✅ | New component under `components/`, no extra folders |
| API Contract | ✅ | Two new service methods match confirmed endpoints exactly |

---

## Files Changed / Created

```
src/app/
├── models/
│   └── todo-response.model.ts        CHANGE — add deletedAt: string | null
├── services/
│   └── todo.service.ts               CHANGE — add getDeleted(), restore()
└── components/
    ├── home/
    │   ├── home.component.ts         CHANGE — new signals, updated onDelete, new onRestore, openTrash/closeTrash
    │   └── home.component.html       CHANGE — trash toggle button, trash view section, TrashItemComponent
    └── trash-item/                   NEW
        ├── trash-item.component.ts
        └── trash-item.component.html
```

---

## Implementation Phases

### Phase A — Model Update

Update `TodoResponse` to include `deletedAt`. This unblocks all other phases.

**File**: `src/app/models/todo-response.model.ts`
**Change**: Add `deletedAt: string | null`

---

### Phase B — Service Update

Add two new methods to `TodoService`. No existing methods change.

**File**: `src/app/services/todo.service.ts`
**Changes**:
- `getDeleted(): Observable<TodoResponse[]>` → `GET api/todo/deleted`
- `restore(id: number): Observable<TodoResponse>` → `PATCH api/todo/{id}/restore`

---

### Phase C — TrashItemComponent (New)

Build the presentational component for the trash view in isolation.

**Files**:
- `src/app/components/trash-item/trash-item.component.ts`
  - `todo = input.required<TodoResponse>()`
  - `restoreRequested = output<number>()`
  - `priorityBadgeClasses()` helper (same logic as TodoItemComponent)
- `src/app/components/trash-item/trash-item.component.html`
  - Card layout: title, priority badge, due date, deleted date
  - Single action: Restore button (emits `restoreRequested`)

---

### Phase D — HomeComponent Logic Update

Update `HomeComponent` class to wire the new state and handlers.

**File**: `src/app/components/home/home.component.ts`

**Changes**:
- Add `deletedTodos = signal<TodoResponse[]>([])`
- Add `showTrash = signal(false)`
- Add `trashLoaded = signal(false)`
- Update `onDelete(id)`:
  - Remove `window.confirm()`
  - On success: remove from `todos`, push to `deletedTodos`
- Add `openTrash()`: set `showTrash(true)`, fetch `getDeleted()` only if `!trashLoaded()`
- Add `closeTrash()`: set `showTrash(false)`
- Add `onRestore(id)`: call `todoService.restore(id)`, on success remove from `deletedTodos`, push back to `todos`
- Add import of `TrashItemComponent`

---

### Phase E — HomeComponent Template Update

Update the template to render the trash view.

**File**: `src/app/components/home/home.component.html`

**Changes**:
- Add "Trash" toggle button in the header (next to "Add Todo")
- Wrap existing active list in `@if (!showTrash())`
- Add `@if (showTrash())` trash section:
  - "Back to list" button calls `closeTrash()`
  - `@if (deletedTodos().length === 0)` empty state: "Your trash is empty"
  - `@for` over `deletedTodos()`, render `<app-trash-item>` with `(restoreRequested)="onRestore($event)"`
- Hide "Add Todo" button when trash is open

---

## Key Behavioural Change — Delete Flow

**Before** (hard delete):
```
click Delete → window.confirm() → DELETE api/todo/{id} → remove from list permanently
```

**After** (soft delete):
```
click Delete → DELETE api/todo/{id} → move item: todos[] → deletedTodos[] (no confirm)
```

The HTTP call is identical. Only the UX and the state mutation change.
