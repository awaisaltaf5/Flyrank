# CLAUDE.md

Guidance for Claude when working on the **FlyRank AI Frontend Engineering Internship** repository.

---

## Repository Context

This is a learning repository for a frontend engineering internship at FlyRank AI. Work is organized **week by week**, with each week containing assignments, projects, notes, and resources.

**Author:** Awais Altaf  
**License:** MIT

When contributing to this repo, prioritize clarity and learning value over complexity. Code should be easy to read, explain, and extend.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Markup | HTML |
| Styling | CSS, Tailwind CSS |
| Language | JavaScript |
| Framework | React |
| Build Tool | Vite |
| Runtime | Node.js |
| Version Control | Git, GitHub |

Use only technologies from this stack unless the user explicitly requests otherwise.

---

## Folder Structure

Follow the weekly organization defined in `README.md`:

```
week-XX/
├── assignments/    # Guided exercises
├── projects/       # Hands-on applications
├── notes/          # Learnings and documentation
└── resources/      # Links and references
```

For React/Vite projects within a week, use a clean internal structure:

```
projects/my-project/
├── public/
├── src/
│   ├── components/     # Reusable UI components
│   ├── assets/         # Images, fonts, static files
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

Keep related files grouped logically. Do not scatter components or utilities across unrelated folders.

---

## Coding Rules

### 1. Functional React Components

- Use **function components** only — no class components.
- Use React hooks (`useState`, `useEffect`, etc.) for state and side effects.
- Keep components focused on a single responsibility.

```jsx
// Good
function Button({ label, onClick }) {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white rounded">
      {label}
    </button>
  );
}

export default Button;
```

### 2. Reusable Code

- Extract repeated UI into shared components under `src/components/`.
- Avoid duplicating logic — create small, composable functions when needed.
- Use props to make components flexible and reusable.
- Prefer composition over large monolithic components.

### 3. Clean Folder Structure

- One component per file when practical.
- Name files in PascalCase for components (`Button.jsx`, `Navbar.jsx`).
- Name utility files in camelCase (`formatDate.js`).
- Colocate styles with components when using plain CSS; use Tailwind utility classes in JSX when using Tailwind.

### 4. Conventional Commits

When suggesting or writing commit messages, follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short description>
```

Common types:

| Type | Use for |
|------|---------|
| `feat` | New feature or component |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, styling (no logic change) |
| `refactor` | Code restructuring without behavior change |
| `chore` | Tooling, dependencies, config |

Examples:

```
feat(week-02): add responsive navbar component
fix(week-03): correct form validation on submit
docs: update week-01 assignment notes
```

### 5. Explain Changes Before Editing

Before making changes:

1. Briefly describe **what** will be changed and **why**.
2. Identify which files will be affected.
3. Proceed with edits only after the plan is clear.

Keep explanations concise but informative — especially helpful for a beginner learning the codebase.

### 6. Keep Code Beginner Friendly

- Use clear, descriptive variable and function names.
- Prefer simple, readable solutions over clever or overly abstract patterns.
- Add short comments only where logic is not obvious — avoid over-commenting.
- Avoid advanced patterns (HOCs, complex custom hooks, heavy abstractions) unless requested.
- Use consistent formatting and indentation (2 spaces for JS/JSX).

---

## Styling Guidelines

- Use **Tailwind CSS** utility classes for styling in React projects when Tailwind is set up.
- Fall back to plain **CSS** for simpler HTML/CSS assignments or when Tailwind is not configured.
- Write **responsive** layouts using Tailwind breakpoints (`sm:`, `md:`, `lg:`) or CSS media queries.
- Keep class names and styles organized — avoid excessively long single-line class strings when readability suffers; extract to a component or CSS class instead.

---

## Git & GitHub Workflow

- Never commit `node_modules/`, `.env` files, or build output — see `.gitignore`.
- Make small, focused commits with clear Conventional Commit messages.
- Do not force-push to `main` unless explicitly requested.
- Do not create commits or pull requests unless the user asks.

---

## Development Commands

When working inside a Vite + React project:

```bash
npm install    # Install dependencies
npm run dev    # Start dev server
npm run build  # Production build
npm run preview # Preview production build
```

---

## What to Avoid

- Class-based React components
- Over-engineering or premature abstraction
- Unrequested refactors or scope creep
- Adding dependencies without a clear reason
- Complex TypeScript unless explicitly requested
- Committing secrets or environment variables
- Editing unrelated files when fixing a specific task

---

## Summary

Write **simple, functional, reusable React code** in a **clean folder structure**, use the defined **tech stack**, follow **Conventional Commits**, **explain changes before editing**, and keep everything **beginner friendly**.
