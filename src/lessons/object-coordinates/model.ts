export type CoordinateKey = 'pt' | 'eta' | 'phi';
export type PhotonPreset = { id: string; pt: number; eta: number; phi: number };

export const photonPresets: PhotonPreset[] = [
  { id: 'baseline', pt: 45, eta: 0, phi: 0 },
  { id: 'harder', pt: 70, eta: 0, phi: 0 },
  { id: 'forward', pt: 45, eta: 2, phi: 0 },
  { id: 'rotated', pt: 45, eta: 0, phi: Math.PI / 2 },
];

export function getPreset(id: string): PhotonPreset {
  const preset = photonPresets.find((candidate) => candidate.id === id);
  if (!preset) throw new Error(`Unknown photon preset: ${id}`);
  return preset;
}

export function changedCoordinates(reference: PhotonPreset, candidate: PhotonPreset): CoordinateKey[] {
  return (['pt', 'eta', 'phi'] as const).filter((key) => reference[key] !== candidate[key]);
}

export function etaRegion(eta: number): 'central' | 'forward-positive' | 'forward-negative' {
  if (Math.abs(eta) < 1) return 'central';
  return eta > 0 ? 'forward-positive' : 'forward-negative';
}

export function coordinateForQuestion(question: 'transverse-hardness' | 'around-beam' | 'beam-direction'): CoordinateKey {
  if (question === 'transverse-hardness') return 'pt';
  if (question === 'around-beam') return 'phi';
  return 'eta';
}
