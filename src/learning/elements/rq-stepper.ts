export type StepAction = 'previous' | 'next' | 'reset';

export interface StepRequestDetail {
  action: StepAction;
  requestedIndex: number;
}

export class RQStepperElement extends HTMLElement {
  #abortController?: AbortController;

  connectedCallback() {
    this.#abortController?.abort();
    this.#abortController = new AbortController();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'group');

    for (const button of this.querySelectorAll<HTMLButtonElement>(
      'button[data-stepper-action]',
    )) {
      button.addEventListener(
        'click',
        () => this.#request(button.dataset.stepperAction as StepAction),
        { signal: this.#abortController.signal },
      );
    }

    const status = this.querySelector('[data-stepper-status]');
    if (status && !status.hasAttribute('aria-live')) {
      status.setAttribute('aria-live', 'polite');
    }
  }

  disconnectedCallback() {
    this.#abortController?.abort();
  }

  setPosition(currentIndex: number, stepCount: number, label?: string) {
    const safeCount = Math.max(1, stepCount);
    const safeIndex = Math.min(Math.max(0, currentIndex), safeCount - 1);
    this.dataset.currentStep = String(safeIndex);
    this.dataset.stepCount = String(safeCount);

    const status = this.querySelector('[data-stepper-status]');
    if (status) {
      status.textContent = `Step ${safeIndex + 1} of ${safeCount}${
        label ? `: ${label}` : ''
      }`;
    }

    for (const button of this.querySelectorAll<HTMLButtonElement>(
      'button[data-stepper-action]',
    )) {
      const action = button.dataset.stepperAction as StepAction;
      button.disabled =
        (action === 'previous' && safeIndex === 0) ||
        (action === 'next' && safeIndex === safeCount - 1);
    }
  }

  #request(action: StepAction) {
    const currentIndex = Number(this.dataset.currentStep ?? 0);
    const stepCount = Number(this.dataset.stepCount ?? 1);
    const requestedIndex =
      action === 'reset'
        ? 0
        : Math.min(
            Math.max(0, currentIndex + (action === 'next' ? 1 : -1)),
            stepCount - 1,
          );

    this.dispatchEvent(
      new CustomEvent<StepRequestDetail>('rq-step-request', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { action, requestedIndex },
      }),
    );
  }
}

if (!customElements.get('rq-stepper')) {
  customElements.define('rq-stepper', RQStepperElement);
}
