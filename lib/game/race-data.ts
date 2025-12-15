export type GateChoice = {
  label: string;
  note: string;
  correct: boolean;
};

export type RaceGate = {
  id: string;
  distance: number;
  left: GateChoice;
  right: GateChoice;
};

export const raceOneGates: RaceGate[] = [
  {
    id: 'trim',
    distance: 260,
    left: {
      label: 'Trim Spaces',
      note: 'Fast clean-up: remove trailing blanks before joins.',
      correct: true,
    },
    right: {
      label: 'Remove Rows',
      note: 'Dropping rows loses signals for later steps.',
      correct: false,
    },
  },
  {
    id: 'normalize',
    distance: 620,
    left: {
      label: 'Normalize Case',
      note: 'Consistent casing helps matching + grouping.',
      correct: true,
    },
    right: {
      label: 'Duplicate Columns',
      note: 'Extra copies increase payload + confusion.',
      correct: false,
    },
  },
  {
    id: 'validate',
    distance: 980,
    left: {
      label: 'Loose Match',
      note: 'Loose matching allows errors to slip by.',
      correct: false,
    },
    right: {
      label: 'Validate Schema',
      note: 'Validating keeps downstream transforms predictable.',
      correct: true,
    },
  },
];
