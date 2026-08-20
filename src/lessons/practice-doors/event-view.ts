import type { PracticeLocale } from './locale';

type Vec3 = { x: number; y: number; z: number };
type ObjectId = 'photon-a' | 'photon-b' | 'jet-c';

type ProjectedPoint = {
  x: number;
  y: number;
  depth: number;
  scale: number;
};

export interface CollisionEventViewHandle {
  setThreshold(threshold: number): void;
}

const LEADING_PHOTON_PT = 48;
const DETECTOR = {
  tracker: 0.76,
  ecal: 1.18,
  hcal: 1.5,
  halfLength: 1.58,
} as const;

const objects = {
  'photon-a': { pt: 48, eta: 0.45, phi: 0.55 },
  'photon-b': { pt: 42, eta: -0.65, phi: -2.15 },
  'jet-c': { pt: 36, eta: 0.2, phi: 2.35 },
} as const;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function pointAtRadius(radius: number, eta: number, phi: number): Vec3 {
  return {
    x: radius * Math.cos(phi),
    y: radius * Math.sin(phi),
    z: radius * Math.sinh(eta),
  };
}

function rotatePoint(point: Vec3, yaw: number, pitch: number): Vec3 {
  const cosYaw = Math.cos(yaw);
  const sinYaw = Math.sin(yaw);
  const x1 = cosYaw * point.x + sinYaw * point.z;
  const z1 = -sinYaw * point.x + cosYaw * point.z;

  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);
  return {
    x: x1,
    y: cosPitch * point.y - sinPitch * z1,
    z: sinPitch * point.y + cosPitch * z1,
  };
}

function projectPoint(
  point: Vec3,
  width: number,
  height: number,
  yaw: number,
  pitch: number,
  zoom: number,
): ProjectedPoint | null {
  const rotated = rotatePoint(point, yaw, pitch);
  const cameraDistance = 4.7;
  const denominator = cameraDistance - rotated.z;
  if (denominator < 0.5) return null;

  const perspective = cameraDistance / denominator;
  const baseScale = Math.min(width, height) * 0.32 * zoom;
  return {
    x: width * 0.5 + rotated.x * baseScale * perspective,
    y: height * 0.51 - rotated.y * baseScale * perspective,
    depth: rotated.z,
    scale: perspective,
  };
}

function cylinderLoop(radius: number, z: number, segments = 48): Vec3[] {
  return Array.from({ length: segments + 1 }, (_, index) => {
    const phi = (index / segments) * Math.PI * 2;
    return { x: radius * Math.cos(phi), y: radius * Math.sin(phi), z };
  });
}

function detectorRail(radius: number, phi: number): Vec3[] {
  return [
    { x: radius * Math.cos(phi), y: radius * Math.sin(phi), z: -DETECTOR.halfLength },
    { x: radius * Math.cos(phi), y: radius * Math.sin(phi), z: DETECTOR.halfLength },
  ];
}

function translatedCopy(locale: PracticeLocale) {
  if (locale === 'es') {
    return {
      section: 'Evento',
      heading: 'Colisión de ejemplo',
      observable: `pT de γ líder ${LEADING_PHOTON_PT} GeV`,
      canvasLabel:
        'Vista conceptual 3D de una colisión. El vértice primario está en el centro. Dos candidatos a fotón llegan a depósitos electromagnéticos compactos sin tracks cargados asociados. Un jet contiene varios tracks cargados y actividad calorimétrica más ancha.',
      reset: 'Reiniciar vista',
      controls: 'Objetos reconstruidos del evento',
      photonA: 'Fotón A',
      photonB: 'Fotón B',
      jetC: 'Jet C',
      initial: 'Arrastra horizontalmente para rotar. Inspecciona un objeto para comparar su firma en el detector.',
      photon: (name: string, pt: number) => `${name}: sin track cargado · depósito compacto en ECAL · pT ${pt} GeV`,
      jet: (pt: number) => `Jet C: varios tracks cargados · actividad calorimétrica ancha · pT ${pt} GeV`,
      key: 'Línea continua = track cargado · línea punteada = dirección neutra',
      passes: '✓ El evento supera el corte',
      rejected: '× Evento rechazado',
      statusDetail: (threshold: number) => `pT de γ líder ${LEADING_PHOTON_PT} GeV · corte ${threshold} GeV`,
      fallback: 'Vista esquemática: dos candidatos a fotón y un jet emergen del vértice primario hacia capas cilíndricas del detector.',
    };
  }

  return {
    section: 'Event',
    heading: 'Example collision',
    observable: `leading γ pT ${LEADING_PHOTON_PT} GeV`,
    canvasLabel:
      'Conceptual 3D detector view of one collision. The primary vertex is at the center. Two photon candidates reach compact electromagnetic deposits without associated charged tracks. A jet contains several charged tracks and broader calorimeter activity.',
    reset: 'Reset view',
    controls: 'Reconstructed objects in this event',
    photonA: 'Photon A',
    photonB: 'Photon B',
    jetC: 'Jet C',
    initial: 'Drag horizontally to rotate. Inspect an object to compare its detector signature.',
    photon: (name: string, pt: number) => `${name}: no charged track · compact ECAL deposit · pT ${pt} GeV`,
    jet: (pt: number) => `Jet C: several charged tracks · broad calorimeter activity · pT ${pt} GeV`,
    key: 'Solid = charged track · dotted = neutral direction',
    passes: '✓ Event passes current cut',
    rejected: '× Event rejected',
    statusDetail: (threshold: number) => `leading γ pT ${LEADING_PHOTON_PT} GeV · cut ${threshold} GeV`,
    fallback: 'Schematic view: two photon candidates and one jet emerge from the primary vertex toward cylindrical detector layers.',
  };
}

export function mountCollisionEventView(
  root: HTMLElement,
  locale: PracticeLocale,
): CollisionEventViewHandle | null {
  const card = root.querySelector<HTMLElement>('.event-view');
  if (!card) return null;

  const copy = translatedCopy(locale);
  card.innerHTML = `
    <header class="visual-card-header">
      <div>
        <p class="section-label">${copy.section}</p>
        <h2 id="event-view-heading">${copy.heading}</h2>
      </div>
      <span class="visual-unit">${copy.observable}</span>
    </header>
    <div class="event-selection-state" data-event-cut-state data-state="pass">
      <strong>${copy.passes}</strong>
      <span data-event-cut-detail>${copy.statusDetail(20)}</span>
    </div>
    <div class="collision-stage" data-collision-stage>
      <canvas class="collision-canvas" data-collision-canvas tabindex="0" role="img" aria-label="${copy.canvasLabel}"></canvas>
      <button class="collision-reset" type="button" data-collision-reset aria-label="${copy.reset}" title="${copy.reset}">↺</button>
      <span class="collision-axis" aria-hidden="true">z · beam</span>
      <div class="collision-fallback" data-collision-fallback hidden>${copy.fallback}</div>
    </div>
    <div class="collision-object-strip" role="group" aria-label="${copy.controls}">
      <button type="button" data-collision-object="photon-a" aria-pressed="false"><strong>γ A</strong><small>${objects['photon-a'].pt} GeV</small></button>
      <button type="button" data-collision-object="photon-b" aria-pressed="false"><strong>γ B</strong><small>${objects['photon-b'].pt} GeV</small></button>
      <button type="button" data-collision-object="jet-c" aria-pressed="false"><strong>jet C</strong><small>${objects['jet-c'].pt} GeV</small></button>
    </div>
    <p class="collision-inspector" data-collision-inspector>${copy.initial}</p>
    <p class="collision-key">${copy.key}</p>
  `;

  const stage = card.querySelector<HTMLElement>('[data-collision-stage]');
  const canvas = card.querySelector<HTMLCanvasElement>('[data-collision-canvas]');
  const resetButton = card.querySelector<HTMLButtonElement>('[data-collision-reset]');
  const inspector = card.querySelector<HTMLElement>('[data-collision-inspector]');
  const cutState = card.querySelector<HTMLElement>('[data-event-cut-state]');
  const cutDetail = card.querySelector<HTMLElement>('[data-event-cut-detail]');
  const fallback = card.querySelector<HTMLElement>('[data-collision-fallback]');
  if (!stage || !canvas || !resetButton || !inspector || !cutState || !cutDetail || !fallback) return null;

  const context = canvas.getContext('2d');
  if (!context) {
    canvas.hidden = true;
    fallback.hidden = false;
    stage.dataset.collisionReady = 'fallback';
    return { setThreshold: () => undefined };
  }
  const ctx = context;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startTime = performance.now();
  let width = 1;
  let height = 1;
  let yaw = 0.62;
  let pitch = 0.22;
  let zoom = 1;
  let threshold = 20;
  let eventPasses = true;
  let selectedObject: ObjectId | null = null;
  let pointerId: number | null = null;
  let pointerStart = { x: 0, y: 0 };
  let pointerLast = { x: 0, y: 0 };
  let pointerMoved = false;
  let lastInteraction = startTime;
  let lastFrame = startTime;
  const hitPoints = new Map<ObjectId, { x: number; y: number }>();

  const palette = {
    border: '',
    muted: '',
    text: '',
    accent: '',
    accentStrong: '',
    background: '',
    surface: '',
    hadronic: '',
  };

  const readPalette = () => {
    const styles = getComputedStyle(document.documentElement);
    palette.border = styles.getPropertyValue('--border').trim() || '#526267';
    palette.muted = styles.getPropertyValue('--muted').trim() || '#93a3a6';
    palette.text = styles.getPropertyValue('--text').trim() || '#e7efee';
    palette.accent = styles.getPropertyValue('--accent').trim() || '#69a9bf';
    palette.accentStrong = styles.getPropertyValue('--accent-strong').trim() || '#91c8d8';
    palette.background = styles.getPropertyValue('--bg').trim() || '#0f1719';
    palette.surface = styles.getPropertyValue('--surface').trim() || '#162124';
    palette.hadronic = styles.getPropertyValue('--background-event').trim() || '#d58a68';
  };
  readPalette();

  new MutationObserver(readPalette).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  new ResizeObserver(resize).observe(stage);

  const project = (point: Vec3) => projectPoint(point, width, height, yaw, pitch, zoom);

  const drawPolyline = (
    points: Vec3[],
    stroke: string,
    lineWidth: number,
    alpha: number,
    dash: number[] = [],
  ) => {
    const projected = points.map(project).filter((point): point is ProjectedPoint => point !== null);
    if (projected.length < 2) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(projected[0].x, projected[0].y);
    projected.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.stroke();
    ctx.restore();
  };

  const drawDeposit = (
    id: ObjectId,
    point: Vec3,
    radius: number,
    fill: string,
    alpha: number,
    ring = false,
  ) => {
    const projected = project(point);
    if (!projected) return;
    hitPoints.set(id, { x: projected.x, y: projected.y });
    const selected = selectedObject === id;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fill;
    ctx.strokeStyle = selected ? palette.text : fill;
    ctx.lineWidth = selected ? 2.4 : 1.2;
    ctx.shadowColor = selected ? fill : 'transparent';
    ctx.shadowBlur = selected ? 14 : 0;
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, radius * projected.scale * (selected ? 1.25 : 1), 0, Math.PI * 2);
    if (ring) ctx.stroke();
    else {
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawDetector = () => {
    const layers = [
      { radius: DETECTOR.tracker, color: palette.muted, alpha: 0.22 },
      { radius: DETECTOR.ecal, color: palette.accent, alpha: 0.22 },
      { radius: DETECTOR.hcal, color: palette.hadronic, alpha: 0.2 },
    ];

    drawPolyline(
      [
        { x: 0, y: 0, z: -1.9 },
        { x: 0, y: 0, z: 1.9 },
      ],
      palette.muted,
      1.1,
      0.45,
      [4, 5],
    );

    layers.forEach((layer) => {
      drawPolyline(cylinderLoop(layer.radius, -DETECTOR.halfLength), layer.color, 1, layer.alpha);
      drawPolyline(cylinderLoop(layer.radius, DETECTOR.halfLength), layer.color, 1, layer.alpha);
      [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((phi) => {
        drawPolyline(detectorRail(layer.radius, phi), layer.color, 0.8, layer.alpha * 0.8);
      });
    });
  };

  const drawEvent = (reveal: number) => {
    hitPoints.clear();
    const eventAlpha = eventPasses ? 1 : 0.34;
    const pathReveal = clamp((reveal - 0.08) / 0.72, 0, 1);
    const depositReveal = clamp((reveal - 0.68) / 0.32, 0, 1);

    (['photon-a', 'photon-b'] as const).forEach((id) => {
      const photon = objects[id];
      const endRadius = DETECTOR.ecal * pathReveal;
      const endpoint = pointAtRadius(endRadius, photon.eta, photon.phi);
      drawPolyline(
        [{ x: 0, y: 0, z: 0 }, endpoint],
        palette.accentStrong,
        selectedObject === id ? 2 : 1.2,
        eventAlpha * 0.72,
        [2, 5],
      );
      if (depositReveal > 0) {
        drawDeposit(
          id,
          pointAtRadius(DETECTOR.ecal, photon.eta, photon.phi),
          7.5 * depositReveal,
          palette.accentStrong,
          eventAlpha * depositReveal,
        );
      }
    });

    const jet = objects['jet-c'];
    const tracks = [
      { phi: -0.11, eta: -0.08, curve: -0.11 },
      { phi: -0.05, eta: 0.05, curve: 0.08 },
      { phi: 0.02, eta: -0.02, curve: -0.06 },
      { phi: 0.08, eta: 0.09, curve: 0.12 },
      { phi: 0.14, eta: -0.06, curve: 0.05 },
    ];
    tracks.forEach((track, trackIndex) => {
      const points = Array.from({ length: 12 }, (_, index) => {
        const t = (index / 11) * pathReveal;
        return pointAtRadius(
          DETECTOR.hcal * 0.94 * t,
          jet.eta + track.eta,
          jet.phi + track.phi + track.curve * t,
        );
      });
      drawPolyline(
        points,
        trackIndex % 2 === 0 ? palette.text : palette.muted,
        selectedObject === 'jet-c' ? 1.9 : 1.25,
        eventAlpha * 0.78,
      );
    });

    if (depositReveal > 0) {
      const clusterOffsets = [
        { phi: 0, eta: 0, size: 10 },
        { phi: -0.08, eta: 0.06, size: 7 },
        { phi: 0.08, eta: -0.05, size: 8 },
        { phi: 0.14, eta: 0.08, size: 6 },
        { phi: -0.14, eta: -0.08, size: 6 },
      ];
      clusterOffsets.forEach((offset, index) => {
        drawDeposit(
          'jet-c',
          pointAtRadius(DETECTOR.hcal, jet.eta + offset.eta, jet.phi + offset.phi),
          offset.size * depositReveal,
          palette.hadronic,
          eventAlpha * depositReveal * (index === 0 ? 0.88 : 0.58),
          index !== 0,
        );
      });
    }

    const vertex = project({ x: 0, y: 0, z: 0 });
    if (vertex) {
      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = palette.text;
      ctx.shadowColor = palette.accentStrong;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, 3.5 + reveal * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  const renderFrame = (now: number) => {
    const delta = Math.min(50, now - lastFrame);
    lastFrame = now;
    const elapsed = now - startTime;
    const reveal = reducedMotion ? 1 : clamp(elapsed / 1150, 0, 1);

    if (
      !reducedMotion &&
      pointerId === null &&
      selectedObject === null &&
      elapsed > 1300 &&
      now - lastInteraction > 1300
    ) {
      yaw += (delta / 56000) * Math.PI * 2;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = palette.background;
    ctx.fillRect(0, 0, width, height);
    drawDetector();
    drawEvent(reveal);
    window.requestAnimationFrame(renderFrame);
  };

  const selectObject = (id: ObjectId | null) => {
    selectedObject = id;
    lastInteraction = performance.now();
    card.querySelectorAll<HTMLButtonElement>('[data-collision-object]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.collisionObject === id));
    });

    if (id === 'photon-a') inspector.textContent = copy.photon(copy.photonA, objects[id].pt);
    else if (id === 'photon-b') inspector.textContent = copy.photon(copy.photonB, objects[id].pt);
    else if (id === 'jet-c') inspector.textContent = copy.jet(objects[id].pt);
    else inspector.textContent = copy.initial;
  };

  card.querySelectorAll<HTMLButtonElement>('[data-collision-object]').forEach((button) => {
    button.addEventListener('click', () => selectObject(button.dataset.collisionObject as ObjectId));
  });

  resetButton.addEventListener('click', () => {
    yaw = 0.62;
    pitch = 0.22;
    zoom = 1;
    selectObject(null);
  });

  canvas.addEventListener('pointerdown', (event) => {
    pointerId = event.pointerId;
    pointerStart = { x: event.clientX, y: event.clientY };
    pointerLast = pointerStart;
    pointerMoved = false;
    lastInteraction = performance.now();
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add('is-dragging');
  });

  canvas.addEventListener('pointermove', (event) => {
    if (pointerId !== event.pointerId) return;
    const dx = event.clientX - pointerLast.x;
    const dy = event.clientY - pointerLast.y;
    if (Math.abs(event.clientX - pointerStart.x) + Math.abs(event.clientY - pointerStart.y) > 5) pointerMoved = true;
    yaw += dx * 0.009;
    pitch = clamp(pitch + dy * 0.004, -0.42, 0.55);
    pointerLast = { x: event.clientX, y: event.clientY };
    lastInteraction = performance.now();
  });

  const endPointer = (event: PointerEvent) => {
    if (pointerId !== event.pointerId) return;
    if (!pointerMoved) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let closest: { id: ObjectId; distance: number } | null = null;
      hitPoints.forEach((point, id) => {
        const distance = Math.hypot(point.x - x, point.y - y);
        if (distance <= 30 && (!closest || distance < closest.distance)) closest = { id, distance };
      });
      if (closest) selectObject(closest.id);
    }
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    pointerId = null;
    canvas.classList.remove('is-dragging');
    lastInteraction = performance.now();
  };

  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);
  canvas.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      zoom = clamp(zoom - event.deltaY * 0.0012, 0.78, 1.34);
      lastInteraction = performance.now();
    },
    { passive: false },
  );

  const setThreshold = (nextThreshold: number) => {
    threshold = nextThreshold;
    eventPasses = LEADING_PHOTON_PT >= threshold;
    card.dataset.eventSelectionState = eventPasses ? 'pass' : 'rejected';
    cutState.dataset.state = eventPasses ? 'pass' : 'rejected';
    cutState.querySelector('strong')!.textContent = eventPasses ? copy.passes : copy.rejected;
    cutDetail.textContent = copy.statusDetail(threshold);
  };

  stage.dataset.collisionReady = 'true';
  setThreshold(20);
  window.requestAnimationFrame(renderFrame);

  return { setThreshold };
}
