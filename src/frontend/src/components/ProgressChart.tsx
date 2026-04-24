import { format, subDays } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

interface ProgressChartProps {
  history: WorkoutRecord[];
}

export default function ProgressChart({ history }: ProgressChartProps) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const count = history.filter((w) => w.date.startsWith(dateStr)).length;
    return {
      day: format(date, "EEE"),
      workouts: count,
    };
  });

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={last7Days}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="oklch(0.35 0.02 250)"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fill: "oklch(0.65 0.04 250)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "oklch(0.65 0.04 250)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(0.18 0.02 250)",
              border: "1px solid oklch(0.35 0.02 250)",
              borderRadius: "12px",
              color: "oklch(0.95 0.01 250)",
              fontSize: "12px",
            }}
            cursor={{ fill: "oklch(0.25 0.02 250)" }}
          />
          <Bar
            dataKey="workouts"
            fill="oklch(0.65 0.22 250)"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
