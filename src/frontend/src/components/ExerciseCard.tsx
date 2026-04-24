import { CheckCircle, Play } from "lucide-react";
import { useState } from "react";
import type { Exercise } from "../lib/exerciseData";
import VideoPlayerModal from "./VideoPlayerModal";

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect?: (exercise: Exercise) => void;
  isSelected?: boolean;
}

const difficultyConfig = {
  beginner: {
    label: "Beginner",
    class: "bg-neon-500/20 text-neon-400 border-neon-500/30",
  },
  intermediate: {
    label: "Intermediate",
    class: "bg-electric-500/20 text-electric-400 border-electric-500/30",
  },
  advanced: {
    label: "Advanced",
    class: "bg-red-500/20 text-red-400 border-red-500/30",
  },
};

export default function ExerciseCard({
  exercise,
  onSelect,
  isSelected,
}: ExerciseCardProps) {
  const [videoOpen, setVideoOpen] = useState(false);
  const diff =
    difficultyConfig[exercise.difficulty] || difficultyConfig.beginner;

  return (
    <>
      <div
        className={`glass-card rounded-2xl overflow-hidden transition-all group hover:border-electric-500/30 ${
          isSelected ? "border-electric-500/60 shadow-glow" : ""
        }`}
      >
        {/* Image / Video Area */}
        <div className="relative aspect-video bg-surface-800 overflow-hidden">
          {exercise.imageUrl ? (
            <img
              src={exercise.imageUrl}
              alt={exercise.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-surface-600 text-4xl">💪</span>
            </div>
          )}

          {/* Difficulty Badge */}
          <div
            className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-semibold border ${diff.class}`}
          >
            {diff.label}
          </div>

          {/* Play Button Overlay */}
          {exercise.videoUrl && (
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="absolute inset-0 flex items-center justify-center bg-surface-950/40 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Play ${exercise.name} demo video`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 min-w-[44px] min-h-[44px] rounded-full bg-electric-500/90 flex items-center justify-center shadow-glow hover:bg-electric-400 transition-colors">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5" />
              </div>
            </button>
          )}
        </div>

        {/* Card Content */}
        <div className="p-3 sm:p-4">
          <h3 className="font-display font-bold text-sm sm:text-base text-white mb-1 sm:mb-2 line-clamp-1">
            {exercise.name}
          </h3>
          <p className="text-surface-400 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2">
            {exercise.description}
          </p>

          {/* Muscle Groups */}
          <div className="flex flex-wrap gap-1 mb-3">
            {exercise.muscleGroups.slice(0, 3).map((muscle) => (
              <span
                key={muscle}
                className="px-2 py-0.5 rounded-md bg-surface-700/60 text-surface-300 text-xs font-medium"
              >
                {muscle}
              </span>
            ))}
          </div>

          {/* Equipment */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-surface-500 text-xs">🏋️</span>
            <span className="text-surface-400 text-xs truncate">
              {Array.isArray(exercise.equipment)
                ? exercise.equipment.join(", ")
                : exercise.equipment}
            </span>
          </div>

          {/* Select Button */}
          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect(exercise)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold transition-all ${
                isSelected
                  ? "bg-electric-500/20 text-electric-400 border border-electric-500/40"
                  : "bg-electric-500 hover:bg-electric-400 text-white shadow-glow"
              }`}
            >
              {isSelected ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Selected
                </>
              ) : (
                "Add to Workout"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {exercise.videoUrl && (
        <VideoPlayerModal
          isOpen={videoOpen}
          onClose={() => setVideoOpen(false)}
          videoUrl={exercise.videoUrl}
          title={exercise.name}
        />
      )}
    </>
  );
}
