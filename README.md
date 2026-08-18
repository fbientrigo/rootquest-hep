# ROOT Quest

**See the event. Make the cut. Find the signal. Learn ROOT.**

ROOT Quest is an experimental interactive learning environment for physics students beginning with ROOT and high-energy physics data analysis.

Instead of starting from API calls and notebook cells, learners first manipulate events, make selections, observe distributions, and predict what their choices will do. ROOT code appears after the underlying idea has become tangible.

## Learning model

**Manipulate → Observe → Predict → Code**

ROOT Quest is a bridge toward ROOT and real analysis work, not a replacement for the official ROOT documentation.

## First experience: Higgs Hunt

The first vertical slice teaches the basic analysis loop through a small Higgs search. Learners will progressively:

- inspect collision events and reconstructed particles;
- keep or reject events;
- apply simple cuts;
- observe selections changing in real time;
- construct and read an invariant-mass distribution;
- look for an excess near the Higgs mass;
- connect those actions to equivalent ROOT analysis code.

The objective is not to teach every ROOT API. It is to build the mental model behind the analysis.

## Project principles

- Simple implementation, rich learning experience.
- Native web capabilities before additional machinery.
- Immediate cause-and-effect feedback.
- Visualization for understanding, not decoration.
- Gamification that rewards useful reasoning.
- Accessibility as part of correctness.
- Physics and ROOT behavior grounded in authoritative sources.
- One polished vertical slice before generalized infrastructure.

## Development

Requirements: Node.js 24 and npm.

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Project structure

- `src/pages/` — site routes and lesson narrative shells.
- `src/layouts/` — the minimal shared page shell.
- `src/styles/` — shared native CSS.
- `docs/` — product, pedagogy, MVP and engineering sources.
- `STACK_CONTRACT.md` — authoritative technical constraints.

Lesson-specific code should be added only when a real interaction needs it. Do not create generalized learning infrastructure until repeated real lessons demonstrate the need.

## Status

Early prototype. The current focus is the Higgs Hunt vertical slice and the minimum reusable foundations required to support it.

## Scope

ROOT Quest is a learning companion, not a ROOT reference manual, notebook replacement, full analysis framework, detector simulation, or general-purpose LMS.

## Independence

ROOT Quest is currently an independent educational experiment built around ROOT and HEP analysis. It is not an official ROOT or CERN project. I am building it to learn and share.
