import { CheckCircle, Minus, Plus } from "lucide-react";
import { useState } from "react";

interface SetLoggerProps {
  exerciseName: string;
  setNumber: number;
  targetReps: number;
  onLogSet: (weight: number, reps: number) => void;
}

export default function SetLogger({
  exerciseName,
  setNumber,
  targetReps,
  onLogSet,
}: SetLoggerProps) {
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(targetReps);

  const handleLog = () => {
    onLogSet(weight, reps);
  };

  const StepperControl = ({
    label,
    value,
    onDecrement,
    onIncrement,
    unit,
  }: {
    label: string;
    value: number;
    onDecrement: () => void;
    onIncrement: () => void;
    unit: string;
  }) => (
    <div className="flex flex-col items-center gap-2">
      <span className="text-surface-400 text-xs sm:text-sm font-medium uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onDecrement}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-surface-700 hover:bg-surface-600 flex items-center justify-center text-white transition-all active:scale-95"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="text-center min-w-[60px] sm:min-w-[72px]">
          <span className="font-display font-black text-2xl sm:text-3xl text-white">
            {value}
          </span>
          <span className="text-surface-400 text-xs sm:text-sm ml-1">
            {unit}
          </span>
        </div>
        <button
          type="button"
          onClick={onIncrement}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-surface-700 hover:bg-surface-600 flex items-center justify-center text-white transition-all active:scale-95"
          aria-label={`Increase ${label}`}
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h3 className="font-display font-bold text-base sm:text-lg text-white">
          {exerciseName}
        </h3>
        <p className="text-surface-400 text-sm mt-0.5">
          Set {setNumber} · Target: {targetReps} reps
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-4 sm:gap-6 mb-5 sm:mb-6">
        <StepperControl
          label="Weight"
          value={weight}
          onDecrement={() => setWeight(Math.max(0, weight - 2.5))}
          onIncrement={() => setWeight(weight + 2.5)}
          unit="kg"
        />
        <div className="hidden sm:block w-px h-16 bg-surface-700/50" />
        <StepperControl
          label="Reps"
          value={reps}
          onDecrement={() => setReps(Math.max(1, reps - 1))}
          onIncrement={() => setReps(reps + 1)}
          unit="reps"
        />
      </div>

      <button
        type="button"
        onClick={handleLog}
        className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 min-h-[48px] rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-semibold text-sm sm:text-base transition-all shadow-glow active:scale-[0.98]"
      >
        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        Log Set
      </button>
    </div>
  );
}
