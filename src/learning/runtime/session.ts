export type SessionChange =
  | { type: 'initial' }
  | { type: 'update'; reason?: string }
  | { type: 'reset'; reason?: string };

export type StateUpdate<State> =
  | State
  | ((current: Readonly<State>) => State);

export type SessionListener<State> = (
  state: Readonly<State>,
  change: SessionChange,
) => void;

export interface LessonSession<State> {
  getState(): Readonly<State>;
  update(update: StateUpdate<State>, reason?: string): Readonly<State>;
  subscribe(listener: SessionListener<State>): () => void;
  reset(reason?: string): Readonly<State>;
  snapshot(): State;
  onDispose(cleanup: () => void): () => void;
  dispose(): void;
}

/**
 * A deliberately small, local observable state container for one lesson.
 * The initial-state factory is called again on reset, making reset deterministic
 * without imposing a serializable state schema on lesson authors.
 */
export function createLessonSession<State>(
  createInitialState: () => State,
): LessonSession<State> {
  let state = createInitialState();
  let disposed = false;
  const listeners = new Set<SessionListener<State>>();
  const cleanups = new Set<() => void>();

  const assertActive = () => {
    if (disposed) {
      throw new Error('This lesson session has been disposed.');
    }
  };

  const notify = (change: SessionChange) => {
    for (const listener of listeners) {
      listener(state, change);
    }
  };

  return {
    getState() {
      return state;
    },

    update(update, reason) {
      assertActive();
      const nextState =
        typeof update === 'function'
          ? (update as (current: Readonly<State>) => State)(state)
          : update;

      if (Object.is(nextState, state)) return state;

      state = nextState;
      notify({ type: 'update', ...(reason ? { reason } : {}) });
      return state;
    },

    subscribe(listener) {
      assertActive();
      listeners.add(listener);
      listener(state, { type: 'initial' });
      return () => listeners.delete(listener);
    },

    reset(reason) {
      assertActive();
      state = createInitialState();
      notify({ type: 'reset', ...(reason ? { reason } : {}) });
      return state;
    },

    snapshot() {
      return structuredClone(state);
    },

    onDispose(cleanup) {
      assertActive();
      cleanups.add(cleanup);
      return () => cleanups.delete(cleanup);
    },

    dispose() {
      if (disposed) return;
      disposed = true;
      listeners.clear();
      for (const cleanup of cleanups) cleanup();
      cleanups.clear();
    },
  };
}
