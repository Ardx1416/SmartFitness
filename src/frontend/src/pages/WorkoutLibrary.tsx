import { Filter, Search } from "lucide-react";
import { useState } from "react";
import ExerciseCard from "../components/ExerciseCard";
import { exercises } from "../lib/exerciseData";
import type { Exercise } from "../lib/exerciseData";

const categories = [
  { value: "all", label: "All Exercises" },
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "legs", label: "Legs" },
  { value: "shoulders", label: "Shoulders" },
  { value: "arms", label: "Arms" },
  { value: "core", label: "Core" },
  { value: "cardio", label: "Cardio" },
  { value: "Movement Patterns", label: "Movement Patterns" },
  { value: "Mobility & Flexibility", label: "Mobility & Flexibility" },
  { value: "Balance & Stability", label: "Balance & Stability" },
  { value: "Corrective & Rehab", label: "Corrective & Rehab" },
];

interface WorkoutLibraryProps {
  onSelectExercise?: (exercise: Exercise) => void;
  selectedExercises?: string[];
}

export default function WorkoutLibrary({
  onSelectExercise,
  selectedExercises = [],
}: WorkoutLibraryProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = exercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.muscleGroups.some((m) =>
        m.toLowerCase().includes(search.toLowerCase()),
      );
    const matchesCategory =
      activeCategory === "all" ||
      ex.category?.toLowerCase() === activeCategory.toLowerCase() ||
      ex.muscleGroups.some((m) =>
        m.toLowerCase().includes(activeCategory.toLowerCase()),
      );
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-surface-950 py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-1 sm:mb-2">
            Exercise Library
          </h1>
          <p className="text-surface-400 text-sm sm:text-base">
            Browse {exercises.length}+ exercises across all muscle groups
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4 sm:mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-surface-400" />
          <input
            type="text"
            placeholder="Search exercises or muscle groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 sm:pl-11 pr-4 py-3 min-h-[44px] bg-surface-800 border border-surface-600/50 rounded-xl text-white placeholder-surface-400 text-base focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/30 transition-all"
          />
        </div>

        {/* Category Tabs - horizontally scrollable on mobile */}
        <div className="mb-6 sm:mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex-shrink-0 px-4 py-2 min-h-[44px] rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat.value
                    ? "bg-electric-500 text-white shadow-glow"
                    : "bg-surface-800 text-surface-300 hover:text-white hover:bg-surface-700 border border-surface-600/50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Filter className="w-4 h-4 text-surface-400" />
          <span className="text-surface-400 text-sm">
            {filtered.length} exercise{filtered.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {/* Exercise Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-surface-500" />
            </div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-2">
              No exercises found
            </h3>
            <p className="text-surface-400 text-sm sm:text-base">
              Try adjusting your search or category filter
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onSelect={onSelectExercise}
                isSelected={selectedExercises.includes(exercise.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
