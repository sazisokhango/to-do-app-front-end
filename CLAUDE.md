# To-Do Front-End — Claude Code Guide

## Project Overview

Angular 21 To-Do application using Spec-Driven Development (SDD) with GitHub's spec-kit methodology.

- **Framework**: Angular 21 (standalone components)
- **Styling**: Tailwind CSS v4
- **Methodology**: Spec-Driven Development (SDD) via spec-kit
- **Node**: 20 LTS | **Package manager**: npm

## SDD Workflow (MANDATORY)

Every feature follows this sequence — no exceptions:

```
/speckit.specify <feature description>   → writes specs/{NNN}-{name}/spec.md
/speckit.clarify                         → resolve ambiguities (if needed)
/speckit.plan                            → writes specs/{NNN}-{name}/plan.md
/speckit.tasks                           → writes specs/{NNN}-{name}/tasks.md
/speckit.implement                       → implements tasks one by one
/speckit.analyze                         → cross-artifact consistency check
/speckit.checklist                       → final completion checklist
```

The active feature is tracked in `.specify/feature.json`.

## Directory Structure

```
to-do-front-end/
├── .claude/commands/        # spec-kit slash commands
├── .specify/                # spec-kit config and templates
│   ├── init-options.json
│   ├── feature.json         # active feature pointer
│   ├── spec-template.md
│   ├── plan-template.md
│   ├── tasks-template.md
│   └── checklist-template.md
├── memory/
│   └── constitution.md      # project constitution (NON-NEGOTIABLE)
├── specs/                   # all feature specs live here
│   └── {NNN}-{feature}/
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       └── checklists/
└── src/
    ├── app/                 # Angular standalone components
    └── styles.css           # Tailwind entry point
```

## Constitution

Read `memory/constitution.md` before starting any feature. It is non-negotiable.

## Common Commands

```bash
# Start dev server (use Node 20 via nvm)
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 20
ng serve

# Run tests
ng test

# Production build
ng build --configuration production
```

## Angular Conventions

- Standalone components only — no NgModules
- Tailwind utility classes only — no component-scoped CSS
- Lazy-loaded routes per feature module
- Typed HTTP interfaces for all API calls
- Component max 200 lines of TypeScript
