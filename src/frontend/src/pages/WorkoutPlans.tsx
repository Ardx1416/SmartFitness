import {
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  Moon,
  RotateCcw,
  Target,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type PlanTab = "beginner" | "balanced";

interface Exercise {
  name: string;
  detail: string;
}

interface DayPlan {
  day: number;
  label: string;
  title: string;
  focus: string;
  accent: string;
  accentRgb: string;
  exercises: Exercise[];
  isRest?: boolean;
  isRecovery?: boolean;
  restMessage?: string;
  image?: string;
}

interface BalancedDay {
  day: string;
  title: string;
  type: string;
  accent: string;
  accentRgb: string;
  icon: React.ElementType;
  items: string[];
  note?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const beginnerDays: DayPlan[] = [
  {
    day: 1,
    label: "DAY 1",
    title: "CHEST + TRICEPS",
    focus: "Chest · Triceps · Core",
    accent: "#FF3B30",
    accentRgb: "255,59,48",
    image: "/assets/workouts/day1-chest.jpeg",
    exercises: [
      { name: "Push-ups", detail: "3 × 12" },
      { name: "Incline Push-ups", detail: "3 × 10" },
      { name: "Bench Dips", detail: "3 × 12" },
      { name: "Diamond Push-ups", detail: "2 × 8" },
      { name: "Plank", detail: "3 × 30 sec" },
    ],
  },
  {
    day: 2,
    label: "DAY 2",
    title: "BACK + BICEPS",
    focus: "Back Strength · Posture",
    accent: "#007AFF",
    accentRgb: "0,122,255",
    image: "/assets/workouts/day2-back.jpeg",
    exercises: [
      { name: "Superman Hold", detail: "3 × 15 sec" },
      { name: "Reverse Snow Angels", detail: "3 × 10" },
      { name: "Resistance Band Curls", detail: "3 × 12" },
      { name: "Plank Shoulder Taps", detail: "3 × 20" },
      { name: "Cobra Stretch", detail: "2 × 20 sec" },
    ],
  },
  {
    day: 3,
    label: "DAY 3",
    title: "LEGS + GLUTES",
    focus: "Lower Body · Fat Burn",
    accent: "#34C759",
    accentRgb: "52,199,89",
    image: "/assets/workouts/day3-legs.jpeg",
    exercises: [
      { name: "Squats", detail: "3 × 15" },
      { name: "Lunges", detail: "3 × 10 each leg" },
      { name: "Glute Bridge", detail: "3 × 15" },
      { name: "Wall Sit", detail: "2 × 30 sec" },
      { name: "Calf Raises", detail: "3 × 20" },
    ],
  },
  {
    day: 4,
    label: "DAY 4",
    title: "ABS + CORE",
    focus: "Visible Abs · Core Strength",
    accent: "#FFD60A",
    accentRgb: "255,214,10",
    image: "/assets/workouts/day4-abs.jpeg",
    exercises: [
      { name: "Crunches", detail: "3 × 15" },
      { name: "Leg Raises", detail: "3 × 12" },
      { name: "Russian Twists", detail: "3 × 20" },
      { name: "Mountain Climbers", detail: "3 × 30 sec" },
      { name: "Bicycle Crunch", detail: "3 × 15" },
    ],
  },
  {
    day: 5,
    label: "DAY 5",
    title: "FULL BODY + CARDIO",
    focus: "Fat Loss · Stamina",
    accent: "#BF5AF2",
    accentRgb: "191,90,242",
    image: "/assets/workouts/day5-fullbody.jpeg",
    exercises: [
      { name: "Burpees", detail: "3 × 10" },
      { name: "Jump Squats", detail: "3 × 12" },
      { name: "High Knees", detail: "3 × 30 sec" },
      { name: "Push-ups", detail: "3 × 10" },
      { name: "Plank", detail: "3 × 30 sec" },
    ],
  },
  {
    day: 6,
    label: "DAY 6",
    title: "ACTIVE RECOVERY",
    focus: "Recovery · Flexibility",
    accent: "#A2845E",
    accentRgb: "162,132,94",
    image: "/assets/workouts/day6-recovery.jpeg",
    isRecovery: true,
    exercises: [
      { name: "Walking / Light Jogging", detail: "20 min" },
      { name: "Full Body Stretching", detail: "10 min" },
    ],
  },
  {
    day: 7,
    label: "DAY 7",
    title: "REST DAY",
    focus: "Muscle Growth Happens Here",
    accent: "#636366",
    accentRgb: "99,99,102",
    image: "/assets/workouts/day7-rest.png",
    isRest: true,
    restMessage:
      "Rest & Recover — Your muscles grow during rest. Take the day off!",
    exercises: [],
  },
];

const balancedDays: BalancedDay[] = [
  {
    day: "Monday",
    title: "Full Body Strength",
    type: "Strength",
    accent: "#007AFF",
    accentRgb: "0,122,255",
    icon: Dumbbell,
    items: [
      "Squats — 3 × 12",
      "Push-ups — 3 × max",
      "Lunges — 3 × 12/leg",
      "Dumbbell Rows — 3 × 12/arm",
      "Plank — 3 × 60 sec",
    ],
  },
  {
    day: "Tuesday",
    title: "Cardio Endurance",
    type: "Cardio",
    accent: "#FF3B30",
    accentRgb: "255,59,48",
    icon: Flame,
    items: [
      "30–45 min moderate intensity",
      "Running / Cycling / Swimming",
      "Elliptical / Rowing Machine",
    ],
    note: "Keep heart rate at 65–75% max",
  },
  {
    day: "Wednesday",
    title: "Active Recovery",
    type: "Recovery",
    accent: "#34C759",
    accentRgb: "52,199,89",
    icon: RotateCcw,
    items: [
      "30–60 min low-intensity",
      "Yoga / Stretching",
      "Light Walking",
      "Swimming / Foam Rolling",
    ],
    note: "Keep it easy — this is recovery",
  },
  {
    day: "Thursday",
    title: "Upper Body Strength",
    type: "Strength",
    accent: "#BF5AF2",
    accentRgb: "191,90,242",
    icon: Target,
    items: [
      "Overhead Press — 3 × 12",
      "Lat Pulldowns — 3 × 12",
      "Bench Press — 3 × 12",
      "Bicep Curls — 3 × 12/arm",
      "Tricep Dips — 3 × 12",
    ],
  },
  {
    day: "Friday",
    title: "HIIT Circuit",
    type: "HIIT",
    accent: "#FF9500",
    accentRgb: "255,149,0",
    icon: Zap,
    items: [
      "Burpees — 30 sec work / 15 sec rest",
      "Jumping Jacks — 30 sec / 15 sec",
      "Mountain Climbers — 30 sec / 15 sec",
      "Squat Jumps — 30 sec / 15 sec",
      "High Knees — 30 sec / 15 sec",
    ],
    note: "3–4 rounds total",
  },
  {
    day: "Saturday",
    title: "Rest & Recovery",
    type: "Rest",
    accent: "#636366",
    accentRgb: "99,99,102",
    icon: Moon,
    items: ["Full rest day", "Focus on sleep and nutrition"],
    note: "Recovery is where the gains happen",
  },
  {
    day: "Sunday",
    title: "Leg Day & Core",
    type: "Strength",
    accent: "#FFD60A",
    accentRgb: "255,214,10",
    icon: CheckCircle2,
    items: [
      "Deadlifts — 3 × 10",
      "Leg Press — 3 × 12",
      "Calf Raises — 3 × 20",
      "Leg Curls — 3 × 12",
      "Russian Twists — 3 × 30",
      "Hanging Leg Raises — 3 × max",
    ],
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function BeginnerDayCard({ plan, index }: { plan: DayPlan; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      data-ocid={`workout_plans.beginner_day.${plan.day}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.02]"
      style={{
        borderColor: `rgba(${plan.accentRgb}, 0.3)`,
        background: "rgba(15,15,20,0.85)",
        boxShadow: `0 0 0 0 rgba(${plan.accentRgb}, 0)`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          `rgba(${plan.accentRgb}, 0.7)`;
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 0 24px rgba(${plan.accentRgb}, 0.18)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          `rgba(${plan.accentRgb}, 0.3)`;
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 0 0 0 rgba(${plan.accentRgb}, 0)`;
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full flex-shrink-0"
        style={{
          background: `linear-gradient(90deg, ${plan.accent}, ${plan.accent}88)`,
        }}
      />

      {/* Image (when available and not rest) */}
      {plan.image && !plan.isRest && !imgError && (
        <div className="relative h-36 w-full overflow-hidden flex-shrink-0">
          <img
            src={plan.image}
            alt={plan.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 40%, rgba(10,10,15,0.9) 100%)",
            }}
          />
        </div>
      )}

      {/* Rest Day with image */}
      {plan.image && plan.isRest && !imgError && (
        <div className="relative h-36 w-full overflow-hidden flex-shrink-0">
          <img
            src={plan.image}
            alt="Rest Day"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-surface-950/50" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Day badge */}
        <span
          className="text-[10px] font-black tracking-[0.2em] px-2.5 py-1 rounded-full w-fit mb-3"
          style={{
            color: plan.accent,
            background: `rgba(${plan.accentRgb}, 0.15)`,
            border: `1px solid rgba(${plan.accentRgb}, 0.35)`,
          }}
        >
          {plan.label}
        </span>

        {/* Title */}
        <h3
          className="font-display font-black text-xl leading-tight mb-2"
          style={{ color: plan.isRest ? "#636366" : "white" }}
        >
          {plan.title}
        </h3>

        {/* Focus pill */}
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-surface-400 mb-4">
          <Target className="w-3 h-3" style={{ color: plan.accent }} />
          {plan.focus}
        </span>

        {/* Rest message or exercise list */}
        {plan.isRest && plan.restMessage ? (
          <div
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{
              background: `rgba(${plan.accentRgb}, 0.08)`,
              border: `1px solid rgba(${plan.accentRgb}, 0.2)`,
            }}
          >
            <Moon
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: plan.accent }}
            />
            <p className="text-surface-300 text-sm leading-relaxed">
              {plan.restMessage}
            </p>
          </div>
        ) : (
          <ul className="space-y-2.5 flex-1">
            {plan.exercises.map((ex) => (
              <li key={ex.name} className="flex items-center gap-3">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: plan.accent }}
                />
                <span className="text-sm text-white font-medium flex-1 min-w-0 truncate">
                  {ex.name}
                </span>
                <span
                  className="text-xs font-bold flex-shrink-0 px-2 py-0.5 rounded-md"
                  style={{
                    color: plan.accent,
                    background: `rgba(${plan.accentRgb}, 0.12)`,
                  }}
                >
                  {ex.detail}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

function BalancedDayCard({
  plan,
  index,
}: { plan: BalancedDay; index: number }) {
  const Icon = plan.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      data-ocid={`workout_plans.balanced_day.${index + 1}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.02]"
      style={{
        borderColor: `rgba(${plan.accentRgb}, 0.3)`,
        background: "rgba(15,15,20,0.85)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          `rgba(${plan.accentRgb}, 0.7)`;
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 0 24px rgba(${plan.accentRgb}, 0.18)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          `rgba(${plan.accentRgb}, 0.3)`;
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full flex-shrink-0"
        style={{
          background: `linear-gradient(90deg, ${plan.accent}, ${plan.accent}66)`,
        }}
      />

      <div className="flex flex-col flex-1 p-5">
        {/* Day + type header */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[10px] font-black tracking-[0.2em] px-2.5 py-1 rounded-full"
            style={{
              color: plan.accent,
              background: `rgba(${plan.accentRgb}, 0.15)`,
              border: `1px solid rgba(${plan.accentRgb}, 0.35)`,
            }}
          >
            {plan.day.toUpperCase()}
          </span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-md"
            style={{
              color: plan.accent,
              background: `rgba(${plan.accentRgb}, 0.1)`,
            }}
          >
            {plan.type}
          </span>
        </div>

        {/* Icon + title */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ background: `rgba(${plan.accentRgb}, 0.15)` }}
          >
            <Icon className="w-5 h-5" style={{ color: plan.accent }} />
          </div>
          <h3 className="font-display font-black text-lg text-white leading-tight">
            {plan.title}
          </h3>
        </div>

        {/* Exercise items */}
        <ul className="space-y-2 flex-1 mb-3">
          {plan.items.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <CheckCircle2
                className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                style={{ color: plan.accent }}
              />
              <span className="text-sm text-surface-300 leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>

        {/* Note */}
        {plan.note && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-surface-400 font-medium mt-auto"
            style={{ background: `rgba(${plan.accentRgb}, 0.07)` }}
          >
            <Clock
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: plan.accent }}
            />
            {plan.note}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function WorkoutPlans() {
  const [activeTab, setActiveTab] = useState<PlanTab>("beginner");

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Page Header */}
      <section className="relative pt-10 pb-8 sm:pt-14 sm:pb-10 overflow-hidden">
        {/* Subtle grid backdrop */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,170,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,170,255,0.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-950/0 via-transparent to-surface-950 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric-500/15 border border-electric-500/30 text-electric-400 text-xs font-semibold mb-4 tracking-wide">
              <Calendar className="w-3.5 h-3.5" />
              Structured Training
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-white mb-3 leading-tight">
              Workout <span className="text-electric-400">Plans</span>
            </h1>
            <p className="text-surface-400 text-base sm:text-lg max-w-xl">
              Structured weekly training for every fitness level. Pick your plan
              and follow each day's exercises.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Plan Selector Tabs */}
      <section className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-1">
            {(
              [
                {
                  id: "beginner" as PlanTab,
                  label: "7-Day Beginner Plan",
                  icon: Dumbbell,
                  badge: "Bodyweight",
                },
                {
                  id: "balanced" as PlanTab,
                  label: "My Balanced Week",
                  icon: Calendar,
                  badge: "All Levels",
                },
              ] as {
                id: PlanTab;
                label: string;
                icon: React.ElementType;
                badge: string;
              }[]
            ).map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                data-ocid={`workout_plans.${id}_tab`}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-300 flex-shrink-0 border ${
                  activeTab === id
                    ? "bg-electric-500/20 text-electric-400 border-electric-500/50 shadow-[0_0_16px_rgba(0,170,255,0.2)]"
                    : "bg-surface-900/60 text-surface-300 border-surface-700/50 hover:border-surface-500/60 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === id
                      ? "bg-electric-500/25 text-electric-300"
                      : "bg-surface-700/60 text-surface-400"
                  }`}
                >
                  {badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Content */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "beginner" ? (
              <motion.div
                key="beginner"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                {/* Plan intro strip */}
                <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl bg-surface-900/60 border border-surface-700/40">
                  <div className="flex items-center gap-2 text-sm text-surface-300">
                    <Dumbbell className="w-4 h-4 text-electric-400" />
                    <span className="font-semibold text-white">
                      7-Day Beginner Plan
                    </span>
                  </div>
                  <span className="h-4 w-px bg-surface-700 hidden sm:block" />
                  <span className="text-xs text-surface-400">
                    No gym required
                  </span>
                  <span className="h-4 w-px bg-surface-700 hidden sm:block" />
                  <span className="text-xs text-surface-400">
                    Bodyweight only
                  </span>
                  <span className="h-4 w-px bg-surface-700 hidden sm:block" />
                  <span className="text-xs text-surface-400">
                    20–45 min/day
                  </span>
                </div>

                <div
                  className="grid gap-4 sm:gap-5"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(260px, 1fr))",
                  }}
                >
                  {beginnerDays.map((plan, i) => (
                    <BeginnerDayCard key={plan.day} plan={plan} index={i} />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="balanced"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                {/* Plan intro strip */}
                <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl bg-surface-900/60 border border-surface-700/40">
                  <div className="flex items-center gap-2 text-sm text-surface-300">
                    <Calendar className="w-4 h-4 text-electric-400" />
                    <span className="font-semibold text-white">
                      My Balanced Week
                    </span>
                  </div>
                  <span className="h-4 w-px bg-surface-700 hidden sm:block" />
                  <span className="text-xs text-surface-400">
                    Gym recommended
                  </span>
                  <span className="h-4 w-px bg-surface-700 hidden sm:block" />
                  <span className="text-xs text-surface-400">
                    All fitness levels
                  </span>
                  <span className="h-4 w-px bg-surface-700 hidden sm:block" />
                  <span className="text-xs text-surface-400">
                    45–60 min/day
                  </span>
                </div>

                <div
                  className="grid gap-4 sm:gap-5"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(260px, 1fr))",
                  }}
                >
                  {balancedDays.map((plan, i) => (
                    <BalancedDayCard key={plan.day} plan={plan} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
