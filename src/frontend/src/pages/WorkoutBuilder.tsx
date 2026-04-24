import {
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import ExerciseSelector from "../components/ExerciseSelector";
import type { Exercise } from "../lib/exerciseData";

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

export default function WorkoutBuilder() {
  const [workoutName, setWorkoutName] = useState("");
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
    [],
  );
  const [showSelector, setShowSelector] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const handleAddExercise = (exercise: Exercise) => {
    if (workoutExercises.find((we) => we.exercise.id === exercise.id)) return;
    setWorkoutExercises((prev) => [
      ...prev,
      { exercise, sets: 3, reps: 10, restSeconds: 60 },
    ]);
    setShowSelector(false);
  };

  const handleRemoveExercise = (id: string) => {
    setWorkoutExercises((prev) => prev.filter((we) => we.exercise.id !== id));
  };

  const handleUpdateExercise = (
    id: string,
    field: "sets" | "reps" | "restSeconds",
    value: number,
  ) => {
    setWorkoutExercises((prev) =>
      prev.map((we) =>
        we.exercise.id === id ? { ...we, [field]: Math.max(1, value) } : we,
      ),
    );
  };

  const handleSave = () => {
    if (!workoutName.trim()) {
      setSavedMessage("Please enter a workout name");
      setTimeout(() => setSavedMessage(""), 3000);
      return;
    }
    if (workoutExercises.length === 0) {
      setSavedMessage("Please add at least one exercise");
      setTimeout(() => setSavedMessage(""), 3000);
      return;
    }

    const plan: WorkoutPlan = {
      id: Date.now().toString(),
      name: workoutName.trim(),
      exercises: workoutExercises,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("workoutPlans") || "[]");
    localStorage.setItem("workoutPlans", JSON.stringify([...existing, plan]));
    setSavedMessage("Workout saved successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
    setWorkoutName("");
    setWorkoutExercises([]);
  };

  const StepperField = ({
    label,
    value,
    onChange,
    min = 1,
    step = 1,
    unit,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    step?: number;
    unit?: string;
  }) => (
    <div className="flex flex-col gap-1">
      <span className="text-surface-400 text-xs font-medium uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-9 h-9 min-w-[36px] min-h-[36px] sm:w-11 sm:h-11 sm:min-w-[44px] sm:min-h-[44px] rounded-lg bg-surface-700 hover:bg-surface-600 flex items-center justify-center text-white transition-all"
          aria-label={`Decrease ${label}`}
        >
          <ChevronDown className="w-4 h-4" />
        </button>
        <div className="text-center min-w-[40px] sm:min-w-[48px]">
          <span className="font-bold text-base sm:text-lg text-white">
            {value}
          </span>
          {unit && (
            <span className="text-surface-400 text-xs ml-0.5">{unit}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onChange(value + step)}
          className="w-9 h-9 min-w-[36px] min-h-[36px] sm:w-11 sm:h-11 sm:min-w-[44px] sm:min-h-[44px] rounded-lg bg-surface-700 hover:bg-surface-600 flex items-center justify-center text-white transition-all"
          aria-label={`Increase ${label}`}
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-950 py-6 sm:py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-1 sm:mb-2">
            Workout Builder
          </h1>
          <p className="text-surface-400 text-sm sm:text-base">
            Create a custom workout plan with your favorite exercises
          </p>
        </div>

        {/* Workout Name */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <label
            htmlFor="workout-name"
            className="block text-surface-300 text-sm font-medium mb-2"
          >
            Workout Name
          </label>
          <input
            id="workout-name"
            type="text"
            placeholder="e.g. Monday Push Day"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="w-full px-4 py-3 min-h-[48px] bg-surface-800 border border-surface-600/50 rounded-xl text-white placeholder-surface-500 text-base focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/30 transition-all"
          />
        </div>

        {/* Exercise List */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          {workoutExercises.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 sm:p-12 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-7 h-7 sm:w-8 sm:h-8 text-surface-500" />
              </div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white mb-2">
                No exercises yet
              </h3>
              <p className="text-surface-400 text-sm mb-4 sm:mb-6">
                Add exercises to build your workout plan
              </p>
              <button
                type="button"
                onClick={() => setShowSelector(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-semibold text-sm transition-all shadow-glow"
              >
                <Plus className="w-4 h-4" />
                Add First Exercise
              </button>
            </div>
          ) : (
            workoutExercises.map((we, index) => (
              <div
                key={we.exercise.id}
                className="glass-card rounded-2xl p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-electric-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-electric-400 font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-sm sm:text-base text-white truncate">
                        {we.exercise.name}
                      </h3>
                      <p className="text-surface-400 text-xs truncate">
                        {we.exercise.muscleGroups.join(", ")}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(we.exercise.id)}
                    className="w-9 h-9 min-w-[36px] min-h-[36px] sm:w-11 sm:h-11 sm:min-w-[44px] sm:min-h-[44px] rounded-xl bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-all flex-shrink-0"
                    aria-label="Remove exercise"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Stepper Controls */}
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <StepperField
                    label="Sets"
                    value={we.sets}
                    onChange={(v) =>
                      handleUpdateExercise(we.exercise.id, "sets", v)
                    }
                  />
                  <StepperField
                    label="Reps"
                    value={we.reps}
                    onChange={(v) =>
                      handleUpdateExercise(we.exercise.id, "reps", v)
                    }
                  />
                  <StepperField
                    label="Rest"
                    value={we.restSeconds}
                    onChange={(v) =>
                      handleUpdateExercise(we.exercise.id, "restSeconds", v)
                    }
                    step={15}
                    unit="s"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        {workoutExercises.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
            <button
              type="button"
              onClick={() => setShowSelector(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-600/50 text-white font-semibold text-sm sm:text-base transition-all w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Exercise
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-semibold text-sm sm:text-base transition-all shadow-glow w-full sm:flex-1"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              Save Workout
            </button>
          </div>
        )}

        {workoutExercises.length === 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-semibold text-sm sm:text-base transition-all shadow-glow w-full"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              Save Workout
            </button>
          </div>
        )}

        {/* Status Message */}
        {savedMessage && (
          <div
            className={`mt-4 p-3 sm:p-4 rounded-xl text-sm font-medium text-center ${
              savedMessage.includes("success")
                ? "bg-neon-500/20 text-neon-400 border border-neon-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {savedMessage}
          </div>
        )}
      </div>

      {/* Exercise Selector Modal */}
      {showSelector && (
        <ExerciseSelector
          onSelect={handleAddExercise}
          onClose={() => setShowSelector(false)}
          selectedIds={workoutExercises.map((we) => we.exercise.id)}
        />
      )}
    </div>
  );
}
