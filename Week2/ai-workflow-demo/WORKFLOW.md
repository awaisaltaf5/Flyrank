# Workflow Reflection: Settings Page — Round 1 vs Round 2

## Round 1 — Initial Implementation

The first version of the Settings form was built from scratch with nine fields: username, email, age, website, bio, password, confirmPassword, theme, and notifications. Validation lived inside the component file as a local `validators` object. The form used controlled inputs with `useState`, tracked `touched` state per field, validated on blur, and included success/error submission feedback with a simulated API call.

The UI was fully responsive using CSS media queries, had animated alerts, and used `aria-invalid` / `aria-describedby` for accessibility. However, the submit button was never disabled — users could click Submit even with empty or invalid fields. The validation rules were strict (password required uppercase, lowercase, and a number), and the code mixed validation logic with the component itself.

## Round 2 — Refactored Implementation

The second round extracted all validation logic into `src/utils/validation.js` as pure, reusable functions (`validateFullName`, `validateEmail`, `validatePassword`, `validateConfirmPassword`, `validateTheme`). Each function returns an error string (empty = valid). The form was simplified to the five required fields: Full Name, Email, Password, Confirm Password, and Theme. A `useMemo` hook computes `isValid` by running `validateAll` on every render, and the submit button is disabled when `!isValid`. Password validation was relaxed to only require 8+ characters. A full test suite was added with 67 unit tests using vitest + React Testing Library.

## Which Code Was More Correct

Round 2 is more correct. The original had unnecessary fields (age, website, bio, notifications) that weren't requested. Round 2 follows the spec exactly with the five required fields. Separation of concerns is cleaner — validation logic is reusable and importable in tests.

## Which Handled More Edge Cases

Round 2 by a wide margin. The validation utility handles null, undefined, empty strings, whitespace-only, min/max lengths, and trimming. The component tests cover 17 scenarios including: initial disabled state, inline errors on blur, email format, password length, confirm password mismatch, re-validation on password change, success/error submission states, and accessibility attribute checks.

## Which Required Less Manual Fixing

Round 1 was more brittle — password validation was overly strict and the mixed validators made changes harder. Round 2's modular design meant any validation change only required editing one function and its test.

## Which Had Better Accessibility

Both rounds used `aria-required`, `aria-invalid`, `aria-describedby`, and `role="alert"`. Round 2 also added `aria-busy` on the submit button during submission and `role="status"` on the success alert.

## One AI Mistake I Caught

The initial test file used `getByLabelText(/^password$/i)` which matched multiple elements because the label text "Password *" included the required asterisk. This caused test failures. Fixing it to use `getByPlaceholderText('Enter your password')` resolved the issue — a lesson in choosing precise query selectors.

## Which Workflow I Would Use in Future

Round 2's workflow — extract validation into reusable utilities, compute form validity with `useMemo`, disable submit until valid, and write tests alongside the component. This pattern is maintainable, testable, and prevents invalid submissions from reaching the server.