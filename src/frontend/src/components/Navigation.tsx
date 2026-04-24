import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  ActivitySquare,
  BookOpen,
  Brain,
  CalendarDays,
  Dumbbell,
  History,
  Home,
  LogIn,
  LogOut,
  PlusSquare,
  Salad,
  User,
  UserPlus,
} from "lucide-react";
import { clearSessionEmail, useAuthStatus } from "../hooks/useAuth";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/library", label: "Library", icon: BookOpen },
  { to: "/workout-plans", label: "Plans", icon: CalendarDays },
  { to: "/builder", label: "Builder", icon: PlusSquare },
  { to: "/history", label: "History", icon: History },
  { to: "/ares", label: "Ares", icon: Brain },
  { to: "/profile", label: "Profile", icon: User },
];

// Shown in desktop nav alongside main links
const toolLinks = [
  { to: "/bmi", label: "BMI", icon: ActivitySquare },
  { to: "/diet-plans", label: "Diet", icon: Salad },
];

// Mobile bottom tab bar: 7 tabs — Home, Library, Plans, Ares, Diet, BMI, Profile
// Ares replaces BMI in the bottom bar (BMI accessible via Home page card)
const mobileTabLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/library", label: "Library", icon: BookOpen },
  { to: "/workout-plans", label: "Plans", icon: CalendarDays },
  { to: "/ares", label: "Ares", icon: Brain },
  { to: "/diet-plans", label: "Diet", icon: Salad },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Navigation() {
  const { isAuthenticated } = useAuthStatus();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSessionEmail();
    queryClient.invalidateQueries({ queryKey: ["authStatus"] });
    queryClient.clear();
    navigate({ to: "/" });
  };

  const handleLogin = () => {
    navigate({ to: "/login" });
  };

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 nav-border bg-surface-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-electric-500 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                Smart<span className="text-electric-400">Fit</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav
              className="flex items-center gap-1"
              aria-label="Main navigation"
            >
              {navLinks.map(({ to, label }) => {
                const isAres = to === "/ares";
                return (
                  <Link
                    key={to}
                    to={to}
                    data-ocid={`nav.${label.toLowerCase()}_link`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(to)
                        ? isAres
                          ? "bg-neon-500/20 text-neon-400 shadow-[0_0_10px_rgba(57,255,20,0.2)]"
                          : "bg-electric-500/20 text-electric-400"
                        : isAres
                          ? "text-neon-400 hover:text-neon-300 hover:bg-neon-500/10 border border-neon-500/25 hover:border-neon-500/50"
                          : "text-surface-200 hover:text-white hover:bg-surface-700/50"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}

              {/* Divider */}
              <span
                className="mx-1 h-5 w-px bg-surface-700/60"
                aria-hidden="true"
              />

              {/* Tool Links: BMI + Diet — highlighted pills */}
              {toolLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  data-ocid={`nav.${label.toLowerCase()}_link`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive(to)
                      ? label === "BMI"
                        ? "bg-electric-500/25 text-electric-400 border border-electric-500/40"
                        : "bg-neon-500/20 text-neon-400 border border-neon-500/40"
                      : label === "BMI"
                        ? "text-electric-400 hover:bg-electric-500/15 border border-electric-500/25 hover:border-electric-500/50"
                        : "text-neon-400 hover:bg-neon-500/15 border border-neon-500/25 hover:border-neon-500/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  data-ocid="nav.logout_button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-surface-200 hover:text-white hover:bg-surface-700/50 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleLogin}
                    data-ocid="nav.login_button"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-surface-200 hover:text-white hover:bg-surface-700/50 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </button>
                  <Link
                    to="/signup"
                    data-ocid="nav.signup_link"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-electric-500 hover:bg-electric-400 text-white transition-all shadow-glow"
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-50 nav-border bg-surface-900/90 backdrop-blur-md">
        <div className="flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-electric-500 flex items-center justify-center shadow-glow">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-base text-white tracking-tight">
              Smart<span className="text-electric-400">Fit</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                data-ocid="mobile_nav.logout_button"
                className="flex items-center gap-1.5 px-3 py-2 min-h-11 rounded-lg text-sm font-medium text-surface-200 hover:text-white hover:bg-surface-700/50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs">Logout</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleLogin}
                  data-ocid="mobile_nav.login_button"
                  className="flex items-center gap-1 px-3 py-2 min-h-11 rounded-lg text-xs font-medium text-surface-200 hover:text-white hover:bg-surface-700/50 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <Link
                  to="/signup"
                  data-ocid="mobile_nav.signup_link"
                  className="flex items-center gap-1 px-3 py-2 min-h-11 rounded-lg text-xs font-medium bg-electric-500 hover:bg-electric-400 text-white transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar — 6 tabs: Home, Library, Plans, Ares, Diet, Profile */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-900/95 backdrop-blur-md border-t border-surface-700/50"
        aria-label="Mobile navigation"
      >
        <div className="grid grid-cols-6 h-16 px-1">
          {mobileTabLinks.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            const isAresTab = to === "/ares";
            const isDiet = to === "/diet-plans";
            const isPlans = to === "/workout-plans";
            const isToolTab = isAresTab || isDiet || isPlans;

            const activeColor = isAresTab
              ? "text-neon-400"
              : isDiet
                ? "text-neon-400"
                : isPlans
                  ? "text-purple-400"
                  : "text-electric-400";

            const inactiveColor = isAresTab
              ? "text-neon-400/60 hover:text-neon-400"
              : isDiet
                ? "text-neon-400/60 hover:text-neon-400"
                : isPlans
                  ? "text-purple-400/60 hover:text-purple-400"
                  : "text-surface-400 hover:text-surface-200";

            const dotColor = isAresTab
              ? "bg-neon-400 shadow-[0_0_6px_rgba(57,255,20,0.8)]"
              : isDiet
                ? "bg-neon-400"
                : isPlans
                  ? "bg-purple-400"
                  : "bg-electric-400";

            return (
              <Link
                key={to}
                to={to}
                data-ocid={`mobile_tab.${label.toLowerCase()}_tab`}
                className={`relative flex flex-col items-center justify-center gap-0.5 min-h-[44px] py-1 rounded-lg transition-all ${
                  active
                    ? activeColor
                    : isToolTab
                      ? inactiveColor
                      : inactiveColor
                }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] ${active ? activeColor : ""}`}
                />
                <span
                  className={`text-[9px] font-semibold leading-tight ${active ? activeColor : isToolTab ? inactiveColor.split(" ")[0] : ""}`}
                >
                  {label}
                </span>
                {active && (
                  <span
                    className={`absolute bottom-1 w-1 h-1 rounded-full ${dotColor}`}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
