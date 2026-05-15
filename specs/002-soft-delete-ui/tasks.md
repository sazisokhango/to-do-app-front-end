# Tasks: Soft Delete UI

**Feature**: 002-soft-delete-ui
**Branch**: `feature/soft-delete-ui`
**Date**: 2026-05-15
**Spec**: specs/002-soft-delete-ui/spec.md
**Plan**: specs/002-soft-delete-ui/plan.md

---

## Summary

| | |
|---|---|
| Total tasks | 15 |
| Phase 1 (Foundation) | 2 tasks |
| Phase 2 — US1 Soft Delete | 2 tasks |
| Phase 3 — US2 Trash View | 5 tasks |
| Phase 4 — US3 Restore | 2 tasks |
| Final Phase (Polish) | 4 tasks |
| Deferred | US4 (permanent delete), US5 (empty trash) — no backend endpoint |
| Parallel opportunities | 4 tasks marked [P] |

**MVP Scope**: Phase 1 + Phase 2 → delete button soft-deletes, item disappears from list.

---

## Dependencies

```
Phase 1 (Foundation: model + service)
    ↓
Phase 2 (US1: soft delete — onDelete updated)
    ↓            ↓
Phase 3 (US2)  Phase 4 (US3: restore — needs US2 trash view to exist)
    ↓
Final Phase (Polish)
```

---

## Phase 1 — Foundation

> Model and service changes that all other phases depend on. Must complete first.

- [ ] T001 Update `src/app/models/todo-response.model.ts` — add `deletedAt: string | null` as the last field of the `TodoResponse` interface
- [ ] T002 Update `src/app/services/todo.service.ts` — add two methods: `getDeleted(): Observable<TodoResponse[]>` calling `GET api/todo/deleted` and `restore(id: number): Observable<TodoResponse>` calling `PATCH api/todo/{id}/restore`

---

## Phase 2 — US1: Soft Delete a Todo (P1)

**Story goal**: User clicks Delete on a todo — no confirm dialog — item disappears from the active list and lands in the deleted signal.

**Independent test**: Click Delete on a todo → verify it disappears from the main list immediately with no confirm dialog.

**Spec coverage**: FR-001, FR-002, FR-003

- [ ] T003 [US1] Update `onDelete(id: number)` in `src/app/components/home/home.component.ts` — remove `window.confirm()`, on success remove item from `todos` signal by filtering, push item to `deletedTodos` signal
- [ ] T004 [US1] Add `deletedTodos = signal<TodoResponse[]>([])`, `showTrash = signal(false)`, and `trashLoaded = signal(false)` to `src/app/components/home/home.component.ts`

---

## Phase 3 — US2: View Deleted Todos in Trash (P1)

**Story goal**: User opens the trash view and sees all soft-deleted todos with title, priority, due date, and deleted date.

**Independent test**: Soft-delete two todos → click Trash → verify both appear. Click Back → verify main list is shown.

**Spec coverage**: FR-004, FR-005, FR-010

- [ ] T005 [P] [US2] Create `src/app/components/trash-item/trash-item.component.ts` — standalone component, `todo = input.required<TodoResponse>()`, `restoreRequested = output<number>()`, `priorityBadgeClasses()` helper method
- [ ] T006 [P] [US2] Create `src/app/components/trash-item/trash-item.component.html` — card layout showing title, priority badge (colour-coded), due date, deleted date (`deletedAt`), and a single Restore button that emits `restoreRequested`
- [ ] T007 [US2] Add `openTrash()` and `closeTrash()` methods to `src/app/components/home/home.component.ts` — `openTrash()` sets `showTrash(true)` and calls `todoService.getDeleted()` only when `!trashLoaded()`, storing result in `deletedTodos` signal and setting `trashLoaded(true)`; `closeTrash()` sets `showTrash(false)`
- [ ] T008 [US2] Import `TrashItemComponent` in `src/app/components/home/home.component.ts` — add to `imports` array
- [ ] T009 [US2] Update `src/app/components/home/home.component.html` — add Trash button to header (hidden when `showTrash()` is true), wrap active list in `@if (!showTrash())`, add `@if (showTrash())` trash section with Back button, empty state ("Your trash is empty"), and `@for` over `deletedTodos()` rendering `<app-trash-item>`

---

## Phase 4 — US3: Restore a Todo (P1)

**Story goal**: User clicks Restore on a trash item — it disappears from trash and reappears in the active list under its correct date group.

**Independent test**: Open trash → click Restore on an item → verify it leaves trash and reappears in main list with original values.

**Spec coverage**: FR-006, FR-007

- [ ] T010 [US3] Add `onRestore(id: number)` to `src/app/components/home/home.component.ts` — call `todoService.restore(id)`, on success remove item from `deletedTodos` signal by filtering, push returned item into `todos` signal
- [ ] T011 [US3] Wire `(restoreRequested)="onRestore($event)"` on `<app-trash-item>` in `src/app/components/home/home.component.html`

---

## Final Phase — Polish & Cross-Cutting Concerns

> Applied after all user stories are complete.

- [ ] T012 Hide "Add Todo" button in `home.component.html` when `showTrash()` is true — use `@if (!showTrash())` around the Add Todo button
- [ ] T013 Add error handling for `getDeleted()` in `home.component.ts` — on error set `error` signal with "Failed to load trash." (FR-011)
- [ ] T014 Add error handling for `onRestore()` in `home.component.ts` — on error set `error` signal with "Failed to restore todo." (FR-011)
- [ ] T015 Run `ng build --configuration production` — fix any TypeScript or build errors until the command exits with code 0 (constitution quality gate)
