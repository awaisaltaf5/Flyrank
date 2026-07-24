# Profile Settings Dashboard

A responsive React-based settings dashboard for managing user profile preferences, built with Vite.

## Features

- Profile form with username and email inputs
- Theme selector (light, dark, system)
- Notification toggle switch
- Form validation with inline error messages
- Success message on save
- Persistent storage using Local Storage
- Responsive design for mobile and desktop
- Accessible form controls with labels, keyboard navigation, and ARIA attributes

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```
src/
│
├── components/
│   ├── ProfileForm.jsx       Main form with validation and save logic
│   ├── ThemeSelector.jsx     Theme dropdown selector
│   ├── NotificationToggle.jsx Notification toggle switch
│   └── SuccessMessage.jsx    Accessible success banner
│
├── hooks/
│   └── useLocalStorage.js    Reusable hook for local storage persistence
│
├── utils/
│   └── validators.js         Validation helpers for username and email
│
├── styles/
│   └── index.css             Global styles, theme classes, responsive layout
│
├── App.jsx                   Root app component
└── main.jsx                  Application entry point
```

## Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- JavaScript (no TypeScript)

## Accessibility

- Labels associated with inputs via `htmlFor` and `id`
- Keyboard navigation support for form controls
- `aria-invalid` on inputs when validation fails
- Error messages use `role="alert"`
- Success message uses `role="status"` with `aria-live="polite"`

## Code Review

### What Went Well

- Clean separation of UI and validation logic
- Cohesive component structure
- Local storage persistence logic is delegated to a hook and utility handlers
- Responsive design handled through media queries
- Dark theme styling implemented via CSS classes

### Possible Improvements

- Use CSS custom properties for easier theming instead of hard-coded colors
- Add a loading spinner or skeleton state for better UX on slow devices
- Defer localStorage reads to a custom hook to reduce side effects in the component body
- Add E2E tests to verify localStorage and theme interactions across page reloads
- Add debounced validation for better performance on large inputs
- Introduce a small animation for success message entrance/exit

### Refactoring Opportunities

- Extract `ThemeSelector` and `NotificationToggle` into a shared UI kit
- Consolidate validation and submit logic into a `useForm` hook or form library
- Split `ProfileForm` into smaller presentational components
- Replace inline theme DOM class toggling with a dedicated theme context/provider
- Move success message timeout/clear logic to a hook for reuse

### Suggested Unit Tests

- `validators.js`: test valid/invalid email and username lengths
- `ThemeSelector.jsx`: verify selection updates onChange callback
- `NotificationToggle.jsx`: verify checkbox state and onChange callback
- `SuccessMessage.jsx`: verify it renders nothing when message is empty
- `ProfileForm.jsx`: test form submission with valid/invalid inputs and localStorage writes
- `useLocalStorage.js`: verify initial read, write, and re-render behavior

## File Explanations

- `index.html`: Vite entry HTML that mounts the React app into `#root`.
- `src/main.jsx`: Bootstraps React and renders `App` into the DOM.
- `src/App.jsx`: Root component that renders `ProfileForm`.
- `src/components/ProfileForm.jsx`: Main form handling state, validation, local storage sync, and submission.
- `src/components/ThemeSelector.jsx`: Reusable dropdown for selecting light/dark/system theme.
- `src/components/NotificationToggle.jsx`: Accessible toggle switch for notifications.
- `src/components/SuccessMessage.jsx`: Banner showing success feedback with `aria-live`.
- `src/hooks/useLocalStorage.js`: Reusable hook for persisting state to local storage.
- `src/utils/validators.js`: Pure validation functions for username and email.
- `src/styles/index.css`: Global styles, form styling, toggle switch, responsive breakpoints, and dark theme.

## Dependency Explanations

- `react` and `react-dom`: Required runtime for building the UI with React 18+.
- `@vitejs/plugin-react`: Vite plugin enabling JSX transformation and React Fast Refresh in development.
- `vite`: Build tool and dev server used to scaffold and run the project.

## Notes

- This project uses JSX and JavaScript per internship requirements.
- No external state management library is included to keep dependencies minimal.
