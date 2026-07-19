# Implementation Instructions (Read Before Writing Any Code)

You are implementing a new feature in an **existing production codebase**, not creating a new project.

Before making any changes, thoroughly inspect the existing project structure and identify the established conventions.

Your implementation **must adapt to the existing codebase**, not introduce a new architecture.

---

## 1. Analyze the Existing Project

Before implementing anything, understand the existing:

* Folder structure
* Routing
* React component organization
* State management
* API layer
* ElysiaJS backend organization
* Shopify integration
* Naming conventions
* TypeScript conventions
* Styling approach
* Error handling
* Loading state patterns
* Form handling
* Reusable UI components
* Utility functions
* Custom hooks
* Context providers

Reuse existing solutions whenever appropriate.

Do **not** duplicate functionality that already exists.

---

## 2. Preserve Existing Architecture

The project already has an established architecture.

Your implementation must fit naturally into it.

Do not introduce:

* New architectural patterns
* New state management libraries
* New authentication libraries unless required
* New UI libraries
* Unnecessary wrappers
* Overly generic abstractions
* Large utility files
* Complex dependency injection
* Premature optimization

Favor consistency over novelty.

---

## 3. Follow Existing Code Style

Match the existing project's:

* File naming
* Function naming
* Component naming
* Folder organization
* Import ordering
* Type definitions
* Error handling
* API conventions
* Formatting
* Comments

The newly added files should be indistinguishable from the rest of the project.

---

## 4. Keep the Code Simple

Prefer simple solutions.

Avoid:

* Clever code
* Deep abstractions
* Over-engineering
* Excessive indirection
* Unnecessary custom hooks
* Excessive context providers
* Reusable abstractions with only one consumer

If a straightforward implementation is sufficient, choose it.

Optimize for readability.

---

## 5. Separation of Responsibilities

Maintain clear responsibilities.

### Frontend

Responsible for:

* Rendering UI
* Managing local UI state
* Calling backend APIs
* Route protection
* Displaying loading states
* Displaying error states

Avoid placing Shopify business logic directly in React components.

---

### Backend (ElysiaJS)

Responsible for:

* Shopify communication
* Authentication
* Session management
* Token handling
* Customer retrieval
* Orders
* Addresses
* Validation
* Error translation

The frontend should never need to understand Shopify-specific implementation details.

---

## 6. Reuse Existing Components

Before creating a new component, determine whether an existing one can be reused.

Examples:

* Buttons
* Inputs
* Cards
* Dialogs
* Tables
* Forms
* Layout components
* Loading indicators
* Empty state components
* Error components

Avoid creating duplicate UI components.

---

## 7. UI Consistency

Every new page must match the current application.

Maintain existing:

* Theme
* Colors
* Typography
* Spacing
* Icons
* Card layouts
* Forms
* Navigation
* Buttons
* Animations
* Responsive behavior

A user should not be able to tell which pages were added later.

---

## 8. API Design

Backend endpoints should be:

* Small
* Predictable
* RESTful where appropriate
* Consistent with the existing project

Avoid "god endpoints" that perform multiple unrelated actions.

---

## 9. Type Safety

Prefer explicit TypeScript types.

Avoid:

* `any`
* Unsafe casting
* Implicit object shapes

Reuse existing project types whenever possible.

Create shared types only when they have multiple consumers.

---

## 10. Error Handling

Handle expected failures gracefully.

Examples:

* Unauthorized
* Expired sessions
* Shopify API failures
* Validation errors
* Missing customer
* Empty order history

Return meaningful errors.

Do not expose Shopify internals directly to the frontend.

---

## 11. Performance

Avoid unnecessary:

* Re-renders
* Duplicate API requests
* Duplicate Shopify calls
* Duplicate state
* Large contexts

Fetch only the data required for each page.

---

## 12. Authentication

Authentication should integrate naturally with the current application.

Guest shopping must continue working exactly as before.

Authentication should only enable additional customer features.

Avoid rewriting existing cart, checkout, or product functionality unless required.

---

## 13. Maintainability

Assume another developer will maintain this project in six months.

The implementation should be:

* Easy to navigate
* Easy to debug
* Easy to extend
* Easy to test

Prioritize clarity over cleverness.

---

## 14. Before Completing the Task

Review the implementation and ensure:

* No duplicate code was introduced.
* Existing conventions were followed.
* Existing reusable components were used.
* Authentication logic is centralized.
* Shopify communication is isolated to the backend.
* Components remain small and focused.
* Public and protected routes behave correctly.
* Guest functionality has not regressed.
* The implementation is production-ready.

If multiple implementation options exist, choose the one that best aligns with the existing codebase rather than the one that is the most technically sophisticated.
