import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import type { AresFitnessProfile, ChatMessage } from "../backend.d.ts";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PersonalityMode = "strict" | "friendly" | "motivational";
export type OnboardingStep =
  | "greeting"
  | "weight"
  | "height"
  | "goal"
  | "experience"
  | "diet"
  | "done";

export interface LocalMessage {
  id: string;
  sender: "ares" | "user";
  text: string;
  timestamp: number;
  quickReplies?: string[];
  workoutActions?: boolean;
  exerciseData?: ExerciseHowTo;
  isNudge?: boolean;
}

export interface ExerciseHowTo {
  name: string;
  steps: string[];
  tip: string;
  mistake: string;
  videoUrl: string;
}

// ─── Exercise How-To Data ─────────────────────────────────────────────────────

const EXERCISE_MAP: Record<string, ExerciseHowTo> = {
  "push-ups": {
    name: "Push-Ups",
    steps: [
      "Start in a high plank with hands shoulder-width apart.",
      "Lower your chest until it nearly touches the floor, keeping elbows at 45°.",
      "Push explosively back to the start, fully extending arms.",
      "Keep your core braced and body in a straight line throughout.",
    ],
    tip: "Beginners: start on your knees to build strength.",
    mistake: "Letting hips sag or shooting up — keep a rigid plank.",
    videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
  },
  squats: {
    name: "Squats",
    steps: [
      "Stand with feet shoulder-width apart, toes slightly out.",
      "Hinge at hips and bend knees, sending them over your toes.",
      "Lower until thighs are parallel to the floor (or below).",
      "Drive through heels to return to standing.",
    ],
    tip: "Hold your arms out in front for balance as a beginner.",
    mistake: "Knees caving inward — push them out actively.",
    videoUrl: "https://www.youtube.com/embed/aclHkVaku9U",
  },
  "pull-ups": {
    name: "Pull-Ups",
    steps: [
      "Hang from a bar with hands slightly wider than shoulder-width, palms facing away.",
      "Depress your shoulder blades and engage your lats.",
      "Pull yourself up until your chin clears the bar.",
      "Lower slowly with control to a dead hang.",
    ],
    tip: "Use a resistance band looped over the bar for assisted reps.",
    mistake: "Kipping or swinging — strict form builds real strength.",
    videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g",
  },
  deadlifts: {
    name: "Deadlifts",
    steps: [
      "Stand with feet hip-width apart, bar over mid-foot.",
      "Hinge forward, grip the bar just outside your legs.",
      "Brace your core, chest up, and drive through your heels to stand.",
      "Lock out hips at the top, then hinge back down with control.",
    ],
    tip: "Think 'push the floor away' rather than 'pull the bar up'.",
    mistake: "Rounding your lower back — keep your spine neutral throughout.",
    videoUrl: "https://www.youtube.com/embed/op9kVnSso6Q",
  },
  "bench press": {
    name: "Bench Press",
    steps: [
      "Lie on a bench with eyes under the bar, feet flat on the floor.",
      "Grip bar slightly wider than shoulder-width, retract your shoulder blades.",
      "Lower bar to your lower chest with control (45° elbow angle).",
      "Press bar up and slightly back to the start position.",
    ],
    tip: "Keep your wrists stacked over your elbows at all times.",
    mistake: "Bouncing the bar off your chest — control the descent.",
    videoUrl: "https://www.youtube.com/embed/VmB1G1K7v94",
  },
  lunges: {
    name: "Lunges",
    steps: [
      "Stand upright with feet hip-width apart.",
      "Step one foot forward and lower your back knee toward the floor.",
      "Front knee stays over your ankle — don't let it pass your toes.",
      "Push off your front foot to return to standing.",
    ],
    tip: "Keep your torso upright; don't lean forward.",
    mistake: "Front knee caving inward — track it over your second toe.",
    videoUrl: "https://www.youtube.com/embed/QOVaHwm-Q6U",
  },
  plank: {
    name: "Plank",
    steps: [
      "Place forearms on the floor, elbows under shoulders.",
      "Extend legs behind you, resting on your toes.",
      "Brace core, glutes, and quads — maintain a straight line.",
      "Hold without letting hips rise or sag.",
    ],
    tip: "Squeeze every muscle in your body for maximum benefit.",
    mistake: "Holding your breath — breathe steadily throughout.",
    videoUrl: "https://www.youtube.com/embed/pSHjTRCQxIw",
  },
  burpees: {
    name: "Burpees",
    steps: [
      "Stand, then squat down and place hands on the floor.",
      "Jump both feet back into a push-up position.",
      "Perform one push-up (optional), then jump feet back in.",
      "Explode upward into a jump, clapping hands overhead.",
    ],
    tip: "Break into smaller sets with short rests to maintain quality.",
    mistake: "Rushing the movement and losing form — control each phase.",
    videoUrl: "https://www.youtube.com/embed/auBLPXO8Fww",
  },
  "bicep curls": {
    name: "Bicep Curls",
    steps: [
      "Stand with dumbbells at your sides, palms facing forward.",
      "Keeping elbows fixed at your sides, curl the weights toward your shoulders.",
      "Squeeze your biceps at the top for a full contraction.",
      "Lower slowly to the starting position.",
    ],
    tip: "Control the lowering phase — the eccentric builds muscle fast.",
    mistake: "Swinging your torso to lift heavier — use lighter weight.",
    videoUrl: "https://www.youtube.com/embed/ykJmrZ5v0Oo",
  },
  rows: {
    name: "Bent-Over Rows",
    steps: [
      "Hinge forward at the hips, back flat and parallel to the floor.",
      "Hold dumbbells or a barbell with arms extended toward the floor.",
      "Pull the weight to your lower chest, driving elbows behind you.",
      "Lower with control back to the hanging position.",
    ],
    tip: "Initiate the pull with your elbows, not your hands.",
    mistake: "Rounding your back under load — lighter weight, better form.",
    videoUrl: "https://www.youtube.com/embed/G8l_8chR5BE",
  },
  dips: {
    name: "Tricep Dips",
    steps: [
      "Grip parallel bars, arms fully extended, shoulders depressed.",
      "Lean slightly forward and lower your body by bending elbows.",
      "Stop when elbows reach ~90° and shoulders are below elbows.",
      "Press back up to the start, locking out your triceps.",
    ],
    tip: "Stay upright to target triceps; lean forward for more chest.",
    mistake: "Flaring elbows out wide — keep them close to your body.",
    videoUrl: "https://www.youtube.com/embed/2z8JmcrW-As",
  },
  "calf raises": {
    name: "Calf Raises",
    steps: [
      "Stand on the edge of a step or flat ground, feet hip-width apart.",
      "Rise onto the balls of your feet as high as possible.",
      "Pause and squeeze your calves at the top.",
      "Lower your heels below the step edge for a full stretch.",
    ],
    tip: "Add weight or perform one-legged to increase difficulty.",
    mistake: "Bouncing — slow, controlled reps improve muscle growth.",
    videoUrl: "https://www.youtube.com/embed/-M4-G8p8fmc",
  },
  "mountain climbers": {
    name: "Mountain Climbers",
    steps: [
      "Start in a high plank position, wrists under shoulders.",
      "Drive one knee toward your chest, keeping hips level.",
      "Quickly switch legs, alternating in a running motion.",
      "Keep your core tight and hips from bouncing.",
    ],
    tip: "Slower tempo = more core work; faster = more cardio.",
    mistake: "Letting hips rise or rock — maintain a rigid plank position.",
    videoUrl: "https://www.youtube.com/embed/nmwgirgXLYM",
  },
  "russian twists": {
    name: "Russian Twists",
    steps: [
      "Sit on the floor, knees bent, feet slightly raised.",
      "Lean back to ~45° with a straight back.",
      "Clasp hands or hold a weight at chest level.",
      "Rotate your torso from side to side, touching the floor each time.",
    ],
    tip: "Keep your chest tall — don't round your upper back.",
    mistake: "Moving only your arms — the rotation should come from your core.",
    videoUrl: "https://www.youtube.com/embed/wkD8rjkodUI",
  },
  "leg raises": {
    name: "Leg Raises",
    steps: [
      "Lie flat on your back with legs straight and arms by your sides.",
      "Brace your core and press your lower back into the floor.",
      "Raise both legs until they're vertical, keeping them straight.",
      "Lower slowly back to just above the floor without touching.",
    ],
    tip: "Tuck hands under your glutes for lower back support.",
    mistake: "Letting your lower back arch — keep it pressed to the ground.",
    videoUrl: "https://www.youtube.com/embed/JB2oyawG9KI",
  },
};

// ─── Workout Day Data ─────────────────────────────────────────────────────────

const WORKOUT_DAYS = [
  {
    focus: "Chest + Triceps",
    exercises: [
      "Push-Ups",
      "Bench Press",
      "Incline Dumbbell Press",
      "Tricep Dips",
      "Overhead Tricep Extension",
    ],
  },
  {
    focus: "Back + Biceps",
    exercises: [
      "Pull-Ups",
      "Bent-Over Rows",
      "Lat Pulldown",
      "Barbell Curls",
      "Hammer Curls",
    ],
  },
  {
    focus: "Legs",
    exercises: [
      "Squats",
      "Romanian Deadlifts",
      "Leg Press",
      "Lunges",
      "Calf Raises",
    ],
  },
  {
    focus: "Abs + Core",
    exercises: [
      "Plank",
      "Crunches",
      "Leg Raises",
      "Russian Twists",
      "Mountain Climbers",
    ],
  },
  {
    focus: "Full Body",
    exercises: [
      "Burpees",
      "Deadlifts",
      "Clean and Press",
      "Kettlebell Swings",
      "Box Jumps",
    ],
  },
  {
    focus: "Recovery",
    exercises: [
      "Cat-Cow",
      "Child's Pose",
      "World's Greatest Stretch",
      "Foam Rolling Calves",
      "Pigeon Pose",
    ],
  },
  { focus: "Rest Day", exercises: [] },
] as const;

// ─── Personality Responses ────────────────────────────────────────────────────

const PERSONALITY = {
  strict: {
    greeting: (name?: string) =>
      `I am Ares — your personal combat coach${name ? `, ${name}` : ""}. No excuses. No shortcuts. Before we begin, I need your data. What is your current weight in kg?`,
    onboardingComplete:
      "Data logged. No more excuses. Let's build your warrior body.",
    workoutPrefix: (focus: string, count: number) =>
      `Today: ${focus}. ${count} exercises. Ready to suffer?`,
    skipResponse: "Skipped. Weakness noted. Don't let it happen twice.",
    startResponse: "Session started. No backing out now.",
    missedOne: (n: number) =>
      `You missed ${n > 1 ? `${n} days` : "yesterday"}. That's not how warriors train. Make up for it TODAY.`,
    alreadyTrained: "Already trained today. Recover well. See you tomorrow.",
    fallback:
      "I'm a combat coach, not a therapist. Ask me about your workout or form.",
    modifyPrompt: "Tell me what to change:",
    progressUpdate: (kg: number) =>
      `${kg}kg recorded. Warriors track their gains. Keep showing up.`,
  },
  friendly: {
    greeting: (name?: string) =>
      `Hey${name ? ` ${name}` : ""}! I'm Ares, your personal fitness coach! 😊 I'm here to help you crush your goals. Let's start by getting to know you — what's your current weight in kg?`,
    onboardingComplete:
      "Perfect! I've got everything I need to build your personalised plan. Let's get to work!",
    workoutPrefix: (focus: string, count: number) =>
      `Today: ${focus}. ${count} exercises. Let's do this! 💪`,
    skipResponse:
      "No worries! Rest days are important too. I'll have something special for you tomorrow.",
    startResponse: "Amazing! Your session has started. You've got this!",
    missedOne: (n: number) =>
      `You've been away for ${n > 1 ? `${n} days` : "a day"}. That's okay — let's ease back in and rebuild your momentum! 😊`,
    alreadyTrained:
      "You already trained today — that's awesome! Rest up and I'll see you tomorrow.",
    fallback:
      "I'm best at workout plans and exercise tips! What would you like to work on?",
    modifyPrompt: "Sure! Tell me what you'd like to change:",
    progressUpdate: (kg: number) =>
      `${kg}kg noted! Tracking your progress is a huge part of the journey. Keep it up!`,
  },
  motivational: {
    greeting: (name?: string) =>
      `WELCOME${name ? `, ${name.toUpperCase()}` : ""}! I am ARES — your combat coach and the voice in your head when things get hard! 🔥 Before we begin, I need your stats. What's your current weight in kg?`,
    onboardingComplete:
      "Let's GOOO! Your transformation starts NOW! The version of you that you've been dreaming about — it's time to BUILD IT!",
    workoutPrefix: (focus: string, count: number) =>
      `TODAY IS ${focus.toUpperCase()} DAY! ${count} exercises. LET'S GO! 🔥`,
    skipResponse:
      "Skipped? Your future self is watching. Come back STRONGER tomorrow!",
    startResponse:
      "LET'S GO! You made the decision — that already puts you ahead of 90% of people!",
    missedOne: (n: number) =>
      `${n > 1 ? `${n} days` : "A day"} missed? That's fuel for today! Warriors don't quit — they COME BACK HARDER! 🔥`,
    alreadyTrained:
      "You already CRUSHED your workout today! REST is part of the GRIND. See you tomorrow CHAMPION!",
    fallback:
      "Let's stay focused on what matters — your TRANSFORMATION! What do you need to build the best version of YOU?",
    modifyPrompt: "LET'S CUSTOMIZE! Tell me what you want to change:",
    progressUpdate: (kg: number) =>
      `${kg}kg LOCKED IN! Every measurement is a victory lap — you're doing INCREDIBLE! 🔥`,
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeMsgId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getDayIndex(lastDate?: string): number {
  if (!lastDate) {
    // No history yet — seed deterministically from today's date number
    return new Date().getDate() % 7;
  }
  const elapsedDays = Math.floor(
    (Date.now() - new Date(lastDate).getTime()) / 86400000,
  );
  return elapsedDays % 7;
}

function getWorkoutForProfile(
  _profile: AresFitnessProfile,
  dayIndex: number,
): (typeof WORKOUT_DAYS)[number] {
  return WORKOUT_DAYS[dayIndex % 7];
}

function getSetsReps(experience?: string): string {
  if (experience === "advanced") return "4–5 sets × 6–10 reps";
  if (experience === "intermediate") return "4 sets × 8–12 reps";
  return "3 sets × 10–12 reps";
}

function parseExerciseIntent(msg: string): string | null {
  const lower = msg.toLowerCase();
  const hasIntent =
    lower.includes("how") ||
    lower.includes("show") ||
    lower.includes("form") ||
    lower.includes("steps") ||
    lower.includes("do");
  if (!hasIntent) return null;

  for (const key of Object.keys(EXERCISE_MAP)) {
    if (lower.includes(key)) return key;
  }
  // fuzzy matches
  const aliases: Record<string, string> = {
    curl: "bicep curls",
    row: "rows",
    "bench press": "bench press",
    deadlift: "deadlifts",
    squat: "squats",
    lunge: "lunges",
    "pull up": "pull-ups",
    pullup: "pull-ups",
    "push up": "push-ups",
    pushup: "push-ups",
    burpee: "burpees",
    dip: "dips",
    plank: "plank",
    "mountain climber": "mountain climbers",
    "russian twist": "russian twists",
    "leg raise": "leg raises",
    "calf raise": "calf raises",
  };
  for (const [alias, key] of Object.entries(aliases)) {
    if (lower.includes(alias)) return key;
  }
  return null;
}

// ─── LS fallback ──────────────────────────────────────────────────────────────

const LS_MESSAGES_KEY = "ares_messages";
const LS_PROFILE_KEY = "ares_profile";

function lsGetMessages(): LocalMessage[] {
  try {
    const raw = localStorage.getItem(LS_MESSAGES_KEY);
    return raw ? (JSON.parse(raw) as LocalMessage[]) : [];
  } catch {
    return [];
  }
}

function lsSaveMessages(msgs: LocalMessage[]) {
  try {
    localStorage.setItem(LS_MESSAGES_KEY, JSON.stringify(msgs.slice(-100)));
  } catch {
    /* noop */
  }
}

function lsGetProfile(): AresFitnessProfile | null {
  try {
    const raw = localStorage.getItem(LS_PROFILE_KEY);
    return raw ? (JSON.parse(raw) as AresFitnessProfile) : null;
  } catch {
    return null;
  }
}

function lsSaveProfile(p: AresFitnessProfile) {
  try {
    localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(p));
  } catch {
    /* noop */
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAres() {
  const { actor, isFetching } = useActor(createActor);

  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [profile, setProfile] = useState<AresFitnessProfile | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [onboardingStep, setOnboardingStep] =
    useState<OnboardingStep>("greeting");
  const [isLoaded, setIsLoaded] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<
    Partial<AresFitnessProfile>
  >({});
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const mode: PersonalityMode = (profile?.personalityMode ??
    "strict") as PersonalityMode;

  // ── scroll helpers ───────────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  // ── add message helpers ──────────────────────────────────────────────────────
  const addMessage = useCallback(
    (msg: Omit<LocalMessage, "id" | "timestamp">) => {
      const full: LocalMessage = {
        ...msg,
        id: makeMsgId(),
        timestamp: Date.now(),
      };
      setMessages((prev) => {
        const next = [...prev, full];
        lsSaveMessages(next);
        return next;
      });
      return full;
    },
    [],
  );

  const persistToBackend = useCallback(
    async (local: LocalMessage) => {
      if (!actor) return;
      const cm: ChatMessage = {
        id: local.id,
        sender: local.sender,
        message: local.text,
        mode: mode,
        timestamp: BigInt(local.timestamp),
      };
      try {
        await actor.addAresChatMessage(cm);
      } catch {
        /* graceful degradation */
      }
    },
    [actor, mode],
  );

  // ── ares responds with typing delay ─────────────────────────────────────────
  const aresRespond = useCallback(
    async (
      text: string,
      options?: {
        quickReplies?: string[];
        workoutActions?: boolean;
        exerciseData?: ExerciseHowTo;
        isNudge?: boolean;
      },
    ) => {
      setIsTyping(true);
      await new Promise((r) => setTimeout(r, 800));
      setIsTyping(false);
      const msg = addMessage({
        sender: "ares",
        text,
        quickReplies: options?.quickReplies,
        workoutActions: options?.workoutActions,
        exerciseData: options?.exerciseData,
        isNudge: options?.isNudge,
      });
      persistToBackend(msg);
      scrollToBottom();
    },
    [addMessage, persistToBackend, scrollToBottom],
  );

  // ── save profile to backend + ls ────────────────────────────────────────────
  const saveProfile = useCallback(
    async (p: AresFitnessProfile) => {
      setProfile(p);
      lsSaveProfile(p);
      if (actor) {
        try {
          await actor.saveAresFitnessProfile(p);
        } catch {
          /* graceful degradation */
        }
      }
    },
    [actor],
  );

  // ── initial load ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isFetching || isLoaded) return;

    const load = async () => {
      let loadedProfile: AresFitnessProfile | null = null;
      let loadedMessages: LocalMessage[] = [];

      if (actor) {
        try {
          loadedProfile = await actor.getAresFitnessProfile();
        } catch {
          loadedProfile = lsGetProfile();
        }
        try {
          const backendMsgs = await actor.getAresChatHistory();
          loadedMessages = backendMsgs.map((cm) => ({
            id: cm.id,
            sender: cm.sender as "ares" | "user",
            text: cm.message,
            timestamp: Number(cm.timestamp),
          }));
        } catch {
          loadedMessages = lsGetMessages();
        }
      } else {
        loadedProfile = lsGetProfile();
        loadedMessages = lsGetMessages();
      }

      setIsLoaded(true);

      if (loadedProfile) {
        setProfile(loadedProfile);
        const dayIdx = getDayIndex(loadedProfile.lastWorkoutDate);
        setCurrentDayIndex(dayIdx);

        if (loadedProfile.onboardingComplete) {
          setOnboardingStep("done");
          if (loadedMessages.length > 0) {
            setMessages(loadedMessages);
            scrollToBottom();
            // check nudge
            const missed = Number(loadedProfile.missedDaysCount ?? 0);
            const today = todayStr();
            const alreadyTrained = loadedProfile.lastWorkoutDate === today;
            const currentP =
              PERSONALITY[
                (loadedProfile.personalityMode ?? "strict") as PersonalityMode
              ];
            if (alreadyTrained) {
              setTimeout(
                () => aresRespond(currentP.alreadyTrained, { isNudge: true }),
                1000,
              );
            } else if (missed >= 2) {
              setTimeout(
                () =>
                  aresRespond(currentP.missedOne(missed), { isNudge: true }),
                1000,
              );
            } else if (missed === 1) {
              setTimeout(
                () => aresRespond(currentP.missedOne(1), { isNudge: true }),
                1000,
              );
            } else {
              // show today's workout
              const workout = getWorkoutForProfile(loadedProfile, dayIdx);
              if (workout.exercises.length > 0) {
                const setsReps = getSetsReps(loadedProfile.experienceLevel);
                const workoutText = `${currentP.workoutPrefix(workout.focus, workout.exercises.length)}\n\n${workout.exercises.map((e, i) => `${i + 1}. ${e}`).join("\n")}\n\n${setsReps} | Rest 60–90s between sets`;
                setTimeout(
                  () => aresRespond(workoutText, { workoutActions: true }),
                  1000,
                );
              } else {
                setTimeout(
                  () =>
                    aresRespond(
                      "Rest is part of training. Eat well. Sleep well. Come back stronger.",
                    ),
                  1000,
                );
              }
            }
          } else {
            // No prior history — greet + show workout
            const currentP =
              PERSONALITY[
                (loadedProfile.personalityMode ?? "strict") as PersonalityMode
              ];
            setTimeout(
              () =>
                aresRespond(currentP.greeting(), {
                  workoutActions: false,
                }),
              500,
            );
          }
        } else {
          // Resume onboarding
          if (loadedMessages.length > 0) {
            setMessages(loadedMessages);
          }
          const pMode =
            PERSONALITY[
              (loadedProfile.personalityMode ?? "strict") as PersonalityMode
            ];
          // Determine step from profile
          if (!loadedProfile.weightKg) {
            setOnboardingStep("weight");
            setTimeout(() => aresRespond(pMode.greeting()), 500);
          } else if (!loadedProfile.heightCm) {
            setOnboardingStep("height");
            setTimeout(() => aresRespond("And your height in cm?"), 500);
          } else if (!loadedProfile.goal) {
            setOnboardingStep("goal");
            setTimeout(
              () =>
                aresRespond("What is your goal? Choose one:", {
                  quickReplies: ["Fat Loss", "Muscle Gain", "Strength", "Abs"],
                }),
              500,
            );
          } else if (!loadedProfile.experienceLevel) {
            setOnboardingStep("experience");
            setTimeout(
              () =>
                aresRespond("Your experience level?", {
                  quickReplies: ["Beginner", "Intermediate", "Advanced"],
                }),
              500,
            );
          } else if (!loadedProfile.dietType) {
            setOnboardingStep("diet");
            setTimeout(
              () =>
                aresRespond("Diet type?", {
                  quickReplies: ["Veg", "Non-Veg"],
                }),
              500,
            );
          }
        }
      } else {
        // Brand new user
        if (loadedMessages.length > 0) {
          setMessages(loadedMessages);
          scrollToBottom();
        } else {
          setOnboardingStep("weight");
          setTimeout(() => aresRespond(PERSONALITY.strict.greeting()), 500);
        }
      }
    };

    load();
  }, [actor, isFetching, isLoaded, aresRespond, scrollToBottom]);

  // ── handle user send ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMsg = addMessage({ sender: "user", text: text.trim() });
      persistToBackend(userMsg);
      scrollToBottom();

      const currentProfile = profile;
      const currentMode: PersonalityMode = (currentProfile?.personalityMode ??
        "strict") as PersonalityMode;
      const pText = PERSONALITY[currentMode];

      // ── onboarding flow ────────────────────────────────────────────────────
      if (!currentProfile || !currentProfile.onboardingComplete) {
        const step = onboardingStep;

        if (step === "weight" || step === "greeting") {
          const val = Number.parseFloat(text.replace(/[^0-9.]/g, ""));
          if (Number.isNaN(val) || val < 20 || val > 300) {
            await aresRespond(
              "Invalid weight. Please enter a number between 20 and 300 kg.",
            );
            return;
          }
          setPendingProfile((p) => ({ ...p, weightKg: val }));
          setOnboardingStep("height");
          await aresRespond("And your height in cm?");
          return;
        }

        if (step === "height") {
          const val = Number.parseFloat(text.replace(/[^0-9.]/g, ""));
          if (Number.isNaN(val) || val < 100 || val > 250) {
            await aresRespond(
              "Invalid height. Please enter a number between 100 and 250 cm.",
            );
            return;
          }
          setPendingProfile((p) => ({ ...p, heightCm: val }));
          setOnboardingStep("goal");
          await aresRespond("What is your goal? Choose one:", {
            quickReplies: ["Fat Loss", "Muscle Gain", "Strength", "Abs"],
          });
          return;
        }

        if (step === "goal") {
          const lower = text.toLowerCase();
          const goalMap: Record<string, string> = {
            "fat loss": "fat_loss",
            fat: "fat_loss",
            "muscle gain": "muscle_gain",
            muscle: "muscle_gain",
            gain: "muscle_gain",
            strength: "strength",
            abs: "abs",
          };
          const goal =
            Object.entries(goalMap).find(([k]) => lower.includes(k))?.[1] ??
            null;
          if (!goal) {
            await aresRespond(
              "I didn't catch that. Please choose: Fat Loss, Muscle Gain, Strength, or Abs.",
              { quickReplies: ["Fat Loss", "Muscle Gain", "Strength", "Abs"] },
            );
            return;
          }
          setPendingProfile((p) => ({ ...p, goal }));
          setOnboardingStep("experience");
          await aresRespond("Your experience level?", {
            quickReplies: ["Beginner", "Intermediate", "Advanced"],
          });
          return;
        }

        if (step === "experience") {
          const lower = text.toLowerCase();
          const lvl = lower.includes("adv")
            ? "advanced"
            : lower.includes("int")
              ? "intermediate"
              : lower.includes("beg")
                ? "beginner"
                : null;
          if (!lvl) {
            await aresRespond(
              "Please choose: Beginner, Intermediate, or Advanced.",
              { quickReplies: ["Beginner", "Intermediate", "Advanced"] },
            );
            return;
          }
          setPendingProfile((p) => ({ ...p, experienceLevel: lvl }));
          setOnboardingStep("diet");
          await aresRespond("Diet type?", {
            quickReplies: ["Veg", "Non-Veg"],
          });
          return;
        }

        if (step === "diet") {
          const lower = text.toLowerCase();
          const diet = lower.includes("non") ? "non_veg" : "veg";
          const finalProfile: AresFitnessProfile = {
            weightKg: pendingProfile.weightKg,
            heightCm: pendingProfile.heightCm,
            goal: pendingProfile.goal,
            experienceLevel: pendingProfile.experienceLevel,
            dietType: diet,
            onboardingComplete: true,
            personalityMode: currentMode,
            currentWeekCompletedDays: [],
            missedDaysCount: BigInt(0),
            lastWorkoutDate: undefined,
          };
          setOnboardingStep("done");
          await saveProfile(finalProfile);

          // generate first workout
          const dayIdx = 0;
          setCurrentDayIndex(dayIdx);
          const workout = WORKOUT_DAYS[dayIdx];
          const setsReps = getSetsReps(finalProfile.experienceLevel);
          await aresRespond(pText.onboardingComplete);
          if (workout.exercises.length > 0) {
            const workoutText = `${pText.workoutPrefix(workout.focus, workout.exercises.length)}\n\n${workout.exercises.map((e, i) => `${i + 1}. ${e}`).join("\n")}\n\n${setsReps} | Rest 60–90s between sets`;
            await aresRespond(workoutText, { workoutActions: true });
          }
          return;
        }
      }

      // ── post-onboarding intents ────────────────────────────────────────────
      const lower = text.toLowerCase();

      // Modify mode
      if (isModifyMode) {
        setIsModifyMode(false);
        const dayIdx = currentDayIndex;
        const workout = WORKOUT_DAYS[dayIdx % 7];
        const setsReps = getSetsReps(currentProfile?.experienceLevel);
        const workoutText = `Modified plan: ${workout.focus} — ${workout.exercises.length} exercises.\n\n${workout.exercises.map((e, i) => `${i + 1}. ${e}`).join("\n")}\n\n${setsReps} | Rest 60–90s\n\nNote: Customisation noted. Adapting future plans.`;
        await aresRespond(workoutText, { workoutActions: true });
        return;
      }

      // Exercise how-to
      const exerciseKey = parseExerciseIntent(lower);
      if (exerciseKey) {
        const ex = EXERCISE_MAP[exerciseKey];
        if (ex) {
          await aresRespond(`Here's how to do ${ex.name}:`, {
            exerciseData: ex,
          });
          return;
        }
      }

      // Diet / food query
      if (
        lower.includes("eat") ||
        lower.includes("food") ||
        lower.includes("diet") ||
        lower.includes("calories") ||
        lower.includes("protein") ||
        lower.includes("nutrition")
      ) {
        const dietMsg =
          currentMode === "strict"
            ? "Fuel your gains properly. High protein is non-negotiable — chicken, eggs, paneer, tuna. Eat within your calorie target. No junk."
            : currentMode === "friendly"
              ? "Great question! Focus on hitting your protein targets first — aim for ~1.6–2g per kg of body weight. Fill the rest with complex carbs and healthy fats 😊"
              : "NUTRITION IS YOUR SUPERPOWER! Hit your protein, fuel those gains with complex carbs, and watch your body TRANSFORM! 🔥";
        await aresRespond(dietMsg);
        return;
      }

      // Progress / weight update
      if (
        lower.includes("weight") ||
        lower.includes("progress") ||
        lower.includes("kg") ||
        lower.includes("lost") ||
        lower.includes("gained")
      ) {
        const val = Number.parseFloat(text.replace(/[^0-9.]/g, ""));
        if (!Number.isNaN(val) && val > 20) {
          if (currentProfile) {
            const updated = { ...currentProfile, weightKg: val };
            await saveProfile(updated);
            await aresRespond(pText.progressUpdate(val));
          }
          return;
        }
        await aresRespond(
          currentMode === "strict"
            ? "Update your weight so I can track your progress. How many kg do you weigh now?"
            : currentMode === "friendly"
              ? "To track your progress, I'll need your current weight. What's your current weight in kg?"
              : "Let's track that PROGRESS! Tell me your current weight in kg!",
        );
        return;
      }

      // Workout query
      if (
        lower.includes("workout") ||
        lower.includes("exercise") ||
        lower.includes("train") ||
        lower.includes("today") ||
        lower.includes("session")
      ) {
        const dayIdx = currentDayIndex;
        const workout = WORKOUT_DAYS[dayIdx % 7];
        const setsReps = getSetsReps(currentProfile?.experienceLevel);
        if (workout.exercises.length > 0) {
          const workoutText = `${pText.workoutPrefix(workout.focus, workout.exercises.length)}\n\n${workout.exercises.map((e, i) => `${i + 1}. ${e}`).join("\n")}\n\n${setsReps} | Rest 60–90s between sets`;
          await aresRespond(workoutText, { workoutActions: true });
        } else {
          await aresRespond(
            "Rest is part of training. Eat well. Sleep well. Come back stronger.",
          );
        }
        return;
      }

      // Mode switch
      if (lower.includes("strict mode") || lower === "strict") {
        const updated = { ...currentProfile!, personalityMode: "strict" };
        await saveProfile(updated);
        await aresRespond("Strict mode activated. No more softness.");
        return;
      }
      if (lower.includes("friendly mode") || lower === "friendly") {
        const updated = { ...currentProfile!, personalityMode: "friendly" };
        await saveProfile(updated);
        await aresRespond("Friendly mode on! I'm here for you 😊");
        return;
      }
      if (lower.includes("motivational mode") || lower === "motivational") {
        const updated = {
          ...currentProfile!,
          personalityMode: "motivational",
        };
        await saveProfile(updated);
        await aresRespond(
          "MOTIVATIONAL MODE ACTIVATED! Let's BUILD SOMETHING GREAT! 🔥",
        );
        return;
      }

      // Fallback
      await aresRespond(pText.fallback);
    },
    [
      profile,
      onboardingStep,
      pendingProfile,
      isModifyMode,
      currentDayIndex,
      addMessage,
      persistToBackend,
      aresRespond,
      saveProfile,
      scrollToBottom,
    ],
  );

  // ── workout action handlers ───────────────────────────────────────────────────
  const handleStartWorkout = useCallback(async () => {
    const today = todayStr();
    if (actor) {
      try {
        await actor.logWorkoutCompleted(today);
      } catch {
        /* noop */
      }
    }
    if (profile) {
      const updated = {
        ...profile,
        lastWorkoutDate: today,
        currentWeekCompletedDays: [...profile.currentWeekCompletedDays, today],
        missedDaysCount: BigInt(0),
      };
      await saveProfile(updated);
    }
    const msg = PERSONALITY[mode].startResponse;
    await aresRespond(msg);
  }, [actor, profile, mode, saveProfile, aresRespond]);

  const handleSkipWorkout = useCallback(async () => {
    if (actor) {
      try {
        await actor.logWorkoutSkipped();
      } catch {
        /* noop */
      }
    }
    if (profile) {
      const updated = {
        ...profile,
        missedDaysCount: (profile.missedDaysCount ?? BigInt(0)) + BigInt(1),
      };
      await saveProfile(updated);
    }
    await aresRespond(PERSONALITY[mode].skipResponse);
  }, [actor, profile, mode, saveProfile, aresRespond]);

  const handleModifyWorkout = useCallback(async () => {
    setIsModifyMode(true);
    await aresRespond(PERSONALITY[mode].modifyPrompt);
  }, [mode, aresRespond]);

  // ── mode switch ──────────────────────────────────────────────────────────────
  const switchMode = useCallback(
    async (newMode: PersonalityMode) => {
      if (!profile) return;
      const updated = { ...profile, personalityMode: newMode };
      await saveProfile(updated);
      const confirmMsgs: Record<PersonalityMode, string> = {
        strict: "Strict mode activated. Comfort won't build your body.",
        friendly: "Switched to friendly mode! I'm here to support you 😊",
        motivational: "MOTIVATIONAL MODE ON! Let's GO WARRIOR! 🔥",
      };
      await aresRespond(confirmMsgs[newMode]);
    },
    [profile, saveProfile, aresRespond],
  );

  // ── clear history ────────────────────────────────────────────────────────────
  const clearHistory = useCallback(async () => {
    setMessages([]);
    lsSaveMessages([]);
    if (actor) {
      try {
        await actor.clearAresChatHistory();
      } catch {
        /* noop */
      }
    }
  }, [actor]);

  return {
    messages,
    profile,
    isTyping,
    mode,
    isLoaded,
    messagesEndRef,
    sendMessage,
    switchMode,
    clearHistory,
    handleStartWorkout,
    handleSkipWorkout,
    handleModifyWorkout,
    currentDayIndex,
  };
}
