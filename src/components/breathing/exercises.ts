export type Phase =
  | { kind: "inhale"; duration: number }
  | { kind: "hold"; duration: number }
  | { kind: "exhale"; duration: number }
  | { kind: "double-inhale"; durations: [number, number] };

export type Exercise = {
  id: string;
  name: string;
  description: string;
  phases: Phase[];
};

export const EXERCISES: Exercise[] = [
  {
    id: "box",
    name: "Box Breathing",
    description:
      "Equal sides — inhale, hold, exhale, hold. Used by Navy SEALs to calm the nervous system.",
    phases: [
      { kind: "inhale", duration: 4 },
      { kind: "hold", duration: 4 },
      { kind: "exhale", duration: 4 },
      { kind: "hold", duration: 4 },
    ],
  },
  {
    id: "478",
    name: "4-7-8",
    description:
      "Long hold and extended exhale activate the parasympathetic nervous system fast.",
    phases: [
      { kind: "inhale", duration: 4 },
      { kind: "hold", duration: 7 },
      { kind: "exhale", duration: 8 },
    ],
  },
  {
    id: "sigh",
    name: "Physiological Sigh",
    description:
      "Two inhales — a big breath then a top-up — followed by a long slow exhale. Fastest known way to reduce stress.",
    phases: [
      { kind: "double-inhale", durations: [2, 1] },
      { kind: "exhale", duration: 8 },
    ],
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    description:
      "Equal inhale and exhale at ~5 seconds each. Maximizes heart rate variability.",
    phases: [
      { kind: "inhale", duration: 5 },
      { kind: "exhale", duration: 5 },
    ],
  },
  {
    id: "triangle",
    name: "Triangle Breathing",
    description:
      "Three-sided rhythm — inhale, hold, extended exhale. Simple and grounding.",
    phases: [
      { kind: "inhale", duration: 4 },
      { kind: "hold", duration: 4 },
      { kind: "exhale", duration: 6 },
    ],
  },
];

export function pickRandom(current?: Exercise): Exercise {
  const pool = current
    ? EXERCISES.filter((e) => e.id !== current.id)
    : EXERCISES;
  return pool[Math.floor(Math.random() * pool.length)];
}
