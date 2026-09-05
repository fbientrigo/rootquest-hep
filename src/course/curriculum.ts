export type CourseLessonStatus = 'live' | 'next' | 'planned';

export type CourseLesson = { id: string; title: string; status: CourseLessonStatus; href?: string };
export type CourseUnit = { id: string; title: string; goal: string; lessons: CourseLesson[] };

export const spiralAnchor: CourseLesson = { id: 'H0', title: 'Higgs Hunt — guided', status: 'live', href: 'learn/higgs-hunt/' };

export const courseUnits: CourseUnit[] = [
  { id: 'A', title: 'Data become distributions', goal: 'Build histogram and measurement intuition before ROOT syntax becomes the focus.', lessons: [
    { id: 'A1', title: 'Same data, different bins', status: 'live', href: 'learn/histogram-binning/' },
    { id: 'A2', title: 'Build a histogram', status: 'live', href: 'learn/histogram-fill/' },
    { id: 'A3', title: 'Read and compare histograms', status: 'live', href: 'learn/histogram-compare/' },
    { id: 'A4', title: 'Measurements with errors', status: 'live', href: 'learn/measurement-errors/' },
  ]},
  { id: 'B', title: 'Open the ROOT file', goal: 'Make ROOT files, trees, branches and entries inspectable rather than opaque.', lessons: [
    { id: 'B1', title: 'Open and inspect a ROOT file', status: 'live', href: 'learn/root-file-inspection/' },
    { id: 'B2', title: 'Tree, branch, entry', status: 'live', href: 'learn/tree-branch-entry/' },
    { id: 'B3', title: 'Collections inside events', status: 'live', href: 'learn/event-collections/' },
    { id: 'B4', title: 'Use ROOT without memorizing ROOT', status: 'live', href: 'learn/root-documentation/' },
  ]},
  { id: 'C', title: 'Analysis as a data pipeline', goal: 'Build fluent everyday analysis around RDataFrame transformations and actions.', lessons: [
    { id: 'C1', title: 'A pipeline transforms a dataset', status: 'live', href: 'learn/data-pipeline/' },
    { id: 'C2', title: 'Filter: keep rows for a reason', status: 'live', href: 'learn/filter-reason/' },
    { id: 'C3', title: 'Define: create an observable', status: 'live', href: 'learn/define-observable/' },
    { id: 'C4', title: 'Actions summarize the sample', status: 'live', href: 'learn/actions-summary/' },
    { id: 'C5', title: 'Cutflow: where did the events go?', status: 'live', href: 'learn/cutflow/' },
    { id: 'C6', title: 'Keep a useful derived sample', status: 'live', href: 'learn/derived-sample/' },
  ]},
  { id: 'D', title: 'Events contain physics objects', goal: 'Connect particle collections to the kinematics used in introductory HEP analysis.', lessons: [
    { id: 'D1', title: 'Coordinates of a reconstructed object', status: 'live', href: 'learn/object-coordinates/' },
    { id: 'D2', title: 'Select objects, then events', status: 'live', href: 'learn/object-event-selection/' },
    { id: 'D3', title: 'Work with collections', status: 'next' },
    { id: 'D4', title: 'Angular separation', status: 'planned' },
    { id: 'D5', title: 'Four-vectors and invariant mass', status: 'planned' },
    { id: 'D6', title: 'Build a candidate', status: 'planned' },
  ]},
  { id: 'E', title: 'From plots to evidence', goal: 'Add the minimum normalization and fitting machinery needed for responsible interpretation.', lessons: [
    { id: 'E1', title: 'Signal and background trade-offs', status: 'planned' }, { id: 'E2', title: 'Event weights and normalization', status: 'planned' }, { id: 'E3', title: 'Data vs simulation', status: 'planned' }, { id: 'E4', title: 'Fit a simple model', status: 'planned' }, { id: 'E5', title: 'Read a fit critically', status: 'planned' }, { id: 'E6', title: 'Signal and control regions', status: 'planned' },
  ]},
  { id: 'F', title: 'Work independently', goal: 'Fade support until a learner can transfer the workflow to an unfamiliar small analysis.', lessons: [
    { id: 'F1', title: 'Assemble an analysis from a question', status: 'planned' }, { id: 'F2', title: 'Higgs Hunt — discovery revisit', status: 'planned' }, { id: 'F3', title: 'Independent mini-analysis', status: 'planned' }, { id: 'F4', title: 'Leave ROOT Quest', status: 'planned' },
  ]},
];

export const coreLessons = courseUnits.flatMap((unit) => unit.lessons);
export const liveCoreLessons = coreLessons.filter((lesson) => lesson.status === 'live');
export const nextLesson = coreLessons.find((lesson) => lesson.status === 'next');
