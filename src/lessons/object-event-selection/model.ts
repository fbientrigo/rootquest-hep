export type Photon = { pt: number; eta: number };
export type SelectionSnapshot = {
  photons: readonly Photon[];
  mask: readonly boolean[];
  selected: readonly Photon[];
  eventPasses: boolean;
};

export const D2_EVENTS: readonly (readonly Photon[])[] = [
  [{ pt: 52, eta: 0.4 }, { pt: 34, eta: 2.1 }, { pt: 22, eta: 0.7 }],
  [{ pt: 41, eta: 0.3 }, { pt: 27, eta: 1.4 }, { pt: 19, eta: 2.2 }],
] as const;

export function selectObjects(
  photons: readonly Photon[],
  ptMin = 30,
  etaMax = 2.5,
  minObjects = 2,
): SelectionSnapshot {
  const mask = photons.map((photon) => photon.pt > ptMin && Math.abs(photon.eta) < etaMax);
  const selected = photons.filter((_, index) => mask[index]);
  return { photons, mask, selected, eventPasses: selected.length >= minObjects };
}

export function evaluateMaskPrediction(value: string) {
  return value === 'mask-does-not-decide-event';
}

export function evaluateTransfer(value: string) {
  return value === 'select-objects-then-count';
}
