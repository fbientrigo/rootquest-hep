import { pointsForRange, type FitRange } from '../simple-fit/model.ts';

export const POINT_UNCERTAINTY = 0.2;

export type FitDiagnosticPoint = {
  x: number;
  y: number;
  prediction: number;
  residual: number;
  pull: number;
};

export type FitDiagnostics = {
  range: FitRange;
  intercept: number;
  slope: number;
  interceptError: number;
  slopeError: number;
  chi2: number;
  ndf: number;
  reducedChi2: number;
  points: readonly FitDiagnosticPoint[];
};

export function diagnoseLinearFit(range: FitRange): FitDiagnostics {
  const points = pointsForRange(range);
  const n = points.length;
  const sumX = points.reduce((sum, point) => sum + point.x, 0);
  const sumX2 = points.reduce((sum, point) => sum + point.x ** 2, 0);
  const sumY = points.reduce((sum, point) => sum + point.y, 0);
  const sumXY = points.reduce((sum, point) => sum + point.x * point.y, 0);
  const determinant = n * sumX2 - sumX ** 2;
  const intercept = (sumX2 * sumY - sumX * sumXY) / determinant;
  const slope = (n * sumXY - sumX * sumY) / determinant;

  const variance = POINT_UNCERTAINTY ** 2;
  const interceptError = Math.sqrt(variance * sumX2 / determinant);
  const slopeError = Math.sqrt(variance * n / determinant);
  const diagnosticPoints = points.map((point) => {
    const prediction = intercept + slope * point.x;
    const residual = point.y - prediction;
    return {
      x: point.x,
      y: point.y,
      prediction,
      residual,
      pull: residual / POINT_UNCERTAINTY,
    };
  });
  const chi2 = diagnosticPoints.reduce((sum, point) => sum + point.pull ** 2, 0);
  const ndf = n - 2;

  return {
    range,
    intercept,
    slope,
    interceptError,
    slopeError,
    chi2,
    ndf,
    reducedChi2: chi2 / ndf,
    points: diagnosticPoints,
  };
}

export function evaluatePrediction(value: string): boolean {
  return value === 'full-range-inadequate';
}

export function evaluateTransfer(value: string): boolean {
  return value === 'residuals-and-gof';
}
