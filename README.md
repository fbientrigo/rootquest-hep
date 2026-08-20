# ROOT Quest

**See the event. Make the cut. Find the signal. Learn ROOT.**

ROOT Quest is an experimental interactive learning environment for physics students beginning with ROOT and high-energy physics data analysis.

Instead of starting from API calls and notebook cells, learners first manipulate events, make selections, observe distributions, and predict what their choices will do. ROOT code appears after the underlying idea has become tangible.

## Learning model

**Manipulate → Observe → Predict → Code**

ROOT Quest is a bridge toward ROOT and real analysis work, not a replacement for the official ROOT documentation.

## Curriculum

ROOT Quest follows a canonical ROOT 80/20 path rather than trying to cover the full ROOT API:

```text
Higgs Hunt hook
      ↓
A · distributions
      ↓
B · ROOT data model
      ↓
C · RDataFrame analysis
      ↓
D · HEP objects and kinematics
      ↓
E · evidence, fits and Data/MC
      ↓
F · independent analysis
```

The curriculum, lesson order, current status and next lesson are defined in [`docs/05_CURRICULUM.md`](docs/05_CURRICULUM.md).

The reusable lesson patterns, attention budget, definition of done and “implement the next lesson” agent protocol are defined in [`docs/06_LESSON_AUTHORING.md`](docs/06_LESSON_AUTHORING.md).

The repository is designed so that a future agent can read those two files, reuse existing probes/drills, implement one polished lesson, verify it, then advance the roadmap without depending on prior chat history.

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
npm ci
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Interaction checks:

```bash
npm run test:unit
npm run test:e2e
```

## Project structure

- `src/pages/` — site routes and lesson narrative shells.
- `src/layouts/` — the minimal shared page shell.
- `src/styles/` — shared native CSS.
- `src/learning/` — portable session mechanics and accessible teaching primitives.
- `src/lessons/` — lesson-specific state, derivations, visuals and controllers.
- `tests/` — pure logic and cross-browser interaction checks.
- `docs/` — product, pedagogy, curriculum, lesson-authoring, MVP and engineering sources.
- `STACK_CONTRACT.md` — authoritative technical constraints.

Lesson-specific code should be added only when a real interaction needs it. Do not create generalized learning infrastructure until repeated real lessons demonstrate the need.

## Status

Early prototype with a working Higgs Hunt vertical slice, reusable learning primitives and an explicit course roadmap.

Current curriculum handoff: consult `docs/05_CURRICULUM.md` for the unique `NEXT` lesson before adding new course content.

## Scope

ROOT Quest is a learning companion, not a ROOT reference manual, notebook replacement, full analysis framework, detector simulation, or general-purpose LMS.

## Independence

ROOT Quest is currently an independent educational experiment built around ROOT and HEP analysis. It is not an official ROOT or CERN project. I am building it to learn and share.
