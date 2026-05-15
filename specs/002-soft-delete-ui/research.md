# Research: Soft Delete UI Feature

**Feature**: 002-soft-delete-ui
**Date**: 2026-05-15

---

## Decision 1: Trash View Location — Same Page Toggle vs Separate Route

**Decision**: Toggle between active list and trash on the same page using a `showTrash = signal(false)` flag in `HomeComponent`. No new route.

**Rationale**: Spec §Assumptions explicitly states "the trash view is a separate section on the same page (toggle/tab), not a separate route." Constitution §V (YAGNI) — a new route would require lazy-loading setup, a new outlet, and navigation guards, all of which exceed the spec's scope.

**Alternatives considered**:
- Separate route `/trash` → rejected: spec assumption rules it out; adds unnecessary routing complexity

---

## Decision 2: Trash Item Display — New TrashItemComponent vs Reusing TodoItemComponent

**Decision**: Create a new `TrashItemComponent` specifically for the trash view.

**Rationale**: The trash item has a fundamentally different set of actions from an active item. Active items show toggle, edit, delete. Trash items show only restore. Adding a `mode: 'active' | 'trash'` input to `TodoItemComponent` would introduce conditional logic that makes the component harder to understand and test. A dedicated component is simpler, under 200 lines, and follows the single-responsibility principle. Constitution §V (YAGNI) applies here: separating the components avoids hidden conditional complexity.

**Alternatives considered**:
- Add `mode` input to `TodoItemComponent` → rejected: conditional template logic makes the component harder to reason about; violates single responsibility

---

## Decision 3: State Management — Two Signals vs One Filtered Signal

**Decision**: Two separate signals — `todos = signal<TodoResponse[]>([])` (active) and `deletedTodos = signal<TodoResponse[]>([])` (trash). When soft-delete occurs, move the item from `todos` to `deletedTodos` without a second API call.

**Rationale**: Fetching `GET api/todo/deleted` on every delete action is wasteful. Since the deleted item is already in memory, moving it between signals is instant and keeps the UI responsive (SC-001, SC-004). `GET api/todo/deleted` is called once on trash view open (lazy load). Constitution §Angular Constraints: "Local component state first."

**Alternatives considered**:
- Single signal with `deletedAt` filter → rejected: `computed()` would need to re-derive both lists on every change; two signals are clearer and cheaper
- Re-fetch `GET api/todo/deleted` after every delete → rejected: unnecessary network call when the data is already in memory

---

## Decision 4: Delete Flow — Remove window.confirm()

**Decision**: Remove `window.confirm()` from `onDelete()`. The soft-delete action is reversible (user can restore from trash), so a destructive confirmation dialog is no longer necessary.

**Rationale**: FR-001 and FR-002 explicitly require removing the confirm dialog. The action is now reversible — trash replaces the safety net that `confirm()` previously provided.

**Alternatives considered**:
- Keep `confirm()` → rejected: FR-002 explicitly prohibits it; soft delete makes it redundant

---

## Decision 5: Trash Load Strategy — Lazy vs Eager

**Decision**: Load `GET api/todo/deleted` lazily — only when the user opens the trash view for the first time.

**Rationale**: Users who never open trash should not pay the cost of a second API call on page load. SC-003 requires the trash to load within 2 seconds of opening — a lazy load satisfies this. Once loaded, `deletedTodos` is kept in sync locally via signal mutations.

**Alternatives considered**:
- Eager load on `ngOnInit` alongside `getAll()` → rejected: unnecessary on pages where user never opens trash
