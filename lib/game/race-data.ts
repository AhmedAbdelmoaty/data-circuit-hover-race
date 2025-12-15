// Each gate option describes how "safe" vs "risky" data choices affect the race.
// Speed favors risky options while quality and combo reward consistent, stable picks.
export type GateChoice = {
  label: string;
  note: string;
  correct: boolean;
  effect: {
    speed: number; // positive = faster, negative = slower
    quality: number; // positive = cleaner dataset, negative = noisier
    combo: number; // combo multiplier adjustment
    position: number; // simulated pack position nudge (lower = better)
  };
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
      note: 'Trim safely cleans strings before joins. Reliable, but not flashy.',
      correct: true,
      effect: { speed: -4, quality: 3, combo: 0.4, position: -1 },
    },
    right: {
      label: 'Remove Rows',
      note: 'Dropping rows is risky—fewer nulls but also fewer signals.',
      correct: false,
      effect: { speed: 6, quality: -5, combo: -0.4, position: 1 },
    },
  },
  {
    id: 'normalize',
    distance: 620,
    left: {
      label: 'Normalize Case',
      note: 'Consistent casing keeps joins + grouping stable.',
      correct: true,
      effect: { speed: -2, quality: 2, combo: 0.6, position: -1 },
    },
    right: {
      label: 'Duplicate Columns',
      note: 'Duplicate columns bloat payload and confuse transforms.',
      correct: false,
      effect: { speed: 5, quality: -4, combo: -0.6, position: 2 },
    },
  },
  {
    id: 'validate',
    distance: 980,
    left: {
      label: 'Loose Match',
      note: 'Loose matching lets dirty records pass—fast but fragile.',
      correct: false,
      effect: { speed: 8, quality: -6, combo: -1, position: 2 },
    },
    right: {
      label: 'Validate Schema',
      note: 'Schema validated → downstream transforms stay predictable.',
      correct: true,
      effect: { speed: -3, quality: 4, combo: 1, position: -2 },
    },
  },
  {
    id: 'impute',
    distance: 1360,
    left: {
      label: 'Impute Nulls',
      note: 'Imputation stabilizes models and keeps sample size.',
      correct: true,
      effect: { speed: -1, quality: 3, combo: 0.8, position: -1 },
    },
    right: {
      label: 'Drop Nulls',
      note: 'Dropping is faster but risks bias + data loss.',
      correct: false,
      effect: { speed: 7, quality: -5, combo: -0.5, position: 2 },
    },
  },
  {
    id: 'normalize-values',
    distance: 1760,
    left: {
      label: 'Scale Features',
      note: 'Normalized values reduce outlier shock; steady but slower.',
      correct: true,
      effect: { speed: -2, quality: 3, combo: 1.2, position: -2 },
    },
    right: {
      label: 'Keep Raw',
      note: 'Raw values surge ahead now, but drift later.',
      correct: false,
      effect: { speed: 9, quality: -6, combo: -1, position: 3 },
    },
  },
];
