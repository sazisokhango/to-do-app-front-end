# Feature Specification: Soft Delete UI

**Feature Branch**: `feature/soft-delete-ui`

**Created**: 2026-05-15

**Status**: Draft

**Input**: User description: "implement soft delete UI — show deleted tasks in a trash view, allow restore, update delete button behaviour"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Soft Delete a Todo (Priority: P1)

A user clicks the delete button on a todo and instead of it being permanently removed, it is moved to a trash area. The item disappears from the main list but is not gone forever.

**Why this priority**: This is the core behaviour change — without it, the trash view and restore have nothing to work with.

**Independent Test**: Click the delete button on a todo. Verify the item disappears from the main list and appears in the trash view.

**Acceptance Scenarios**:

1. **Given** a user clicks Delete on a todo, **When** the action completes, **Then** the todo is removed from the main list without a browser confirm dialog.
2. **Given** a todo is soft-deleted, **When** the user opens the trash view, **Then** the deleted todo appears there.
3. **Given** a todo is soft-deleted, **When** the user views the main list, **Then** the deleted todo does not appear — even if filters are set to "All".
4. **Given** the delete action fails (API error), **When** the error occurs, **Then** the todo remains in the main list and an error message is shown.

---

### User Story 2 — View Deleted Todos in a Trash View (Priority: P1)

A user wants to see all items they have deleted so they can decide whether to restore or permanently remove them.

**Why this priority**: Without the trash view, soft-deleted items are invisible — the feature has no value.

**Independent Test**: Soft-delete two todos. Open the trash view. Verify both appear with their original title, priority, and due date.

**Acceptance Scenarios**:

1. **Given** the user navigates to the trash view, **When** it loads, **Then** all soft-deleted todos are shown with their title, priority, and due date.
2. **Given** there are no soft-deleted todos, **When** the user opens the trash view, **Then** an empty state message is shown ("Your trash is empty").
3. **Given** the user is on the trash view, **When** they navigate back to the main list, **Then** the main list shows only active (non-deleted) todos.

---

### User Story 3 — Restore a Deleted Todo (Priority: P1)

A user realises they deleted a todo by mistake and wants to bring it back to the active list.

**Why this priority**: Restore is the primary reason soft delete exists — without it, the feature adds no value over hard delete.

**Independent Test**: Soft-delete a todo. Open trash. Click Restore. Verify the todo reappears in the main list under its original date group.

**Acceptance Scenarios**:

1. **Given** a todo is in the trash, **When** the user clicks Restore, **Then** the todo disappears from the trash and reappears in the main list under its correct date group.
2. **Given** a restored todo, **When** it appears in the main list, **Then** its title, description, priority, due date, and completion status are unchanged.
3. **Given** the restore action fails (API error), **When** the error occurs, **Then** the todo remains in the trash and an error message is shown.

---

### User Story 4 — Permanently Delete a Todo from Trash (Priority: P2)

A user wants to permanently remove a specific todo from the trash — it should be gone for good.

**Why this priority**: Important for privacy and cleanliness, but the app works without it (items can stay in trash indefinitely).

**Independent Test**: Soft-delete a todo. Open trash. Click Permanent Delete. Confirm. Verify the todo no longer appears in trash or the main list.

**Acceptance Scenarios**:

1. **Given** a todo is in the trash, **When** the user clicks Permanent Delete and confirms, **Then** the todo is removed from the trash permanently.
2. **Given** the user clicks Permanent Delete and cancels the confirmation, **When** the dialog closes, **Then** the todo remains in the trash.

---

### User Story 5 — Empty Trash (Priority: P3)

A user wants to permanently remove all deleted todos in one action.

**Why this priority**: Convenience feature — lower priority than individual permanent delete.

**Independent Test**: Add three todos to trash. Click "Empty Trash". Verify the trash is empty.

**Acceptance Scenarios**:

1. **Given** the trash has items, **When** the user clicks "Empty Trash" and confirms, **Then** all items are permanently deleted and the empty state is shown.
2. **Given** the trash is already empty, **When** the user views the trash, **Then** the "Empty Trash" button is disabled or hidden.

---

### Edge Cases

- What if the user soft-deletes a todo that is currently being edited? → The form closes and the todo moves to trash.
- What if a completed todo is soft-deleted? → It appears in trash with its completed status preserved.
- What if the trash view API call fails? → An error message is shown; no partial state is displayed.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Delete button MUST soft-delete a todo (move to trash), not permanently remove it.
- **FR-002**: The browser `confirm()` dialog MUST be removed from the delete flow.
- **FR-003**: Soft-deleted todos MUST NOT appear in the main list under any filter.
- **FR-004**: The system MUST provide a trash view showing all soft-deleted todos.
- **FR-005**: The trash view MUST show each deleted todo's title, priority, and due date.
- **FR-006**: The system MUST allow users to restore a todo from trash to the active list.
- **FR-007**: A restored todo MUST appear in the main list with all original values intact.
- **FR-008**: The system MUST allow users to permanently delete a single todo from the trash.
- **FR-009**: Permanent delete MUST require a confirmation step.
- **FR-010**: The system MUST show an empty state when the trash contains no items.
- **FR-011**: The system MUST show an error message when any trash API action fails.
- **FR-012**: The system MUST provide an "Empty Trash" action to permanently delete all trash items (P3).

### Key Entities

- **Deleted Todo**: A todo that has been soft-deleted — same shape as `TodoResponse` but with `deletedAt` set to a datetime string instead of `null`. Excluded from the main active list.
- **deletedAt**: A new field on `TodoResponse`. `null` = active todo. ISO 8601 datetime string = soft-deleted todo, indicating when it was deleted.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can soft-delete a todo in a single click (no confirm dialog).
- **SC-002**: A user can restore a deleted todo in a single click from the trash view.
- **SC-003**: The trash view loads all deleted todos within 2 seconds of opening.
- **SC-004**: 100% of soft-deleted todos are hidden from the main list immediately after deletion.
- **SC-005**: A user can permanently delete a single item from trash with one click and one confirmation.

---

## Assumptions

- **Soft delete**: `DELETE api/todo/{id}` — existing endpoint, now soft-deletes instead of hard-deletes. No frontend change to the HTTP call, only to the UX (no confirm dialog).
- **Fetch deleted todos**: `GET api/todo/deleted` — new endpoint, returns all soft-deleted todos.
- **Restore**: `PATCH api/todo/{id}/restore` — new endpoint, moves a todo back to the active list.
- **Permanent delete / empty trash**: no backend endpoint confirmed — US4 (permanent delete) and US5 (empty trash) are deferred until the backend provides these endpoints.
- The trash view is a separate section on the same page (toggle/tab), not a separate route.
- Authentication is out of scope — all users share the same trash.
