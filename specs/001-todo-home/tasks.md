# Tasks: Todo Home

**Feature**: 001-todo-home
**Branch**: `001-todo-home`
**Date**: 2026-05-14
**Spec**: specs/001-todo-home/spec.md
**Plan**: specs/001-todo-home/plan.md

---

## Summary

| | |
|---|---|
| Total tasks | 36 |
| Phase 1 (Setup) | 5 tasks |
| Phase 2 (Foundation) | 4 tasks |
| Phase 3 — US1 View & Group | 7 tasks |
| Phase 4 — US2 Create Todo | 5 tasks |
| Phase 5 — US3 Edit Todo | 3 tasks |
| Phase 6 — US4 Toggle | 2 tasks |
| Phase 7 — US5 Delete | 2 tasks |
| Phase 8 — US6 Filter | 4 tasks |
| Final Phase (Polish) | 4 tasks |
| Parallel opportunities | 14 tasks marked [P] |

**MVP Scope**: Complete Phase 1 + Phase 2 + Phase 3 → app shows a grouped todo list.

---

## Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundation: models + service)
    ↓
Phase 3 (US1: view list)  ← must complete before any other phase
    ↓            ↓
Phase 4 (US2)  Phase 6 (US4: toggle — can start once HomeComponent exists)
    ↓
Phase 5 (US3: edit — needs form from US2)
    ↓
Phase 7 (US5: delete — independent, can run after Phase 3)
Phase 8 (US6: filter — independent, can run after Phase 3)
    ↓
Final Phase (Polish)
```

---

## Phase 1 — Setup

> Configure the app shell, routing, and dev proxy. No feature logic yet.

- [x] T001 Update `src/app/app.config.ts` — add `provideHttpClient()` to providers array
- [x] T002 Update `src/app/app.routes.ts` — add default route `''` pointing to `HomeComponent` (lazy-loaded)
- [x] T003 Replace contents of `src/app/app.html` — remove Angular boilerplate, add only `<router-outlet />`
- [x] T004 Create `proxy.conf.json` at project root — forward `/api` to `http://localhost:8080`
- [x] T005 Update `angular.json` — add `"proxyConfig": "proxy.conf.json"` under `serve > options`

---

## Phase 2 — Foundation (Models + Service)

> Data shapes and HTTP service. Required by every user story. All three model files can be written in parallel.

- [x] T006 [P] Create `src/app/models/priority.enum.ts` — export `Priority` type (`'LOW' | 'MEDIUM' | 'HIGH'`) and `PRIORITIES` array
- [x] T007 [P] Create `src/app/models/todo-request.model.ts` — export `TodoRequest` interface (title, description, priority, dueDate)
- [x] T008 [P] Create `src/app/models/todo-response.model.ts` — export `TodoResponse` interface (id, title, description, completed, priority, dueDate, createdAt, updatedAt)
- [x] T009 Create `src/app/services/todo.service.ts` — implement all 5 methods: `getAll`, `create`, `update`, `toggle`, `delete`

---

## Phase 3 — US1: View All Todos Grouped by Date and Status (P1)

**Story goal**: User opens the app and sees all todos grouped by due date, incomplete before complete.

**Independent test**: Run the app with seeded backend data → verify date headings appear in ascending order with incomplete todos first in each group.

**Spec coverage**: FR-001, FR-002, FR-003, FR-013

- [x] T010 [P] Create folder `src/app/components/home/` and stub `home.component.ts` — standalone component with selector `app-home`, imports `RouterOutlet`
- [x] T011 [P] Create folder `src/app/components/todo-item/` and stub `todo-item.component.ts` — standalone component with selector `app-todo-item`
- [x] T012 [US1] Implement `HomeComponent` state in `src/app/components/home/home.component.ts` — add `todos = signal<TodoResponse[]>([])`, call `todoService.getAll()` in `ngOnInit`, store result in signal
- [x] T013 [US1] Implement `groupedTodos` computed signal in `home.component.ts` — sort by `dueDate` ascending, group into `{ date, incomplete[], complete[] }[]`, sort each group incomplete-first
- [x] T014 [US1] Implement `TodoItemComponent` class in `src/app/components/todo-item/todo-item.component.ts` — `todo` input (required), outputs: `toggled<number>`, `editRequested<TodoResponse>`, `deleteRequested<number>`, helper methods `priorityClasses()` and `isOverdue()`
- [x] T015 [US1] Implement `TodoItemComponent` template in `src/app/components/todo-item/todo-item.component.html` — card layout with title, description, priority badge (colour-coded), due date, overdue warning, edit and delete buttons, toggle button
- [x] T016 [US1] Implement `HomeComponent` template in `src/app/components/home/home.component.html` — page header, `@for` loop over `groupedTodos()`, date heading per group, `@for` over incomplete then complete, `<app-todo-item>` per item, empty state block when `todos()` is empty

---

## Phase 4 — US2: Create a New Todo (P1)

**Story goal**: User clicks "Add Todo", fills in the form, submits, and the new todo appears in the list.

**Independent test**: Click Add Todo → fill valid form → submit → new item appears under correct date group without page reload.

**Spec coverage**: FR-004, FR-010, FR-011, FR-012

- [x] T017 [US2] Create `src/app/components/todo-form/todo-form.component.ts` — standalone component, `todo = input<TodoResponse | null>(null)`, `saved = output<TodoRequest>()`, `cancelled = output<void>()`, `ReactiveFormsModule`, `FormBuilder` with controls: title (required, maxLength 255), description, priority (default 'MEDIUM'), dueDate (required, custom `notInPast` validator)
- [x] T018 [US2] Add `notInPast` validator function in `todo-form.component.ts` — returns `{ pastDate: true }` if selected date is before today
- [x] T019 [US2] Implement `TodoFormComponent` template in `src/app/components/todo-form/todo-form.component.html` — fixed-position modal overlay, form fields for all four controls, inline error messages per validation rule, Cancel and Submit buttons
- [x] T020 [US2] Wire create flow into `home.component.ts` — add `showForm = signal(false)`, `editingTodo = signal<TodoResponse | null>(null)`, `openCreate()` method sets both, `onSave(request)` calls `todoService.create()` then pushes result into `todos` signal and closes form
- [x] T021 [US2] Wire form into `home.component.html` — "Add Todo" button calls `openCreate()`, `@if (showForm())` renders `<app-todo-form>` passing `[todo]="editingTodo()"`, handle `(saved)` and `(cancelled)` outputs

---

## Phase 5 — US3: Edit an Existing Todo (P1)

**Story goal**: User clicks Edit on a todo, sees the form pre-filled, changes a value, saves, and the list updates.

**Independent test**: Click Edit on a todo → verify all fields are pre-filled → change due date → save → todo appears under new date group.

**Spec coverage**: FR-005, FR-010, FR-011

- [x] T022 [US3] Extend `TodoFormComponent` for edit mode in `todo-form.component.ts` — in `ngOnInit`, if `todo()` is not null call `form.patchValue()` with existing title, description, priority, dueDate
- [x] T023 [US3] Wire edit flow into `home.component.ts` — add `openEdit(todo: TodoResponse)` method that sets `editingTodo` signal and `showForm` to true; extend `onSave()` to call `todoService.update(id, request)` when `editingTodo()` is not null, then replace the item in the `todos` signal
- [x] T024 [US3] Wire `editRequested` output in `home.component.html` — `(editRequested)="openEdit($event)"` on `<app-todo-item>`

---

## Phase 6 — US4: Toggle Todo Completion (P1)

**Story goal**: User clicks the toggle circle on a todo; it moves between incomplete and complete sections instantly.

**Independent test**: Click toggle on an incomplete todo → it appears in the complete section. Click again → returns to incomplete section.

**Spec coverage**: FR-007, SC-003

- [x] T025 [P] [US4] Implement `onToggle(id: number)` in `home.component.ts` — call `todoService.toggle(id)`, on success replace the matching todo in the `todos` signal with the updated response
- [x] T026 [P] [US4] Wire `toggled` output in `home.component.html` — `(toggled)="onToggle($event)"` on `<app-todo-item>`

---

## Phase 7 — US5: Delete a Todo (P2)

**Story goal**: User clicks Delete, confirms via browser dialog, and the todo disappears from the list.

**Independent test**: Click Delete → confirm → item is removed from list. Click Delete → cancel → item remains.

**Spec coverage**: FR-006

- [x] T027 [P] [US5] Implement `onDelete(id: number)` in `home.component.ts` — call `window.confirm('Delete this todo?')`, if confirmed call `todoService.delete(id)`, on success remove the item from the `todos` signal by filtering it out
- [x] T028 [P] [US5] Wire `deleteRequested` output in `home.component.html` — `(deleteRequested)="onDelete($event)"` on `<app-todo-item>`

---

## Phase 8 — US6: Filter Todos (P2)

**Story goal**: User selects a status or priority filter; the list narrows immediately with no page reload.

**Independent test**: Select "Active" filter → only incomplete todos shown. Select "HIGH" priority → only HIGH priority todos shown. Reset to "All" → full list returns.

**Spec coverage**: FR-008, FR-009, SC-005

- [x] T029 [US6] Add filter signals in `home.component.ts` — `statusFilter = signal<'all' | 'active' | 'completed'>('all')`, `priorityFilter = signal<'all' | Priority>('all')`
- [x] T030 [US6] Implement `filteredTodos = computed(...)` in `home.component.ts` — filters `todos()` by both `statusFilter()` and `priorityFilter()`; update `groupedTodos` to use `filteredTodos()` instead of `todos()`
- [x] T031 [US6] Add filter bar to `home.component.html` — status buttons (All / Active / Completed) and priority buttons (All / LOW / MEDIUM / HIGH), active filter highlighted, clicking updates the corresponding signal
- [x] T032 [US6] Verify filter resets correctly — ensure "Add Todo" and "Edit Todo" do not break active filter state (no additional code if signals already reactive)

---

## Final Phase — Polish & Cross-Cutting Concerns

> Applied after all user stories are complete.

- [x] T033 Add API error handling to `home.component.ts` — wrap `todoService.getAll()` in error handler, set `error = signal<string | null>(null)`, display error message in `home.component.html` (FR-014)
- [x] T034 Add overdue styling to `todo-item.component.html` — show red warning icon and "Overdue" label when `isOverdue()` returns true
- [x] T035 Add priority colour-coded left border to todo card in `todo-item.component.html` — HIGH=red, MEDIUM=amber, LOW=green border-left
- [x] T036 Run `ng build --configuration production` — fix any TypeScript or build errors until the command exits with code 0 (constitution quality gate)
