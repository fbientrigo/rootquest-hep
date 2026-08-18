# Product and Audience

## Mission

Build the smallest genuinely useful interactive learning environment for ROOT and introductory HEP data analysis.

This is not another ROOT documentation site.

The product should help a newcomer develop enough intuition to inspect particles and events, understand selections and cuts, construct and read plots quickly, reason about distributions, understand the role of ROOT objects, and eventually work independently with official ROOT resources and real analyses.

Difficult ideas should become tangible before they become formal.

## Who we are building for

Primary users are physics students and early HEP learners who:

- know some basic programming or can follow simple code;
- may have little or no ROOT experience;
- do not yet have a strong mental model of events, objects, cuts, histograms, trees, or analysis workflows;
- can execute a notebook cell without understanding what happened;
- benefit from seeing cause and effect immediately.

Do not design primarily for experienced ROOT developers.

A successful lesson should help a newcomer understand something they can later recognize in official ROOT documentation.

The site is a bridge **toward ROOT**, not a replacement for ROOT.

## Product boundary

The project is not trying to become a second ROOT manual, full notebook platform, generic LMS, online IDE, detector simulation framework, full ATLAS event display, or backend-heavy user platform.

The product is the learning experience.

## What should feel different from a notebook

A notebook often allows:

```text
read explanation → run cell → plot appears → run next cell
```

ROOT Quest should more often create:

```text
see a physical/data-analysis situation
    ↓
make a decision
    ↓
observe the consequence
    ↓
predict another consequence
    ↓
formalize what happened
    ↓
see or write the ROOT equivalent
```

A learner should frequently decide, compare, predict, inspect or explain.

## Simple underneath, rich on top

Architecture simplicity must not be confused with educational simplicity.

The implementation can stay small while the experience remains interactive, visual, playful, polished, responsive and scientifically meaningful.

Do not remove a high-value interaction because static prose is easier. Ask whether the interaction can be expressed with a smaller engine or an existing primitive.

The implementation should be boring. The teaching experience should not be.

## Product decision test

Before accepting a feature, ask:

1. Which learner difficulty does this solve?
2. What does the learner do differently because it exists?
3. Does it make an important concept more tangible?
4. Could the same outcome be achieved with a smaller interaction?
5. Does it help the learner progress toward independent ROOT use?
