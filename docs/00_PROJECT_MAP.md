# Project Map — ROOT Quest

Use this file when a task is ambiguous or crosses areas. Otherwise route directly to the smallest relevant source set.

ROOT Quest helps physics students and early HEP learners build the mental models required to use ROOT and understand data analysis. It is a bridge toward ROOT and real analysis work, not a replacement for ROOT documentation.

## Source map

### `01_PRODUCT_AND_AUDIENCE.md`
Read for product mission, users, boundaries, success criteria and product decisions.

### `02_LEARNING_AND_INTERACTION.md`
Read for pedagogy, lesson design, interactivity, gamification, quizzes, immediate feedback and visualization.

### `03_HIGGS_HUNT_MVP.md`
Read for the current vertical slice, event-selection flow, cuts, training/discovery modes and MVP acceptance.

### `04_ENGINEERING_QUALITY.md`
Read for senior-code philosophy, native web, accessibility, performance, dependencies and verification.

### `../STACK_CONTRACT.md`
Authoritative for stack, versions, browser/build/deploy constraints and approved dependencies.

## Routing

| Task | Read |
| --- | --- |
| Product direction / feature value | `01` |
| Lesson, quiz, gamification, visualization | `02` |
| Anything in Higgs Hunt | `03` + usually `02` |
| Refactor, dependency, browser/API choice | `04` + stack contract |
| Accessibility/performance | `04` |
| Ambiguous cross-cutting work | this file first |

Do not read unrelated sources merely because they exist.

## Authority order

1. explicit current user instruction;
2. current repository behavior and tests;
3. `STACK_CONTRACT.md` for technical constraints;
4. these project sources for product/pedagogical intent;
5. authoritative ROOT/CERN/experiment sources for technical/physics truth;
6. inference.

Do not fill gaps with confidence. Mark unsupported assumptions.

## Working model

```text
understand goal
    ↓
route to 1–2 sources
    ↓
inspect current implementation
    ↓
smallest causal change
    ↓
verify observable behavior
```

## North star

A learner should not repeatedly press Run on code they do not understand.

They should first be able to **see it → manipulate it → predict it → explain it → express it in ROOT.**
