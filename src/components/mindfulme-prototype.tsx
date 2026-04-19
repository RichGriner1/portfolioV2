"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// Mindfulme brand palette — illustration content, sampled from the real app SVGs.
const MM_BG = "#FDF3D9"; // cream
const MM_INK = "#323232"; // near-black
const MM_ORANGE = "#EB6B31"; // terracotta accent
const MM_TEAL = "#81D0D5"; // sage/teal secondary
const MM_YELLOW = "#F6C343"; // warm yellow
const MM_PEACH = "#FBE1D6"; // soft peach
const MM_MUTED = "#A89F94"; // warm muted

const EASE = [0.2, 0.8, 0.2, 1] as const;

type TabKey = "home" | "meditate" | "journey" | "profile";

type MindfulmePrototypeProps = {
  active: boolean;
};

const AFFIRMATIONS = [
  "I am grounded in this moment.",
  "My calm is my superpower.",
  "Today I choose gentleness.",
  "I am enough, exactly as I am.",
];

const MEDITATIONS = [
  { id: "focus", title: "Deep Focus", duration: "10 min", color: MM_ORANGE },
  { id: "calm", title: "Evening Calm", duration: "15 min", color: MM_TEAL },
  { id: "reset", title: "Midday Reset", duration: "5 min", color: MM_YELLOW },
];

const JOURNEY = [
  { day: "Day 7", note: "climbed the anxiety mountain" },
  { day: "Day 5", note: "finally slept through the night" },
  { day: "Day 3", note: "noticed my breath in traffic" },
  { day: "Day 1", note: "started — that was the hard part" },
];

export function MindfulmePrototype({ active }: MindfulmePrototypeProps) {
  const [tab, setTab] = useState<TabKey>("home");
  const [direction, setDirection] = useState(1);

  const TAB_ORDER: TabKey[] = ["home", "meditate", "journey", "profile"];

  const goTab = (next: TabKey) => {
    const curIdx = TAB_ORDER.indexOf(tab);
    const nextIdx = TAB_ORDER.indexOf(next);
    setDirection(nextIdx >= curIdx ? 1 : -1);
    setTab(next);
  };

  return (
    <div
      className="relative rounded-[32px] p-1.5 shadow-lg"
      style={{ backgroundColor: MM_INK, width: 220, height: 360 }}
    >
      <div
        className="relative flex h-full w-full flex-col overflow-hidden rounded-[26px]"
        style={{ backgroundColor: MM_BG }}
      >
        {/* Notch */}
        <div
          aria-hidden
          className="absolute top-1.5 left-1/2 z-10 h-3 w-14 -translate-x-1/2 rounded-full"
          style={{ backgroundColor: MM_INK }}
        />

        {/* Screen content */}
        <div className="relative flex-1 overflow-hidden pt-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={tab}
              custom={direction}
              initial={{ x: direction * 12, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -direction * 12, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="absolute inset-0 overflow-y-auto px-3 pt-3 pb-2"
            >
              {tab === "home" && <HomeScreen onStart={() => goTab("meditate")} />}
              {tab === "meditate" && <MeditateScreen />}
              {tab === "journey" && <JourneyScreen />}
              {tab === "profile" && <ProfileScreen />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tab bar */}
        <TabBar tab={tab} onChange={goTab} active={active} />

        {/* Home indicator */}
        <div
          aria-hidden
          className="absolute bottom-1 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full"
          style={{ backgroundColor: MM_MUTED, opacity: 0.5 }}
        />
      </div>
    </div>
  );
}

function HomeScreen({ onStart }: { onStart: () => void }) {
  const [affIdx, setAffIdx] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-[9px] tracking-wide uppercase" style={{ color: MM_MUTED }}>
          Good morning
        </p>
        <p className="text-[13px] font-semibold" style={{ color: MM_INK }}>
          Richard
        </p>
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => setAffIdx((i) => (i + 1) % AFFIRMATIONS.length)}
        className="rounded-2xl p-3 text-left"
        style={{ backgroundColor: MM_PEACH }}
        aria-label="Cycle affirmation"
      >
        <p className="text-[8px] tracking-wide uppercase" style={{ color: MM_ORANGE }}>
          Today&apos;s Affirmation
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={affIdx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="mt-1 font-serif text-[13px] leading-snug italic"
            style={{ color: MM_ORANGE }}
          >
            &ldquo;{AFFIRMATIONS[affIdx]}&rdquo;
          </motion.p>
        </AnimatePresence>
      </motion.button>

      <div className="flex gap-1.5">
        <Chip label="Career" bg={MM_TEAL} />
        <Chip label="Finance" bg={MM_YELLOW} />
        <Chip label="Focus" bg={MM_PEACH} />
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={onStart}
        className="mt-1 rounded-full py-2 text-[11px] font-medium"
        style={{ backgroundColor: MM_ORANGE, color: MM_BG }}
      >
        Start meditation
      </motion.button>
    </div>
  );
}

function Chip({ label, bg }: { label: string; bg: string }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[9px] font-medium"
      style={{ backgroundColor: bg, color: MM_INK }}
    >
      {label}
    </span>
  );
}

function MeditateScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-semibold" style={{ color: MM_INK }}>
        Meditate
      </p>
      <div className="flex flex-col gap-1.5">
        {MEDITATIONS.map((m) => {
          const open = selected === m.id;
          return (
            <motion.button
              key={m.id}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(open ? null : m.id)}
              aria-expanded={open}
              className="flex w-full flex-col rounded-xl p-2 text-left"
              style={{ backgroundColor: "rgba(50,50,50,0.04)" }}
            >
              <div className="flex items-center gap-2">
                <Blob color={m.color} />
                <div className="flex-1">
                  <p className="text-[11px] font-medium" style={{ color: MM_INK }}>
                    {m.title}
                  </p>
                  <p className="text-[9px]" style={{ color: MM_MUTED }}>
                    {m.duration}
                  </p>
                </div>
              </div>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full"
                        style={{ backgroundColor: m.color }}
                        aria-hidden
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill={MM_BG}>
                          <path d="M1 0L8 4L1 8Z" />
                        </svg>
                      </span>
                      <Waveform color={m.color} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function Blob({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2C16 2 22 5 22 11C22 17 17 22 11 22C5 22 2 17 2 12C2 6 8 2 12 2Z"
        fill={color}
      />
    </svg>
  );
}

function Waveform({ color }: { color: string }) {
  const bars = [4, 8, 6, 10, 5, 9, 7, 11, 4, 8, 6];
  return (
    <div className="flex flex-1 items-center gap-0.5">
      {bars.map((h, i) => (
        <span
          key={i}
          className="rounded-full"
          style={{ width: 2, height: h, backgroundColor: color, opacity: 0.7 }}
        />
      ))}
    </div>
  );
}

function JourneyScreen() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] font-semibold" style={{ color: MM_INK }}>
        Journey
      </p>
      <div className="relative flex flex-col gap-3 pl-4">
        <span
          aria-hidden
          className="absolute top-1 bottom-1 left-1 w-px"
          style={{ backgroundColor: MM_MUTED, opacity: 0.4 }}
        />
        {JOURNEY.map((entry, i) => (
          <div key={entry.day} className="relative">
            <span
              aria-hidden
              className="absolute top-1 -left-3.5 h-2 w-2 rounded-full"
              style={{ backgroundColor: i === 0 ? MM_ORANGE : MM_TEAL }}
            />
            <p className="text-[9px] tracking-wide uppercase" style={{ color: MM_MUTED }}>
              {entry.day}
            </p>
            <p className="text-[10px] leading-snug" style={{ color: MM_INK }}>
              {entry.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full text-[12px] font-semibold"
          style={{ backgroundColor: MM_ORANGE, color: MM_BG }}
          aria-hidden
        >
          RG
        </span>
        <div>
          <p className="text-[12px] font-semibold" style={{ color: MM_INK }}>
            Richard Griner
          </p>
          <p className="text-[9px]" style={{ color: MM_MUTED }}>
            Streak: 7 days
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <ProfileRow label="Favorites" />
        <ProfileRow label="History" />
      </div>
    </div>
  );
}

function ProfileRow({ label }: { label: string }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      className="flex items-center justify-between rounded-lg px-2 py-2 text-left"
      style={{ backgroundColor: "rgba(50,50,50,0.04)" }}
    >
      <span className="text-[11px]" style={{ color: MM_INK }}>
        {label}
      </span>
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
        <path
          d="M3 1L7 5L3 9"
          stroke={MM_MUTED}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}

function TabBar({
  tab,
  onChange,
  active,
}: {
  tab: TabKey;
  onChange: (t: TabKey) => void;
  active: boolean;
}) {
  const tabs: { key: TabKey; label: string }[] = [
    { key: "home", label: "Home" },
    { key: "meditate", label: "Meditate" },
    { key: "journey", label: "Journey" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <div
      className="flex items-center justify-around border-t px-1 pt-1 pb-3"
      style={{ borderColor: "rgba(50,50,50,0.08)" }}
    >
      {tabs.map((t) => {
        const isActive = t.key === tab;
        return (
          <motion.button
            key={t.key}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onChange(t.key)}
            aria-label={t.label}
            aria-pressed={isActive}
            className="relative flex flex-col items-center gap-0.5 rounded-md px-1.5 py-1"
          >
            <motion.span
              animate={
                isActive && active
                  ? { scale: [1, 1.08, 1] }
                  : { scale: 1 }
              }
              transition={{
                duration: 1.8,
                repeat: isActive && active ? Infinity : 0,
                ease: "easeInOut",
              }}
              className="flex items-center justify-center"
            >
              <TabIcon tab={t.key} active={isActive} />
            </motion.span>
            <span
              className="text-[7px] font-medium tracking-wide"
              style={{ color: isActive ? MM_ORANGE : MM_MUTED }}
            >
              {t.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

function TabIcon({ tab, active }: { tab: TabKey; active: boolean }) {
  const color = active ? MM_ORANGE : MM_MUTED;
  const fill = active ? MM_ORANGE : "none";
  const size = 14;

  switch (tab) {
    case "home":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
          <path
            d="M2 7L8 2L14 7V13C14 13.5 13.5 14 13 14H10V10H6V14H3C2.5 14 2 13.5 2 13V7Z"
            stroke={color}
            strokeWidth="1.3"
            fill={fill}
            strokeLinejoin="round"
          />
        </svg>
      );
    case "meditate":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
          <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.3" fill={fill} />
          <circle
            cx="8"
            cy="8"
            r="2.5"
            stroke={color}
            strokeWidth="1.3"
            fill={active ? MM_BG : "none"}
          />
        </svg>
      );
    case "journey":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
          <path
            d="M2 13L6 6L9 10L11 7L14 13H2Z"
            stroke={color}
            strokeWidth="1.3"
            fill={fill}
            strokeLinejoin="round"
          />
        </svg>
      );
    case "profile":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
          <circle cx="8" cy="6" r="2.8" stroke={color} strokeWidth="1.3" fill={fill} />
          <path
            d="M3 14C3 11.5 5 10 8 10C11 10 13 11.5 13 14"
            stroke={color}
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
