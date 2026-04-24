import { Search, X } from "lucide-react";
import { useState } from "react";
import { exercises } from "../lib/exerciseData";
import type { Exercise } from "../lib/exerciseData";
import ExerciseCard from "./ExerciseCard";

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
  selectedIds?: string[];
}

const categories = [
  { value: "all", label: "All" },
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "legs", label: "Legs" },
  { value: "shoulders", label: "Shoulders" },
  { value: "arms", label: "Arms" },
  { value: "core", label: "Core" },
  { value: "cardio", label: "Cardio" },
  { value: "Movement Patterns", label: "Movement Patterns" },
  { value: "Mobility & Flexibility", label: "Mobility & Flex" },
  { value: "Balance & Stability", label: "Balance & Stability" },
  { value: "Corrective & Rehab", label: "Corrective & Rehab" },
];

export default function ExerciseSelector({
  onSelect,
  onClose,
  selectedIds = [],
}: ExerciseSelectorProps) {
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-950/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close exercise selector"
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-4xl sm:mx-4 bg-surface-900 border border-surface-700/50 rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-surface-700/50 flex-shrink-0">
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-white">
              Add Exercise
            </h2>
            <p className="text-surface-400 text-xs sm:text-sm mt-0.5">
              Select an exercise to add to your workout
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-surface-800 hover:bg-surface-700 flex items-center justify-center text-surface-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 sm:p-6 border-b border-surface-700/50 flex-shrink-0 space-y-3 sm:space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 min-h-[44px] bg-surface-800 border border-surface-600/50 rounded-xl text-white placeholder-surface-400 text-sm focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/30 transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex-shrink-0 px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
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

        {/* Exercise Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-10 h-10 text-surface-500 mx-auto mb-3" />
              <p className="text-surface-400 text-sm">No exercises found</p>
              <p className="text-surface-500 text-xs mt-1">
                Try a different search or category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filtered.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onSelect={onSelect}
                  isSelected={selectedIds.includes(exercise.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-surface-700/50 flex-shrink-0">
          <p className="text-surface-400 text-xs text-center">
            {filtered.length} exercise{filtered.length !== 1 ? "s" : ""}{" "}
            available
          </p>
        </div>
      </div>
    </div>
  );
}
