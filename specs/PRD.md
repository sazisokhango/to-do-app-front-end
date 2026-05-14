# To-Do Application — Product Requirements Document

## Overview

A front-end Angular application for managing To-Do items. Users can create, view, update, and delete tasks. Items are displayed grouped by due date and completion status.

## Technology

- Angular 20+
- Tailwind CSS

## Project Structure

```
src/app/
├── models/       — data interfaces and enums
├── services/     — API communication
└── components/   — UI components
```

## Features

### Home View
- Show all existing to-do items
- Group by due date and by status (complete / incomplete)
- Allow creation, edit, delete, and filter

### Create Todo
- Form with title, description, priority, due date
- POST to api/todo

### Edit Todo
- Pre-filled form with existing values
- PUT to api/todo/{id}

### Delete Todo
- Remove item from the list
- DELETE to api/todo/{id}

### Toggle Status
- Mark complete/incomplete
- PATCH to api/todo/{id}/toggle

### Filter
- Filter by status (all / active / completed)
- Filter by priority (all / LOW / MEDIUM / HIGH)

## API Contracts

### TodoRequest (POST / PUT body)
```json
{
  "title": "Example",
  "description": "Example description",
  "priority": "MEDIUM",
  "dueDate": "2026-05-20"
}
```

### TodoResponse (GET response items)
```json
{
  "id": 1,
  "title": "Example",
  "description": "Example",
  "completed": false,
  "priority": "MEDIUM",
  "dueDate": "2026-05-20",
  "createdAt": "2026-05-12T10:30:00",
  "updatedAt": "2026-05-12T10:30:00"
}
```

### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | api/todo | Fetch all todos |
| POST | api/todo | Create new todo |
| PUT | api/todo/{id} | Update todo |
| PATCH | api/todo/{id}/toggle | Toggle completed status |
| DELETE | api/todo/{id} | Delete todo |

## Validation Rules
- **Title**: required, max 255 characters
- **Priority**: optional, defaults to MEDIUM
- **Due Date**: required, must not be in the past
