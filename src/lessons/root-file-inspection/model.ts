export type RootObjectKind = 'TTree' | 'TH1D' | 'TGraphErrors';

export type RootFileObject = {
  name: string;
  kind: RootObjectKind;
  title: string;
  detail: string;
};

export const demoRootFile = {
  name: 'analysis.root',
  objects: [
    { name: 'Events', kind: 'TTree', title: 'Selected collision events', detail: '12,480 entries' },
    { name: 'm_gg', kind: 'TH1D', title: 'Diphoton invariant mass', detail: '40 bins · 100–160 GeV' },
    { name: 'efficiency', kind: 'TGraphErrors', title: 'Selection efficiency', detail: '5 measured points' },
  ] satisfies RootFileObject[],
} as const;

export function listRootObjects(): RootFileObject[] {
  return [...demoRootFile.objects];
}

export function getRootObject(name: string): RootFileObject | undefined {
  return demoRootFile.objects.find((object) => object.name === name);
}

export function evaluateObjectChoice(value: string) {
  const correct = value === 'm_gg';
  return {
    correct,
    message: correct
      ? 'The mass histogram is stored under the key m_gg, so Get("m_gg") retrieves that named object.'
      : 'Listing tells you the stored names and classes first. Retrieve the object whose name and type match the question.',
  };
}

export function evaluateInspectionTransfer(value: string) {
  const correct = value === 'list-first';
  return {
    correct,
    message: correct
      ? 'Inspect the file contents first, then retrieve the object you can name and justify.'
      : 'Guessing an object name skips the evidence the file itself provides. List or inspect its contents first.',
  };
}
