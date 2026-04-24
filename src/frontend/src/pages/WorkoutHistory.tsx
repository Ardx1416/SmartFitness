import { format } from "date-fns";
import { BarChart2, Calendar, Clock, Dumbbell, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import ProgressChart from "../components/ProgressChart";

interface WorkoutRecord {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: Array<{
    exerciseId: string;
    sets: Array<{ weight: number; reps: number; completed: boolean }>;
  }>;
}

export default function WorkoutHistory() {
  const [history, setHistory] = useState<WorkoutRecord[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("workoutHistory") || "[]");
    setHistory(stored);
  }, []);

  const totalWorkouts = history.length;
  const thisWeek = history.filter((w) => {
    const date = new Date(w.date);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;
  const totalTime = history.reduce((acc, w) => acc + (w.duration || 0), 0);
  const totalSets = history.reduce(
    (acc, w) => acc + w.exercises.reduce((a, e) => a + e.sets.length, 0),
    0,
  );

  const stats = [
    {
      label: "Total Workouts",
      value: totalWorkouts,
      icon: Dumbbell,
      color: "text-electric-400",
    },
    {
      label: "This Week",
      value: thisWeek,
      icon: Calendar,
      color: "text-neon-400",
    },
    {
      label: "Total Time",
      value: `${totalTime}m`,
      icon: Clock,
      color: "text-electric-300",
    },
    {
      label: "Total Sets",
      value: totalSets,
      icon: TrendingUp,
      color: "text-electric-400",
    },
  ];

  return (
    <div className="min-h-screen bg-surface-950 py-6 sm:py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-1 sm:mb-2">
            Progress History
          </h1>
          <p className="text-surface-400 text-sm sm:text-base">
            Track your fitness journey and celebrate your achievements
          </p>
        </div>

        {/* Stats Grid - 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="glass-card rounded-2xl p-3 sm:p-4 lg:p-5"
            >
              <div className={`${color} mb-2 sm:mb-3`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-white mb-0.5 sm:mb-1">
                {value}
              </div>
              <div className="text-surface-400 text-xs sm:text-sm font-medium leading-tight">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        {history.length > 0 && (
          <div className="glass-card rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <BarChart2 className="w-5 h-5 text-electric-400" />
              <h2 className="font-display font-bold text-base sm:text-lg text-white">
                Weekly Frequency
              </h2>
            </div>
            <ProgressChart history={history} />
          </div>
        )}

        {/* History List */}
        <div>
          <h2 className="font-display font-bold text-lg sm:text-xl text-white mb-3 sm:mb-4">
            Workout Log
          </h2>

          {history.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 sm:p-12 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-7 h-7 sm:w-8 sm:h-8 text-surface-500" />
              </div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white mb-2">
                No workouts yet
              </h3>
              <p className="text-surface-400 text-sm">
                Complete your first workout to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="glass-card rounded-2xl p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-sm sm:text-base text-white truncate">
                        {record.name}
                      </h3>
                      <p className="text-surface-400 text-xs sm:text-sm mt-0.5">
                        {format(new Date(record.date), "MMM d, yyyy · h:mm a")}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-electric-400 font-bold text-sm sm:text-base">
                        {record.duration}m
                      </div>
                      <div className="text-surface-500 text-xs">duration</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-700/50 text-surface-300 text-xs">
                      <Dumbbell className="w-3 h-3" />
                      {record.exercises.length} exercises
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-700/50 text-surface-300 text-xs">
                      <TrendingUp className="w-3 h-3" />
                      {record.exercises.reduce((a, e) => a + e.sets.length, 0)}{" "}
                      sets
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
