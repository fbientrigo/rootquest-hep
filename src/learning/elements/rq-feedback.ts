export type FeedbackKind =
  | 'observation'
  | 'success'
  | 'misconception'
  | 'hint'
  | 'explanation';

export interface FeedbackMessage {
  kind: FeedbackKind;
  message: string;
  heading?: string;
}

export class RQFeedbackElement extends HTMLElement {
  connectedCallback() {
    const live = this.getAttribute('aria-live') ?? 'polite';
    this.setAttribute('aria-live', live);
    this.setAttribute('aria-atomic', 'true');
    if (live !== 'off' && !this.hasAttribute('role')) {
      this.setAttribute('role', 'status');
    }
  }

  show({ kind, heading, message }: FeedbackMessage) {
    this.dataset.state = kind;
    this.hidden = false;

    const content = document.createElement('p');
    if (heading) {
      const title = document.createElement('strong');
      title.textContent = `${heading} `;
      content.append(title);
    }
    content.append(message);
    this.replaceChildren(content);
  }
}

if (!customElements.get('rq-feedback')) {
  customElements.define('rq-feedback', RQFeedbackElement);
}

