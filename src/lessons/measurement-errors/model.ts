export type MeasurementPoint = { x: number; y: number; ex: number; ey: number };

export const measurementPoints: MeasurementPoint[] = [
  { x: 1, y: 2.2, ex: 0, ey: 0.25 },
  { x: 2, y: 3.1, ex: 0, ey: 0.35 },
  { x: 3, y: 4.0, ex: 0, ey: 0.30 },
  { x: 4, y: 4.6, ex: 0, ey: 0.50 },
  { x: 5, y: 5.4, ex: 0, ey: 0.40 },
];

export function scaledPoints(scale: number): MeasurementPoint[] {
  if (!(scale > 0)) throw new Error('uncertainty scale must be positive');
  return measurementPoints.map((point) => ({ ...point, ey: point.ey * scale }));
}

export function yInterval(point: MeasurementPoint): [number, number] {
  return [point.y - point.ey, point.y + point.ey];
}

export function evaluateErrorPrediction(value: string) {
  const correct = value === 'same-center-wider-bar';
  return {
    correct,
    message: correct
      ? 'Doubling the y uncertainty leaves the measured central value unchanged and doubles the vertical error-bar half-width.'
      : 'An uncertainty bar describes the reported uncertainty around a point; it does not create events or move the measured central value.',
  };
}

export function evaluateRepresentationTransfer(value: string) {
  const correct = value === 'graph-errors';
  return {
    correct,
    message: correct
      ? 'Use measured points with error bars: the x positions are chosen measurement conditions, the y values are results, and the bars carry their uncertainties.'
      : 'A histogram is appropriate for a distribution of many observations. Here each x position has one reported measurement with an uncertainty.',
  };
}
