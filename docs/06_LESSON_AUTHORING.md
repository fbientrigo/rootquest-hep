# Lesson Authoring Contract

Use this file when implementing or revising a ROOT Quest lesson.

The goal is to make a new lesson cheap to author without turning ROOT Quest into a generic lesson framework. Reuse teaching mechanics and repository patterns; keep physics, ROOT logic, datasets and visual meaning local to the lesson unless real repetition proves otherwise.

## The lesson unit

A lesson is a focused learning experience, normally about one causal idea.

A lesson is complete when a learner can do something observable that they could not reliably do before. “The page contains an explanation of X” is not an outcome.

Each lesson should fit this shape when the concept allows it:

```text
CONTEXT
What problem/question are we trying to solve?

MANIPULATE
Change one meaningful quantity or make one decision.

OBSERVE
See the consequence immediately.

PREDICT
Commit to what another change should do.

CODE
Reveal or construct the ROOT expression for the idea already understood.

TRANSFER
Answer one short question or make one nearby decision without the previous scaffold.
```

Not every lesson needs six visible stages. Preserve the causal sequence, not a template for its own sake.

## Required lesson brief

Before coding, write down these eight fields in working notes or the PR/commit context:

1. **Curriculum ID** — for example `A1`.
2. **Learner outcome** — one observable sentence.
3. **Prior knowledge** — only what this lesson actually assumes.
4. **Misconception** — the most important plausible wrong mental model.
5. **Manipulation/decision** — what the learner actively does.
6. **Visible consequence** — what changes and why it matters.
7. **ROOT bridge** — exact ROOT concept/API revealed after meaning.
8. **Proof of learning** — the smallest action showing the outcome was achieved.

If these cannot be stated clearly, do not solve the ambiguity by adding UI.

Language is not a ninth learning field. It is a completion constraint: the same learner outcome and causal experience must be available in both English and Spanish.

## Attention budget

Use the Higgs Hunt discipline as the default upper bound for a focused scene:

- at most **4 active controls** visible at once;
- at most **3 nearby reading blocks**;
- at most **2 simultaneously emphasized results**;
- normally at most **1 moving teaching signal** at a time.

These are attention constraints, not arbitrary DOM limits. Break them only when the learning outcome requires simultaneous comparison and the result remains usable on mobile and with assistive technology.

## Reusable teaching primitives that already exist

### `<rq-predict>`

Use when the learner must commit to a consequence before seeing it.

Good uses:

- which rows survive a filter;
- whether efficiency rises or falls;
- how binning changes a representation;
- which ROOT operation matches an analysis intention.

Do not use it for trivia that can be looked up without reasoning.

### `<rq-feedback>`

Use for local causal feedback: observation, success, misconception, hint or explanation.

Good feedback states **what changed and why**. Avoid a bare “correct/incorrect” state.

Continuous sliders should generally avoid chatty live-region announcements; committed/discrete outcomes may announce politely.

### `<rq-stepper>`

Use when a learner benefits from stepping through a causal sequence while lesson state remains the source of truth.

Good uses:

- successive filters in a cutflow;
- worked-example fading;
- comparing a prediction with a revealed result.

Do not use it merely to paginate prose.

## Reusable patterns — reuse before componentizing

The following are approved lesson patterns. Most should remain ordinary semantic HTML + lesson-local controller/model code until at least two real lessons reveal a stable shared implementation.

### 1. Manipulator → linked consequence

Examples: threshold slider, bin-count slider, parameter control.

```text
native control
    ↓
lesson session state
    ↓
pure derived calculation
    ↓
visual + textual summary + optional ROOT representation
```

Use native `input`, `output`, `button`, `fieldset` and related elements before inventing controls.

### 2. Dataset/table → selection

Examples: choose events, branches, objects or rows.

Keep the visible selection and the scientific derivation driven by the same explicit lesson state. The DOM is never the scientific source of truth.

### 3. Linked representations

Examples:

- `TFile → TTree → branch` hierarchy beside example values;
- event objects beside a compact record;
- histogram beside bin counts;
- visual selection beside generated ROOT code.

Use when moving between two representations is itself the concept being learned.

### 4. Prediction → reveal

Use `<rq-predict>` plus lesson-local consequence rendering. The answer should remain hidden until commitment when seeing it first would destroy the prediction task.

### 5. Pipeline trace

Show entering, removed and surviving data through sequential operations. Reuse the conceptual pattern from `lab/learning-engine`; extract shared code only after another real lesson demonstrates a stable duplication.

### 6. ROOT code bridge

Code should be generated from or consistent with the learner's actual choices whenever practical.

The code reveal should answer:

> “How does ROOT express the operation I just understood?”

not:

> “What syntax should I memorize next?”

### 7. Transfer checkpoint

End with one small unscaffolded or less-scaffolded decision. Reuse an existing primitive if suitable; do not create a scoring system merely to mark completion.

## What belongs in `src/learning/`

Only promote code to the shared learning foundation when either:

1. at least **two real learner-facing lessons** need the same stable mechanic, or
2. it provides a cross-cutting correctness requirement such as accessibility/lifecycle behavior.

Good shared candidates are mechanics such as prediction commitment, feedback semantics and step navigation.

Do **not** move these into the shared engine merely because they may recur someday:

- physics calculations;
- ROOT syntax formatters;
- histogram algorithms;
- event datasets;
- lesson narratives;
- scoring rules;
- hints;
- visualization-specific geometry;
- Higgs-specific state;
- curriculum sequencing.

The current `src/learning/README.md` remains authoritative for engine boundaries.

## Lesson-local implementation shape

Prefer the established boundary:

```text
semantic Astro/HTML lesson shell
        ↓
lesson controller + explicit local session state
        ↓
pure derived calculations/model
        ↓
SVG/HTML/text views + teaching primitives
```

A new lesson may be much smaller than Higgs Hunt. Do not create `model.ts`, `controller.ts` and dedicated CSS files automatically; split only when the actual lesson benefits.

## Bilingual authoring contract

Every learner-facing lesson, practice route and lab ships as one complete experience in English (`en`) and Spanish (`es`). This is a definition-of-done requirement, not follow-up localization work.

When authoring or changing learner-facing copy:

- add the English and Spanish versions in the same change;
- preserve the same scientific meaning, causal claim, challenge difficulty and feedback intent in both languages;
- translate pedagogically rather than word-for-word when a literal rendering would sound unnatural;
- keep ROOT/API identifiers, code, variable names, symbols and established physics notation unchanged unless ordinary prose around them requires translation;
- localize page title/description, visible prose, controls, answer options, dynamic feedback, progress/status text, SVG descriptions and meaningful ARIA labels;
- keep verbatim quotations and bibliographic source titles in their source language when fidelity matters;
- do not accept mixed-language artifacts as a temporary finished state.

Use the smallest existing mechanism:

1. reuse the shared `src/i18n/runtime.ts` localization layer for site-wide and ordinary lesson copy;
2. reuse established lesson-local locale data when an interaction already has specialized localized state, as in Practice Doors;
3. do not add an i18n framework or dependency unless the current product proves the shared static approach insufficient.

The learner's language choice is global and persisted by the site. A lesson must not create its own competing preference. Legacy/query language controls may interoperate with the global preference but must not override it silently.

Before marking a learner-facing change complete, exercise both languages through the critical interaction. A new route must be added to the bilingual Playwright route coverage.

## Scientific and ROOT truth

Before encoding technical behavior:

- verify ROOT API behavior against current authoritative ROOT documentation;
- verify HEP/experiment-specific claims against authoritative CERN/experiment material;
- keep prepared/synthetic data clearly identified;
- never alter physics behavior merely to make an interaction easier to win;
- distinguish conceptual teaching diagrams from detector/event displays.

If a synthetic dataset is used to expose cause and effect, say so in the lesson.

## Accessibility and mobile acceptance

A lesson is not complete unless the core operation works with:

- keyboard navigation;
- visible focus;
- semantic labels/instructions;
- touch-sized controls;
- non-color-only meaning;
- reduced motion;
- a textual description/summary for important visual state;
- narrow mobile layout without hiding required meaning.

All meaningful accessibility text must follow the active English/Spanish language; an otherwise translated screen with stale English ARIA/SVG feedback is incomplete.

Prefer progressive enhancement: the semantic structure should remain understandable before custom interaction is applied.

## Definition of done for one lesson

A lesson can move to `LIVE` only when all are true:

- the curriculum learner outcome is implemented;
- the active interaction changes the scientifically correct derived state;
- prediction, if used, occurs before the revealing consequence;
- feedback explains the relevant cause;
- ROOT syntax appears after or alongside established meaning, not as unexplained ceremony;
- the transfer checkpoint tests the intended idea rather than API trivia;
- the complete learner-facing experience exists in natural English and Spanish, including dynamic/accessibility text;
- language switching preserves the global preference and the route is covered by the bilingual browser check;
- existing mechanics/code were reused where appropriate;
- no speculative framework/dependency was added;
- unit tests cover pure non-trivial derivations where useful;
- an interaction/E2E check covers the critical learner path when practical;
- `npm run build` passes;
- relevant existing tests pass;
- mobile/accessibility behavior is checked;
- `docs/05_CURRICULUM.md` is updated from `NEXT` to `LIVE` and the next eligible lesson is promoted to `NEXT`.

## Daily agent protocol — “implement the next lesson”

When the user asks an agent to implement the next class/lesson, the phrase has a deterministic meaning.

### 1. Route

Read:

- `docs/05_CURRICULUM.md` — **what comes next**;
- this file — **how a lesson is built**.

Then read only the smallest additional source set required by the lesson:

- `docs/02_LEARNING_AND_INTERACTION.md` for a new/changed teaching mechanic;
- `docs/04_ENGINEERING_QUALITY.md` + `STACK_CONTRACT.md` for an engineering/dependency/browser decision;
- `docs/03_HIGGS_HUNT_MVP.md` only if changing/reusing Higgs Hunt behavior;
- current repository files/tests for the actual implementation being reused.

For every learner-facing implementation, inspect the current language runtime and bilingual route test before adding copy. The language contract is mandatory even when no other engineering decision requires reopening `STACK_CONTRACT.md`.

Do not load the whole project documentation by default.

### 2. Select the lesson

Choose the unique `NEXT` lesson in `docs/05_CURRICULUM.md`.

If no `NEXT` exists, choose the first `PLANNED` lesson in canonical order whose prerequisites are already `LIVE`, and mark it `NEXT` as part of the work.

Do not skip forward because another lesson is easier or more visually interesting.

### 3. Reuse before building

Search the repository for:

- an existing learner-facing lesson;
- `practice/*` drills;
- `lab/*` probes;
- relevant `src/learning/` primitives;
- the existing `src/i18n/` localization layer and bilingual test coverage;
- lesson-local calculations/visual patterns that can be reused without coupling unrelated domains.

If a probe already demonstrates the mechanic, promote/refine it instead of reimplementing it.

### 4. Verify external truth only where needed

For the exact ROOT/physics surface taught by the lesson, verify current authoritative documentation. Do not expand research into unrelated curriculum topics.

### 5. Implement one polished vertical slice

Implement the smallest experience that reaches the learner outcome and satisfies the lesson contract. Author learner-facing English and Spanish together; do not defer translation to a later run. Do not implement the following lesson in the same task unless the user explicitly asks.

### 6. Verify observable behavior

State the causal acceptance condition before finishing, for example:

```text
Correct if changing bin count keeps the same source values while only their grouping changes,
and the learner must successfully distinguish that from changing the selected sample.
```

Then run the relevant build/tests and interaction checks in both languages. Verify that changing language on one route persists after navigating to another route.

### 7. Advance the roadmap

Only after the lesson satisfies the definition of done:

- mark it `LIVE` in `docs/05_CURRICULUM.md`;
- promote the next eligible lesson to `NEXT`;
- keep useful `PROBE`/`DRILL` reuse notes;
- make any new shared mechanic explicit in `src/learning/README.md` only if it met the promotion rule.

The repository should therefore always tell the next agent what to do without relying on chat history.

## Recommended agent request

A short request should be sufficient once these contracts are present:

```text
Review the ROOT Quest curriculum and implement the next lesson on main.
Follow the lesson-authoring contract, reuse existing probes/primitives before adding machinery,
keep the complete learner experience available in natural English and Spanish,
verify the ROOT/physics claims against authoritative sources, run the relevant tests/build,
and advance the curriculum only when the lesson satisfies its definition of done.
```
