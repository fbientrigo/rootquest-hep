# First Vertical Slice — Higgs Hunt

## Goal

Validate ROOT Quest with one polished end-to-end learning experience rather than broad curriculum coverage.

The learner should be able to:

1. inspect collision events;
2. identify reconstructed particles;
3. select or reject events;
4. manipulate simple cuts;
5. see selections update immediately;
6. build and read an invariant-mass histogram;
7. discover an excess near the Higgs mass;
8. see the ROOT code corresponding to the analysis they performed.

Do not build ten unfinished lessons when one polished experience can validate the idea.

## Narrative arc

```text
inspect a particle
    ↓
inspect an event
    ↓
classify a few events manually
    ↓
realize thousands cannot be inspected one by one
    ↓
introduce cuts
    ↓
watch cuts reshape the sample
    ↓
build distributions
    ↓
identify a mass structure
    ↓
express the workflow in ROOT
```

The learner should reach the feeling: **now I understand why we need histograms, selections and ROOT.**

## Act 1 — See

Show one collision event with only the information necessary for the exercise. Let the learner inspect reconstructed objects and basic quantities without detector-detail overload.

Goal: distinguish particle/object/event.

## Act 2 — Choose

Give a small number of events and ask the learner to keep or reject them. Training mode may reveal afterward whether a choice retained signal or background.

Goal: establish that analysis is selection.

## Act 3 — Cut

Manual classification stops scaling. Introduce the minimum useful thresholds and selections. Every change updates relevant results immediately.

Goal: understand a cut as a rule applied consistently to many events.

## Act 4 — Plot

Introduce the histogram because individual inspection no longer scales. Teach only the histogram concepts needed to interpret the result: variable, counts, bins, range and selection effects.

Goal: move from events to distributions.

## Act 5 — Discover

Remove training labels. Let the learner choose sensible selections and look for structure in the data. Do not reduce the answer to one magic slider combination.

Goal: make the statistical signal feel discovered rather than displayed.

## Act 6 — ROOT

Show the equivalent ROOT workflow after the learner has built the analysis visually. Only expose API surface corresponding to operations they already performed.

## 2D / 3D rule

Start with the simplest representation that teaches the required geometry. Enable 3D only when it improves spatial understanding. The MVP must not depend on detailed detector simulation.

## Dataset rule

Use the smallest dataset that preserves the lesson. Prepared educational representations are acceptable when provenance and transformations are reproducible and the physics meaning is not silently altered.

## MVP acceptance

A new learner can, without blindly following code:

- distinguish particles, events and samples;
- explain what a simple cut does;
- predict the direction of change from tightening/loosening a cut;
- read the basic invariant-mass histogram;
- explain why many events are summarized statistically;
- identify the interesting mass region;
- recognize ROOT code as the formal version of actions already performed.

## Explicit non-goals

Do not expand this slice into a complete ROOT curriculum, full detector reconstruction, advanced statistics, production analysis, account system, leaderboard, generic visualization framework or game engine.
