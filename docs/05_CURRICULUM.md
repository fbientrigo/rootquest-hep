# ROOT Quest Curriculum — the 80/20 path

This is the canonical learning sequence for ROOT Quest.

Use it to answer three questions:

1. What should a learner know next?
2. Which lesson should be implemented next?
3. Which ROOT topics are core, optional, or intentionally out of scope?

The curriculum is intentionally smaller than ROOT. Its goal is independent, everyday analysis competence: a physics undergraduate should be able to inspect a ROOT dataset, reason about events and distributions, build a small analysis with modern ROOT, interpret the result, and continue from official documentation without depending on ROOT Quest.

## Learning destination

A learner who completes the core path should be able to:

- inspect an unfamiliar `.root` file and identify useful objects, trees, branches and entries;
- explain the difference between an event, object, column, selection and distribution;
- create, read, normalize and compare histograms and graphs with uncertainties;
- express an analysis as an `RDataFrame` pipeline using `Filter`, `Define` and common actions;
- work with vector-like particle collections and basic HEP kinematics;
- construct a candidate and an invariant-mass distribution;
- reason about signal/background trade-offs, cutflows, event weights and Data/MC comparisons;
- perform and diagnose a simple fit;
- read official ROOT documentation and transfer an analysis idea into ROOT code.

The target is not API recall. The target is a correct mental model plus enough high-frequency ROOT vocabulary to work independently.

## Course shape

ROOT Quest uses one spiral anchor and six units.

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
      ↘
       revisit earlier ideas with less support
```

The Higgs Hunt is not a one-off final exam. It is the motivating vertical slice: learners first experience the analysis loop with support, then progressively understand the machinery beneath it, and finally revisit the same reasoning with fewer labels and hints.

## Curriculum status vocabulary

Exactly one learner-facing lesson should normally be `NEXT`.

- **LIVE** — polished learner-facing lesson exists and satisfies the current lesson contract.
- **DRILL** — useful practice exists, but it is not a full curricular lesson.
- **PROBE** — mechanic or concept exists in an internal lab/prototype and should be reused rather than rebuilt.
- **NEXT** — next lesson to implement.
- **PLANNED** — ordered future lesson.
- **BONUS** — intentionally outside the core path.

Do not mark a lesson `LIVE` because code exists somewhere. It must have a coherent learner outcome, teaching loop and verification.

## Spiral anchor

| ID | Experience | Status | Purpose |
| --- | --- | --- | --- |
| H0 | **Higgs Hunt — guided** | LIVE | Give the learner the whole analysis loop early: inspect objects → make a selection → move a cut → read a mass distribution → recognize the equivalent `RDataFrame` code. |

Existing `practice/*` activities are supporting drills, not substitutes for the ordered lessons below. Existing `lab/*` interactions are prototypes to harvest.

---

# Unit A — Data become distributions

Goal: build histogram and measurement intuition before treating ROOT syntax as the concept.

| ID | Lesson | Learner outcome | ROOT 80/20 surface | Status / reuse |
| --- | --- | --- | --- | --- |
| A1 | **Same data, different bins** | Distinguish underlying values from their histogram representation; predict what binning changes and what it cannot change. | histogram concept, bins, range, under/overflow vocabulary | **LIVE** — learner-facing lesson promotes the histogram probe model; Higgs Hunt continues to reinforce binning. |
| A2 | **Build a histogram** | Turn individual measurements into a distribution and connect `Fill` to one event contributing to one bin. | `TH1D`, `Fill`, `Draw`, axes | **LIVE** — learner-facing lesson fills a fixed `TH1D` one measurement at a time and maps each action to ROOT code. |
| A3 | **Read and compare histograms** | Extract counts and summaries, normalize two samples appropriately, and identify when a comparison is misleading. | `Integral`, `Scale`, `GetBinContent`, `GetMean`, `GetStdDev` | **LIVE** — learner-facing lesson contrasts raw yield with unit-area shape using two samples whose relative bin pattern is identical but totals differ. |
| A4 | **Measurements with errors** | Distinguish a distribution from a set of measured points and interpret error bars. | `TGraph`, `TGraphErrors` | **LIVE** — learner-facing lesson keeps measured central values fixed while uncertainty bars change, then transfers the learner to choosing graph-with-errors vs histogram representations. |

Observable unit proof: given a small dataset, the learner can choose a sensible representation, explain the effect of changing bins, and reproduce it with basic ROOT objects.

---

# Unit B — Open the ROOT file

Goal: make ROOT's data model tangible enough that an unfamiliar file is inspectable rather than opaque.

| ID | Lesson | Learner outcome | ROOT 80/20 surface | Status / reuse |
| --- | --- | --- | --- | --- |
| B1 | **Open and inspect a ROOT file** | Open an unfamiliar file, list its contents and retrieve a named object. | `TFile.Open`, `ls`, `Get`, `rootls` | **LIVE** — learner-facing lesson turns a synthetic ROOT-file inventory into an inspect → identify → `Get` workflow, with `rootls` as the shell equivalent. |
| B2 | **Tree, branch, entry** | Map `TTree → branch → entry value` to dataset/column/row mental models without claiming they are identical implementations. | `TTree`, branches, entries | **LIVE** — learner-facing lesson promotes the existing tree-browser probe, adds entry selection as an independent coordinate, and maps `TTree ≈ dataset`, branch ≈ column, entry ≈ row-like record with an explicit analogy caveat. |
| B3 | **Collections inside events** | Recognize scalar vs vector-like branches and explain why one event can contain many jets/photons/tracks. | vector-like branch values; bridge to `RVec` | **LIVE** — learner-facing lesson reuses B2's synthetic `photon_pt` and `event_weight` branches to separate entry count from collection multiplicity, then bridges supported collection columns to `ROOT::RVec`. |
| B4 | **Use ROOT without memorizing ROOT** | Find a class, method, signature and example from ROOT's own help/documentation and choose the relevant operation. | PyROOT import, ROOT prompt/help, class reference, tutorials | **LIVE** — learner-facing lesson starts from an analysis intention, routes to the relevant class reference, extracts `Filter` method/signature/example evidence, introduces `.help`/`.Class` and tutorials as complementary sources, then transfers the lookup strategy to `Count`. |

Observable unit proof: give the learner a small unfamiliar ROOT file and a question; they can locate the relevant tree/branches and explain what one entry represents.

---

# Unit C — Analysis as a data pipeline

Goal: make modern everyday analysis fluent around `RDataFrame`, with syntax following the transformation model.

| ID | Lesson | Learner outcome | ROOT 80/20 surface | Status / reuse |
| --- | --- | --- | --- | --- |
| C1 | **A pipeline transforms a dataset** | Trace which events enter, are removed and survive successive operations. | `RDataFrame` mental model | **LIVE** — learner-facing lesson promotes the existing filtering trace: six synthetic events pass through two sequential filters, with prediction before reveal and an explicit `RDataFrame` chain showing that the second filter receives only first-filter survivors. |
| C2 | **Filter: keep rows for a reason** | Translate a stated selection criterion into a filter and predict its effect before applying it. | `Filter` | **NEXT** — promote the existing `practice/code` and Higgs Hunt Filter drills into a full curricular lesson rather than rebuilding the mechanic. |
| C3 | **Define: create an observable** | Create a derived quantity without confusing transformation with selection. | `Define` | **DRILL** — `practice/code` contains a working example. |
| C4 | **Actions summarize the sample** | Choose an action that answers a question about the current dataframe. | `Histo1D`, `Histo2D`, `Count`, `Mean`, `Sum`, `Min`, `Max` | **DRILL** for `Histo1D`; remaining actions planned. |
| C5 | **Cutflow: where did the events go?** | Diagnose a selection pipeline by measuring survival at each stage rather than guessing from the final plot. | named `Filter`s, `Report` | PLANNED |
| C6 | **Keep a useful derived sample** | Decide when to persist selected/derived columns and when not to. | `Snapshot`, `Range` as a small debugging aid | PLANNED |

Observable unit proof: from a stated analysis question, the learner can build and explain a small `RDataFrame` chain and trace the consequence of each operation.

---

# Unit D — Events contain physics objects

Goal: connect vector-like data structures to the physical quantities used in introductory HEP analysis.

| ID | Lesson | Learner outcome | ROOT 80/20 surface | Status / reuse |
| --- | --- | --- | --- | --- |
| D1 | **Coordinates of a reconstructed object** | Interpret `pT`, `eta` and `phi` geometrically and identify which quantity answers a stated detector/kinematic question. | common HEP columns | PLANNED — Higgs Hunt already uses `pT` and photon-like objects. |
| D2 | **Select objects, then events** | Separate an object-level mask from an event-level requirement. | `ROOT::VecOps::RVec`, boolean masks | PLANNED |
| D3 | **Work with collections** | Filter and summarize variable-length particle collections without manual per-event bookkeeping. | `RVec`, masks, `size`, common VecOps patterns | PLANNED |
| D4 | **Angular separation** | Predict and compute when two objects are close/far in detector coordinates. | `DeltaR` concept / appropriate ROOT VecOps or math helper | PLANNED |
| D5 | **Four-vectors and invariant mass** | Manipulate two object momenta, predict qualitative mass changes, then compute the candidate mass. | modern `ROOT::Math` Lorentz-vector types; avoid teaching `TLorentzVector` as the default | PLANNED — Higgs Hunt already visualizes `m_gg`. |
| D6 | **Build a candidate** | Combine object selection, ordering and kinematics into a derived event-level candidate. | `RVec` + `Define` + four-vectors | PLANNED |

Observable unit proof: the learner can construct a physically meaningful two-object candidate from event collections and explain each selection and derived quantity.

---

# Unit E — From plots to evidence

Goal: stop treating a histogram as the answer; introduce the minimum statistical and normalization machinery needed to interpret it responsibly.

| ID | Lesson | Learner outcome | ROOT 80/20 surface | Status / reuse |
| --- | --- | --- | --- | --- |
| E1 | **Signal and background trade-offs** | Explain efficiency/rejection and why tightening a cut can help one metric while hurting another. | selections + histogram comparison | **DRILL** — `practice/manipulate` and Higgs Hunt already teach this causally. |
| E2 | **Event weights and normalization** | Explain why simulated events may contribute unequal weight and compute a weighted distribution. | weight column, weighted `Histo1D`, `Sum` | PLANNED — `event_weight` already appears in the tree probe. |
| E3 | **Data vs simulation** | Compare Data and MC without silently normalizing away the question being asked. | `Add`, `Divide`, histogram arithmetic/normalization, stacked or overlaid comparison when pedagogically justified | PLANNED |
| E4 | **Fit a simple model** | Connect a visible model shape to parameters and fit a simple function over a justified range. | `TF1`, `Fit` | PLANNED |
| E5 | **Read a fit critically** | Inspect residuals/parameter uncertainties/goodness-of-fit cues and recognize an obviously inadequate model. | fit result essentials, chi-square vocabulary where appropriate | PLANNED |
| E6 | **Signal and control regions** | Distinguish selecting a region to test a hypothesis from tuning a cut until a desired answer appears. | selections, regions, blinded/discovery framing | PLANNED |

Observable unit proof: given signal/background or Data/MC distributions, the learner can explain normalization, make a defensible comparison and fit a simple model without overstating the result.

---

# Unit F — Work independently

Goal: fade support until the learner can transfer the mental model to a new small analysis and official ROOT material.

| ID | Lesson | Learner outcome | ROOT 80/20 surface | Status / reuse |
| --- | --- | --- | --- | --- |
| F1 | **Assemble an analysis from a question** | Decide which columns, derived observables, selections and outputs are needed before seeing a completed pipeline. | `TFile`/`TTree` + `RDataFrame` + histograms | PLANNED |
| F2 | **Higgs Hunt — discovery revisit** | Repeat the familiar analysis with truth labels and explanatory scaffolding reduced; justify choices from observables/distributions. | integrated core | PLANNED — reuse H0 mechanics and state, do not clone the experience. |
| F3 | **Independent mini-analysis** | Analyze a second small dataset/problem with a different surface story and produce a defensible result. | integrated core | PLANNED |
| F4 | **Leave ROOT Quest** | Use official ROOT documentation/tutorials to reproduce or extend an analysis operation not directly taught by ROOT Quest. | documentation literacy | PLANNED |

Observable course proof: the learner can complete a small unfamiliar analysis and explain the causal chain from input data to final distribution/result.

---

# Core vs bonus boundary

The core deliberately stops before ROOT becomes a specialist curriculum.

Useful follow-on material can be added as `BONUS` only when the core path is healthy:

- RooFit / RooStats;
- RNTuple internals and migration-oriented material;
- TMVA;
- HistFactory;
- unfolding;
- distributed `RDataFrame`;
- advanced multithreading;
- custom C++ class I/O;
- large application/CMake architecture;
- detector geometry/event-display frameworks.

A bonus topic must not block a core lesson.

# Language and API stance

- Teach **analysis ideas first**, then ROOT syntax.
- Prefer modern ROOT interfaces for new material.
- `RDataFrame` is the default analysis model for the core path.
- PyROOT is an appropriate low-friction teaching surface; C++ ROOT expressions may be shown where they are the natural ROOT representation or where the concept transfers directly.
- Do not make language syntax the learning objective unless syntax itself is the obstacle.
- Do not teach legacy APIs as the preferred new workflow when ROOT documents a modern replacement.

# Curriculum sources

The ordering is informed by the recurring core in authoritative/established learning material, especially:

- ROOT Student Course — <https://github.com/root-project/student-course>
- ROOT Primer — <https://root.cern/primer/>
- ROOT Tutorials — <https://root.cern/tutorials/>
- ATLAS Open Data learning material — <https://opendata.atlas.cern/>
- HSF analysis training — <https://hsf-training.github.io/>

These sources guide coverage; ROOT Quest should not copy their notebook-first teaching format. For a technical ROOT claim inside a lesson, verify the exact current behavior against authoritative ROOT documentation before encoding it.

# How the roadmap advances

When a lesson becomes `LIVE`:

1. change its status in this file;
2. promote exactly one subsequent eligible `PLANNED` lesson to `NEXT`;
3. preserve any `PROBE`/`DRILL` labels in the reuse notes if useful, but never implement the same mechanic twice;
4. if implementation reveals that curriculum ordering is wrong, make the smallest evidence-based curriculum edit rather than silently skipping lessons.

The default next lesson on this roadmap is **C2 — Filter: keep rows for a reason**.
