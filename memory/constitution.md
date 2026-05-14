# To-Do Front-End Constitution

## Core Principles

### I. Specification First (NON-NEGOTIABLE)
Every feature begins with a spec in `specs/`. No code is written without an approved spec.md and plan.md. The spec is the source of truth; code is its generated expression.

### II. Angular Standalone Components
All Angular components, directives, and pipes MUST use the standalone pattern. No NgModules. Each component is self-contained and independently testable.

### III. Tailwind CSS Only
Styling is done exclusively via Tailwind CSS utility classes. No custom CSS files per component. Global styles only in `src/styles.css`. No inline `style` attributes.

### IV. Spec-Driven Testing
Tests derive from acceptance scenarios in the spec. Test descriptions mirror spec language. Every functional requirement (FR-NNN) must have at least one corresponding test.

### V. Simplicity (YAGNI)
Start simple. No premature abstraction. Three similar lines are better than a premature helper. No half-finished implementations. Features not in the spec are out of scope.

### VI. SDD Workflow Order
The mandatory sequence for every feature:
1. Create a feature branch: `git checkout -b {NNN}-{feature-name}`
2. `/speckit.specify` — write the spec
3. Review and approve spec
4. `/speckit.plan` — create implementation plan
5. Review and approve plan
6. `/speckit.tasks` — generate task list
7. `/speckit.implement` — implement tasks
8. `/speckit.checklist` — verify completion
9. Open a Pull Request — `main` is never committed to directly

### VII. Branch-First (NON-NEGOTIABLE)
A feature branch MUST be created before any spec, plan, or code is written. No commits may be made directly to `main`. Branch names follow the pattern `{NNN}-{feature-name}` matching the spec folder (e.g. `001-todo-home`). `main` receives code only via merged Pull Requests.

---

## Angular Constraints

- **Angular version**: 21 (standalone)
- **Node version**: 20 LTS
- **Package manager**: npm
- **Stylesheet**: CSS with Tailwind v4
- **Routing**: Angular Router (lazy-loaded routes per feature)
- **State**: Local component state first; use services for shared state only when the spec requires it
- **HTTP**: Angular `HttpClient` with typed interfaces

## Project Structure (NON-NEGOTIABLE)

All source code lives under `src/app/` and is organised into exactly three folders:

```
src/app/
├── models/       — interfaces and enums only, no logic
├── services/     — all HTTP and business logic, no UI
└── components/   — standalone Angular components, no direct HTTP calls
```

No additional top-level folders may be created without a constitution amendment.

## Domain Constants

### Priority
Valid values: `LOW | MEDIUM | HIGH`
Default when omitted: `MEDIUM`

## API Contract

Base path: `api/todo` (proxied in development via `proxy.conf.json`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `api/todo` | Fetch all todos |
| POST | `api/todo` | Create todo |
| PUT | `api/todo/{id}` | Update todo |
| PATCH | `api/todo/{id}/toggle` | Toggle completed status |
| DELETE | `api/todo/{id}` | Delete todo |

### TodoRequest shape (POST / PUT)
```json
{ "title": "", "description": "", "priority": "MEDIUM", "dueDate": "YYYY-MM-DD" }
```

### TodoResponse shape (all GET responses)
```json
{ "id": 0, "title": "", "description": "", "completed": false, "priority": "MEDIUM",
  "dueDate": "YYYY-MM-DD", "createdAt": "", "updatedAt": "" }
```

## Validation Rules (NON-NEGOTIABLE)

These apply to every feature that creates or edits a todo:

- **Title**: required, maximum 255 characters
- **Priority**: optional — MUST default to `MEDIUM` when omitted
- **Due Date**: required, MUST NOT be a past date

## UI Behaviour Rules

- The home view MUST group todos by **due date** (ascending) and within each date by **status** (incomplete first, complete last)
- Filtering supports: status (`all / active / completed`) and priority (`all / LOW / MEDIUM / HIGH`)

## Quality Gates

- All specs pass the specification quality checklist before planning
- All acceptance scenarios become Karma/Jasmine tests
- No component has more than 200 lines of TypeScript
- No inline styles — Tailwind classes only
- `ng build --configuration production` must succeed before any merge

## Governance

This constitution supersedes all other practices. Amendments require updating this file with rationale and date. All feature branches must be spec-compliant before merge.

**Version**: 1.2.0 | **Ratified**: 2026-05-14 | **Last Amended**: 2026-05-14
