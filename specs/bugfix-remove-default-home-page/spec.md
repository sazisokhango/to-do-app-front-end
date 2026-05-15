# Bugfix Specification: Remove Default Angular Home Page

**Branch**: `bugfix/remove-default-app-home-page`

**Created**: 2026-05-14

**Status**: Complete

**Type**: Bugfix

---

## Problem

The Angular scaffold generates a default boilerplate home page (`app.html`) with placeholder content (Angular logo, links, inline styles). This was not fully removed, leaving default text visible to users instead of the Todo app.

## What Was Done

Removed the Angular default boilerplate content from `src/app/app.html` so that the router outlet renders the `HomeComponent` cleanly with no leftover scaffold content.

## Acceptance Criteria

- **Given** a user opens the app, **When** the page loads, **Then** they see the Todo Home view — not the Angular default page.
- **Given** `src/app/app.html`, **When** inspected, **Then** it contains only `<router-outlet />` with no Angular scaffold markup.

## Requirements

- **FR-001**: `src/app/app.html` MUST contain only `<router-outlet />`.
- **FR-002**: No inline `<style>` blocks or Angular branding content in `app.html`.

## Verified

- `ng build --configuration production` passes.
