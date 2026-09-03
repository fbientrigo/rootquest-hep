import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { evaluateChoice } from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';

function feedbackFor(scenario: 'reuse' | 'debug', value: string) {
  const correct = evaluateChoice(scenario, value as 'snapshot' | 'pipeline' | 'range');
  if (scenario === 'reuse') {
    return {
      correct,
      heading: correct
        ? (spanish() ? 'Persistir tiene una razón concreta.' : 'Persistence has a concrete reason.')
        : (spanish() ? 'No confundas inspección con persistencia.' : 'Do not confuse inspection with persistence.'),
      message: correct
        ? (spanish()
          ? 'Snapshot escribe las filas seleccionadas y las columnas elegidas a un nuevo dataset para reutilizarlo después.'
          : 'Snapshot writes the selected rows and chosen columns to a new dataset so it can be reused later.')
        : (spanish()
          ? 'Aquí habrá reutilización posterior. Range sólo limita qué entradas procesa una rama del pipeline y mantener el pipeline no crea un dataset nuevo.'
          : 'This result will be reused later. Range only limits which entries a pipeline branch processes, and keeping the pipeline does not create a new dataset.'),
    };
  }

  return {
    correct,
    heading: correct
      ? (spanish() ? 'Range sirve para mirar poco, no para guardar.' : 'Range is for processing less, not for saving.')
      : (spanish() ? 'El objetivo es inspeccionar, no persistir.' : 'The goal is inspection, not persistence.'),
    message: correct
      ? (spanish()
        ? 'Range limita las entradas procesadas en esa rama. Es útil para una inspección pequeña, pero no escribe un archivo ni reemplaza Snapshot.'
        : 'Range limits the entries processed on that branch. It is useful for a small inspection, but it does not write a file or replace Snapshot.')
      : (spanish()
        ? 'Para revisar sólo unas pocas entradas no necesitas crear un dataset persistente. Limita temporalmente la rama con Range.'
        : 'To inspect only a few entries you do not need a persistent dataset. Temporarily limit the branch with Range.'),
  };
}

for (const [id, scenario] of [['c6-persist', 'reuse'], ['c6-transfer', 'debug']] as const) {
  const predict = document.getElementById(id) as RQPredictElement;
  predict.addEventListener('rq-prediction-commit', (rawEvent) => {
    const event = rawEvent as CustomEvent<PredictionCommitDetail>;
    const result = feedbackFor(scenario, event.detail.value);
    predict.reveal({
      kind: result.correct ? 'success' : 'misconception',
      heading: result.heading,
      message: result.message,
    });
  });
}
