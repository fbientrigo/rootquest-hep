# ROOT Quest learning foundation

## Purpose

This directory contains the smallest mechanics shared by the current learning probes. It coordinates local lesson state and provides accessible prediction, feedback, and trace navigation. It contains no ROOT, HEP, visualization, scoring, or Astro-specific logic.

The boundary is:

```text
semantic lesson HTML
        ↓
lesson controller + explicit state
        ↓
session update → pure derived data
        ↓
lesson views + teaching primitives
        ↓
native browser platform
```

Astro publishes the page. It is not part of the state or interaction model.

## Research translated into constraints

| Learner problem | Adopted principle | Engine capability | Failure prevented |
| --- | --- | --- | --- |
| A feature can be interactive without producing useful thinking. | Check the path from mechanic → learner behavior → intended experience. | The lab documents that path for every mechanic; the runtime does not prescribe game rules. | Decorative or feature-led gamification. |
| Rewards can distract from the concept being learned. | Keep the learning operation intrinsic to the interaction. | Lessons decide meaningful outcomes; the core has no XP or reward system. | Trivia and unrelated reward “sugar coating.” |
| Recognition can feel like understanding without durable recall. | Require a prediction to be committed before its consequence is revealed. | `<rq-predict>` separates commit from reveal. | Passive guessing after seeing the answer. |
| Novices can be overloaded by unsupported discovery. | Move from demonstration to guided completion to independent work, fading support deliberately. | `<rq-stepper>` supplies navigation while lessons compose examples, hints, and challenges. | A generic adaptive system or premature discovery. |
| “Correct” does not explain what changed or why. | Feedback should be timely, specific, and connected to the task/process. | `<rq-feedback>` presents observation, success, misconception, hint, or explanation close to the action. | Points-only and red/green-only feedback. |

Sources: [MDA](https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/), [intrinsic integration](https://doi.org/10.1080/10508406.2010.508029), [spacing and retrieval practice](https://doi.org/10.1038/s44159-022-00089-1), [worked-example fading](https://doi.org/10.1023/B:TRUC.0000021815.74806.f6), and [formative feedback](https://doi.org/10.3102/0034654307313795).

Spacing informs future lesson sequencing, but it adds no runtime code yet: there is no persistence or curriculum scheduler in the current product.

## State and lifecycle

Create one session for one local interaction:

```ts
const session = createLessonSession(() => ({ threshold: 2, attempts: 0 }));

session.subscribe((state) => render(state));
session.update((state) => ({ ...state, threshold: 3 }));
session.reset();
```

`createLessonSession` provides current-state reads, explicit immutable updates, immediate subscriptions, deterministic reset, debug snapshots, cleanup registration, and disposal. The lesson owns domain meaning and pure derived calculations. DOM and visualizations are projections, never the scientific source of truth.

## Teaching primitives

- `<rq-predict>` enhances a semantic form. It locks a committed prediction, emits `rq-prediction-commit`, and lets the lesson reveal causal feedback later.
- `<rq-feedback>` is a polite live region by default and distinguishes observation, success, misconception, hint, and explanation in text as well as style.
- `<rq-stepper>` enhances native buttons, emits cancellable `rq-step-request` events, and reflects a position owned by lesson state. The lesson supplies frames and meaning.

All elements use light DOM. Import `src/learning/index.ts` once in an interactive page to register them. Native buttons, ranges, checkboxes, fieldsets, details, progress, and output elements remain native controls.

## Authoring a new interaction

1. Write normal semantic Astro/HTML content.
2. Define a small lesson state and an initial-state factory.
3. Keep transformations and scientific derivations in pure lesson functions.
4. Subscribe one render function to the session and let that state drive all linked views.
5. Compose only the teaching primitives the learner behavior needs.
6. Register DOM listener cleanup with the session and dispose it with the page lifecycle.

Do not make elements call one another to synchronize views. The controller updates the session; derived state updates each view.

## Accessibility expectations

Lessons must retain labels, keyboard operation, visible focus, touch-sized targets, textual visualization summaries, non-color-only states, and meaning under reduced motion. Use `aria-live="off"` for feedback that updates continuously (for example while dragging a slider) and reserve polite announcements for committed or discrete consequences.

## Mechanics used by the lab

| Mechanic | Encouraged dynamic | Intended learning result |
| --- | --- | --- |
| Move bin/threshold ranges and commit a prediction | Compare immediate distribution changes, then test a hypothesis | Binning changes representation; selection changes the sample. |
| Select a branch in an expandable hierarchy | Move between structure, metadata, and values | A branch is a column-like part of a tree with per-entry values. |
| Predict, then step through filters | Compare entering, removed, and surviving events | A pipeline transforms a dataset one operation at a time. |

## Keep out of the engine

Do not add a capability until at least two real interactions share the same mechanic or it supplies a cross-cutting correctness requirement such as accessibility or lifecycle cleanup. Keep lesson visuals, ROOT formatters, physics calculations, datasets, scoring rules, hints, and narrative local.

The current implementation intentionally rejects a custom lesson host element, global event bus, score/XP component, auto-play engine, lesson registry, JSON DSL, dependency injection, persistence layer, plotting library, JSROOT, Three.js, and a UI framework.

## Higgs Hunt compatibility

The Higgs Hunt main experience now proves this boundary. One local session drives object selection, stage progression, a cut visualization, selection metrics, a mass histogram, and a lesson-specific ROOT formatter. Prediction uses `<rq-predict>`, causal explanations use `<rq-feedback>`, and the five focused scenes use `<rq-stepper>`. All physics, synthetic data, SVG rendering, and ROOT syntax remain in `src/lessons/higgs-hunt/`; the reusable foundation is unchanged and contains no Higgs concepts.

Its attention budget is deliberate: one scene is visible at a time, no scene exposes more than four active controls, explanatory content is limited to three nearby blocks, at most two results are visually emphasized, and only the cut marker moves. Reduced-motion mode removes that transition without removing its textual consequence.

| Scene mechanic | Encouraged dynamic | Intended learning result |
| --- | --- | --- |
| Select two reconstructed objects | Compare compact and broad detector signatures | A diphoton candidate is built from two photon-like objects. |
| Commit which rows pass `photon_n == 2` | Apply a rule before seeing confirmation | A filter tests one stated condition consistently across events. |
| Move the photon-pT cut | Explore signal-efficiency/background-rejection trade-offs | Tighter cuts can improve purity while losing useful events. |
| Change histogram bins | Compare alternative groupings of fixed values | Binning changes the visible representation, not the underlying data. |
| Read code derived from prior choices | Map experienced operations to syntax | RDataFrame expresses selections and distributions already understood conceptually. |
