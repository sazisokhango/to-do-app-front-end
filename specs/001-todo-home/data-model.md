# Data Model: Todo Home Feature

**Feature**: 001-todo-home
**Date**: 2026-05-14

---

## Entities

### Priority (Enum)

```
LOW | MEDIUM | HIGH
```

- Default: `MEDIUM`
- Source: constitution §Domain Constants

---

### TodoRequest

Sent to the backend when creating (POST) or updating (PUT) a todo.

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | string | YES | max 255 characters |
| description | string | NO | free text |
| priority | Priority | NO | defaults to MEDIUM |
| dueDate | string | YES | format YYYY-MM-DD, must not be past |

---

### TodoResponse

Received from the backend on every GET response.

| Field | Type | Notes |
|-------|------|-------|
| id | number | unique identifier |
| title | string | |
| description | string | |
| completed | boolean | false = incomplete, true = complete |
| priority | Priority | LOW / MEDIUM / HIGH |
| dueDate | string | YYYY-MM-DD |
| createdAt | string | ISO 8601 datetime |
| updatedAt | string | ISO 8601 datetime |

---

## State Transitions

```
Todo lifecycle:

  [Created]  →  completed: false
       ↓  toggle
  [Completed]  →  completed: true
       ↓  toggle
  [Created]  →  completed: false
```

---

## Derived UI Shape (component only — never sent to API)

The home component transforms the flat `TodoResponse[]` into a grouped structure for rendering:

```
DateGroup[]
  ├── date: string           (YYYY-MM-DD)
  ├── incomplete: TodoResponse[]   (sorted by priority: HIGH → MEDIUM → LOW)
  └── complete: TodoResponse[]     (sorted by priority: HIGH → MEDIUM → LOW)
```

This is a pure in-memory transformation. It is never persisted or sent to the backend.

---

## Validation Rules (from constitution)

| Field | Rule | Error Message |
|-------|------|---------------|
| title | required | "Title is required" |
| title | max 255 chars | "Title cannot exceed 255 characters" |
| dueDate | required | "Due date is required" |
| dueDate | not in past | "Due date cannot be in the past" |
| priority | defaults to MEDIUM | (no error — silent default) |
