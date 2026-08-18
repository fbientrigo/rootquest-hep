# Learning and Interaction

## Core teaching loop

**Manipulate → Observe → Predict → Code**

Whenever possible:

1. let the learner manipulate something;
2. show the consequence immediately;
3. ask them to predict what another change will do;
4. only then expose the ROOT representation or code.

Do not begin with API syntax when an idea can first be experienced.

## Active learning

Interactivity and gamification are teaching tools, not decoration.

Useful activities include selecting particles, keeping/rejecting events, changing cuts, inspecting an event, predicting effects before moving a threshold, building/changing a histogram, comparing signal efficiency with background rejection, diagnosing why a plot changed, translating a visual operation into ROOT, and short active-recall prompts.

A learner should frequently have to **decide**.

## Immediate feedback

A cut slider should update the relevant result immediately. Selecting a particle should visibly explain what changed.

When an analysis choice changes, update the relevant subset of:

- surviving events;
- event visualization;
- histogram/distribution;
- score or teaching feedback;
- signal/background metrics in training mode;
- generated ROOT representation.

Avoid unnecessary page reloads or server round trips. Latency breaks the causal link between action and consequence.

## Gamification

Reward useful analysis reasoning: retaining useful signal, rejecting background, making a correct prediction, recognizing a useful observable, or explaining why a selection worked.

Penalize choices only when the feedback teaches something, such as throwing away useful signal or admitting irrelevant background.

Do not reward arbitrary clicking or speed. Points are subordinate to the physics.

## Training and discovery

Training mode may expose truth information to teach efficiency, rejection, purity and trade-offs.

Discovery mode removes truth labels. The learner reasons from observables and distributions.

The intended transition is:

```text
particle → event → many events → selection → distribution → statistical structure → ROOT analysis
```

## Visualization

Use the minimum visual complexity that communicates the concept. Prefer 2D when it is enough. Use 3D when spatial reasoning genuinely improves understanding of event geometry, directions or angular relationships.

A beautiful visualization that teaches the wrong mental model is a failure.

## ROOT should appear after meaning

Let learners manipulate a concept visually, then reveal the ROOT expression. The code should feel like a compact description of something they already understand.

## Quiz design

Prefer prediction and causal questions over API trivia. A strong loop is:

1. ask for a prediction;
2. commit the answer;
3. show the system changing;
4. explain the causal connection.

## Flashcards

Use spaced recall for concepts worth remembering later—kinematics, cut meaning, histogram intuition, event/object/distribution distinctions and key ROOT object roles. Do not convert every paragraph into a card.

## Lesson design check

Before implementing a lesson, answer:

1. What should the learner understand afterward?
2. What can they manipulate?
3. What should they predict?
4. What changes visibly?
5. Where does ROOT enter?
6. What misconception might occur?
7. How do we know they understood?
