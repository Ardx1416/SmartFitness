import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  Camera,
  ChevronRight,
  Edit2,
  Flame,
  LogOut,
  Save,
  Settings,
  User,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { clearSessionEmail, getSessionEmail } from "../hooks/useAuth";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FitnessProfile {
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  goal: "strength" | "endurance" | "weight-loss" | "muscle-gain";
  units: "metric" | "imperial";
  name: string;
}

const defaultFitnessProfile: FitnessProfile = {
  fitnessLevel: "beginner",
  goal: "strength",
  units: "metric",
  name: "",
};

const USERS_KEY = "ironforge_users";

interface StoredUser {
  username: string;
  email: string;
  passwordHash: string;
}

interface WorkoutEntry {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: { sets?: number; [key: string]: unknown }[];
}

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function getStoredWorkouts(): WorkoutEntry[] {
  try {
    const raw = localStorage.getItem("workoutHistory");
    return raw ? (JSON.parse(raw) as WorkoutEntry[]) : [];
  } catch {
    return [];
  }
}

function getInitials(name: string, email: string): string {
  const trimmed = name?.trim();
  if (trimmed) {
    const parts = trimmed.split(" ");
    if (parts.length >= 2) {
      return (
        (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
      ).toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "FT";
}

function getGoalLabel(goal: FitnessProfile["goal"]): string {
  const labels: Record<FitnessProfile["goal"], string> = {
    strength: "Build Strength",
    endurance: "Improve Endurance",
    "weight-loss": "Lose Weight",
    "muscle-gain": "Gain Muscle",
  };
  return labels[goal];
}

function getLevelLabel(level: FitnessProfile["fitnessLevel"]): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function formatDuration(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function relativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

function calcStreak(workouts: WorkoutEntry[]): number {
  if (!workouts.length) return 0;
  const days = new Set(workouts.map((w) => new Date(w.date).toDateString()));
  let streak = 0;
  const cursor = new Date();
  // Allow today to count even if no workout yet today (check yesterday first)
  while (true) {
    if (days.has(cursor.toDateString())) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  id: string;
}

function SelectField({
  label,
  value,
  onChange,
  options,
  id,
}: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-surface-300 text-sm font-medium"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 min-h-[48px] bg-surface-800 border border-surface-600/50 rounded-xl text-white text-base focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/30 transition-all appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface-800">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Workout Summary Card ─────────────────────────────────────────────────────

function WorkoutSummaryCard() {
  const workouts = getStoredWorkouts();

  if (workouts.length === 0) {
    return (
      <div
        className="glass-card rounded-2xl p-5 sm:p-6"
        data-ocid="profile.workout_summary.card"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-electric-500/20 flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-electric-400" />
          </div>
          <h2 className="font-display font-bold text-base sm:text-lg text-white">
            Workout Summary
          </h2>
        </div>
        <div
          className="flex flex-col items-center justify-center py-8 gap-4"
          data-ocid="profile.workout_summary.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-surface-800/60 flex items-center justify-center text-3xl">
            🏋️
          </div>
          <div className="text-center">
            <p className="text-white font-semibold mb-1">No workouts yet</p>
            <p className="text-surface-400 text-sm">
              Start training to build your streak
            </p>
          </div>
          <Link
            to="/builder"
            data-ocid="profile.workout_summary.start_button"
            className="px-5 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-semibold text-sm transition-all shadow-glow"
          >
            Start Your First Workout
          </Link>
        </div>
      </div>
    );
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekCount = workouts.filter(
    (w) => new Date(w.date) >= weekAgo,
  ).length;

  const totalMinutes = workouts.reduce((acc, w) => acc + (w.duration ?? 0), 0);

  const totalSets = workouts.reduce(
    (acc, w) =>
      acc +
      (w.exercises ?? []).reduce(
        (s, ex) => s + (typeof ex.sets === "number" ? ex.sets : 0),
        0,
      ),
    0,
  );

  const sortedByDate = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const lastWorkoutDate = sortedByDate[0]?.date ?? "";
  const streak = calcStreak(workouts);

  const stats: {
    label: string;
    value: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      label: "Total Workouts",
      value: String(workouts.length),
      icon: <Activity className="w-4 h-4" />,
      color: "text-electric-400",
    },
    {
      label: "This Week",
      value: String(thisWeekCount),
      icon: <Zap className="w-4 h-4" />,
      color: "text-electric-400",
    },
    {
      label: "Total Time",
      value: formatDuration(totalMinutes),
      icon: <span className="text-xs font-bold">⏱</span>,
      color: "text-electric-400",
    },
    {
      label: "Total Sets",
      value: totalSets > 0 ? String(totalSets) : "—",
      icon: <span className="text-xs font-bold">💪</span>,
      color: "text-electric-400",
    },
    {
      label: "Last Workout",
      value: lastWorkoutDate ? relativeDate(lastWorkoutDate) : "—",
      icon: <span className="text-xs font-bold">📅</span>,
      color: "text-electric-400",
    },
    {
      label: "Current Streak",
      value: streak > 0 ? `${streak}d 🔥` : "0d",
      icon: <Flame className="w-4 h-4" />,
      color: "text-neon-400",
    },
  ];

  return (
    <div
      className="glass-card rounded-2xl p-5 sm:p-6"
      data-ocid="profile.workout_summary.card"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-electric-500/20 flex items-center justify-center flex-shrink-0">
          <Activity className="w-5 h-5 text-electric-400" />
        </div>
        <h2 className="font-display font-bold text-base sm:text-lg text-white">
          Workout Summary
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map(({ label, value, icon, color }) => (
          <div
            key={label}
            className="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-800/50 border border-surface-700/30"
          >
            <div className={`flex items-center gap-1.5 ${color} opacity-70`}>
              {icon}
              <span className="text-xs font-medium text-surface-400">
                {label}
              </span>
            </div>
            <span className={`font-display font-bold text-xl ${color}`}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

export default function Profile() {
  const queryClient = useQueryClient();

  // Derive user from session + localStorage
  const sessionEmail = getSessionEmail();
  const users = getStoredUsers();
  const sessionUser = users.find((u) => u.email === sessionEmail);

  const displayEmail = sessionEmail ?? "";
  const displayUsername =
    sessionUser?.username ?? displayEmail.split("@")[0] ?? "Athlete";

  const [fitnessProfile, setFitnessProfile] = useState<FitnessProfile>(
    defaultFitnessProfile,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState<FitnessProfile>(
    defaultFitnessProfile,
  );
  const [saved, setSaved] = useState(false);

  // Photo upload state
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photoKey = `profile_photo_${displayEmail}`;

  // Load fitness profile + photo from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("fitnessProfile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as FitnessProfile;
        if (!parsed.name && displayUsername) {
          parsed.name = displayUsername;
        }
        setFitnessProfile(parsed);
        setEditProfile(parsed);
      } catch {
        const withName = { ...defaultFitnessProfile, name: displayUsername };
        setFitnessProfile(withName);
        setEditProfile(withName);
      }
    } else {
      const withName = { ...defaultFitnessProfile, name: displayUsername };
      setFitnessProfile(withName);
      setEditProfile(withName);
    }

    // Load stored photo
    if (displayEmail) {
      const storedPhoto = localStorage.getItem(photoKey);
      if (storedPhoto) setProfilePhoto(storedPhoto);
    }
  }, [displayUsername, displayEmail, photoKey]);

  const handlePhotoClick = () => {
    setPhotoError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Image must be under 2MB. Please choose a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      localStorage.setItem(photoKey, dataUrl);
      setProfilePhoto(dataUrl);
      setPhotoError(null);
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const handleLogout = () => {
    clearSessionEmail();
    queryClient.clear();
    window.location.href = "/login";
  };

  const handleEditStart = () => {
    setEditProfile({ ...fitnessProfile });
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setEditProfile({ ...fitnessProfile });
    setIsEditing(false);
  };

  const handleSave = () => {
    localStorage.setItem("fitnessProfile", JSON.stringify(editProfile));
    setFitnessProfile({ ...editProfile });
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = getInitials(
    fitnessProfile.name || displayUsername,
    displayEmail,
  );

  return (
    <div className="min-h-screen bg-surface-950 py-6 sm:py-8 lg:py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {/* Header */}
        <div className="mb-2">
          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-1">
            Profile
          </h1>
          <p className="text-surface-400 text-sm sm:text-base">
            Your account and fitness preferences
          </p>
        </div>

        {/* User Identity Card */}
        <div className="glass-card rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-4">
            {/* Avatar with photo upload */}
            <div className="relative flex-shrink-0 group">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                aria-label="Upload profile photo"
                data-ocid="profile.photo.upload_button"
              />

              {/* Avatar circle */}
              <button
                type="button"
                onClick={handlePhotoClick}
                onMouseEnter={() => setIsHoveringAvatar(true)}
                onMouseLeave={() => setIsHoveringAvatar(false)}
                aria-label="Change profile photo"
                data-ocid="profile.avatar.button"
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
                style={{
                  boxShadow:
                    "0 0 0 2px #00AAFF, 0 0 18px 2px rgba(0,170,255,0.35)",
                }}
              >
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center font-display font-bold text-xl sm:text-2xl text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.5 0.22 265) 0%, oklch(0.65 0.2 145) 100%)",
                    }}
                  >
                    {initials}
                  </div>
                )}

                {/* Camera overlay — always visible on mobile, hover on desktop */}
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-full transition-opacity duration-200 ${
                    isHoveringAvatar
                      ? "opacity-100"
                      : "opacity-0 sm:opacity-0 opacity-100"
                  }`}
                  style={{ background: "rgba(0,0,0,0.55)" }}
                  aria-hidden="true"
                >
                  <Camera className="w-6 h-6 text-white drop-shadow" />
                </div>
              </button>
            </div>

            {/* Name / email */}
            <div className="min-w-0 flex-1">
              <h2 className="font-display font-bold text-lg sm:text-xl text-white truncate">
                {fitnessProfile.name || displayUsername}
              </h2>
              <p className="text-surface-400 text-sm truncate mt-0.5">
                {displayEmail}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-electric-500/15 text-electric-400 border border-electric-500/25">
                  {getLevelLabel(fitnessProfile.fitnessLevel)}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neon-500/15 text-neon-400 border border-neon-500/25">
                  {getGoalLabel(fitnessProfile.goal)}
                </span>
              </div>
            </div>

            {/* Edit button */}
            {!isEditing && (
              <button
                type="button"
                onClick={handleEditStart}
                data-ocid="profile.edit_button"
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-surface-700/60 hover:bg-surface-600/60 flex items-center justify-center text-surface-300 hover:text-white transition-all"
                aria-label="Edit profile"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Photo error */}
          {photoError && (
            <div
              data-ocid="profile.photo.error_state"
              className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              <X className="w-4 h-4 flex-shrink-0" />
              {photoError}
            </div>
          )}

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            data-ocid="profile.logout_button"
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 min-h-[44px] rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Workout Summary Card */}
        <WorkoutSummaryCard />

        {/* Fitness Settings Card */}
        <div className="glass-card rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-electric-500/20 flex items-center justify-center flex-shrink-0">
                <Settings className="w-5 h-5 text-electric-400" />
              </div>
              <h2 className="font-display font-bold text-base sm:text-lg text-white">
                Fitness Settings
              </h2>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={handleEditCancel}
                data-ocid="profile.cancel_button"
                className="w-8 h-8 rounded-lg bg-surface-700/60 hover:bg-surface-600/60 flex items-center justify-center text-surface-400 hover:text-white transition-all"
                aria-label="Cancel editing"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {isEditing ? (
            /* Edit form */
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="display-name"
                  className="block text-surface-300 text-sm font-medium"
                >
                  Display Name
                </label>
                <input
                  id="display-name"
                  type="text"
                  placeholder="Your name"
                  value={editProfile.name}
                  onChange={(e) =>
                    setEditProfile({ ...editProfile, name: e.target.value })
                  }
                  data-ocid="profile.name.input"
                  className="w-full px-4 py-3 min-h-[48px] bg-surface-800 border border-surface-600/50 rounded-xl text-white placeholder-surface-500 text-base focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/30 transition-all"
                />
              </div>

              <SelectField
                label="Fitness Level"
                id="fitness-level"
                value={editProfile.fitnessLevel}
                onChange={(v) =>
                  setEditProfile({
                    ...editProfile,
                    fitnessLevel: v as FitnessProfile["fitnessLevel"],
                  })
                }
                options={[
                  { value: "beginner", label: "Beginner" },
                  { value: "intermediate", label: "Intermediate" },
                  { value: "advanced", label: "Advanced" },
                ]}
              />
              <SelectField
                label="Primary Goal"
                id="primary-goal"
                value={editProfile.goal}
                onChange={(v) =>
                  setEditProfile({
                    ...editProfile,
                    goal: v as FitnessProfile["goal"],
                  })
                }
                options={[
                  { value: "strength", label: "Build Strength" },
                  { value: "endurance", label: "Improve Endurance" },
                  { value: "weight-loss", label: "Lose Weight" },
                  { value: "muscle-gain", label: "Gain Muscle" },
                ]}
              />
              <SelectField
                label="Units"
                id="units"
                value={editProfile.units}
                onChange={(v) =>
                  setEditProfile({
                    ...editProfile,
                    units: v as FitnessProfile["units"],
                  })
                }
                options={[
                  { value: "metric", label: "Metric (kg, km)" },
                  { value: "imperial", label: "Imperial (lbs, miles)" },
                ]}
              />

              <button
                type="button"
                onClick={handleSave}
                data-ocid="profile.save_button"
                className="w-full flex items-center justify-center gap-2 py-3.5 min-h-[52px] rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-semibold text-base transition-all shadow-glow"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          ) : (
            /* Read-only view */
            <div className="space-y-3">
              {[
                {
                  label: "Display Name",
                  value: fitnessProfile.name || displayUsername,
                },
                {
                  label: "Fitness Level",
                  value: getLevelLabel(fitnessProfile.fitnessLevel),
                },
                {
                  label: "Primary Goal",
                  value: getGoalLabel(fitnessProfile.goal),
                },
                {
                  label: "Units",
                  value:
                    fitnessProfile.units === "metric"
                      ? "Metric (kg, km)"
                      : "Imperial (lbs, miles)",
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-surface-800/50 border border-surface-700/30"
                >
                  <span className="text-surface-400 text-sm">{label}</span>
                  <span className="text-white text-sm font-medium">
                    {value}
                  </span>
                </div>
              ))}

              {saved && (
                <div
                  data-ocid="profile.success_state"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-neon-500/10 border border-neon-500/20 text-neon-400 text-sm font-semibold"
                >
                  ✓ Profile saved successfully
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="glass-card rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-neon-500/20 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-neon-400" />
            </div>
            <h2 className="font-display font-bold text-base sm:text-lg text-white">
              Account Info
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-surface-800/50 border border-surface-700/30">
              <span className="text-surface-400 text-sm">Username</span>
              <span className="text-white text-sm font-medium">
                {displayUsername}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-surface-800/50 border border-surface-700/30">
              <span className="text-surface-400 text-sm">Email</span>
              <span className="text-white text-sm font-medium truncate max-w-[200px]">
                {displayEmail}
              </span>
            </div>
          </div>
        </div>

        {/* Tools & Resources */}
        <div className="pt-2">
          <h2 className="font-display font-bold text-lg sm:text-xl text-white mb-4">
            Tools &amp; Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/bmi"
              data-ocid="profile.bmi_calculator.link"
              className="glass-card rounded-2xl p-5 flex flex-col gap-3 group transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_4px_rgba(0,170,255,0.25)] border border-electric-500/20 hover:border-electric-500/50"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-electric-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                  ⚖️
                </div>
                <ChevronRight className="w-5 h-5 text-electric-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white mb-1">
                  BMI Calculator
                </h3>
                <p className="text-surface-400 text-sm leading-relaxed">
                  Check your Body Mass Index and get personalized insights
                </p>
              </div>
              <span className="text-electric-400 text-xs font-semibold uppercase tracking-wider">
                Open Tool →
              </span>
            </Link>

            <Link
              to="/diet-plans"
              data-ocid="profile.diet_plans.link"
              className="glass-card rounded-2xl p-5 flex flex-col gap-3 group transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_4px_rgba(57,255,20,0.2)] border border-neon-500/20 hover:border-neon-500/50"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-neon-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                  🥗
                </div>
                <ChevronRight className="w-5 h-5 text-neon-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white mb-1">
                  Diet Plans
                </h3>
                <p className="text-surface-400 text-sm leading-relaxed">
                  Explore curated meal plans tailored to your fitness goals
                </p>
              </div>
              <span className="text-neon-400 text-xs font-semibold uppercase tracking-wider">
                Explore Plans →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
