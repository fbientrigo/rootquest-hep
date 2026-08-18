# ROOT Quest agent guide

Think deeply; change little; explain simply.

Do not load every source by default. Route first.

- Product direction, audience, scope → `docs/01_PRODUCT_AND_AUDIENCE.md`
- Pedagogy, quizzes, gamification, visualization → `docs/02_LEARNING_AND_INTERACTION.md`
- Current Higgs Hunt vertical slice → `docs/03_HIGGS_HUNT_MVP.md`
- Engineering, accessibility, dependencies, performance → `docs/04_ENGINEERING_QUALITY.md`
- Ambiguous/cross-cutting work → `docs/00_PROJECT_MAP.md`
- Stack/versions/build/browser constraints → `STACK_CONTRACT.md`

Normally read only the 1–2 sources needed for the task.

Before coding:

1. identify the concrete learner or engineering outcome;
2. inspect the relevant existing flow;
3. route to the smallest source set;
4. identify the smallest causal change;
5. define the observable behavior that proves it correct.

Prefer one polished vertical slice over generalized infrastructure. Do not create a learning engine, component library, state framework, or new dependency for hypothetical future lessons.

For ROOT or physics behavior, authoritative ROOT/CERN/experiment sources outrank inference. Repository code and tests outrank stale implementation descriptions.

Teaching default: **Manipulate → Observe → Predict → Code.**
