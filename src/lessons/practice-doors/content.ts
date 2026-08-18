export type Choice = { value: string; label: string };

export type PracticeStage = {
  title: string;
  prompt: string;
  kind: 'selection' | 'choice';
  goal?: string;
  options?: Choice[];
  success?: string;
  miss?: string;
  reveal?: string;
};

export type PracticeModeDefinition = {
  action: string;
  name: string;
  description: string;
  stages: PracticeStage[];
};

export const practiceModes: Record<string, PracticeModeDefinition> = {
  manipulate: {
    action: 'Manipulate',
    name: 'Selection Lab',
    description: 'Move a real analysis threshold and learn the signal/background trade-off by seeing the sample change immediately.',
    stages: [
      {
        title: 'Keep most of the signal',
        prompt: 'Raise the photon pT threshold until at least 4 signal examples remain while background falls to 5 or fewer.',
        kind: 'selection',
        goal: 'Signal ≥ 4 · Background ≤ 5',
      },
      {
        title: 'Tighten the selection',
        prompt: 'Now keep at least 3 signal examples while reducing background to 3 or fewer.',
        kind: 'selection',
        goal: 'Signal ≥ 3 · Background ≤ 3',
      },
      {
        title: 'Find the sharper compromise',
        prompt: 'Finish with at least 2 signal examples and no more than 2 background examples.',
        kind: 'selection',
        goal: 'Signal ≥ 2 · Background ≤ 2',
      },
    ],
  },
  observe: {
    action: 'Observe',
    name: 'Event Detective',
    description: 'Read a compact event record, notice which observable matters, and eliminate candidates one reason at a time.',
    stages: [
      {
        title: 'Apply the first clue',
        prompt: 'The analysis requires exactly two photons. Which event can be rejected immediately?',
        kind: 'choice',
        options: [
          { value: 'a', label: 'Event A' },
          { value: 'b', label: 'Event B' },
          { value: 'c', label: 'Event C' },
        ],
        success: 'Correct. Event C has only one photon, so it fails before any other observable matters.',
        miss: 'Check photon multiplicity first. The rule is exactly two photons.',
      },
      {
        title: 'Use detector acceptance',
        prompt: 'Among the two-photon events, which one fails |η| < 2.5?',
        kind: 'choice',
        options: [
          { value: 'a', label: 'Event A' },
          { value: 'b', label: 'Event B' },
        ],
        success: 'Correct. Event B has |η| = 2.8, outside the stated acceptance.',
        miss: 'Compare the absolute η values with 2.5.',
      },
      {
        title: 'Inspect what survives',
        prompt: 'Which surviving event is the Higgs-like diphoton candidate near 125 GeV?',
        kind: 'choice',
        options: [
          { value: 'a', label: 'Event A' },
          { value: 'b', label: 'Event B' },
          { value: 'c', label: 'Event C' },
        ],
        success: 'Correct. Event A survives the stated cuts and has mγγ = 125 GeV.',
        miss: 'First keep only events that survived the earlier rules, then compare diphoton mass.',
      },
    ],
  },
  predict: {
    action: 'Predict',
    name: 'Prediction Trials',
    description: 'Commit to a consequence before the system reveals it. The goal is a causal model, not a lucky click.',
    stages: [
      {
        title: 'Tighten a cut',
        prompt: 'The threshold rises from 30 to 40 GeV. What happens to the number of selected events in this sample?',
        kind: 'choice',
        options: [
          { value: 'more', label: 'More events survive' },
          { value: 'fewer', label: 'Fewer events survive' },
          { value: 'same', label: 'Exactly the same events survive' },
        ],
        success: 'Correct. Tightening the threshold removes events that were between 30 and 40 GeV.',
        miss: 'A stricter lower threshold cannot add an event that previously failed it.',
      },
      {
        title: 'Predict efficiency',
        prompt: 'For the same sample, what happens to signal efficiency when the threshold moves from 30 to 40 GeV?',
        kind: 'choice',
        options: [
          { value: 'increase', label: 'It increases' },
          { value: 'decrease', label: 'It decreases' },
          { value: 'unchanged', label: 'It is unchanged' },
        ],
        success: 'Correct. One signal example is removed, so signal efficiency falls from 4/5 to 3/5.',
        miss: 'Efficiency counts retained signal relative to the original signal sample.',
      },
      {
        title: 'Separate data from representation',
        prompt: 'You keep the selected events fixed but increase the histogram bin count. What changed?',
        kind: 'choice',
        options: [
          { value: 'events', label: 'The underlying events changed' },
          { value: 'grouping', label: 'Only the grouping of values changed' },
          { value: 'selection', label: 'The selection became tighter' },
        ],
        success: 'Correct. Binning changes the representation, not which events are in the sample.',
        miss: 'No selection rule changed in this step.',
      },
    ],
  },
  code: {
    action: 'Code',
    name: 'ROOT Builder',
    description: 'Map an analysis decision you already understand to the ROOT operation that expresses it.',
    stages: [
      {
        title: 'Express a selection',
        prompt: 'You want to keep only events with exactly two photons. Which RDataFrame operation matches that action?',
        kind: 'choice',
        options: [
          { value: 'filter', label: 'Filter' },
          { value: 'define', label: 'Define' },
          { value: 'histo1d', label: 'Histo1D' },
        ],
        success: 'Correct. Filter keeps rows that satisfy a condition.',
        miss: 'Choose the operation whose meaning is to keep or reject rows.',
        reveal: 'df.Filter("photon_n == 2")',
      },
      {
        title: 'Create an observable',
        prompt: 'You have two photon four-vectors and want a new diphoton-mass column. Which operation expresses that?',
        kind: 'choice',
        options: [
          { value: 'filter', label: 'Filter' },
          { value: 'define', label: 'Define' },
          { value: 'histo1d', label: 'Histo1D' },
        ],
        success: 'Correct. Define creates a derived column from existing event information.',
        miss: 'The task is to create a new quantity, not reject events or draw a distribution.',
        reveal: 'df.Define("mgg", "(photon_p4[0] + photon_p4[1]).M()")',
      },
      {
        title: 'Summarize many events',
        prompt: 'You now want the distribution of mγγ across the selected sample. Which operation is the natural next step?',
        kind: 'choice',
        options: [
          { value: 'filter', label: 'Filter' },
          { value: 'define', label: 'Define' },
          { value: 'histo1d', label: 'Histo1D' },
        ],
        success: 'Correct. Histo1D turns the values of a column into a one-dimensional distribution.',
        miss: 'The observable already exists; now you want to summarize its values across events.',
        reveal: 'df.Histo1D({"mgg", "Diphoton mass", 30, 100., 160.}, "mgg")',
      },
    ],
  },
};
