import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Timer,
  Trophy,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import SetLogger from "../components/SetLogger";

interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  imageUrl?: string;
  videoUrl?: string;
  category?: string;
}

interface WorkoutExercise {
  exercise: Exercise;
  sets: number;
  reps: number;
  restSeconds: number;
}

interface WorkoutPlan {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  createdAt: string;
}

interface LoggedSet {
  weight: number;
  reps: number;
  completed: boolean;
}

export default function WorkoutSession() {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [loggedSets, setLoggedSets] = useState<Record<string, LoggedSet[]>>({});
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [isResting, setIsResting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const plans = JSON.parse(localStorage.getItem("workoutPlans") || "[]");
    if (plans.length > 0) {
      setCurrentPlan(plans[plans.length - 1]);
    }
  }, []);

  useEffect(() => {
    if (!isResting || restTimer === null) return;
    if (restTimer <= 0) {
      setIsResting(false);
      setRestTimer(null);
      return;
    }
    const timer = setTimeout(
      () => setRestTimer((t) => (t !== null ? t - 1 : null)),
      1000,
    );
    return () => clearTimeout(timer);
  }, [isResting, restTimer]);

  const currentExercise = currentPlan?.exercises[currentExerciseIndex];

  const handleLogSet = useCallback(
    (weight: number, reps: number) => {
      if (!currentExercise) return;
      const key = currentExercise.exercise.id;
      const newSet: LoggedSet = { weight, reps, completed: true };

      setLoggedSets((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), newSet],
      }));

      const totalSets = currentExercise.sets;
      const nextSet = currentSetIndex + 1;

      if (nextSet >= totalSets) {
        // Move to next exercise
        const nextExercise = currentExerciseIndex + 1;
        if (nextExercise >= (currentPlan?.exercises.length || 0)) {
          // Workout complete
          finishWorkout();
        } else {
          setCurrentExerciseIndex(nextExercise);
          setCurrentSetIndex(0);
          setIsResting(true);
          setRestTimer(currentExercise.restSeconds);
        }
      } else {
        setCurrentSetIndex(nextSet);
        setIsResting(true);
        setRestTimer(currentExercise.restSeconds);
      }
    },
    [currentExercise, currentSetIndex, currentExerciseIndex, currentPlan],
  );

  const finishWorkout = useCallback(() => {
    const duration = Math.round((Date.now() - startTime) / 60000);
    const record = {
      id: Date.now().toString(),
      name: currentPlan?.name || "Workout",
      date: new Date().toISOString(),
      duration,
      exercises: Object.entries(loggedSets).map(([exerciseId, sets]) => ({
        exerciseId,
        sets,
      })),
    };
    const history = JSON.parse(localStorage.getItem("workoutHistory") || "[]");
    localStorage.setItem(
      "workoutHistory",
      JSON.stringify([record, ...history]),
    );
    setIsComplete(true);
  }, [currentPlan, loggedSets, startTime]);

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(null);
  };

  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-surface-500" />
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-2">
            No Workout Found
          </h2>
          <p className="text-surface-400 text-sm sm:text-base mb-6">
            Create a workout plan in the Builder first.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/builder" })}
            className="px-6 py-3 min-h-[48px] rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-semibold text-sm sm:text-base transition-all shadow-glow w-full sm:w-auto"
          >
            Go to Builder
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-electric-500/20 flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-electric-400" />
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">
            Workout Complete!
          </h2>
          <p className="text-surface-400 text-sm sm:text-base mb-2">
            You crushed{" "}
            <span className="text-electric-400 font-semibold">
              {currentPlan.name}
            </span>
          </p>
          <p className="text-surface-500 text-sm mb-8">
            {currentPlan.exercises.length} exercises ·{" "}
            {Math.round((Date.now() - startTime) / 60000)} min
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: "/history" })}
              className="flex-1 py-3 min-h-[48px] rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-semibold text-sm sm:text-base transition-all shadow-glow"
            >
              View History
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="flex-1 py-3 min-h-[48px] rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-600/50 text-white font-semibold text-sm sm:text-base transition-all"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 py-4 sm:py-6 lg:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="font-display font-bold text-lg sm:text-xl lg:text-2xl text-white truncate max-w-[200px] sm:max-w-none">
              {currentPlan.name}
            </h1>
            <p className="text-surface-400 text-xs sm:text-sm">
              Exercise {currentExerciseIndex + 1} of{" "}
              {currentPlan.exercises.length}
            </p>
          </div>
          <button
            type="button"
            onClick={finishWorkout}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 min-h-[44px] rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-600/50 text-surface-300 hover:text-white text-xs sm:text-sm font-medium transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Finish</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-surface-800 rounded-full mb-4 sm:mb-6 overflow-hidden">
          <div
            className="h-full bg-electric-500 rounded-full transition-all duration-500"
            style={{
              width: `${(currentExerciseIndex / currentPlan.exercises.length) * 100}%`,
            }}
          />
        </div>

        {/* Rest Timer */}
        {isResting && restTimer !== null && (
          <div className="glass-card rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer className="w-5 h-5 text-electric-400" />
              <span className="text-surface-300 font-medium text-sm sm:text-base">
                Rest Time
              </span>
            </div>
            <div className="font-display font-black text-5xl sm:text-6xl text-electric-400 mb-4">
              {restTimer}s
            </div>
            <button
              type="button"
              onClick={skipRest}
              className="px-5 py-2.5 min-h-[44px] rounded-xl bg-surface-700 hover:bg-surface-600 text-white text-sm font-medium transition-all"
            >
              Skip Rest
            </button>
          </div>
        )}

        {/* Main Content - stacked on mobile, side by side on desktop */}
        {!isResting && currentExercise && (
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Exercise Info Panel */}
            <div className="w-full lg:w-2/5 glass-card rounded-2xl overflow-hidden">
              {currentExercise.exercise.imageUrl ? (
                <div className="aspect-video sm:aspect-[4/3] lg:aspect-square overflow-hidden">
                  <img
                    src={currentExercise.exercise.imageUrl}
                    alt={currentExercise.exercise.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video sm:aspect-[4/3] lg:aspect-square bg-surface-800 flex items-center justify-center">
                  <Dumbbell className="w-12 h-12 sm:w-16 sm:h-16 text-surface-600" />
                </div>
              )}
              <div className="p-4 sm:p-5">
                <h2 className="font-display font-bold text-lg sm:text-xl text-white mb-1">
                  {currentExercise.exercise.name}
                </h2>
                <p className="text-surface-400 text-xs sm:text-sm leading-relaxed mb-3">
                  {currentExercise.exercise.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {currentExercise.exercise.muscleGroups.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded-md bg-surface-700/60 text-surface-300 text-xs"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Set Logger Panel */}
            <div className="w-full lg:flex-1 space-y-4">
              {/* Set Progress */}
              <div className="glass-card rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-surface-300 text-sm font-medium">
                    Sets Progress
                  </span>
                  <span className="text-electric-400 font-bold text-sm">
                    {currentSetIndex + 1} / {currentExercise.sets}
                  </span>
                </div>
                <div className="flex gap-2">
                  {Array.from(
                    { length: currentExercise.sets },
                    (_, i) => i + 1,
                  ).map((setNum) => (
                    <div
                      key={`set-${setNum}`}
                      className={`flex-1 h-2 rounded-full transition-all ${
                        setNum - 1 < currentSetIndex
                          ? "bg-electric-500"
                          : setNum - 1 === currentSetIndex
                            ? "bg-electric-500/50"
                            : "bg-surface-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <SetLogger
                exerciseName={currentExercise.exercise.name}
                setNumber={currentSetIndex + 1}
                targetReps={currentExercise.reps}
                onLogSet={handleLogSet}
              />

              {/* Navigation */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (currentSetIndex > 0) setCurrentSetIndex((s) => s - 1);
                    else if (currentExerciseIndex > 0) {
                      setCurrentExerciseIndex((e) => e - 1);
                      setCurrentSetIndex(0);
                    }
                  }}
                  disabled={currentExerciseIndex === 0 && currentSetIndex === 0}
                  className="flex items-center justify-center gap-1.5 flex-1 py-3 min-h-[48px] rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-600/50 text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const totalSets = currentExercise.sets;
                    if (currentSetIndex + 1 < totalSets) {
                      setCurrentSetIndex((s) => s + 1);
                    } else if (
                      currentExerciseIndex + 1 <
                      currentPlan.exercises.length
                    ) {
                      setCurrentExerciseIndex((e) => e + 1);
                      setCurrentSetIndex(0);
                    }
                  }}
                  className="flex items-center justify-center gap-1.5 flex-1 py-3 min-h-[48px] rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-600/50 text-white text-sm font-medium transition-all"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
