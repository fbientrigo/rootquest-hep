# Stack Contract

This file is authoritative for technical constraints. Change it intentionally when the current product requires a different capability.

## Runtime and build

- Node.js 24.
- npm.
- Astro 7.1.6.
- Static output only.
- GitHub Pages is the initial deployment target.

## Application stack

Default to:

- semantic HTML;
- native CSS;
- TypeScript/JavaScript only where interaction requires it;
- Astro as the site/build shell, not as the learning model.

Do not add React, Vue, Svelte, Tailwind, a state framework, backend, database, authentication, or an API layer without a concrete current requirement.

## Interactive capabilities

Future dependencies are allowed only when a current lesson proves their need.

Expected candidates, not preinstalled dependencies:

- JSROOT for reading/drawing real ROOT objects in the browser;
- Three.js for an optional event-space 3D view when 3D materially improves spatial understanding.

Do not install either until its first real interaction is implemented.

## Content and portability

- Site routes live under `src/pages/`.
- Shared page chrome lives under `src/layouts/`.
- Shared styles live under `src/styles/`.
- Lesson-specific logic should remain local to that lesson until repetition proves a reusable primitive.
- The learning content and interaction logic must not depend unnecessarily on Astro so they can later be adapted to another static site shell, including possible ROOT/CERN infrastructure.

## State

- Keep state local to the current lesson.
- No backend state or accounts for the MVP.
- Prefer explicit small state objects and pure derived-analysis functions.

## Data

- Use the smallest educational dataset that preserves the lesson.
- Prepared data must retain documented provenance and reproducible transformations.
- Do not silently alter physics for visual convenience.
- Static educational data belongs under `public/data/<lesson>/` when introduced.

## Accessibility

Target WCAG 2.2 AA where applicable.

At minimum preserve:

- keyboard access;
- visible focus;
- semantic controls and labels;
- reduced-motion preferences;
- touch usability;
- non-color-only meaning;
- an understandable alternative to important visual-only information when practical.

## Browser target

Support current evergreen desktop and mobile browsers, with particular attention to Chromium, Firefox, and Safari/WebKit. Prefer progressive enhancement so core explanatory content remains readable if optional JavaScript fails.

## Performance

- Keep initial JavaScript minimal.
- Lazy-load heavy optional capabilities such as 3D.
- Avoid network round trips for interactions that can run locally.
- Measure before optimizing.

## Verification

Current gates:

- production Astro build succeeds.
- pure runtime and lesson-model tests run with Node's built-in test runner;
- critical learning interactions run in Chromium, Firefox and WebKit with Playwright;
- the browser suite includes an axe WCAG smoke check and a keyboard-only path.

`@playwright/test` and `@axe-core/playwright` are development-only verification dependencies. They are not shipped to learners.
