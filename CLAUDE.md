# ROOT Quest agent guide

Think deeply; change little; explain simply.

Do not load every source by default. Route first.

- Product direction, audience, scope → `docs/01_PRODUCT_AND_AUDIENCE.md`
- Pedagogy, quizzes, gamification, visualization → `docs/02_LEARNING_AND_INTERACTION.md`
- Current Higgs Hunt vertical slice → `docs/03_HIGGS_HUNT_MVP.md`
- Engineering, accessibility, dependencies, performance → `docs/04_ENGINEERING_QUALITY.md`
- Curriculum, coverage, ordering, next lesson → `docs/05_CURRICULUM.md`
- Lesson implementation/reuse contract → `docs/06_LESSON_AUTHORING.md`
- Ambiguous/cross-cutting work → `docs/00_PROJECT_MAP.md`
- Stack/versions/build/browser constraints → `STACK_CONTRACT.md`

Normally read only the 1–2 sources needed for the task.

## When asked to implement the next lesson

The request is deterministic; do not ask what lesson the user means.

1. Read `docs/05_CURRICULUM.md` and select the unique `NEXT` lesson.
2. Read `docs/06_LESSON_AUTHORING.md` and apply its lesson contract.
3. Inspect existing `LIVE`, `DRILL` and `PROBE` implementations relevant to that lesson before writing new machinery.
4. Read other project sources only if the concrete lesson crosses into them.
5. Verify the exact ROOT/physics behavior taught by the lesson against authoritative sources.
6. Implement one polished learner-facing vertical slice, not the following lessons.
7. Run the relevant build/tests and verify the causal learner behavior.
8. Only when the lesson satisfies the definition of done, mark it `LIVE` in the curriculum and promote exactly one subsequent eligible lesson to `NEXT`.

Do not skip curriculum order merely because another lesson is easier or more visually interesting.

Before coding:

1. identify the concrete learner or engineering outcome;
2. inspect the relevant existing flow;
3. route to the smallest source set;
4. identify the smallest causal change;
5. define the observable behavior that proves it correct.

Prefer one polished vertical slice over generalized infrastructure. Do not create a learning engine, component library, state framework, or new dependency for hypothetical future lessons.

Reusable teaching primitives and patterns are documented in `docs/06_LESSON_AUTHORING.md`; the engine boundary remains authoritative in `src/learning/README.md`. Promote a mechanic to shared infrastructure only after real repetition reveals a stable shape or a cross-cutting correctness requirement demands it.

For ROOT or physics behavior, authoritative ROOT/CERN/experiment sources outrank inference. Repository code and tests outrank stale implementation descriptions.

Teaching default: **Manipulate → Observe → Predict → Code.**
