# Week 4 Accessibility Notes

## What shadcn/ui handled better

- **Radix primitives** ship with battle-tested focus trap, Escape handling, and portal rendering, reducing manual edge-case work.
- **Declarative state** (`data-[state=open]`) makes open/closed styling reliable without synchronizing multiple React state variables.
- **Composable subcomponents** expose small, typed APIs (`DialogTrigger`, `DialogContent`) that map cleanly to semantic roles and ARIA.
- **Consistent animations** are built in, whereas our manual modal required additional work to match similar behavior without animation libraries.

## Concrete gaps in my manual implementation

1. **Modal focus trap fragmentation**  
   My Modal traps focus with Tab/Shift+Tab, but it does not prevent programmatic focus leaks or handle non-focusable children robustly. It also does not implement a full "roving tabindex" pattern inside the dialog body, which Radix covers.

2. **Tabs arrow-key rendering edge cases**  
   My custom Tabs arrow-key navigator works for button-based tabs, but it does not account for dynamic tab lists or disabled tabs. Radix Tabs handles disabled tabs, orientation, and activation behavior out of the box.

## Accessibility differences

- **Roles & states**: Both implementations use `role="dialog"`, `aria-modal`, `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`, and `aria-expanded`. shadcn/ui components preserve these through Radix, which also adds additional context like `data-state` for CSS selectors.
- **Live region handling**: Radix primitives often avoid unnecessary live regions; our manual components rely on static ARIA without dynamic announcements.
- **Initial focus**: shadcn/ui defaults to a predictable initial focus pattern within dialogs and tabs, while our manual Modal focuses the first interactive element; our Tabs rely on click rather than strong auto-activation semantics.

## Focus management differences

- **Portal rendering**: shadcn/ui Dialog renders in a portal and returns focus to the trigger automatically. Our Modal returns focus on close, but portal-like behavior is inline and can be disrupted by surrounding scroll/layout.
- **Focus boundaries**: shadcn/ui enforces strict tab boundaries inside dialogs and preserves focus even if content changes. Our Modal traps Tab cycling, but it is not as resilient to DOM mutations or nested focusable components.
- **Roving tabindex**: shadcn/ui Tabs implement roving tabindex via Radix. Our custom Tabs use `tabIndex` toggling, which is correct but more fragile if tab components become non-button elements.

## Keyboard interaction differences

- **Escape handling**: shadcn/ui Dialog reliably closes on Escape with proper suppression and focus return. Our Modal listens for `Escape` and calls `onClose`, but does not stop event propagation beyond the modal itself.
- **Tabs navigation**: Both support arrow keys. shadcn/ui Tabs also support Home/End and ensure disabled tabs are skipped cleanly via Radix behavior. Our custom Tabs support Left/Right/Home/End but do not enforce disabled-tab skipping.
- **Disclosure**: Our disclosure handles Enter/Space correctly. shadcn/ui does not provide a Disclosure primitive here, but Radix Collapsible would provide similar behavior with more robust state synchronization.

## What I learned

- Building accessible components from scratch reveals many subtle requirements: focus boundaries, return focus, proper ARIA relationships, and edge cases around non-standard interactive content.
- shadcn/ui is valuable not because accessibility is impossible to implement manually, but because it reduces repetitive, error-prone behavior to configurable primitives.
- TypeScript strictness (`verbatimModuleSyntax`, `noAny`) forces small but important import and typing decisions, such as explicit `type` imports and correct JSX typing.
- Vite aliases (`@`) and path mapping require both `tsconfig.json` and `vite.config.ts` changes to stay consistent across build, dev server, and IDE tooling.