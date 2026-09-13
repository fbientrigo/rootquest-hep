export type FitRange = 'model-window' | 'full';

export type FitPoint = { x: number; y: number };

export const FIT_POINTS: readonly FitPoint[] = [
  { x: 0, y: 2.1 },
  { x: 1, y: 3.4 },
  { x: 2, y: 5.2 },
  { x: 3, y: 6.4 },
  { x: 4, y: 8.1 },
  { x: 5, y: 15.5 },
  { x: 6, y: 18.0 },
] as const;

export const MODEL_WINDOW = { min: 0, max: 4 } as const;
export const FIXED_INTERCEPT = 2.0;

export function linearValue(x: number, intercept: number, slope: number): number {
  return intercept + slope * x;
}

export function pointsForRange(range: FitRange): readonly FitPoint[] {
  return range === 'model-window'
    ? FIT_POINTS.filter((point) => point.x >= MODEL_WINDOW.min && point.x <= MODEL_WINDOW.max)
    : FIT_POINTS;
}

export function fitLinearLeastSquares(range: FitRange): { intercept: number; slope: number; minX: number; maxX: number } {
  const points = pointsForRange(range);
  const meanX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const covariance = points.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0);
  const variance = points.reduce((sum, point) => sum + (point.x - meanX) ** 2, 0);
  const slope = covariance / variance;
  const intercept = meanY - slope * meanX;
  return {
    intercept,
    slope,
    minX: points[0].x,
    maxX: points[points.length - 1].x,
  };
}

export function evaluatePrediction(value: string): boolean {
  return value === 'slope-increases';
}

export function evaluateTransfer(value: string): boolean {
  return value === 'tf1-range-r';
}
