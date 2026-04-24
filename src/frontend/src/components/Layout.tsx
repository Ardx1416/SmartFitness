import { Outlet } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Dumbbell } from "lucide-react";
import Navigation from "./Navigation";

export default function Layout() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-surface-950 text-white flex flex-col">
      <Navigation />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <footer className="hidden md:block bg-surface-900 border-t border-surface-700/50 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-electric-500 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-white">
                  Smart<span className="text-electric-400">Fit</span>
                </span>
              </div>
              <p className="text-surface-400 text-sm leading-relaxed">
                Your premium fitness companion. Track workouts, build custom
                plans, and crush your goals.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  { to: "/", label: "Home" },
                  { to: "/library", label: "Exercise Library" },
                  { to: "/builder", label: "Workout Builder" },
                  { to: "/history", label: "Progress History" },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-surface-400 hover:text-electric-400 text-sm transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-surface-700/50 pt-6 text-center">
            <p className="text-surface-500 text-sm">
              © {year} SmartFit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
