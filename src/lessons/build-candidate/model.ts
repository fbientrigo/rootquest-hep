export type CandidatePhoton = {
  id: string;
  pt: number;
  eta: number;
  phi: number;
};

export type CandidateSnapshot = {
  mask: readonly boolean[];
  selected: readonly CandidatePhoton[];
  ordered: readonly CandidatePhoton[];
  candidate: readonly [CandidatePhoton, CandidatePhoton] | null;
  mass: number | null;
};

export const D6_EVENT: readonly CandidatePhoton[] = [
  { id: 'D', pt: 35, eta: 0.8, phi: -2.1 },
  { id: 'C', pt: 44, eta: -0.5, phi: 2.8 },
  { id: 'A', pt: 62, eta: 0.2, phi: 0.1 },
  { id: 'B', pt: 28, eta: 1.1, phi: -0.4 },
] as const;

function masslessCartesian(photon: CandidatePhoton) {
  return {
    px: photon.pt * Math.cos(photon.phi),
    py: photon.pt * Math.sin(photon.phi),
    pz: photon.pt * Math.sinh(photon.eta),
    energy: photon.pt * Math.cosh(photon.eta),
  };
}

export function diphotonMass(photon1: CandidatePhoton, photon2: CandidatePhoton) {
  const p1 = masslessCartesian(photon1);
  const p2 = masslessCartesian(photon2);
  const energy = p1.energy + p2.energy;
  const px = p1.px + p2.px;
  const py = p1.py + p2.py;
  const pz = p1.pz + p2.pz;
  const massSquared = energy ** 2 - px ** 2 - py ** 2 - pz ** 2;
  return Math.sqrt(Math.max(0, massSquared));
}

export function buildCandidate(
  photons: readonly CandidatePhoton[],
  ptMin = 30,
): CandidateSnapshot {
  const mask = photons.map((photon) => photon.pt > ptMin);
  const selected = photons.filter((_, index) => mask[index]);
  const ordered = [...selected].sort((a, b) => b.pt - a.pt);
  const candidate = ordered.length >= 2
    ? [ordered[0], ordered[1]] as const
    : null;
  const mass = candidate ? diphotonMass(candidate[0], candidate[1]) : null;
  return { mask, selected, ordered, candidate, mass };
}

export function evaluatePairPrediction(value: string) {
  return value === 'A-C';
}

export function evaluateTransfer(value: string) {
  return value === 'filter-before-indexing';
}
