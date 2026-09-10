import { deriveSelection, type SelectionSnapshot } from '../practice-doors/model.ts';

export interface TradeoffSnapshot extends SelectionSnapshot {
  threshold: number;
  signalEfficiency: number;
  backgroundEfficiency: number;
  backgroundRejection: number;
}

export function deriveTradeoff(threshold: number): TradeoffSnapshot {
  const selection = deriveSelection(threshold);
  const signalEfficiency = selection.signalKept / selection.signalTotal;
  const backgroundEfficiency = selection.backgroundKept / selection.backgroundTotal;

  return {
    threshold,
    ...selection,
    signalEfficiency,
    backgroundEfficiency,
    backgroundRejection: 1 - backgroundEfficiency,
  };
}

export function evaluateDirectionPrediction(value: string): boolean {
  return value === 'signal-down-background-rejection-up';
}

export function evaluateTransfer(value: string): boolean {
  return value === '40';
}
