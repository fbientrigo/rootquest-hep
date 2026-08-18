# Engineering Quality

## Principle

**Think deeply. Change little. Verify the behavior.**

The codebase should stay small enough that a competent developer can trace a learner action to its visible result without navigating unnecessary layers.

Senior engineering here means disciplined restraint, not minimal effort.

## Ponytail-style ladder

Before adding code or machinery, stop at the first sufficient rung:

1. Does this need to exist?
2. Does the repository already solve it?
3. Does the language or standard library solve it?
4. Does the web platform solve it?
5. Does an existing dependency solve it?
6. Can a smaller design make the problem disappear?
7. Only then write the minimum new code.

Lazy means efficient, never negligent.

This never justifies compromising correctness, physics meaning, accessibility, security, data integrity or reproducibility.

## Read deeply before changing little

Before changing behavior, inspect the relevant flow, producers/consumers, nearby tests and the reason current behavior exists. Find the smallest causal change.

Prefer:

```text
deep understanding + small causal change + specific verification
```

over speculative refactors.

## Native web first

Prefer semantic native elements and browser behavior where adequate. Prefer HTML over component machinery, CSS over JavaScript, JavaScript over another framework, and an existing dependency over a new dependency when they solve the same problem.

## Accessibility is correctness

Never remove accessibility to reduce code size. Preserve keyboard navigation, visible focus, semantic labels, reduced-motion support, touch usability, common browsers and non-color-only meaning. Target WCAG 2.2 AA where applicable.

## Performance

Preserve immediate cause and effect. Pay attention to initial JavaScript, dataset size, rerenders, visualization libraries, 3D and mobile performance. Load heavy optional capabilities only when needed. Measure before optimizing.

## State

Keep state local until a concrete requirement proves otherwise. Do not introduce backend state, databases, accounts, synchronization or global state frameworks for hypothetical needs.

## Dependencies

Every dependency needs a current concrete problem. “We may need it later” is not a justification.

## Code style

Prefer explicit over magical, small over generic, local over global, composition over framework, data over configuration machinery, functions over premature classes, and native behavior over wrappers.

Do not build reusable infrastructure for one use case. Refactor when real repetition reveals the correct shape.

## Source and truth discipline

For ROOT behavior or physics claims, prefer authoritative ROOT/CERN/experiment sources. Verify uncertain behavior before encoding it into a lesson. Preserve provenance for prepared data. Do not invent behavior for pedagogical convenience.

## Verification

For an interactive feature, verify:

```text
user action
    ↓
state changes correctly
    ↓
derived data changes correctly
    ↓
visual result changes correctly
    ↓
feedback remains pedagogically and physically meaningful
```

A feature is not complete because it compiles or looks correct in one browser.

## When uncertain

Do not respond to uncertainty by adding generality. Prefer one probe over speculative architecture, one causal fix over defensive patches, and one polished vertical slice over infrastructure for hypothetical lessons.
