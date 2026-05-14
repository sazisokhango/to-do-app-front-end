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
1. `/speckit.specify` — write the spec
2. Review and approve spec
3. `/speckit.plan` — create implementation plan
4. Review and approve plan
5. `/speckit.tasks` — generate task list
6. `/speckit.implement` — implement tasks
7. `/speckit.checklist` — verify completion

## Angular Constraints

- **Angular version**: 21 (standalone)
- **Node version**: 20 LTS
- **Package manager**: npm
- **Stylesheet**: CSS with Tailwind v4
- **Routing**: Angular Router (lazy-loaded routes per feature)
- **State**: Local component state first; use services for shared state only when the spec requires it
- **HTTP**: Angular `HttpClient` with typed interfaces

## Quality Gates

- All specs pass the specification quality checklist before planning
- All acceptance scenarios become Karma/Jasmine tests
- No component has more than 200 lines of TypeScript
- No inline styles — Tailwind classes only
- `ng build --configuration production` must succeed before any merge

## Governance

This constitution supersedes all other practices. Amendments require updating this file with rationale and date. All feature branches must be spec-compliant before merge.

**Version**: 1.0.0 | **Ratified**: 2026-05-14 | **Last Amended**: 2026-05-14
