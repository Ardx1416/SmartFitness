import { Link, useNavigate } from "@tanstack/react-router";
import { Dumbbell, Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";
import { useLogin } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { mutateAsync: loginUser, isPending } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      await loginUser({ email: email.trim(), password });
      navigate({ to: "/" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-electric-500 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-glow">
            <Dumbbell className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white mb-1 sm:mb-2">
            Welcome Back
          </h1>
          <p className="text-surface-400 text-sm sm:text-base">
            Sign in to continue your fitness journey
          </p>
        </div>

        {/* Form Card */}
        <div className="auth-card rounded-2xl p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Error */}
            {error && (
              <div className="p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-surface-300 text-sm font-medium"
              >
                Email
              </label>
              <input
                id="login-email"
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
                htmlFor="login-password"
                className="block text-surface-300 text-sm font-medium"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
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
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-3.5 min-h-[52px] rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-semibold text-base transition-all shadow-glow disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <LogIn className="w-5 h-5" />
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-5 sm:mt-6 text-center">
            <p className="text-surface-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-electric-400 hover:text-electric-300 font-medium transition-colors"
              >
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
