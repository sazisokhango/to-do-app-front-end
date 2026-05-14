# Implementation Plan: Todo Home

**Branch**: `001-todo-home` | **Date**: 2026-05-14 | **Spec**: specs/001-todo-home/spec.md

---

## Summary

Build the Todo Home page as a single Angular 21 standalone SPA. The page fetches all todos from the backend, groups them by due date and status, and provides create/edit/delete/toggle/filter capabilities. All HTTP calls go through `TodoService`. State lives in a component signal. The form is a reusable standalone component rendered as a modal overlay.

---

## Technical Context

| | |
|---|---|
| **Language/Version** | TypeScript, Angular 21 |
| **Primary Dependencies** | Angular 21 standalone, Tailwind CSS v4, Angular ReactiveFormsModule, Angular HttpClient |
| **Storage** | N/A — backend manages persistence |
| **Testing** | Karma + Jasmine (built into Angular) |
| **Target Platform** | Web browser (SPA) |
| **Project Type** | Web application |
| **Performance Goals** | Initial load < 2s (SC-001), filter response immediate (SC-005) |
| **Constraints** | Standalone only, Tailwind only, max 200 lines per component |
| **Scale/Scope** | Single page, simple CRUD, ~10–100 todos |

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec First | ✅ | spec.md exists and is approved |
| II. Standalone Components | ✅ | All components use `standalone: true` (default in Angular 21) |
| III. Tailwind CSS Only | ✅ | No component `.css` files — Tailwind classes only |
| IV. Spec-Driven Testing | ✅ | Each FR-NNN maps to a test case in tasks.md |
| V. Simplicity (YAGNI) | ✅ | No NgRx, no CDK, no extra libraries |
| Project Structure | ✅ | models / services / components only |
| API Contract | ✅ | Service methods match all 5 endpoints exactly |
| Validation Rules | ✅ | Title required/255, due date not past, priority defaults MEDIUM |
| UI Behaviour Rules | ✅ | Grouped by date ascending, incomplete before complete |

---

## Project Structure

```
src/app/
├── models/
│   ├── priority.enum.ts          — Priority type + PRIORITIES array
│   ├── todo-request.model.ts     — TodoRequest interface
│   └── todo-response.model.ts    — TodoResponse interface
├── services/
│   └── todo.service.ts           — All 5 API methods
└── components/
    ├── home/
    │   ├── home.component.ts     — Orchestrator, state, grouping logic
    │   └── home.component.html   — List + filter bar + form trigger
    ├── todo-item/
    │   ├── todo-item.component.ts    — Presentational, emits actions
    │   └── todo-item.component.html  — Card UI
    └── todo-form/
        ├── todo-form.component.ts    — Reactive form, create/edit mode
        └── todo-form.component.html  — Modal overlay UI

proxy.conf.json                   — Dev proxy: /api → backend
src/app/app.routes.ts             — Route '' → HomeComponent
src/app/app.config.ts             — provideHttpClient(), provideRouter()
src/app/app.html                  — <router-outlet>
```

---

## Implementation Phases

### Phase A — Foundation (models + service + config)

Set up the data shapes, HTTP service, Angular providers, and dev proxy. The app must compile and the service must be injectable before any UI is built.

Files:
- `src/app/models/priority.enum.ts`
- `src/app/models/todo-request.model.ts`
- `src/app/models/todo-response.model.ts`
- `src/app/services/todo.service.ts`
- `src/app/app.config.ts` (add `provideHttpClient`)
- `src/app/app.routes.ts` (add route to HomeComponent)
- `src/app/app.html` (replace boilerplate with `<router-outlet>`)
- `proxy.conf.json`
- `angular.json` (reference proxy)

---

### Phase B — TodoFormComponent

Build the form in isolation before the home page. This way it can be verified independently (User Stories 2 and 3).

Files:
- `src/app/components/todo-form/todo-form.component.ts`
- `src/app/components/todo-form/todo-form.component.html`

Key logic:
- `FormBuilder` with `title`, `description`, `priority`, `dueDate` controls
- Custom `notInPast` validator for `dueDate`
- `ngOnInit` patches form values when `todo` input is provided (edit mode)
- `submit()` only emits if `form.valid`, otherwise marks all as touched

---

### Phase C — TodoItemComponent

Build the card that displays a single todo. Purely presentational — no API calls.

Files:
- `src/app/components/todo-item/todo-item.component.ts`
- `src/app/components/todo-item/todo-item.component.html`

Key logic:
- `priorityClasses()` returns Tailwind classes based on priority value
- `isOverdue()` returns true if `dueDate` is past and `completed` is false
- Three outputs: `toggled`, `editRequested`, `deleteRequested`

---

### Phase D — HomeComponent

Wire everything together. This is the most complex component.

Files:
- `src/app/components/home/home.component.ts`
- `src/app/components/home/home.component.html`

Key logic:
- `todos = signal<TodoResponse[]>([])` — single source of truth
- `statusFilter = signal<'all'|'active'|'completed'>('all')`
- `priorityFilter = signal<'all'|Priority>('all')`
- `filteredTodos = computed(...)` — applies both filters to `todos()`
- `groupedTodos = computed(...)` — transforms `filteredTodos()` into `DateGroup[]`
- `onToggle(id)` → calls `todoService.toggle(id)`, updates signal in place
- `onDelete(id)` → `confirm()` → calls `todoService.delete(id)`, removes from signal
- `onSave(request)` → create or update depending on `editingTodo` signal value
- `showForm = signal(false)` — controls modal visibility
- `editingTodo = signal<TodoResponse | null>(null)` — null = create mode

---

## Key Algorithmic Decision — Grouping

```
Input: TodoResponse[] (filtered)

1. Sort by dueDate ascending (nulls last)
2. Group into Map<dueDate, {incomplete[], complete[]}>
3. Within each group, sort incomplete by priority desc (HIGH first)
4. Within each group, sort complete by priority desc (HIGH first)
5. Output: DateGroup[] in date-ascending order
```

This runs as a `computed()` signal — it only recalculates when `filteredTodos` changes.
