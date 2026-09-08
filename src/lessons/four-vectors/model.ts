export type PhotonKinematics = {
  pt: number;
  eta: number;
  phi: number;
};

export type DiphotonScenario = {
  id: string;
  label: string;
  photon1: PhotonKinematics;
  photon2: PhotonKinematics;
};

export const D5_SCENARIOS: readonly DiphotonScenario[] = [
  {
    id: 'close',
    label: 'A',
    photon1: { pt: 50, eta: 0, phi: 0 },
    photon2: { pt: 50, eta: 0, phi: 0.4 },
  },
  {
    id: 'back-to-back',
    label: 'B',
    photon1: { pt: 50, eta: 0, phi: 0 },
    photon2: { pt: 50, eta: 0, phi: Math.PI },
  },
  {
    id: 'asymmetric',
    label: 'C',
    photon1: { pt: 40, eta: 0.4, phi: 0.2 },
    photon2: { pt: 55, eta: -0.3, phi: 2.4 },
  },
] as const;

function masslessCartesian(photon: PhotonKinematics) {
  return {
    px: photon.pt * Math.cos(photon.phi),
    py: photon.pt * Math.sin(photon.phi),
    pz: photon.pt * Math.sinh(photon.eta),
    energy: photon.pt * Math.cosh(photon.eta),
  };
}

export function diphotonInvariantMass(scenario: DiphotonScenario) {
  const p1 = masslessCartesian(scenario.photon1);
  const p2 = masslessCartesian(scenario.photon2);
  const energy = p1.energy + p2.energy;
  const px = p1.px + p2.px;
  const py = p1.py + p2.py;
  const pz = p1.pz + p2.pz;
  const massSquared = energy ** 2 - px ** 2 - py ** 2 - pz ** 2;
  return Math.sqrt(Math.max(0, massSquared));
}

export function evaluateOpeningPrediction(value: string) {
  return value === 'back-to-back-larger';
}

export function evaluateTransfer(value: string) {
  return value === 'mass-doubles';
}
