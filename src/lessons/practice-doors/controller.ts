import { createLessonSession } from '../../learning';
import { mountCollisionEventView } from './event-view';
import {
  applySpanishPracticeCopy,
  fallbackAnswer,
  getPracticeLocale,
  histogramDescription,
  installPracticeLanguageSwitch,
  selectionFeedback,
  stageStatus,
  visualSummary,
} from './locale';
import {
  deriveSelection,
  evaluatePracticeAnswer,
  meetsSelectionGoal,
  type PracticeMode,
} from './model';

interface PracticeState {
  stage: number;
  threshold: number;
  completed: number[];
}

const root = document.querySelector<HTMLElement>('[data-practice-root]');

if (root) {
  const mode = root.dataset.practiceMode as PracticeMode;
  const locale = getPracticeLocale();
  root.dataset.locale = locale;
  if (locale === 'es') applySpanishPracticeCopy(root, mode);
  installPracticeLanguageSwitch(root, locale);

  const eventView = mode === 'manipulate' ? mountCollisionEventView(root, locale) : null;

  const session = createLessonSession<PracticeState>(() => ({
    stage: 1,
    threshold: 20,
    completed: [],
  }));

  const stagePanels = [...root.querySelectorAll<HTMLElement>('[data-stage-panel]')];
  const stageMarkers = [...root.querySelectorAll<HTMLElement>('[data-stage-marker]')];
  const continueButton = root.querySelector<HTMLButtonElement>('[data-continue]');
  const completion = root.querySelector<HTMLElement>('[data-completion]');

  const completeStage = (stage: number) => {
    const state = session.getState();
    if (state.completed.includes(stage)) return;
    session.update((current) => ({ ...current, completed: [...current.completed, stage] }));
  };

  const renderSelectionVisuals = (state: PracticeState) => {
    const visualization = root.querySelector<HTMLElement>('[data-selection-visualization]');
    if (!visualization) return;

    const snapshot = deriveSelection(state.threshold);
    eventView?.setThreshold(state.threshold);

    visualization.querySelectorAll<HTMLOutputElement>('[data-live-threshold]').forEach((output) => {
      output.value = `${state.threshold} GeV`;
    });

    visualization.querySelectorAll<SVGElement>('[data-histogram-bar]').forEach((bar) => {
      bar.dataset.selected = Number(bar.dataset.binMin) >= state.threshold ? 'true' : 'false';
    });

    const plotStart = 30;
    const plotWidth = 300;
    const cutX = plotStart + ((state.threshold - 20) / 50) * plotWidth;
    const rejectedRegion = visualization.querySelector<SVGRectElement>('[data-rejected-region]');
    const cutLine = visualization.querySelector<SVGLineElement>('[data-cut-line]');
    const cutLabel = visualization.querySelector<SVGTextElement>('[data-cut-label]');

    rejectedRegion?.setAttribute('width', String(Math.max(0, cutX - plotStart)));
    cutLine?.setAttribute('x1', String(cutX));
    cutLine?.setAttribute('x2', String(cutX));
    cutLabel?.setAttribute('x', String(Math.min(cutX + 4, 300)));
    if (cutLabel) cutLabel.textContent = `${state.threshold} GeV`;

    const summary = visualization.querySelector<HTMLElement>('[data-visual-summary]');
    if (summary) summary.textContent = visualSummary(locale, state.threshold, snapshot);

    const description = visualization.querySelector<SVGDescElement>('[data-histogram-description]');
    if (description) description.textContent = histogramDescription(locale, state.threshold, snapshot);
  };

  const announceSelection = (panel: HTMLElement, state: PracticeState) => {
    const snapshot = deriveSelection(state.threshold);
    const signal = panel.querySelector<HTMLProgressElement>('[data-signal-progress]');
    const background = panel.querySelector<HTMLProgressElement>('[data-background-progress]');
    const signalText = panel.querySelector<HTMLOutputElement>('[data-signal-output]');
    const backgroundText = panel.querySelector<HTMLOutputElement>('[data-background-output]');
    const thresholdText = panel.querySelector<HTMLOutputElement>('[data-threshold-output]');
    const feedback = panel.querySelector<HTMLElement>('[data-feedback]');

    if (signal) signal.value = snapshot.signalKept;
    if (background) background.value = snapshot.backgroundKept;
    if (signalText) signalText.value = `${snapshot.signalKept} / ${snapshot.signalTotal}`;
    if (backgroundText) backgroundText.value = `${snapshot.backgroundKept} / ${snapshot.backgroundTotal}`;
    if (thresholdText) thresholdText.value = `${state.threshold} GeV`;

    if (feedback) {
      const solved = meetsSelectionGoal(state.stage, snapshot);
      feedback.textContent = selectionFeedback(locale, solved, snapshot);
      feedback.dataset.kind = solved ? 'success' : 'observation';
    }
  };

  const render = (state: PracticeState) => {
    if (mode === 'manipulate') renderSelectionVisuals(state);

    stagePanels.forEach((panel) => {
      const stage = Number(panel.dataset.stagePanel);
      panel.hidden = stage !== state.stage;
      if (stage === state.stage && mode === 'manipulate') announceSelection(panel, state);
    });

    stageMarkers.forEach((marker) => {
      const stage = Number(marker.dataset.stageMarker);
      const status = marker.querySelector<HTMLElement>('[data-stage-status]');
      const complete = state.completed.includes(stage);
      const stateLabel = complete ? 'complete' : stage === state.stage ? 'current' : 'locked';

      marker.dataset.state = stateLabel;
      if (status) status.textContent = stageStatus(locale, stateLabel);
    });

    const currentComplete = state.completed.includes(state.stage);
    if (continueButton) {
      continueButton.disabled = !currentComplete;
      continueButton.hidden = state.stage === 3 && currentComplete;
    }
    if (completion) completion.hidden = !(state.stage === 3 && currentComplete);
  };

  root.querySelectorAll<HTMLInputElement>('input[type="range"][data-threshold]').forEach((input) => {
    input.addEventListener('input', () => {
      const stage = Number(input.dataset.stage);
      const threshold = Number(input.value);
      const state = session.getState();
      if (stage !== state.stage) return;

      session.update((current) => ({ ...current, threshold }));
      if (meetsSelectionGoal(stage, deriveSelection(threshold))) completeStage(stage);
    });
  });

  root.querySelectorAll<HTMLFormElement>('[data-answer-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const stage = Number(form.dataset.stage);
      const state = session.getState();
      if (stage !== state.stage) return;

      const answer = String(new FormData(form).get('answer') ?? '');
      const feedback = form.closest<HTMLElement>('[data-stage-panel]')?.querySelector<HTMLElement>('[data-feedback]');
      const correct = evaluatePracticeAnswer(mode, stage, answer);

      if (feedback) {
        feedback.textContent = correct ? form.dataset.success ?? fallbackAnswer(locale, true) : form.dataset.miss ?? fallbackAnswer(locale, false);
        feedback.dataset.kind = correct ? 'success' : 'misconception';
      }

      if (correct) {
        form.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input, button').forEach((control) => {
          control.disabled = true;
        });
        form.closest<HTMLElement>('[data-stage-panel]')?.querySelector<HTMLElement>('[data-reveal]')?.removeAttribute('hidden');
        completeStage(stage);
      }
    });
  });

  continueButton?.addEventListener('click', () => {
    const state = session.getState();
    if (!state.completed.includes(state.stage) || state.stage >= 3) return;

    const nextStage = state.stage + 1;
    session.update((current) => ({ ...current, stage: nextStage, threshold: 20 }));
    requestAnimationFrame(() => {
      root.querySelector<HTMLElement>(`[data-stage-panel="${nextStage}"] h2`)?.focus();
    });
  });

  session.subscribe((state) => render(state));
}
