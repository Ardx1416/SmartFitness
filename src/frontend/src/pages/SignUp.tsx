import { Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle, Dumbbell, Eye, EyeOff, UserPlus } from "lucide-react";
import { useState } from "react";
import { useRegister } from "../hooks/useAuth";

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { score, label: "Fair", color: "bg-yellow-500" };
  if (score === 3) return { score, label: "Good", color: "bg-neon-500" };
  return { score, label: "Strong", color: "bg-electric-500" };
}

export default function SignUp() {
  const navigate = useNavigate();
  const { mutateAsync: register, isPending } = useRegister();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (username.trim().length < 2) {
      setError("Username must be at least 2 characters");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      setSuccess(true);
      setTimeout(() => navigate({ to: "/login" }), 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neon-500/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-neon-400" />
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">
            Account Created!
          </h2>
          <p className="text-surface-400 text-sm sm:text-base">
            Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-electric-500 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-glow">
            <Dumbbell className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white mb-1 sm:mb-2">
            Create Account
          </h1>
          <p className="text-surface-400 text-sm sm:text-base">
            Start your fitness journey today
          </p>
        </div>

        {/* Form Card */}
        <div className="auth-card rounded-2xl p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error */}
            {error && (
              <div className="p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="signup-username"
                className="block text-surface-300 text-sm font-medium"
              >
                Username
              </label>
              <input
                id="signup-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="fitnesshero"
                autoComplete="username"
                className="w-full px-4 py-3 min-h-[48px] bg-surface-800 border border-surface-600/50 rounded-xl text-white placeholder-surface-500 text-base focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/30 transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="signup-email"
                className="block text-surface-300 text-sm font-medium"
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 min-h-[48px] bg-surface-800 border border-surface-600/50 rounded-xl text-white placeholder-surface-500 text-base focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/30 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="signup-password"
                className="block text-surface-300 text-sm font-medium"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 min-h-[48px] bg-surface-800 border border-surface-600/50 rounded-xl text-white placeholder-surface-500 text-base focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-surface-400 hover:text-surface-200 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {/* Password Strength */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-all ${
                          i <= strength.score
                            ? strength.color
                            : "bg-surface-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-surface-400">
                    Strength:{" "}
                    <span className="text-white font-medium">
                      {strength.label}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="signup-confirm-password"
                className="block text-surface-300 text-sm font-medium"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="signup-confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 min-h-[48px] bg-surface-800 border border-surface-600/50 rounded-xl text-white placeholder-surface-500 text-base focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-surface-400 hover:text-surface-200 transition-colors"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-3.5 min-h-[52px] rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-semibold text-base transition-all shadow-glow disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <UserPlus className="w-5 h-5" />
              {isPending ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-5 sm:mt-6 text-center">
            <p className="text-surface-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-electric-400 hover:text-electric-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
