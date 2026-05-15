# Data Model: Soft Delete UI Feature

**Feature**: 002-soft-delete-ui
**Date**: 2026-05-15

---

## Model Changes

### TodoResponse — Updated

One field added to the existing interface:

| Field | Type | Change | Notes |
|-------|------|--------|-------|
| id | number | unchanged | |
| title | string | unchanged | |
| description | string | unchanged | |
| completed | boolean | unchanged | |
| priority | Priority | unchanged | |
| dueDate | string | unchanged | YYYY-MM-DD |
| createdAt | string | unchanged | ISO 8601 |
| updatedAt | string | unchanged | ISO 8601 |
| **deletedAt** | `string \| null` | **NEW** | `null` = active, ISO 8601 datetime = soft-deleted |

---

## State Shape (component — never sent to API)

`HomeComponent` holds two separate signals:

```
todos: TodoResponse[]          — active todos (deletedAt = null)
deletedTodos: TodoResponse[]   — trash todos (deletedAt = string)
```

### Transitions

```
[Active list]  →  delete button clicked  →  [Trash]
                  DELETE api/todo/{id}
                  move item: todos → deletedTodos

[Trash]        →  restore clicked        →  [Active list]
                  PATCH api/todo/{id}/restore
                  move item: deletedTodos → todos
```

---

## No New Request Shapes

- Soft delete: `DELETE api/todo/{id}` — no request body
- Restore: `PATCH api/todo/{id}/restore` — no request body
- Fetch deleted: `GET api/todo/deleted` — no request body

`TodoRequest` is unchanged.
