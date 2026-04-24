import { Link } from "@tanstack/react-router";
import {
  ActivitySquare,
  BookOpen,
  Brain,
  CalendarDays,
  ChevronRight,
  Dumbbell,
  Play,
  Salad,
  Share2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import ShareModal from "../components/ShareModal";

const quickAccess = [
  {
    to: "/bmi",
    icon: ActivitySquare,
    title: "BMI Calculator",
    description:
      "Check your Body Mass Index and get personalized health insights instantly.",
    accent: "electric",
    iconColor: "text-electric-400",
    iconBg: "bg-electric-500/15",
    border: "border-electric-500/30",
    hoverBorder: "hover:border-electric-400/60",
    glow: "hover:shadow-glow",
    badge: "Health Tool",
    badgeBg: "bg-electric-500/20 text-electric-300",
    ocid: "bmi",
    radialColor: "rgba(0,170,255,0.07)",
  },
  {
    to: "/diet-plans",
    icon: Salad,
    title: "Diet Plans",
    description:
      "Discover curated nutrition plans for weight loss, muscle gain, and endurance.",
    accent: "neon",
    iconColor: "text-neon-400",
    iconBg: "bg-neon-500/15",
    border: "border-neon-500/30",
    hoverBorder: "hover:border-neon-400/60",
    glow: "hover:shadow-[0_0_20px_rgba(57,255,20,0.25)]",
    badge: "Nutrition",
    badgeBg: "bg-neon-500/20 text-neon-300",
    ocid: "diet",
    radialColor: "rgba(57,255,20,0.07)",
  },
  {
    to: "/workout-plans",
    icon: CalendarDays,
    title: "Workout Plans",
    description:
      "Structured daily workout routines from beginner to advanced. Follow a proven 7-day plan.",
    accent: "purple",
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/15",
    border: "border-purple-500/30",
    hoverBorder: "hover:border-purple-400/60",
    glow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]",
    badge: "7-Day Plan",
    badgeBg: "bg-purple-500/20 text-purple-300",
    ocid: "plans",
    radialColor: "rgba(168,85,247,0.07)",
  },
  {
    to: "/ares",
    icon: Brain,
    title: "Ares AI Coach",
    description:
      "Your personal AI combat coach — workouts, diet, and discipline.",
    accent: "neon",
    iconColor: "text-neon-400",
    iconBg: "bg-neon-500/15",
    border: "border-neon-500/30 border-electric-500/20",
    hoverBorder: "hover:border-electric-400/70",
    glow: "hover:shadow-[0_0_24px_rgba(0,170,255,0.3)]",
    badge: "AI Coach",
    badgeBg: "bg-electric-500/20 text-electric-300",
    ocid: "ares",
    radialColor: "rgba(0,170,255,0.09)",
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Exercise Library",
    description:
      "Browse 66+ exercises with detailed instructions, muscle group targeting, and difficulty ratings.",
    color: "text-electric-400",
    bg: "bg-electric-500/10",
  },
  {
    icon: Dumbbell,
    title: "Custom Workouts",
    description:
      "Build personalized workout plans with custom sets, reps, and rest times for every exercise.",
    color: "text-neon-400",
    bg: "bg-neon-500/10",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Monitor your fitness journey with detailed history, charts, and performance analytics.",
    color: "text-electric-300",
    bg: "bg-electric-300/10",
  },
];

const stats = [
  { value: "66+", label: "Exercises" },
  { value: "12+", label: "Categories" },
  { value: "100%", label: "Free" },
  { value: "∞", label: "Workouts" },
];

export default function Home() {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[75vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-motivational.dim_1920x1080.png')",
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-surface-950/95 via-surface-950/80 to-surface-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric-500/20 border border-electric-500/30 text-electric-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Zap className="w-3.5 h-3.5" />
              Premium Fitness Platform
            </div>

            {/* Headline */}
            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight mb-4 sm:mb-6">
              Train Smarter,
              <br />
              <span className="text-electric-400">Get Stronger</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl text-surface-300 mb-6 sm:mb-8 leading-relaxed max-w-lg">
              Your all-in-one fitness companion. Build custom workouts, track
              progress, and achieve your goals with our premium exercise
              library.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/library"
                data-ocid="hero.start_training_button"
                className="flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 min-h-[48px] rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-semibold text-base sm:text-lg transition-all shadow-glow hover:shadow-glow-lg w-full sm:w-auto"
              >
                <Play className="w-5 h-5" />
                Start Training
              </Link>
              <Link
                to="/builder"
                data-ocid="hero.build_workout_button"
                className="flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 min-h-[48px] rounded-xl bg-surface-800/80 hover:bg-surface-700 border border-surface-600/50 text-white font-semibold text-base sm:text-lg transition-all w-full sm:w-auto"
              >
                Build Workout
                <ChevronRight className="w-5 h-5" />
              </Link>
              {/* Share Button */}
              <button
                type="button"
                onClick={() => setShareOpen(true)}
                data-ocid="hero.share_button"
                className="flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 min-h-[48px] rounded-xl bg-surface-800/60 hover:bg-surface-700/80 border border-electric-500/30 hover:border-electric-500/60 text-electric-400 hover:text-electric-300 font-semibold text-base sm:text-lg transition-all w-full sm:w-auto shadow-[0_0_12px_rgba(99,102,241,0.15)] hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]"
              >
                <Share2 className="w-5 h-5" />
                Share App
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Access: BMI Calculator & Diet Plans ── */}
      <section
        className="py-10 sm:py-14 bg-surface-950"
        data-ocid="quick_access.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-surface-700 to-transparent" />
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-800 border border-surface-700/60">
              <Zap className="w-3.5 h-3.5 text-electric-400" />
              <span className="text-xs font-semibold text-surface-300 uppercase tracking-widest">
                Health Tools
              </span>
            </div>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-surface-700 to-transparent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {quickAccess.map(
              ({
                to,
                icon: Icon,
                title,
                description,
                iconColor,
                iconBg,
                border,
                hoverBorder,
                glow,
                badge,
                badgeBg,
                ocid,
                radialColor,
              }) => (
                <Link
                  key={to}
                  to={to}
                  data-ocid={`quick_access.${ocid}_button`}
                  className={`group relative flex items-start gap-5 p-5 sm:p-6 rounded-2xl bg-surface-900/70 border ${border} ${hoverBorder} ${glow} transition-all duration-300 overflow-hidden`}
                >
                  {/* Subtle background radial */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at top left, ${radialColor}, transparent 60%)`,
                    }}
                  />

                  {/* Icon */}
                  <div
                    className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${iconBg} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                  >
                    <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${iconColor}`} />
                  </div>

                  {/* Text */}
                  <div className="relative flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${badgeBg}`}
                      >
                        {badge}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-1.5 leading-tight">
                      {title}
                    </h3>
                    <p className="text-surface-400 text-sm sm:text-base leading-relaxed">
                      {description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    className={`relative flex-shrink-0 w-5 h-5 mt-1 ${iconColor} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300`}
                  />
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-surface-900/80 border-y border-surface-700/50 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-4 sm:gap-0 sm:grid sm:grid-cols-4 scrollbar-hide">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="flex-shrink-0 text-center px-4 sm:px-6 py-2 sm:py-0 sm:border-r sm:border-surface-700/50 last:border-0 min-w-[80px]"
              >
                <div className="font-display font-black text-2xl sm:text-3xl text-electric-400">
                  {value}
                </div>
                <div className="text-surface-400 text-xs sm:text-sm font-medium mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-3 sm:mb-4">
              Everything You Need to
              <span className="text-electric-400"> Succeed</span>
            </h2>
            <p className="text-surface-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              A complete fitness platform designed to help you build strength,
              track progress, and stay motivated.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                className="glass-card rounded-2xl p-5 sm:p-6 lg:p-8 hover:border-electric-500/30 transition-all group"
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${bg} flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${color}`} />
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-2 sm:mb-3">
                  {title}
                </h3>
                <p className="text-surface-400 text-sm sm:text-base leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-surface-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-3 sm:mb-4">
            Ready to Transform Your
            <span className="text-electric-400"> Fitness?</span>
          </h2>
          <p className="text-surface-400 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of athletes using SmartFit to build better bodies and
            achieve their fitness goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/signup"
              data-ocid="cta.get_started_button"
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-semibold text-base sm:text-lg transition-all shadow-glow w-full sm:w-auto"
            >
              Get Started Free
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              to="/library"
              data-ocid="cta.browse_button"
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-600/50 text-white font-semibold text-base sm:text-lg transition-all w-full sm:w-auto"
            >
              Browse Exercises
            </Link>
          </div>
        </div>
      </section>

      {/* Share Modal */}
      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}
