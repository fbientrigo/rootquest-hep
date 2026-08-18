import {
  RQFeedbackElement,
  type FeedbackMessage,
} from './rq-feedback';

export interface PredictionCommitDetail {
  name: string;
  value: string;
}

type LockableControl =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | HTMLButtonElement;

export class RQPredictElement extends HTMLElement {
  #abortController?: AbortController;
  #controls: Array<{ control: LockableControl; disabled: boolean }> = [];

  connectedCallback() {
    this.#abortController?.abort();
    this.#abortController = new AbortController();
    this.dataset.state ||= 'idle';

    const form = this.querySelector('form');
    if (!form) return;

    this.#controls = Array.from(
      form.querySelectorAll<LockableControl>('input, select, textarea, button'),
      (control) => ({ control, disabled: control.disabled }),
    );

    form.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        if (this.dataset.state !== 'idle') return;

        const name = this.getAttribute('answer-name') ?? 'prediction';
        const value = new FormData(form).get(name);
        if (value === null) return;

        for (const { control } of this.#controls) control.disabled = true;
        this.dataset.state = 'committed';
        this.#feedback().show({
          kind: 'observation',
          heading: 'Prediction committed.',
          message: 'Test the system to reveal what happens and why.',
        });

        this.dispatchEvent(
          new CustomEvent<PredictionCommitDetail>('rq-prediction-commit', {
            bubbles: true,
            composed: true,
            detail: { name, value: String(value) },
          }),
        );
      },
      { signal: this.#abortController.signal },
    );
  }

  disconnectedCallback() {
    this.#abortController?.abort();
  }

  reveal(feedback: FeedbackMessage) {
    this.dataset.state = 'revealed';
    this.#feedback().show(feedback);
  }

  resetPrediction() {
    this.querySelector('form')?.reset();
    for (const { control, disabled } of this.#controls) {
      control.disabled = disabled;
    }
    this.dataset.state = 'idle';
    const feedback = this.#feedback();
    feedback.hidden = true;
    feedback.replaceChildren();
  }

  #feedback() {
    const existing = this.querySelector<RQFeedbackElement>(
      'rq-feedback[data-prediction-feedback]',
    );
    if (existing) return existing;

    const feedback = document.createElement(
      'rq-feedback',
    ) as RQFeedbackElement;
    feedback.dataset.predictionFeedback = '';
    this.append(feedback);
    return feedback;
  }
}

if (!customElements.get('rq-predict')) {
  customElements.define('rq-predict', RQPredictElement);
}

