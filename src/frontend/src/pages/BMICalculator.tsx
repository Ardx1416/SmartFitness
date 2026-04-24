import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "smartfit-bmi-v3";

type UnitSystem = "metric" | "imperial";
type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "very" | "extra";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary",
  light: "Lightly Active",
  moderate: "Moderately Active",
  very: "Very Active",
  extra: "Extra Active",
};

const ACTIVITY_DESC: Record<ActivityLevel, string> = {
  sedentary: "Little or no exercise",
  light: "Light exercise 1–3 days/wk",
  moderate: "Moderate exercise 3–5 days/wk",
  very: "Hard exercise 6–7 days/wk",
  extra: "Very hard exercise / physical job",
};

interface FormInputs {
  unitSystem: UnitSystem;
  heightCm: string;
  heightFt: string;
  heightIn: string;
  weightKg: string;
  weightLbs: string;
  age: string;
  gender: Gender;
  activityLevel: ActivityLevel;
  waistCm: string;
  hipCm: string;
  neckCm: string;
  wristCm: string;
}

interface Results {
  bmi: number;
  bmiCategory: string;
  bmiColor: string;
  bfPercent: number;
  bfMethod: string;
  bfCategory: string;
  bfColor: string;
  ffm: number;
  bfMass: number;
  smm: number;
  bmr: number;
  tdee: number;
  idealWeightHamwi: number;
  idealWeightMin: number;
  idealWeightMax: number;
  targetWeight: number;
  weightDelta: number;
  obesityDegree: number;
  visceralLevel: number;
  visceralCategory: string;
  visceralColor: string;
  whr: number | null;
  whrCategory: string;
  whrColor: string;
  fitnessScore: number;
  fitnessColor: string;
  weightKg: number;
  heightCm: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  idealBF: number;
}

const MET_ACTIVITIES = [
  { name: "Walking (3.5 mph)", met: 3.8, icon: "🚶" },
  { name: "Jogging (5 mph)", met: 7.0, icon: "🏃" },
  { name: "Cycling (moderate)", met: 8.0, icon: "🚴" },
  { name: "Swimming", met: 7.0, icon: "🏊" },
  { name: "Weight Training", met: 5.0, icon: "🏋️" },
  { name: "Yoga", met: 3.0, icon: "🧘" },
  { name: "HIIT", met: 10.0, icon: "⚡" },
  { name: "Jump Rope", met: 11.0, icon: "🪢" },
];

// ---- Pure calculation functions ----
function toMetric(inputs: FormInputs): { heightCm: number; weightKg: number } {
  if (inputs.unitSystem === "metric") {
    return {
      heightCm: Number.parseFloat(inputs.heightCm) || 0,
      weightKg: Number.parseFloat(inputs.weightKg) || 0,
    };
  }
  const ft = Number.parseFloat(inputs.heightFt) || 0;
  const inches = Number.parseFloat(inputs.heightIn) || 0;
  return {
    heightCm: (ft * 12 + inches) * 2.54,
    weightKg: (Number.parseFloat(inputs.weightLbs) || 0) * 0.453592,
  };
}

function calcResults(inputs: FormInputs): Results | null {
  const { heightCm, weightKg } = toMetric(inputs);
  const age = Number.parseFloat(inputs.age) || 0;
  if (heightCm <= 0 || weightKg <= 0 || age <= 0) return null;

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  // BMI category
  let bmiCategory = "Obese";
  let bmiColor = "#FF4444";
  if (bmi < 18.5) {
    bmiCategory = "Underweight";
    bmiColor = "#00AAFF";
  } else if (bmi < 25) {
    bmiCategory = "Normal";
    bmiColor = "#39FF14";
  } else if (bmi < 30) {
    bmiCategory = "Overweight";
    bmiColor = "#FFB800";
  }

  // Body fat % — try US Navy method first if we have waist/hip/neck
  const waist = Number.parseFloat(inputs.waistCm) || 0;
  const hip = Number.parseFloat(inputs.hipCm) || 0;
  const neck = Number.parseFloat(inputs.neckCm) || 0;
  const wrist = Number.parseFloat(inputs.wristCm) || 0;

  let bfPercent: number;
  let bfMethod = "Deurenberg Formula";

  if (waist > 0 && neck > 0 && (inputs.gender === "male" || hip > 0)) {
    // US Navy Method
    if (inputs.gender === "male") {
      bfPercent =
        86.01 * Math.log10(waist - neck) -
        70.041 * Math.log10(heightCm) +
        36.76;
    } else {
      bfPercent =
        163.205 * Math.log10(waist + hip - neck) -
        97.684 * Math.log10(heightCm) -
        78.387;
    }
    bfMethod = "US Navy Method";
  } else {
    // Deurenberg fallback
    const gFactor = inputs.gender === "male" ? 1 : 0;
    bfPercent = 1.2 * bmi + 0.23 * age - 10.8 * gFactor - 5.4;
  }

  bfPercent = Math.max(3, Math.min(60, bfPercent));
  const idealBF = inputs.gender === "male" ? 15 : 22;

  let bfCategory = "Obese";
  let bfColor = "#FF4444";
  if (inputs.gender === "male") {
    if (bfPercent < 10) {
      bfCategory = "Athletes";
      bfColor = "#00AAFF";
    } else if (bfPercent < 20) {
      bfCategory = "Healthy";
      bfColor = "#39FF14";
    } else if (bfPercent < 25) {
      bfCategory = "Acceptable";
      bfColor = "#FFB800";
    }
  } else {
    if (bfPercent < 20) {
      bfCategory = "Athletes";
      bfColor = "#00AAFF";
    } else if (bfPercent < 30) {
      bfCategory = "Healthy";
      bfColor = "#39FF14";
    } else if (bfPercent < 35) {
      bfCategory = "Acceptable";
      bfColor = "#FFB800";
    }
  }

  const ffm = weightKg * (1 - bfPercent / 100);
  const bfMass = weightKg * (bfPercent / 100);
  const smm = ffm * 0.55;

  // BMR — Mifflin-St Jeor
  const bmr =
    inputs.gender === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  const tdee = bmr * ACTIVITY_MULTIPLIERS[inputs.activityLevel];

  // Hamwi Ideal Weight
  const heightInInches = heightCm / 2.54;
  let idealWeightHamwi: number;
  if (inputs.gender === "male") {
    idealWeightHamwi = (48 + 2.7 * Math.max(0, heightInInches - 60)) * 0.453592;
  } else {
    idealWeightHamwi =
      (45.5 + 2.2 * Math.max(0, heightInInches - 60)) * 0.453592;
  }
  // Frame size adjustment using wrist
  if (wrist > 0) {
    const frameRatio = heightCm / wrist;
    if (inputs.gender === "male") {
      if (frameRatio > 10.4)
        idealWeightHamwi *= 0.9; // small frame
      else if (frameRatio < 9.6) idealWeightHamwi *= 1.1; // large frame
    } else {
      if (frameRatio > 11) idealWeightHamwi *= 0.9;
      else if (frameRatio < 10.1) idealWeightHamwi *= 1.1;
    }
  }

  // BMI-based ideal range
  const idealWeightMin = 18.5 * heightM * heightM;
  const idealWeightMax = 24.9 * heightM * heightM;
  const targetWeight = (idealWeightMin + idealWeightMax) / 2;
  const weightDelta = weightKg - targetWeight;

  // Obesity degree (weight relative to Hamwi ideal)
  const obesityDegree = (weightKg / idealWeightHamwi) * 100;

  // WHR
  let whr: number | null = null;
  let whrCategory = "";
  let whrColor = "";
  if (waist > 0 && hip > 0) {
    whr = waist / hip;
    if (inputs.gender === "male") {
      if (whr < 0.9) {
        whrCategory = "Healthy";
        whrColor = "#39FF14";
      } else if (whr <= 1.0) {
        whrCategory = "Moderate Risk";
        whrColor = "#FFB800";
      } else {
        whrCategory = "High Risk";
        whrColor = "#FF4444";
      }
    } else {
      if (whr < 0.8) {
        whrCategory = "Healthy";
        whrColor = "#39FF14";
      } else if (whr <= 0.85) {
        whrCategory = "Moderate Risk";
        whrColor = "#FFB800";
      } else {
        whrCategory = "High Risk";
        whrColor = "#FF4444";
      }
    }
  }

  // Visceral fat estimate (from BMI, age, WHR)
  const whrFactor = whr !== null ? (whr - 0.75) * 5 : 0;
  const rawVisceral = Math.round((bmi - 18.5) / 1.8 + age / 10 + whrFactor);
  const visceralLevel = Math.min(20, Math.max(1, rawVisceral));
  let visceralCategory = "Low";
  let visceralColor = "#39FF14";
  if (visceralLevel >= 15) {
    visceralCategory = "High";
    visceralColor = "#FF4444";
  } else if (visceralLevel >= 10) {
    visceralCategory = "Moderate";
    visceralColor = "#FFB800";
  }

  // InBody-style Fitness Score
  const bmiScore = Math.max(0, 30 - Math.abs(bmi - 22) * 3);
  const bfScore = Math.max(0, 35 - Math.abs(bfPercent - idealBF) * 2);
  const muscleScore = Math.min(35, (smm / weightKg) * 100);
  const rawFitness = bmiScore + bfScore + muscleScore;
  const fitnessScore = Math.min(100, Math.max(0, Math.round(rawFitness)));
  let fitnessColor = "#FF4444";
  if (fitnessScore >= 70) fitnessColor = "#39FF14";
  else if (fitnessScore >= 40) fitnessColor = "#FFB800";

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory,
    bmiColor,
    bfPercent: Math.round(bfPercent * 10) / 10,
    bfMethod,
    bfCategory,
    bfColor,
    ffm: Math.round(ffm * 10) / 10,
    bfMass: Math.round(bfMass * 10) / 10,
    smm: Math.round(smm * 10) / 10,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    idealWeightHamwi: Math.round(idealWeightHamwi * 10) / 10,
    idealWeightMin: Math.round(idealWeightMin * 10) / 10,
    idealWeightMax: Math.round(idealWeightMax * 10) / 10,
    targetWeight: Math.round(targetWeight * 10) / 10,
    weightDelta: Math.round(Math.abs(weightDelta) * 10) / 10,
    obesityDegree: Math.round(obesityDegree * 10) / 10,
    visceralLevel,
    visceralCategory,
    visceralColor,
    whr: whr !== null ? Math.round(whr * 100) / 100 : null,
    whrCategory,
    whrColor,
    fitnessScore,
    fitnessColor,
    weightKg,
    heightCm,
    age,
    gender: inputs.gender,
    activityLevel: inputs.activityLevel,
    idealBF,
  };
}

function bmiToPercent(bmi: number) {
  return Math.min(100, Math.max(0, ((bmi - 10) / 40) * 100));
}

function clampPercent(value: number, min: number, max: number) {
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

// ---- Tooltip Component ----
function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center cursor-pointer transition-colors"
        style={{
          background: "rgba(0,170,255,0.2)",
          color: "#00AAFF",
          border: "1px solid rgba(0,170,255,0.4)",
        }}
        aria-label="More info"
      >
        i
      </button>
      {open && (
        <div
          className="absolute z-50 w-60 p-3 rounded-xl text-xs leading-relaxed shadow-2xl"
          style={{
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "oklch(0.14 0.02 260 / 0.97)",
            border: "1px solid rgba(0,170,255,0.35)",
            color: "oklch(0.85 0.01 260)",
          }}
        >
          {text}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              bottom: "-5px",
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "5px solid rgba(0,170,255,0.35)",
            }}
          />
        </div>
      )}
    </div>
  );
}

// ---- Scale Bar ----
function ScaleBar({
  percent,
  color,
  gradient,
}: {
  percent: number;
  color: string;
  gradient?: string;
}) {
  return (
    <div
      className="relative h-3 rounded-full overflow-hidden mt-3"
      style={{ background: gradient ?? "rgba(255,255,255,0.07)" }}
    >
      {!gradient && (
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, background: color }}
        />
      )}
      {gradient && (
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-background shadow-lg transition-all duration-700"
          style={{ left: `${percent}%`, background: color }}
        />
      )}
    </div>
  );
}

// ---- Circular Score Component ----
function CircularScore({ score, color }: { score: number; color: string }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center w-36 h-36 mx-auto">
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 128 128"
        aria-hidden="true"
      >
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="10"
        />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="text-center z-10">
        <div
          className="text-4xl font-black"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color }}
        >
          {score}
        </div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Score
        </div>
      </div>
    </div>
  );
}

// ---- Metric Card ----
function MetricCard({
  label,
  value,
  unit,
  sub,
  color,
  icon,
  tip,
  ocid,
  scalePercent,
  scaleGradient,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  color: string;
  icon?: string;
  tip: string;
  ocid: string;
  scalePercent?: number;
  scaleGradient?: string;
}) {
  return (
    <div
      className="glass-card rounded-xl p-4"
      data-ocid={ocid}
      style={{ borderColor: `${color}44` }}
    >
      <div className="flex items-center gap-1 mb-2">
        {icon && <span className="text-base">{icon}</span>}
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex-1 min-w-0 truncate">
          {label}
        </span>
        <InfoTooltip text={tip} />
      </div>
      <div
        className="text-2xl font-black"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", color }}
      >
        {value}
      </div>
      {unit && <div className="text-[10px] text-muted-foreground">{unit}</div>}
      {sub && (
        <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
      )}
      {scalePercent !== undefined && (
        <ScaleBar
          percent={scalePercent}
          color={color}
          gradient={scaleGradient}
        />
      )}
    </div>
  );
}

// ---- Segmental Badge ----
function SegBadge({ status }: { status: "UNDER" | "NORMAL" | "OVER" }) {
  const map = {
    UNDER: {
      color: "#00AAFF",
      bg: "rgba(0,170,255,0.15)",
      border: "rgba(0,170,255,0.4)",
    },
    NORMAL: {
      color: "#39FF14",
      bg: "rgba(57,255,20,0.15)",
      border: "rgba(57,255,20,0.4)",
    },
    OVER: {
      color: "#FF4444",
      bg: "rgba(255,68,68,0.15)",
      border: "rgba(255,68,68,0.4)",
    },
  };
  const s = map[status];
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      {status}
    </span>
  );
}

const defaultInputs: FormInputs = {
  unitSystem: "metric",
  heightCm: "",
  heightFt: "",
  heightIn: "",
  weightKg: "",
  weightLbs: "",
  age: "",
  gender: "male",
  activityLevel: "moderate",
  waistCm: "",
  hipCm: "",
  neckCm: "",
  wristCm: "",
};

export default function BMICalculator() {
  const [inputs, setInputs] = useState<FormInputs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved)
        return { ...defaultInputs, ...JSON.parse(saved) } as FormInputs;
    } catch {
      /* ignore */
    }
    return defaultInputs;
  });

  const [results, setResults] = useState<Results | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = { ...defaultInputs, ...JSON.parse(saved) } as FormInputs;
        return calcResults(parsed);
      }
    } catch {
      /* ignore */
    }
    return null;
  });

  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const actRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (actRef.current && !actRef.current.contains(e.target as Node))
        setShowActivityDropdown(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const persist = useCallback((next: FormInputs) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  function update<K extends keyof FormInputs>(field: K, value: FormInputs[K]) {
    setInputs((prev) => {
      const next = { ...prev, [field]: value };
      persist(next);
      return next;
    });
  }

  function handleCalculate() {
    const r = calcResults(inputs);
    setResults(r);
    if (r) {
      // Persist the calculated bmi value alongside form inputs so DietPlans
      // can read parsed?.bmi from the same localStorage key.
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...inputs, bmi: r.bmi }),
        );
      } catch {
        /* ignore */
      }
      setTimeout(() => {
        document
          .getElementById("bmi-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }

  function handleReset() {
    setInputs(defaultInputs);
    setResults(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  const inputClass =
    "w-full bg-transparent border border-border rounded-xl px-4 py-3 text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors duration-200";
  const focusBlue = "focus:ring-[rgba(0,170,255,0.4)] focus:border-[#00AAFF]";

  function getSegStatus(
    r: Results,
  ): Record<string, "UNDER" | "NORMAL" | "OVER"> {
    const smmRatio = r.smm / r.weightKg;
    const bfIdeal = r.gender === "male" ? 15 : 22;
    const armStat: "UNDER" | "NORMAL" | "OVER" =
      smmRatio < 0.28 ? "UNDER" : smmRatio > 0.38 ? "OVER" : "NORMAL";
    const legStat: "UNDER" | "NORMAL" | "OVER" =
      smmRatio < 0.28 ? "UNDER" : smmRatio > 0.38 ? "OVER" : "NORMAL";
    const trunkStat: "UNDER" | "NORMAL" | "OVER" =
      r.bfPercent > bfIdeal + 10
        ? "OVER"
        : r.bfPercent < bfIdeal - 10
          ? "UNDER"
          : "NORMAL";
    return {
      leftArm: armStat,
      rightArm: armStat,
      trunk: trunkStat,
      leftLeg: legStat,
      rightLeg: legStat,
    };
  }

  const dietStream = results
    ? results.bmiCategory.toLowerCase().replace(" ", "")
    : "normal";

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-12">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{
              background: "rgba(0,170,255,0.12)",
              color: "#00AAFF",
              border: "1px solid rgba(0,170,255,0.3)",
            }}
          >
            ⚡ InBody-Style Analysis
          </div>
          <h1
            className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-2"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              background: "linear-gradient(135deg, #00AAFF, #39FF14)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Body Composition Analyzer
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            15+ metrics: BMI, body fat (US Navy method), muscle mass,
            metabolism, visceral fat, WHR & fitness score
          </p>
        </div>

        {/* ── INPUT FORM ── */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          {/* Unit Toggle */}
          <div className="flex justify-between items-center mb-6">
            <h2
              className="text-lg font-black uppercase tracking-wide text-foreground"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Your Measurements
            </h2>
            <div
              className="glass-card rounded-full p-1 flex gap-1"
              data-ocid="bmi.unit_toggle"
            >
              {(["metric", "imperial"] as UnitSystem[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => update("unitSystem", u)}
                  data-ocid={`bmi.unit_${u}`}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                  style={
                    inputs.unitSystem === u
                      ? { background: "#00AAFF", color: "#0A0A0A" }
                      : { color: "var(--muted-foreground)" }
                  }
                >
                  {u === "metric" ? "Metric" : "Imperial"}
                </button>
              ))}
            </div>
          </div>

          {/* Height + Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="bmi-height-metric"
                className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider"
              >
                Height
              </label>
              {inputs.unitSystem === "metric" ? (
                <div className="relative">
                  <input
                    id="bmi-height-metric"
                    type="number"
                    min="0"
                    placeholder="e.g. 175"
                    value={inputs.heightCm}
                    onChange={(e) => update("heightCm", e.target.value)}
                    className={`${inputClass} ${focusBlue}`}
                    data-ocid="bmi.height_cm_input"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    cm
                  </span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      min="0"
                      placeholder="ft"
                      value={inputs.heightFt}
                      onChange={(e) => update("heightFt", e.target.value)}
                      className={`${inputClass} ${focusBlue}`}
                      data-ocid="bmi.height_ft_input"
                      aria-label="Height feet"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      ft
                    </span>
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      placeholder="in"
                      value={inputs.heightIn}
                      onChange={(e) => update("heightIn", e.target.value)}
                      className={`${inputClass} ${focusBlue}`}
                      data-ocid="bmi.height_in_input"
                      aria-label="Height inches"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      in
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="bmi-weight"
                className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider"
              >
                Weight
              </label>
              <div className="relative">
                <input
                  id="bmi-weight"
                  type="number"
                  min="0"
                  placeholder={
                    inputs.unitSystem === "metric" ? "e.g. 70" : "e.g. 154"
                  }
                  value={
                    inputs.unitSystem === "metric"
                      ? inputs.weightKg
                      : inputs.weightLbs
                  }
                  onChange={(e) =>
                    update(
                      inputs.unitSystem === "metric" ? "weightKg" : "weightLbs",
                      e.target.value,
                    )
                  }
                  className={`${inputClass} ${focusBlue}`}
                  data-ocid="bmi.weight_input"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  {inputs.unitSystem === "metric" ? "kg" : "lbs"}
                </span>
              </div>
            </div>
          </div>

          {/* Age + Gender */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="bmi-age"
                className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider"
              >
                Age
              </label>
              <input
                id="bmi-age"
                type="number"
                min="0"
                max="120"
                placeholder="e.g. 28"
                value={inputs.age}
                onChange={(e) => update("age", e.target.value)}
                className={`${inputClass} ${focusBlue}`}
                data-ocid="bmi.age_input"
              />
            </div>
            <div>
              <div className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                Gender
              </div>
              <div className="glass-card rounded-xl p-1 flex gap-1 h-[50px]">
                {(["male", "female"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => update("gender", g)}
                    data-ocid={`bmi.gender_${g}`}
                    className="flex-1 rounded-lg text-sm font-semibold capitalize transition-all duration-200"
                    style={
                      inputs.gender === g
                        ? { background: "#00AAFF", color: "#0A0A0A" }
                        : { color: "var(--muted-foreground)" }
                    }
                  >
                    {g === "male" ? "♂ Male" : "♀ Female"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Level */}
          <div className="mb-4" ref={actRef}>
            <div className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Activity Level
            </div>
            <button
              type="button"
              onClick={() => setShowActivityDropdown(!showActivityDropdown)}
              data-ocid="bmi.activity_select"
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border text-foreground text-sm transition-colors duration-200 hover:border-[#00AAFF]"
            >
              <div className="text-left">
                <div className="font-semibold">
                  {ACTIVITY_LABELS[inputs.activityLevel]}
                </div>
                <div className="text-xs text-muted-foreground">
                  {ACTIVITY_DESC[inputs.activityLevel]} · ×
                  {ACTIVITY_MULTIPLIERS[inputs.activityLevel]}
                </div>
              </div>
              <span className="text-muted-foreground ml-2">
                {showActivityDropdown ? "▲" : "▼"}
              </span>
            </button>
            {showActivityDropdown && (
              <div
                className="mt-1 rounded-xl border border-border overflow-hidden z-10 relative"
                style={{ background: "oklch(0.13 0.015 260)" }}
              >
                {(Object.keys(ACTIVITY_MULTIPLIERS) as ActivityLevel[]).map(
                  (level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        update("activityLevel", level);
                        setShowActivityDropdown(false);
                      }}
                      data-ocid={`bmi.activity_${level}`}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-[rgba(0,170,255,0.08)] transition-colors text-left border-b border-border last:border-0"
                      style={
                        inputs.activityLevel === level
                          ? { color: "#00AAFF" }
                          : { color: "var(--foreground)" }
                      }
                    >
                      <div>
                        <div className="font-semibold">
                          {ACTIVITY_LABELS[level]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {ACTIVITY_DESC[level]}
                        </div>
                      </div>
                      <span
                        className="text-xs font-bold ml-2"
                        style={{ color: "#00AAFF" }}
                      >
                        ×{ACTIVITY_MULTIPLIERS[level]}
                      </span>
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Body Circumference Measurements */}
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Body Measurements
              </span>
              <InfoTooltip text="Waist, hip & neck enable the more accurate US Navy body fat method. Wrist improves the Hamwi ideal weight calculation via frame size." />
              <span className="text-xs text-muted-foreground normal-case ml-1">
                (optional — improves accuracy)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  field: "waistCm" as const,
                  label: "Waist",
                  placeholder: "cm",
                  ocid: "bmi.waist_input",
                  hint:
                    inputs.gender === "female"
                      ? "for Navy BF% + WHR"
                      : "for Navy BF% + WHR",
                },
                {
                  field: "hipCm" as const,
                  label: "Hip",
                  placeholder: "cm",
                  ocid: "bmi.hip_input",
                  hint: "for WHR",
                },
                {
                  field: "neckCm" as const,
                  label: "Neck",
                  placeholder: "cm",
                  ocid: "bmi.neck_input",
                  hint: "for Navy BF% method",
                },
                {
                  field: "wristCm" as const,
                  label: "Wrist",
                  placeholder: "cm",
                  ocid: "bmi.wrist_input",
                  hint: "for frame size / Hamwi",
                },
              ].map(({ field, label, ocid }) => (
                <div key={field} className="relative">
                  <label htmlFor={ocid} className="sr-only">
                    {label} circumference in cm
                  </label>
                  <input
                    id={ocid}
                    type="number"
                    min="0"
                    placeholder={label}
                    value={inputs[field]}
                    onChange={(e) => update(field, e.target.value)}
                    className={`${inputClass} ${focusBlue}`}
                    data-ocid={ocid}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    cm
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <button
            type="button"
            onClick={handleCalculate}
            data-ocid="bmi.calculate_button"
            className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-base transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #00AAFF, #0077CC)",
              color: "#fff",
              fontFamily: "'Barlow Condensed', sans-serif",
              boxShadow: "0 0 24px rgba(0,170,255,0.35)",
            }}
          >
            ⚡ Analyze My Body
          </button>
        </div>

        {/* ── RESULTS DASHBOARD ── */}
        {results && (
          <div id="bmi-results" className="space-y-5">
            {/* A. BMI Card */}
            <div
              className="glass-card rounded-2xl p-6"
              data-ocid="bmi.result_card"
              style={{ borderColor: `${results.bmiColor}66` }}
            >
              <div className="flex items-center gap-2 mb-4">
                <h3
                  className="text-base font-black uppercase tracking-wide"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    color: "#00AAFF",
                  }}
                >
                  Body Mass Index
                </h3>
                <InfoTooltip text="BMI = weight(kg) / height(m)². WHO classification: <18.5 Underweight, 18.5–24.9 Normal, 25–29.9 Overweight, ≥30 Obese. Note: BMI doesn't distinguish fat from muscle." />
              </div>
              <div className="flex items-center gap-6 mb-5">
                <div
                  className="text-7xl font-black"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    color: results.bmiColor,
                  }}
                  data-ocid="bmi.value_display"
                >
                  {results.bmi}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Category
                  </div>
                  <span
                    className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider"
                    data-ocid="bmi.category_badge"
                    style={{
                      background: `${results.bmiColor}22`,
                      color: results.bmiColor,
                      border: `1px solid ${results.bmiColor}66`,
                    }}
                  >
                    {results.bmiCategory}
                  </span>
                  <div className="text-xs text-muted-foreground mt-2">
                    Height: {results.heightCm}cm · Weight: {results.weightKg}kg
                  </div>
                </div>
              </div>
              {/* BMI Scale Bar */}
              <div
                className="relative h-4 rounded-full overflow-hidden mb-2"
                style={{
                  background:
                    "linear-gradient(to right, #00AAFF 0%, #00AAFF 21.25%, #39FF14 21.25%, #39FF14 53.75%, #FFB800 53.75%, #FFB800 70%, #FF4444 70%, #FF4444 100%)",
                }}
              >
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-background shadow-lg transition-all duration-700"
                  style={{
                    left: `${bmiToPercent(results.bmi)}%`,
                    background: results.bmiColor,
                  }}
                  data-ocid="bmi.scale_indicator"
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground px-0.5 mb-1">
                {["10", "18.5", "25", "30", "50"].map((v) => (
                  <span key={v}>{v}</span>
                ))}
              </div>
              <div className="flex text-[10px] font-semibold">
                {[
                  { label: "Underweight", color: "#00AAFF" },
                  { label: "Normal", color: "#39FF14" },
                  { label: "Overweight", color: "#FFB800" },
                  { label: "Obese", color: "#FF4444" },
                ].map((c) => (
                  <span
                    key={c.label}
                    className="flex-1 text-center"
                    style={{ color: c.color }}
                  >
                    {c.label}
                  </span>
                ))}
              </div>
            </div>

            {/* B. Body Fat % Card */}
            <div
              className="glass-card rounded-2xl p-5"
              data-ocid="bmi.bf_card"
              style={{ borderColor: `${results.bfColor}44` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <h3
                  className="text-base font-black uppercase tracking-wide"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    color: "#39FF14",
                  }}
                >
                  Body Fat Percentage
                </h3>
                <InfoTooltip
                  text={`Calculated using: ${results.bfMethod}. ${results.bfMethod === "US Navy Method" ? "Uses waist, hip, neck & height measurements — more accurate than BMI-based methods." : "Deurenberg formula: BF% = 1.2×BMI + 0.23×Age − 10.8×GenderFactor − 5.4. Add neck & waist measurements for the more accurate US Navy method."}`}
                />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="text-6xl font-black"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    color: results.bfColor,
                  }}
                >
                  {results.bfPercent}%
                </div>
                <div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: `${results.bfColor}22`,
                      color: results.bfColor,
                      border: `1px solid ${results.bfColor}55`,
                    }}
                  >
                    {results.bfCategory}
                  </span>
                  <div className="text-[10px] text-muted-foreground mt-1.5">
                    Method: {results.bfMethod}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Ideal: {results.gender === "male" ? "10–20%" : "20–30%"}
                  </div>
                </div>
              </div>
              {/* BF Scale Bar */}
              <div
                className="relative h-3 rounded-full overflow-hidden mb-1"
                style={{
                  background:
                    inputs.gender === "male"
                      ? "linear-gradient(to right, #00AAFF 0%, #00AAFF 13.3%, #39FF14 13.3%, #39FF14 33.3%, #FFB800 33.3%, #FFB800 41.6%, #FF4444 41.6%, #FF4444 100%)"
                      : "linear-gradient(to right, #00AAFF 0%, #00AAFF 26.6%, #39FF14 26.6%, #39FF14 50%, #FFB800 50%, #FFB800 58.3%, #FF4444 58.3%, #FF4444 100%)",
                }}
              >
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-background shadow transition-all duration-700"
                  style={{
                    left: `${clampPercent(results.bfPercent, 3, 60)}%`,
                    background: results.bfColor,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>3% Min</span>
                <span>
                  {results.gender === "male"
                    ? "10–20% Healthy"
                    : "20–30% Healthy"}
                </span>
                <span>60% Max</span>
              </div>
            </div>

            {/* C. Body Composition 2x2 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3
                  className="text-base font-black uppercase tracking-wide"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    color: "#00AAFF",
                  }}
                >
                  Body Composition
                </h3>
                <InfoTooltip text="Fat mass, lean mass, and estimated skeletal muscle based on your body fat percentage and weight." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  label="Fat-Free Mass"
                  value={`${results.ffm} kg`}
                  sub="Lean body mass"
                  color="#39FF14"
                  icon="💪"
                  tip="FFM = Weight × (1 − BF%/100). Includes muscles, bones, organs, and water."
                  ocid="bmi.ffm_card"
                  scalePercent={clampPercent(results.ffm, 30, results.weightKg)}
                />
                <MetricCard
                  label="Fat Mass"
                  value={`${results.bfMass} kg`}
                  sub="Total body fat"
                  color={results.bfColor}
                  icon="📊"
                  tip="Fat Mass = Weight × BF%/100. Includes essential fat and storage fat."
                  ocid="bmi.fat_mass_card"
                  scalePercent={clampPercent(
                    results.bfMass,
                    3,
                    results.weightKg * 0.6,
                  )}
                />
                <MetricCard
                  label="Skeletal Muscle"
                  value={`${results.smm} kg`}
                  sub="Est. muscle mass"
                  color="#39FF14"
                  icon="🏋️"
                  tip="Skeletal Muscle Mass ≈ FFM × 0.55. Higher muscle mass improves metabolism and reduces injury risk."
                  ocid="bmi.smm_card"
                  scalePercent={clampPercent(
                    results.smm,
                    10,
                    results.weightKg * 0.5,
                  )}
                />
                <MetricCard
                  label="Ideal BF %"
                  value={`${results.idealBF}%`}
                  sub="Target body fat"
                  color="#FFB800"
                  icon="🎯"
                  tip={`Ideal body fat: Males 10–20%, Females 20–30%. Your target is ${results.idealBF}% for optimal health.`}
                  ocid="bmi.ideal_bf_card"
                  scalePercent={clampPercent(results.idealBF, 5, 50)}
                />
              </div>
            </div>

            {/* D. Metabolism */}
            <div
              className="glass-card rounded-2xl p-5"
              data-ocid="bmi.metabolism_card"
            >
              <div className="flex items-center gap-2 mb-4">
                <h3
                  className="text-base font-black uppercase tracking-wide"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    color: "#00AAFF",
                  }}
                >
                  Metabolism
                </h3>
                <InfoTooltip text="BMR is calories burned at complete rest (Mifflin-St Jeor). TDEE adds your activity factor. Eat at TDEE to maintain weight." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    label: "Basal Metabolic Rate",
                    value: `${results.bmr}`,
                    unit: "kcal/day",
                    color: "#00AAFF",
                    tip: "BMR (Mifflin-St Jeor): calories burned at complete rest. Male: 10W + 6.25H − 5A + 5. Female: same − 166.",
                    ocid: "bmi.bmr_card",
                  },
                  {
                    label: "Total Daily Energy",
                    value: `${results.tdee}`,
                    unit: "kcal/day",
                    color: "#39FF14",
                    tip: `TDEE = BMR × ${ACTIVITY_MULTIPLIERS[results.activityLevel]} (${ACTIVITY_LABELS[results.activityLevel]}). Your estimated total daily calorie burn including activities.`,
                    ocid: "bmi.tdee_card",
                  },
                  {
                    label: "Maintenance Cals",
                    value: `${results.tdee}`,
                    unit: "kcal/day",
                    color: "#FFB800",
                    tip: "Eat at TDEE to maintain weight. Eat 300–500 kcal less to lose fat gradually. Add 250–500 kcal to gain muscle.",
                    ocid: "bmi.maintenance_card",
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="glass-card rounded-xl p-4"
                    data-ocid={card.ocid}
                    style={{ borderColor: `${card.color}33` }}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {card.label}
                      </span>
                      <InfoTooltip text={card.tip} />
                    </div>
                    <div
                      className="text-3xl font-black"
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        color: card.color,
                      }}
                    >
                      {card.value}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {card.unit}
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${clampPercent(Number(card.value), 1000, 4000)}%`,
                          background: card.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* E. Weight Goals */}
            <div
              className="glass-card rounded-2xl p-5"
              data-ocid="bmi.weight_goal_card"
            >
              <div className="flex items-center gap-2 mb-4">
                <h3
                  className="text-base font-black uppercase tracking-wide"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    color: "#FFB800",
                  }}
                >
                  Weight Goals
                </h3>
                <InfoTooltip text="Hamwi Ideal Weight uses gender + height + wrist frame size. BMI Ideal Range = BMI 18.5–24.9 at your height. Obesity Degree = actual ÷ Hamwi × 100." />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: "Hamwi Ideal",
                    value: `${results.idealWeightHamwi} kg`,
                    sub: "Frame-adjusted",
                    color: "#39FF14",
                    tip: "Hamwi formula: Males: 48 + 2.7×(height_in - 60). Females: 45.5 + 2.2×(height_in - 60). Adjusted for wrist circumference (frame size).",
                  },
                  {
                    label: "BMI Ideal Range",
                    value: `${results.idealWeightMin}–${results.idealWeightMax}`,
                    sub: "kg",
                    color: "#00AAFF",
                    tip: "Weight range for BMI 18.5–24.9 at your height. The midpoint is your target weight.",
                  },
                  {
                    label: "Target Weight",
                    value: `${results.targetWeight} kg`,
                    sub: "BMI midpoint 21.7",
                    color: "#FFB800",
                    tip: "Midpoint of the healthy BMI range (21.7) at your height. A practical goal weight for optimal health.",
                  },
                  {
                    label: "Obesity Degree",
                    value: `${results.obesityDegree}%`,
                    sub: "vs Hamwi ideal",
                    color:
                      results.obesityDegree >= 120
                        ? "#FF4444"
                        : results.obesityDegree >= 110
                          ? "#FFB800"
                          : "#39FF14",
                    tip: "Obesity Degree = (Actual Weight ÷ Hamwi Ideal) × 100. 100% = exactly at ideal. 120%+ = obese range.",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center p-3 rounded-xl"
                    style={{
                      background: `${item.color}08`,
                      border: `1px solid ${item.color}25`,
                    }}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {item.label}
                      </div>
                      <InfoTooltip text={item.tip} />
                    </div>
                    <div
                      className="text-base font-black"
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        color: item.color,
                      }}
                    >
                      {item.value}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {item.sub}
                    </div>
                  </div>
                ))}
              </div>
              {/* Weight delta CTA */}
              {results.bmiCategory !== "Normal" && (
                <div
                  className="mt-4 p-3 rounded-xl text-center text-sm"
                  style={{
                    background: "rgba(0,170,255,0.06)",
                    border: "1px solid rgba(0,170,255,0.2)",
                  }}
                >
                  <span style={{ color: "#00AAFF" }} className="font-semibold">
                    {results.bmiCategory === "Underweight"
                      ? `Gain ${results.weightDelta} kg`
                      : `Lose ${results.weightDelta} kg`}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    to reach your target weight of {results.targetWeight} kg
                  </span>
                </div>
              )}
            </div>

            {/* F. Visceral Fat */}
            <div
              className="glass-card rounded-2xl p-5"
              data-ocid="bmi.visceral_card"
              style={{ borderColor: `${results.visceralColor}44` }}
            >
              <div className="flex items-center gap-2 mb-4">
                <h3
                  className="text-base font-black uppercase tracking-wide"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    color: results.visceralColor,
                  }}
                >
                  Visceral Fat Level
                </h3>
                <InfoTooltip text="Visceral fat surrounds internal organs. Estimated from BMI, age & WHR. Levels 1–9 are healthy; 10–14 moderate risk (consider diet changes); 15+ high risk for heart disease, diabetes, metabolic syndrome." />
              </div>
              <div className="flex items-center gap-5 mb-4">
                <div
                  className="text-6xl font-black"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    color: results.visceralColor,
                  }}
                >
                  {results.visceralLevel}
                </div>
                <div>
                  <span
                    className="px-4 py-1.5 rounded-full text-sm font-bold"
                    style={{
                      background: `${results.visceralColor}22`,
                      color: results.visceralColor,
                      border: `1px solid ${results.visceralColor}66`,
                    }}
                  >
                    {results.visceralCategory}
                  </span>
                  <div className="text-xs text-muted-foreground mt-2">
                    Scale: 1 (lowest) → 20 (highest)
                  </div>
                </div>
              </div>
              <div
                className="relative h-3 rounded-full overflow-hidden"
                style={{
                  background:
                    "linear-gradient(to right, #39FF14 0%, #39FF14 45%, #FFB800 45%, #FFB800 70%, #FF4444 70%, #FF4444 100%)",
                }}
              >
                <div
                  className="h-full w-1 rounded-full bg-background shadow"
                  style={{
                    marginLeft: `calc(${((results.visceralLevel - 1) / 19) * 100}% - 2px)`,
                    transition: "margin 0.7s ease",
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>1 Low</span>
                <span>9</span>
                <span>10 Moderate</span>
                <span>14</span>
                <span>15+ High</span>
              </div>
            </div>

            {/* G. WHR */}
            {results.whr !== null && (
              <div
                className="glass-card rounded-2xl p-5"
                data-ocid="bmi.whr_card"
                style={{ borderColor: `${results.whrColor}44` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <h3
                    className="text-base font-black uppercase tracking-wide"
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      color: results.whrColor,
                    }}
                  >
                    Waist-Hip Ratio
                  </h3>
                  <InfoTooltip text="WHR = Waist ÷ Hip circumference. Predicts cardiovascular risk better than BMI. Men: <0.9 healthy, 0.9–1.0 moderate, >1.0 high risk. Women: <0.8 healthy, 0.8–0.85 moderate, >0.85 high risk." />
                </div>
                <div className="flex items-center gap-6 mb-3">
                  <div
                    className="text-5xl font-black"
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      color: results.whrColor,
                    }}
                  >
                    {results.whr}
                  </div>
                  <div>
                    <span
                      className="px-4 py-1.5 rounded-full text-sm font-bold"
                      style={{
                        background: `${results.whrColor}22`,
                        color: results.whrColor,
                        border: `1px solid ${results.whrColor}66`,
                      }}
                    >
                      {results.whrCategory}
                    </span>
                    <div className="text-xs text-muted-foreground mt-2">
                      Healthy: {results.gender === "male" ? "<0.90" : "<0.80"}
                    </div>
                  </div>
                </div>
                <div
                  className="relative h-3 rounded-full overflow-hidden"
                  style={{
                    background:
                      results.gender === "male"
                        ? "linear-gradient(to right, #39FF14 0%, #39FF14 64%, #FFB800 64%, #FFB800 79%, #FF4444 79%, #FF4444 100%)"
                        : "linear-gradient(to right, #39FF14 0%, #39FF14 57%, #FFB800 57%, #FFB800 68%, #FF4444 68%, #FF4444 100%)",
                  }}
                >
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-background shadow transition-all duration-700"
                    style={{
                      left: `${clampPercent(results.whr, 0.5, 1.4)}%`,
                      background: results.whrColor,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>0.5</span>
                  <span>
                    {results.gender === "male"
                      ? "Healthy <0.90"
                      : "Healthy <0.80"}
                  </span>
                  <span>1.4</span>
                </div>
              </div>
            )}

            {/* H. Fitness Score */}
            <div
              className="glass-card rounded-2xl p-6"
              data-ocid="bmi.fitness_score_card"
            >
              <div className="flex items-center gap-2 mb-4">
                <h3
                  className="text-base font-black uppercase tracking-wide"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    color: results.fitnessColor,
                  }}
                >
                  Composite Fitness Score
                </h3>
                <InfoTooltip text="0–100 score combining: BMI proximity to 22 (30pts), body fat proximity to ideal (35pts), muscle-to-weight ratio (35pts). Score ≥70 = excellent, 40–69 = room to improve, <40 = needs attention." />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <CircularScore
                  score={results.fitnessScore}
                  color={results.fitnessColor}
                />
                <div className="flex-1 space-y-3 w-full">
                  {[
                    {
                      label: "BMI Score",
                      value: Math.round(
                        Math.max(0, 30 - Math.abs(results.bmi - 22) * 3),
                      ),
                      max: 30,
                      color: results.bmiColor,
                    },
                    {
                      label: "Body Fat Score",
                      value: Math.round(
                        Math.max(
                          0,
                          35 -
                            Math.abs(results.bfPercent - results.idealBF) * 2,
                        ),
                      ),
                      max: 35,
                      color: results.bfColor,
                    },
                    {
                      label: "Muscle Score",
                      value: Math.round(
                        Math.min(35, (results.smm / results.weightKg) * 100),
                      ),
                      max: 35,
                      color: "#39FF14",
                    },
                  ].map((bar) => (
                    <div key={bar.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">
                          {bar.label}
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: bar.color }}
                        >
                          {bar.value} / {bar.max}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${(bar.value / bar.max) * 100}%`,
                            background: bar.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div
                    className="text-xs text-center pt-1"
                    style={{ color: results.fitnessColor }}
                  >
                    {results.fitnessScore >= 70
                      ? "🏆 Excellent fitness profile"
                      : results.fitnessScore >= 40
                        ? "⚠️ Room for improvement"
                        : "🔴 Needs attention — focus on diet and training"}
                  </div>
                </div>
              </div>
            </div>

            {/* I. Segmental Analysis */}
            <div
              className="glass-card rounded-2xl p-5"
              data-ocid="bmi.segmental_card"
            >
              <div className="flex items-center gap-2 mb-5">
                <h3
                  className="text-base font-black uppercase tracking-wide"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    color: "#00AAFF",
                  }}
                >
                  Segmental Analysis
                </h3>
                <InfoTooltip text="InBody-style segmental muscle status. Estimated from skeletal muscle ratio and body fat. UNDER = below optimal muscle for that segment. NORMAL = healthy balance. OVER = excess fat relative to muscle." />
              </div>
              {(() => {
                const segs = getSegStatus(results);
                const segBg = (key: string) =>
                  segs[key] === "NORMAL"
                    ? "rgba(57,255,20,0.1)"
                    : segs[key] === "UNDER"
                      ? "rgba(0,170,255,0.1)"
                      : "rgba(255,68,68,0.1)";
                const segBorder = (key: string) =>
                  segs[key] === "NORMAL"
                    ? "rgba(57,255,20,0.3)"
                    : segs[key] === "UNDER"
                      ? "rgba(0,170,255,0.3)"
                      : "rgba(255,68,68,0.3)";
                return (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-8 w-full justify-center">
                      {[
                        { key: "leftArm", label: "Left Arm", emoji: "💪" },
                        { key: "rightArm", label: "Right Arm", emoji: "💪" },
                      ].map(({ key, label, emoji }) => (
                        <div
                          key={key}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <div
                            className="w-14 h-20 rounded-xl flex items-center justify-center text-2xl"
                            style={{
                              background: segBg(key),
                              border: `1px solid ${segBorder(key)}`,
                            }}
                          >
                            {emoji}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {label}
                          </div>
                          <SegBadge
                            status={segs[key] as "UNDER" | "NORMAL" | "OVER"}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className="w-24 h-28 rounded-xl flex items-center justify-center text-3xl"
                        style={{
                          background: segBg("trunk"),
                          border: `1px solid ${segBorder("trunk")}`,
                        }}
                      >
                        🫀
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Trunk
                      </div>
                      <SegBadge
                        status={segs.trunk as "UNDER" | "NORMAL" | "OVER"}
                      />
                    </div>
                    <div className="flex gap-8 w-full justify-center">
                      {[
                        { key: "leftLeg", label: "Left Leg", emoji: "🦵" },
                        { key: "rightLeg", label: "Right Leg", emoji: "🦵" },
                      ].map(({ key, label, emoji }) => (
                        <div
                          key={key}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <div
                            className="w-14 h-24 rounded-xl flex items-center justify-center text-2xl"
                            style={{
                              background: segBg(key),
                              border: `1px solid ${segBorder(key)}`,
                            }}
                          >
                            {emoji}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {label}
                          </div>
                          <SegBadge
                            status={segs[key] as "UNDER" | "NORMAL" | "OVER"}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      {[
                        { color: "#00AAFF", label: "Under" },
                        { color: "#39FF14", label: "Normal" },
                        { color: "#FF4444", label: "Over" },
                      ].map(({ color, label }) => (
                        <span
                          key={label}
                          className="inline-flex items-center gap-1"
                        >
                          <span style={{ color }}>■</span>
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* J. Calorie Burn Table */}
            <div
              className="glass-card rounded-2xl p-5"
              data-ocid="bmi.calorie_table_card"
            >
              <div className="flex items-center gap-2 mb-4">
                <h3
                  className="text-base font-black uppercase tracking-wide"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    color: "#FFB800",
                  }}
                >
                  Calories Burned in 30 min
                </h3>
                <InfoTooltip text="Formula: MET × Weight(kg) × 0.5 hours = calories burned. MET (Metabolic Equivalent of Task) values from ACSM guidelines." />
              </div>
              <div className="space-y-2">
                {MET_ACTIVITIES.map((act, i) => {
                  const kcal = Math.round(act.met * results.weightKg * 0.5);
                  const barPct = Math.min(100, (kcal / 350) * 100);
                  const barColor =
                    kcal > 300 ? "#39FF14" : kcal > 200 ? "#FFB800" : "#00AAFF";
                  return (
                    <div
                      key={act.name}
                      data-ocid={`bmi.calorie_table.item.${i + 1}`}
                      className="flex items-center gap-3 py-1.5"
                    >
                      <span className="text-lg w-7 text-center flex-shrink-0">
                        {act.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-foreground truncate">
                            {act.name}
                          </span>
                          <span
                            className="text-sm font-bold ml-2 flex-shrink-0"
                            style={{ color: barColor }}
                          >
                            {kcal} kcal
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${barPct}%`,
                              background: barColor,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* K. Diet Plan CTA */}
            <div
              className="rounded-2xl p-6 text-center"
              data-ocid="bmi.diet_cta_card"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,170,255,0.12), rgba(57,255,20,0.08))",
                border: "1px solid rgba(0,170,255,0.3)",
              }}
            >
              <div className="text-3xl mb-2">🥗</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                Personalized Nutrition
              </div>
              <div
                className="text-xl font-black mb-3"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  color: results.bmiColor,
                }}
              >
                Your BMI: {results.bmiCategory} → Personalized Diet Plan
                Available
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Get a customized diet plan with high-protein foods,
                nutrient-dense meals, and calorie targets matching your{" "}
                {results.bmiCategory.toLowerCase()} goals. Target calories:{" "}
                <strong style={{ color: "#FFB800" }}>
                  {results.bmiCategory === "Normal"
                    ? results.tdee
                    : results.bmiCategory === "Underweight"
                      ? results.tdee + 400
                      : results.tdee - 500}{" "}
                  kcal/day
                </strong>
              </p>
              <Link
                to="/diet-plans"
                search={{ stream: dietStream } as Record<string, string>}
                data-ocid="bmi.diet_plans_link"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-black uppercase tracking-wider text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #39FF14, #00BB0A)",
                  color: "#0A0A0A",
                  boxShadow: "0 0 20px rgba(57,255,20,0.3)",
                }}
              >
                View Your {results.bmiCategory} Diet Plan →
              </Link>
            </div>

            {/* Reset Button */}
            <div className="text-center pb-4">
              <button
                type="button"
                onClick={handleReset}
                data-ocid="bmi.reset_button"
                className="px-8 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-[#00AAFF] transition-all duration-200 text-sm font-semibold uppercase tracking-wider"
              >
                Reset &amp; Calculate Again
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!results && (
          <div
            className="glass-card rounded-2xl p-8 text-center"
            data-ocid="bmi.empty_state"
          >
            <div className="text-5xl mb-3">📊</div>
            <h3
              className="font-black uppercase tracking-wide text-foreground mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Ready for Your Analysis?
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Fill in your measurements above and tap{" "}
              <strong style={{ color: "#00AAFF" }}>Analyze My Body</strong> to
              get your full InBody-style report.
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              {["15+ Metrics", "US Navy BF%", "Custom Diet Plan"].map(
                (item) => (
                  <div
                    key={item}
                    className="glass-card rounded-lg p-2 text-center"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
