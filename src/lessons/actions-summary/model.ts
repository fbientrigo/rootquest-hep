export type ActionId = 'count' | 'mean' | 'sum' | 'histo1d';

export type ActionQuestion = {
  id: string;
  prompt: string;
  action: ActionId;
  column?: string;
  code: string;
};

export const ACTION_QUESTIONS: ActionQuestion[] = [
  {
    id: 'entries',
    prompt: 'How many rows are in the current sample?',
    action: 'count',
    code: 'n = df.Count()',
  },
  {
    id: 'mean-mass',
    prompt: 'What is the average diphoton mass?',
    action: 'mean',
    column: 'mass',
    code: 'mean_mass = df.Mean("mass")',
  },
  {
    id: 'sum-weight',
    prompt: 'What is the total event weight?',
    action: 'sum',
    column: 'event_weight',
    code: 'total_weight = df.Sum("event_weight")',
  },
  {
    id: 'mass-shape',
    prompt: 'How are diphoton-mass values distributed across the sample?',
    action: 'histo1d',
    column: 'mass',
    code: 'mass_hist = df.Histo1D(("mgg", "Diphoton mass", 12, 100., 160.), "mass")',
  },
];

export const ACTION_LABELS: Record<ActionId, string> = {
  count: 'Count',
  mean: 'Mean',
  sum: 'Sum',
  histo1d: 'Histo1D',
};

export function questionById(id: string) {
  return ACTION_QUESTIONS.find((question) => question.id === id) ?? ACTION_QUESTIONS[0];
}

export function actionMatchesQuestion(questionId: string, action: string) {
  return questionById(questionId).action === action;
}

export function transferActionForIntent(intent: 'minimum' | 'maximum' | 'relationship') {
  if (intent === 'minimum') return 'Min';
  if (intent === 'maximum') return 'Max';
  return 'Histo2D';
}
