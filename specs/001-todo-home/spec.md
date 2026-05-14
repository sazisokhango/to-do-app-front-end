# Feature Specification: Todo Home

**Feature Branch**: `001-todo-home`

**Created**: 2026-05-14

**Status**: Draft

**Input**: User description: "Home view showing all todo items grouped by date and status, with the ability to create, edit, delete, toggle completion, and filter todos."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — View All Todos Grouped by Date and Status (Priority: P1)

A user opens the app and immediately sees all their existing todo items organised by due date. Within each date, incomplete items appear first, followed by completed items.

**Why this priority**: This is the core purpose of the app — if a user cannot see their todos, nothing else matters.

**Independent Test**: Open the app with existing todos in the system. Verify that items are grouped under their due date headings, with incomplete items listed before completed ones within each group.

**Acceptance Scenarios**:

1. **Given** the system has todos with different due dates, **When** the user opens the home page, **Then** todos are displayed under their respective due date headings in ascending date order.
2. **Given** a due date group has both complete and incomplete todos, **When** the user views that group, **Then** incomplete todos appear before completed todos.
3. **Given** a todo is marked as completed, **When** the user views the list, **Then** the completed todo is visually distinct (e.g. muted, struck through) from incomplete todos.
4. **Given** there are no todos in the system, **When** the user opens the home page, **Then** an empty state message is shown prompting the user to create their first todo.

---

### User Story 2 — Create a New Todo (Priority: P1)

A user wants to add a new task. They fill in the title, an optional description, a priority level, and a due date, then submit the form.

**Why this priority**: Without the ability to create todos the app has no value.

**Independent Test**: Submit the create form with valid data and verify the new item appears in the list under the correct date group.

**Acceptance Scenarios**:

1. **Given** the user clicks "Add Todo", **When** the form opens, **Then** priority defaults to MEDIUM and all other fields are empty.
2. **Given** the user submits a valid form, **When** the request succeeds, **Then** the new todo appears in the list under its due date group without a page reload.
3. **Given** the user leaves the title blank and submits, **When** validation runs, **Then** an error message "Title is required" is shown and the form is not submitted.
4. **Given** the user enters more than 255 characters in the title, **When** validation runs, **Then** an error message is shown and the form is not submitted.
5. **Given** the user picks a due date in the past, **When** validation runs, **Then** an error message "Due date cannot be in the past" is shown and the form is not submitted.
6. **Given** the user clicks Cancel, **When** the form closes, **Then** no todo is created and the list is unchanged.

---

### User Story 3 — Edit an Existing Todo (Priority: P1)

A user realises a todo needs updating — the title, description, priority, or due date has changed.

**Why this priority**: Tasks change; users must be able to keep their list accurate.

**Independent Test**: Open an existing todo for editing, change one field, save, and verify the updated values appear in the list.

**Acceptance Scenarios**:

1. **Given** the user clicks Edit on a todo, **When** the form opens, **Then** all existing values are pre-filled.
2. **Given** the user changes the due date and saves, **When** the request succeeds, **Then** the todo moves to the correct new date group in the list.
3. **Given** the user clears the title and tries to save, **When** validation runs, **Then** an error is shown and the todo is not updated.

---

### User Story 4 — Toggle Todo Completion (Priority: P1)

A user completes a task and wants to mark it done, or realises a "completed" item needs to be reopened.

**Why this priority**: Status tracking is a core feature of any todo app.

**Independent Test**: Click the toggle on an incomplete todo and verify it moves to the completed section of its date group.

**Acceptance Scenarios**:

1. **Given** a todo is incomplete, **When** the user toggles it, **Then** it moves to the completed section of its date group.
2. **Given** a todo is complete, **When** the user toggles it, **Then** it moves back to the incomplete section.

---

### User Story 5 — Delete a Todo (Priority: P2)

A user wants to permanently remove a todo that is no longer relevant.

**Why this priority**: Important for keeping the list clean, but the app still works without it.

**Independent Test**: Delete a todo and verify it is removed from the list.

**Acceptance Scenarios**:

1. **Given** the user clicks Delete on a todo, **When** the user confirms, **Then** the todo is removed from the list.
2. **Given** the user clicks Delete and then cancels the confirmation, **When** the dialog closes, **Then** the todo remains in the list.

---

### User Story 6 — Filter Todos (Priority: P2)

A user wants to narrow down the list to focus on specific items — e.g. only high-priority incomplete tasks.

**Why this priority**: Useful for productivity but the app functions without it.

**Independent Test**: Apply a status filter of "Active" and verify only incomplete todos are shown.

**Acceptance Scenarios**:

1. **Given** the user selects the "Completed" status filter, **When** the filter applies, **Then** only completed todos are shown.
2. **Given** the user selects the "Active" status filter, **When** the filter applies, **Then** only incomplete todos are shown.
3. **Given** the user selects "HIGH" priority filter, **When** the filter applies, **Then** only HIGH priority todos are shown.
4. **Given** filters are active, **When** the user resets to "All", **Then** the full list is shown again.
5. **Given** filters are active, **When** the user creates or edits a todo that does not match the active filter, **Then** it does not appear in the filtered list.

---

### Edge Cases

- What happens when the API is unavailable? → A user-friendly error message is displayed; the list is not cleared.
- What happens when a todo has no due date set by the server? → It should appear under an "No due date" group at the end.
- What happens when two todos share the same due date? → They appear in the same date group.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display all todo items on the home page on load.
- **FR-002**: The system MUST group todo items by due date in ascending order.
- **FR-003**: Within each date group, incomplete todos MUST appear before completed todos.
- **FR-004**: The system MUST allow users to create a new todo via a form.
- **FR-005**: The system MUST allow users to edit an existing todo via a pre-filled form.
- **FR-006**: The system MUST allow users to delete a todo with a confirmation step.
- **FR-007**: The system MUST allow users to toggle a todo between complete and incomplete.
- **FR-008**: The system MUST allow users to filter todos by status (all / active / completed).
- **FR-009**: The system MUST allow users to filter todos by priority (all / LOW / MEDIUM / HIGH).
- **FR-010**: Title MUST be required and MUST NOT exceed 255 characters.
- **FR-011**: Due date MUST be required and MUST NOT be a past date.
- **FR-012**: Priority MUST default to MEDIUM when not provided by the user.
- **FR-013**: The system MUST show an empty state when no todos exist.
- **FR-014**: The system MUST show an error message when the API call fails.

### Key Entities

- **Todo**: A task with a title, optional description, priority (LOW/MEDIUM/HIGH), due date, and completion status.
- **Priority**: An enumerated value — LOW, MEDIUM, or HIGH. MEDIUM is the default.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can view all their todos within 2 seconds of opening the app.
- **SC-002**: A user can create a new todo in under 1 minute from clicking "Add Todo" to seeing it in the list.
- **SC-003**: A user can mark a todo complete in a single interaction (one click/tap).
- **SC-004**: 100% of validation rules (title required, max length, past date) prevent invalid data from reaching the server.
- **SC-005**: Filtering reduces the visible list immediately with no page reload.

---

## Assumptions

- The backend API is already built and available at the base path `api/todo` (proxied during development).
- Authentication is out of scope — all users see the same list.
- The app is single-page; no multi-page routing is required for this feature.
- Mobile responsiveness is desirable but not a hard requirement for this iteration.
- The delete confirmation is a browser-native `confirm()` dialog for simplicity in this iteration.
