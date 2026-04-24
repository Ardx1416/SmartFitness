import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Stream = "underweight" | "normal" | "overweight" | "obese";
type DietType = "veg" | "nonveg";
type SugarTab = "natural" | "complex";
type SupplementTab = "pre" | "post" | "general";

interface Supplement {
  name: string;
  emoji: string;
  category: SupplementTab;
  dosage: string;
  bestTime: string;
  benefits: string[];
  safetyNote: string;
}

interface MealEntry {
  time: string;
  timing: string;
  foods: string[];
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface StreamPlan {
  id: Stream;
  label: string;
  bmiRange: string;
  goalBadge: string;
  calorieRange: string;
  macrosGrams: { protein: number; carbs: number; fat: number };
  macrosPct: { protein: number; carbs: number; fat: number };
  color: string;
  note?: string;
  veg: MealEntry[];
  nonveg: MealEntry[];
}

interface ProteinFood {
  name: string;
  emoji: string;
  protein: string;
  kcal: number;
  serving: string;
  tip: string;
}

interface Superfood {
  name: string;
  emoji: string;
  nutrients: string[];
  benefit: string;
  bestTime: string;
}

interface GoodCarb {
  name: string;
  gi: string;
  giLevel: "low" | "medium" | "high";
  bestTime: string;
  benefit: string;
}

// ─── Diet Stream Data ─────────────────────────────────────────────────────────

const STREAMS: StreamPlan[] = [
  {
    id: "underweight",
    label: "Underweight",
    bmiRange: "BMI < 18.5",
    goalBadge: "Healthy Weight Gain & Muscle Building",
    calorieRange: "3000–3500 kcal/day",
    macrosGrams: { protein: 180, carbs: 400, fat: 100 },
    macrosPct: { protein: 28, carbs: 50, fat: 22 },
    color: "#39FF14",
    veg: [
      {
        time: "Breakfast",
        timing: "7:00 – 8:00 AM",
        foods: [
          "1 cup oats",
          "1 banana (sliced)",
          "1 cup whole milk",
          "1 tbsp honey",
          "10 almonds",
        ],
        kcal: 520,
        protein: 18,
        carbs: 82,
        fat: 12,
      },
      {
        time: "Pre-Workout Snack",
        timing: "10:00 – 11:00 AM",
        foods: [
          "6 dates (pitted)",
          "2 slices whole wheat toast",
          "2 tbsp peanut butter",
        ],
        kcal: 420,
        protein: 14,
        carbs: 62,
        fat: 14,
      },
      {
        time: "Lunch",
        timing: "1:00 – 2:00 PM",
        foods: [
          "1.5 cups brown rice",
          "1 cup dal (lentils)",
          "150g paneer curry",
          "Mixed salad (cucumber, tomato, onion)",
        ],
        kcal: 780,
        protein: 38,
        carbs: 95,
        fat: 22,
      },
      {
        time: "Post-Workout Snack",
        timing: "4:00 – 5:00 PM",
        foods: [
          "1 banana",
          "1 cup milk",
          "1 scoop pea/whey protein",
          "10 cashews",
        ],
        kcal: 420,
        protein: 32,
        carbs: 52,
        fat: 10,
      },
      {
        time: "Dinner",
        timing: "7:30 – 8:30 PM",
        foods: [
          "2 whole wheat rotis",
          "1 cup chickpea curry",
          "100g cottage cheese",
          "1 medium sweet potato (baked)",
        ],
        kcal: 680,
        protein: 32,
        carbs: 90,
        fat: 18,
      },
      {
        time: "Pre-Bed Snack",
        timing: "10:00 – 10:30 PM",
        foods: [
          "1 cup warm milk",
          "10 mixed nuts (almonds + walnuts)",
          "1 tsp honey",
        ],
        kcal: 280,
        protein: 10,
        carbs: 22,
        fat: 16,
      },
    ],
    nonveg: [
      {
        time: "Breakfast",
        timing: "7:00 – 8:00 AM",
        foods: [
          "3 whole eggs + 2 egg whites (scrambled)",
          "2 slices whole wheat toast",
          "½ avocado (sliced)",
          "1 glass orange juice",
        ],
        kcal: 580,
        protein: 36,
        carbs: 42,
        fat: 26,
      },
      {
        time: "Pre-Workout Snack",
        timing: "10:00 – 11:00 AM",
        foods: [
          "100g grilled chicken breast",
          "2 slices whole wheat bread",
          "Lettuce + mustard",
        ],
        kcal: 380,
        protein: 38,
        carbs: 32,
        fat: 8,
      },
      {
        time: "Lunch",
        timing: "1:00 – 2:00 PM",
        foods: [
          "1.5 cups brown rice",
          "200g grilled chicken breast",
          "1 cup mixed sautéed vegetables",
          "Small salad with olive oil",
        ],
        kcal: 780,
        protein: 58,
        carbs: 80,
        fat: 18,
      },
      {
        time: "Post-Workout Snack",
        timing: "4:00 – 5:00 PM",
        foods: ["1 scoop whey protein + 1 cup milk", "1 banana"],
        kcal: 380,
        protein: 38,
        carbs: 42,
        fat: 6,
      },
      {
        time: "Dinner",
        timing: "7:30 – 8:30 PM",
        foods: [
          "180g baked salmon OR grilled chicken",
          "1 large sweet potato",
          "1 cup steamed broccoli",
        ],
        kcal: 620,
        protein: 48,
        carbs: 55,
        fat: 18,
      },
      {
        time: "Pre-Bed Snack",
        timing: "10:00 – 10:30 PM",
        foods: ["200g Greek yogurt (full-fat)", "15 almonds"],
        kcal: 280,
        protein: 22,
        carbs: 16,
        fat: 14,
      },
    ],
  },
  {
    id: "normal",
    label: "Maintenance",
    bmiRange: "BMI 18.5–24.9",
    goalBadge: "Body Weight Maintenance — Stay Lean & Strong",
    calorieRange: "2000–2500 kcal/day",
    macrosGrams: { protein: 130, carbs: 280, fat: 70 },
    macrosPct: { protein: 28, carbs: 46, fat: 26 },
    color: "#00AAFF",
    veg: [
      {
        time: "Breakfast",
        timing: "7:00 – 8:00 AM",
        foods: [
          "200g Greek yogurt parfait",
          "30g granola",
          "½ cup mixed berries",
          "1 tsp honey",
        ],
        kcal: 380,
        protein: 20,
        carbs: 52,
        fat: 8,
      },
      {
        time: "Pre-Workout Snack",
        timing: "10:30 – 11:00 AM",
        foods: ["1 medium apple", "1.5 tbsp almond butter"],
        kcal: 220,
        protein: 5,
        carbs: 28,
        fat: 10,
      },
      {
        time: "Lunch",
        timing: "1:00 – 2:00 PM",
        foods: [
          "1 cup cooked quinoa",
          "100g paneer (grilled/cubed)",
          "1 cup mixed vegetables",
          "2 tbsp olive oil dressing",
        ],
        kcal: 560,
        protein: 30,
        carbs: 58,
        fat: 22,
      },
      {
        time: "Post-Workout Snack",
        timing: "4:30 – 5:00 PM",
        foods: [
          "1 banana",
          "1 cup spinach + almond milk smoothie",
          "1 scoop pea protein",
        ],
        kcal: 280,
        protein: 26,
        carbs: 34,
        fat: 4,
      },
      {
        time: "Dinner",
        timing: "7:30 – 8:00 PM",
        foods: [
          "1 cup brown rice",
          "1 cup mixed dal",
          "1 cup stir-fried vegetables (peppers, beans, zucchini)",
        ],
        kcal: 480,
        protein: 22,
        carbs: 72,
        fat: 10,
      },
      {
        time: "Pre-Bed Snack",
        timing: "9:30 – 10:00 PM",
        foods: [
          "1 cup warm turmeric milk (golden milk)",
          "A few walnuts (optional)",
        ],
        kcal: 160,
        protein: 6,
        carbs: 16,
        fat: 8,
      },
    ],
    nonveg: [
      {
        time: "Breakfast",
        timing: "7:00 – 8:00 AM",
        foods: [
          "3-egg omelette with bell peppers + spinach + onion",
          "2 slices whole grain toast",
          "Black coffee or green tea",
        ],
        kcal: 420,
        protein: 30,
        carbs: 30,
        fat: 16,
      },
      {
        time: "Pre-Workout Snack",
        timing: "10:30 – 11:00 AM",
        foods: ["1 banana", "1 boiled egg"],
        kcal: 180,
        protein: 10,
        carbs: 26,
        fat: 5,
      },
      {
        time: "Lunch",
        timing: "1:00 – 2:00 PM",
        foods: [
          "150g grilled chicken breast",
          "¾ cup cooked quinoa",
          "Large mixed salad with lemon vinaigrette",
        ],
        kcal: 520,
        protein: 48,
        carbs: 42,
        fat: 12,
      },
      {
        time: "Post-Workout Snack",
        timing: "4:30 – 5:00 PM",
        foods: ["1 scoop whey protein + water or low-fat milk"],
        kcal: 160,
        protein: 25,
        carbs: 8,
        fat: 2,
      },
      {
        time: "Dinner",
        timing: "7:30 – 8:00 PM",
        foods: [
          "180g baked white fish (cod/tilapia)",
          "1 cup steamed vegetables",
          "½ cup brown rice",
        ],
        kcal: 460,
        protein: 42,
        carbs: 42,
        fat: 10,
      },
      {
        time: "Pre-Bed Snack",
        timing: "9:30 – 10:00 PM",
        foods: ["150g cottage cheese (low-fat)"],
        kcal: 140,
        protein: 18,
        carbs: 6,
        fat: 4,
      },
    ],
  },
  {
    id: "overweight",
    label: "Overweight",
    bmiRange: "BMI 25–29.9",
    goalBadge: "Fat Loss — Preserve Muscle Mass",
    calorieRange: "1400–1700 kcal/day",
    macrosPct: { protein: 35, carbs: 35, fat: 30 },
    macrosGrams: { protein: 100, carbs: 160, fat: 45 },
    color: "#f59e0b",
    veg: [
      {
        time: "Breakfast",
        timing: "7:00 – 8:00 AM",
        foods: [
          "2 moong dal chilla (savory pancakes)",
          "Mint chutney (no sugar)",
          "1 cup green tea",
        ],
        kcal: 280,
        protein: 18,
        carbs: 30,
        fat: 8,
      },
      {
        time: "Pre-Workout Snack",
        timing: "10:30 – 11:00 AM",
        foods: ["1 cup green tea", "A handful of almonds (10–12)"],
        kcal: 100,
        protein: 4,
        carbs: 4,
        fat: 8,
      },
      {
        time: "Lunch",
        timing: "1:00 – 2:00 PM",
        foods: [
          "Large salad: chickpeas (½ cup), cucumber, tomatoes, red onion",
          "Lemon + olive oil dressing (1 tsp oil)",
          "1 cup moong dal soup",
        ],
        kcal: 380,
        protein: 22,
        carbs: 48,
        fat: 10,
      },
      {
        time: "Post-Workout Snack",
        timing: "4:30 – 5:00 PM",
        foods: ["1 scoop pea protein + water + ½ cup berries smoothie"],
        kcal: 160,
        protein: 24,
        carbs: 16,
        fat: 2,
      },
      {
        time: "Dinner",
        timing: "7:00 – 7:30 PM",
        foods: [
          "2 cups cauliflower rice (stir-fried with veggies)",
          "150g tofu (pan-seared)",
        ],
        kcal: 320,
        protein: 24,
        carbs: 22,
        fat: 14,
      },
      {
        time: "Pre-Bed Snack",
        timing: "9:30 – 10:00 PM",
        foods: ["1 cup chamomile tea", "5 walnuts"],
        kcal: 80,
        protein: 2,
        carbs: 2,
        fat: 8,
      },
    ],
    nonveg: [
      {
        time: "Breakfast",
        timing: "7:00 – 8:00 AM",
        foods: [
          "4 egg whites omelette (with spinach, tomato)",
          "Side salad (no dressing)",
          "1 cup green tea",
        ],
        kcal: 180,
        protein: 26,
        carbs: 8,
        fat: 4,
      },
      {
        time: "Pre-Workout Snack",
        timing: "10:30 – 11:00 AM",
        foods: ["1 cup black coffee (no sugar, no milk)"],
        kcal: 5,
        protein: 0,
        carbs: 1,
        fat: 0,
      },
      {
        time: "Lunch",
        timing: "1:00 – 2:00 PM",
        foods: [
          "150g grilled chicken breast (no oil)",
          "2 cups steamed vegetables",
          "Small salad with lemon juice",
        ],
        kcal: 380,
        protein: 46,
        carbs: 20,
        fat: 8,
      },
      {
        time: "Post-Workout Snack",
        timing: "4:30 – 5:00 PM",
        foods: ["1 scoop whey protein + water (no milk)"],
        kcal: 120,
        protein: 25,
        carbs: 4,
        fat: 1,
      },
      {
        time: "Dinner",
        timing: "7:00 – 7:30 PM",
        foods: [
          "150g baked fish (cod/tilapia)",
          "Large mixed salad (no high-fat dressing)",
        ],
        kcal: 300,
        protein: 38,
        carbs: 12,
        fat: 10,
      },
      {
        time: "Pre-Bed Snack",
        timing: "9:30 – 10:00 PM",
        foods: ["100g low-fat cottage cheese"],
        kcal: 100,
        protein: 14,
        carbs: 4,
        fat: 2,
      },
    ],
  },
  {
    id: "obese",
    label: "Obese",
    bmiRange: "BMI 30+",
    goalBadge: "Significant Fat Loss & Metabolic Health",
    calorieRange: "1200–1400 kcal/day",
    macrosPct: { protein: 36, carbs: 38, fat: 26 },
    macrosGrams: { protein: 80, carbs: 130, fat: 30 },
    color: "#ef4444",
    note: "⚠️ Consult a healthcare provider or registered dietitian before starting this plan.",
    veg: [
      {
        time: "Breakfast",
        timing: "7:00 – 8:00 AM",
        foods: [
          "1 cup vegetable upma (semolina with veggies)",
          "1 cup green tea (no sugar)",
        ],
        kcal: 240,
        protein: 8,
        carbs: 38,
        fat: 6,
      },
      {
        time: "Pre-Workout Snack",
        timing: "10:00 – 10:30 AM",
        foods: ["1 medium fruit (apple, pear, or orange)"],
        kcal: 70,
        protein: 0,
        carbs: 18,
        fat: 0,
      },
      {
        time: "Lunch",
        timing: "1:00 – 1:30 PM",
        foods: [
          "1 cup vegetable soup (clear)",
          "½ cup small dal",
          "Large green salad (no dressing or lemon only)",
        ],
        kcal: 280,
        protein: 14,
        carbs: 36,
        fat: 6,
      },
      {
        time: "Post-Workout Snack",
        timing: "4:00 – 4:30 PM",
        foods: ["1 scoop pea protein + water (no added sugars)"],
        kcal: 120,
        protein: 22,
        carbs: 6,
        fat: 1,
      },
      {
        time: "Dinner",
        timing: "7:00 – 7:30 PM",
        foods: [
          "1.5 cups steamed vegetables (broccoli, beans, carrots)",
          "100g tofu (steamed or lightly grilled)",
          "¼ cup brown rice",
        ],
        kcal: 280,
        protein: 18,
        carbs: 28,
        fat: 8,
      },
      {
        time: "Pre-Bed Snack",
        timing: "9:00 – 9:30 PM",
        foods: ["1 cup chamomile or mint tea (no sugar)"],
        kcal: 5,
        protein: 0,
        carbs: 1,
        fat: 0,
      },
    ],
    nonveg: [
      {
        time: "Breakfast",
        timing: "7:00 – 8:00 AM",
        foods: [
          "4 egg whites (boiled or scrambled dry)",
          "Mixed vegetable salad (cucumber, tomato, onion)",
          "1 cup green tea",
        ],
        kcal: 160,
        protein: 22,
        carbs: 8,
        fat: 3,
      },
      {
        time: "Pre-Workout Snack",
        timing: "10:00 – 10:30 AM",
        foods: ["1 cup green tea (no sugar or milk)"],
        kcal: 5,
        protein: 0,
        carbs: 1,
        fat: 0,
      },
      {
        time: "Lunch",
        timing: "1:00 – 1:30 PM",
        foods: [
          "120g grilled chicken breast (no oil)",
          "Large salad (2 cups greens, cucumber, tomato)",
          "1 glass lemon water",
        ],
        kcal: 280,
        protein: 36,
        carbs: 12,
        fat: 6,
      },
      {
        time: "Post-Workout Snack",
        timing: "4:00 – 4:30 PM",
        foods: ["1 scoop whey protein + plain water (no milk, no fruit)"],
        kcal: 120,
        protein: 25,
        carbs: 3,
        fat: 1,
      },
      {
        time: "Dinner",
        timing: "7:00 – 7:30 PM",
        foods: [
          "120g steamed fish (cod/tilapia/pomfret)",
          "2 cups mixed vegetables (steamed)",
        ],
        kcal: 280,
        protein: 34,
        carbs: 14,
        fat: 8,
      },
      {
        time: "Pre-Bed Snack",
        timing: "9:00 – 9:30 PM",
        foods: ["1 cup warm water with fresh lemon juice"],
        kcal: 5,
        protein: 0,
        carbs: 1,
        fat: 0,
      },
    ],
  },
];

// ─── High Protein Foods ───────────────────────────────────────────────────────

const VEG_PROTEIN: ProteinFood[] = [
  {
    name: "Paneer",
    emoji: "🧀",
    protein: "18g/100g",
    kcal: 265,
    serving: "100g cubed in curry or salad",
    tip: "Best Indian veg protein source",
  },
  {
    name: "Tofu",
    emoji: "⬜",
    protein: "17g/100g",
    kcal: 144,
    serving: "150g stir-fried or baked",
    tip: "Marinate overnight for best flavor",
  },
  {
    name: "Greek Yogurt",
    emoji: "🫙",
    protein: "17g/100g",
    kcal: 97,
    serving: "200g with berries or as dip",
    tip: "Excellent casein source — ideal pre-bed",
  },
  {
    name: "Lentils (Dal)",
    emoji: "🍲",
    protein: "9g/100g cooked",
    kcal: 116,
    serving: "1 cup in dal or soup",
    tip: "Daily dal is India's best protein habit",
  },
  {
    name: "Chickpeas",
    emoji: "🫘",
    protein: "9g/100g",
    kcal: 164,
    serving: "1 cup roasted or in curry",
    tip: "High fiber + protein — great for fat loss",
  },
  {
    name: "Quinoa",
    emoji: "🌾",
    protein: "4g/100g",
    kcal: 120,
    serving: "1 cup cooked, replace rice",
    tip: "Complete protein — all 9 essential amino acids",
  },
  {
    name: "Edamame",
    emoji: "🫛",
    protein: "11g/100g",
    kcal: 121,
    serving: "1 cup steamed with sea salt",
    tip: "Best plant snack before a workout",
  },
  {
    name: "Hemp Seeds",
    emoji: "🌱",
    protein: "32g/100g",
    kcal: 553,
    serving: "3 tbsp in smoothie or salad",
    tip: "Highest plant protein density per 100g",
  },
  {
    name: "Tempeh",
    emoji: "🟫",
    protein: "19g/100g",
    kcal: 193,
    serving: "100g sliced and pan-seared",
    tip: "Fermented — better digestion than tofu",
  },
  {
    name: "Cottage Cheese",
    emoji: "🍶",
    protein: "11g/100g",
    kcal: 98,
    serving: "200g as pre-bed snack",
    tip: "Slow-digesting casein — builds muscle overnight",
  },
];

const NONVEG_PROTEIN: ProteinFood[] = [
  {
    name: "Chicken Breast",
    emoji: "🍗",
    protein: "31g/100g",
    kcal: 165,
    serving: "150g grilled or baked",
    tip: "King of lean protein — grill, bake, or poach",
  },
  {
    name: "Eggs",
    emoji: "🥚",
    protein: "13g/100g",
    kcal: 155,
    serving: "3 whole eggs daily",
    tip: "Whole eggs = best bioavailability of all foods",
  },
  {
    name: "Tuna",
    emoji: "🐟",
    protein: "30g/100g",
    kcal: 132,
    serving: "150g canned in water or fresh",
    tip: "Perfect quick meal — high protein, low fat",
  },
  {
    name: "Salmon",
    emoji: "🐠",
    protein: "20g/100g",
    kcal: 208,
    serving: "150g baked twice a week",
    tip: "Rich in omega-3 — essential for recovery",
  },
  {
    name: "Turkey",
    emoji: "🦃",
    protein: "29g/100g",
    kcal: 189,
    serving: "150g roasted or minced",
    tip: "Leaner than beef — high in B vitamins",
  },
  {
    name: "Whey Protein",
    emoji: "💪",
    protein: "80g/100g",
    kcal: 400,
    serving: "30g scoop post-workout",
    tip: "Fastest-absorbing protein — use within 30 min of workout",
  },
  {
    name: "Cottage Cheese",
    emoji: "🫙",
    protein: "11g/100g",
    kcal: 98,
    serving: "200g as evening snack",
    tip: "Casein protein — slow release all night",
  },
  {
    name: "Shrimp",
    emoji: "🦐",
    protein: "24g/100g",
    kcal: 99,
    serving: "150g stir-fried or grilled",
    tip: "Very low calorie, very high protein — ideal cutting food",
  },
  {
    name: "Sardines",
    emoji: "🐟",
    protein: "25g/100g",
    kcal: 208,
    serving: "1 can in salad or toast",
    tip: "Cheapest omega-3 + protein combo available",
  },
  {
    name: "Lean Beef",
    emoji: "🥩",
    protein: "26g/100g",
    kcal: 215,
    serving: "150g grilled sirloin/mince",
    tip: "High in creatine, zinc, and iron — once a week",
  },
];

// ─── Superfoods ───────────────────────────────────────────────────────────────

const SUPERFOODS: Superfood[] = [
  {
    name: "Spinach",
    emoji: "🥬",
    nutrients: ["Iron", "Vitamin K", "Folate", "Magnesium"],
    benefit: "Boosts red blood cell production and blood health",
    bestTime: "Morning smoothie or lunch salad",
  },
  {
    name: "Kale",
    emoji: "🌿",
    nutrients: ["Vitamins A/C/K", "Calcium", "Antioxidants"],
    benefit: "Potent anti-inflammatory, supports bone density",
    bestTime: "Lunch salad",
  },
  {
    name: "Avocado",
    emoji: "🥑",
    nutrients: ["Healthy Fats", "Potassium", "B Vitamins", "Vitamin E"],
    benefit: "Heart health, hormone production, lasting satiety",
    bestTime: "Breakfast or lunch",
  },
  {
    name: "Blueberries",
    emoji: "🫐",
    nutrients: ["Anthocyanins", "Vitamin C", "Manganese"],
    benefit: "Brain health, reduces oxidative stress post-workout",
    bestTime: "Morning or post-workout",
  },
  {
    name: "Sweet Potato",
    emoji: "🍠",
    nutrients: ["Beta-carotene", "Potassium", "Fiber", "Vitamin B6"],
    benefit: "Sustained energy, immunity boost, gut health",
    bestTime: "Pre-workout meal",
  },
  {
    name: "Broccoli",
    emoji: "🥦",
    nutrients: ["Vitamin C", "Vitamin K", "Fiber", "Sulforaphane"],
    benefit: "Anti-cancer, detox support, testosterone balance",
    bestTime: "Lunch or dinner",
  },
  {
    name: "Almonds",
    emoji: "🌰",
    nutrients: ["Vitamin E", "Magnesium", "Healthy Fats", "Fiber"],
    benefit: "Reduces LDL cholesterol, supports bone & heart health",
    bestTime: "Mid-morning snack",
  },
  {
    name: "Chia Seeds",
    emoji: "🌱",
    nutrients: ["Omega-3", "Fiber", "Calcium", "Protein"],
    benefit: "Gut health, joint lubrication, blood sugar stability",
    bestTime: "Breakfast (soaked overnight)",
  },
];

// ─── Supplements ─────────────────────────────────────────────────────────────

const PRE_WORKOUT_SUPPLEMENTS: Supplement[] = [
  {
    name: "Creatine Monohydrate",
    emoji: "⚡",
    category: "pre",
    dosage: "3–5g daily",
    bestTime: "Any time (pre or post-workout)",
    benefits: [
      "Increases strength & power output",
      "Improves explosive performance",
      "Enhances muscle recovery",
      "Most researched supplement in sports science",
    ],
    safetyNote:
      "Well-studied safety profile. Stay hydrated — drink extra water.",
  },
  {
    name: "Caffeine",
    emoji: "☕",
    category: "pre",
    dosage: "150–300mg",
    bestTime: "30–60 min before workout",
    benefits: [
      "Boosts energy & mental focus",
      "Improves endurance capacity",
      "Reduces perceived exertion",
      "Enhances fat oxidation during exercise",
    ],
    safetyNote:
      "Avoid after 2 PM to prevent sleep disruption. Cycle off periodically.",
  },
  {
    name: "Beta-Alanine",
    emoji: "🔥",
    category: "pre",
    dosage: "2–5g",
    bestTime: "30 min before workout",
    benefits: [
      "Reduces muscle fatigue during sets",
      "Improves high-intensity performance",
      "Increases muscle endurance",
      "Buffers lactic acid buildup",
    ],
    safetyNote:
      "May cause harmless skin tingling (paresthesia) — completely normal and temporary.",
  },
  {
    name: "Pre-Workout Blend",
    emoji: "💥",
    category: "pre",
    dosage: "1 scoop",
    bestTime: "20–30 min before workout",
    benefits: [
      "Energy + pump + focus all-in-one",
      "Enhances workout intensity",
      "Improves blood flow & muscle pump",
      "Convenient multi-ingredient formula",
    ],
    safetyNote:
      "Check stimulant content before use. Cycle off every 8 weeks to avoid tolerance.",
  },
];

const POST_WORKOUT_SUPPLEMENTS: Supplement[] = [
  {
    name: "Whey Protein",
    emoji: "🥛",
    category: "post",
    dosage: "25–50g",
    bestTime: "Within 30 min after workout",
    benefits: [
      "Rapid muscle protein synthesis",
      "Supports muscle repair & growth",
      "Complete amino acid profile",
      "Fast-absorbing for quick recovery",
    ],
    safetyNote:
      "Choose low-sugar options. Can be replaced by whole food protein sources.",
  },
  {
    name: "BCAAs",
    emoji: "🧬",
    category: "post",
    dosage: "5–10g",
    bestTime: "During or after workout",
    benefits: [
      "Reduces delayed muscle soreness",
      "Prevents muscle breakdown (catabolism)",
      "Supports faster recovery",
      "Leucine triggers muscle protein synthesis",
    ],
    safetyNote:
      "Generally safe. Redundant if your protein intake is already sufficient (1.6g+/kg).",
  },
  {
    name: "L-Glutamine",
    emoji: "🛡️",
    category: "post",
    dosage: "5g",
    bestTime: "Post-workout or before bed",
    benefits: [
      "Supports gut health & immunity",
      "Reduces muscle soreness",
      "Accelerates recovery between sessions",
      "Helps maintain muscle during calorie deficit",
    ],
    safetyNote:
      "Well-tolerated at recommended doses. Most effective during high-volume training.",
  },
  {
    name: "Fast Carbs (Dextrose)",
    emoji: "🍇",
    category: "post",
    dosage: "30–60g",
    bestTime: "Immediately post-workout",
    benefits: [
      "Rapidly replenishes glycogen stores",
      "Spikes insulin for nutrient uptake",
      "Accelerates overall recovery",
      "Pairs well with whey protein",
    ],
    safetyNote:
      "Only beneficial post-workout. Avoid at other times to prevent fat gain.",
  },
];

const GENERAL_SUPPLEMENTS: Supplement[] = [
  {
    name: "Omega-3 Fish Oil",
    emoji: "🐟",
    category: "general",
    dosage: "2–3g EPA+DHA",
    bestTime: "With meals",
    benefits: [
      "Reduces systemic inflammation",
      "Supports joint health & mobility",
      "Improves heart health",
      "Enhances mood & cognitive function",
    ],
    safetyNote:
      "Choose molecularly distilled brands to avoid mercury. Refrigerate after opening.",
  },
  {
    name: "Vitamin D3 + K2",
    emoji: "☀️",
    category: "general",
    dosage: "2000–5000 IU D3 + 100mcg K2",
    bestTime: "With a fatty meal",
    benefits: [
      "Supports testosterone production",
      "Strengthens bone density",
      "Boosts immune function",
      "Improves muscle function & mood",
    ],
    safetyNote:
      "Get bloodwork done to optimize your personal dose. K2 prevents calcium from depositing in arteries.",
  },
  {
    name: "Magnesium Glycinate",
    emoji: "🌙",
    category: "general",
    dosage: "300–400mg",
    bestTime: "Before bed",
    benefits: [
      "Improves sleep quality & duration",
      "Reduces muscle cramps & spasms",
      "Relieves stress & anxiety",
      "Essential for energy production",
    ],
    safetyNote:
      "Avoid magnesium oxide — poor absorption. Glycinate or malate forms are best tolerated.",
  },
  {
    name: "Zinc",
    emoji: "⚙️",
    category: "general",
    dosage: "15–30mg elemental zinc",
    bestTime: "With meals or before bed",
    benefits: [
      "Supports testosterone levels",
      "Strengthens immune health",
      "Essential for protein synthesis",
      "Promotes wound healing",
    ],
    safetyNote: "Don't exceed 40mg/day. Always take with food to avoid nausea.",
  },
  {
    name: "Multivitamin",
    emoji: "💊",
    category: "general",
    dosage: "1 serving daily",
    bestTime: "With breakfast",
    benefits: [
      "Fills nutritional gaps in the diet",
      "Supports overall health & vitality",
      "Improves energy metabolism",
      "Comprehensive micronutrient coverage",
    ],
    safetyNote:
      "Look for whole-food based options. Not a substitute for a balanced diet.",
  },
];

// ─── Good Sugars / Carbs ──────────────────────────────────────────────────────

const NATURAL_SUGARS: GoodCarb[] = [
  {
    name: "Banana",
    gi: "51",
    giLevel: "low",
    bestTime: "Pre-workout",
    benefit: "Quick energy boost + potassium to prevent muscle cramps",
  },
  {
    name: "Dates",
    gi: "42",
    giLevel: "low",
    bestTime: "Pre-workout",
    benefit: "Iron-rich, dense natural energy, fiber-filled",
  },
  {
    name: "Honey",
    gi: "58",
    giLevel: "medium",
    bestTime: "Pre-workout in small amounts",
    benefit: "Antibacterial, antimicrobial — use in moderation",
  },
  {
    name: "Berries / Blueberries",
    gi: "25",
    giLevel: "low",
    bestTime: "Morning or post-workout",
    benefit: "Highest antioxidant density, very low calorie",
  },
  {
    name: "Mango",
    gi: "51",
    giLevel: "low",
    bestTime: "Post-workout",
    benefit: "Vitamin C, digestive enzymes, natural energy",
  },
  {
    name: "Coconut Sugar",
    gi: "35",
    giLevel: "low",
    bestTime: "In moderation",
    benefit: "Contains inulin fiber, lower GI than table sugar",
  },
];

const COMPLEX_CARBS: GoodCarb[] = [
  {
    name: "Brown Rice",
    gi: "55",
    giLevel: "medium",
    bestTime: "Lunch or pre-workout",
    benefit: "Sustained energy release, fiber, B vitamins",
  },
  {
    name: "Oats",
    gi: "40",
    giLevel: "low",
    bestTime: "Breakfast",
    benefit: "Beta-glucan fiber reduces cholesterol, steady energy all morning",
  },
  {
    name: "Quinoa",
    gi: "53",
    giLevel: "low",
    bestTime: "Any meal",
    benefit: "Complete protein + carb combo — unique in the plant world",
  },
  {
    name: "Sweet Potato",
    gi: "44",
    giLevel: "low",
    bestTime: "Pre-workout",
    benefit:
      "Beta-carotene, potassium, longer energy release than white potato",
  },
  {
    name: "Whole Wheat",
    gi: "49",
    giLevel: "low",
    bestTime: "All meals",
    benefit: "Fiber, minerals, slower digestion = fewer cravings",
  },
  {
    name: "Lentils",
    gi: "25",
    giLevel: "low",
    bestTime: "Lunch or dinner",
    benefit: "Protein + carb combo — lowest GI grain food available",
  },
];

// ─── Sub-Components ───────────────────────────────────────────────────────────

function MacroPill({
  label,
  value,
  color,
}: { label: string; value: number; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
      style={{
        backgroundColor: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {label} {value}%
    </span>
  );
}

function MacroBar({
  protein,
  carbs,
  fat,
}: { protein: number; carbs: number; fat: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex rounded-full overflow-hidden h-2.5 gap-0.5">
        <div
          className="bg-[#00AAFF] transition-all duration-700 rounded-l-full"
          style={{ width: `${protein}%` }}
        />
        <div
          className="bg-violet-400 transition-all duration-700"
          style={{ width: `${carbs}%` }}
        />
        <div
          className="bg-amber-400 transition-all duration-700 rounded-r-full"
          style={{ width: `${fat}%` }}
        />
      </div>
      <div className="flex gap-3 flex-wrap">
        <MacroPill label="Protein" value={protein} color="#00AAFF" />
        <MacroPill label="Carbs" value={carbs} color="#a78bfa" />
        <MacroPill label="Fat" value={fat} color="#f59e0b" />
      </div>
    </div>
  );
}

function MealCard({ meal, index }: { meal: MealEntry; index: number }) {
  return (
    <motion.div
      data-ocid={`diet.meal.${index + 1}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="glass-card rounded-xl p-4"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: "#00AAFF" }}
            >
              {meal.time}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {meal.timing}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right" style={{ minWidth: 56 }}>
          <div
            className="text-lg font-black"
            style={{
              color: "#39FF14",
              fontFamily: "'Barlow Condensed', sans-serif",
            }}
          >
            {meal.kcal}
          </div>
          <div className="text-[10px] text-muted-foreground">kcal</div>
        </div>
      </div>
      <ul className="space-y-1 mb-3">
        {meal.foods.map((food) => (
          <li
            key={food}
            className="flex items-start gap-1.5 text-xs text-foreground/80"
          >
            <span className="mt-1 w-1 h-1 rounded-full bg-[#00AAFF] flex-shrink-0" />
            {food}
          </li>
        ))}
      </ul>
      <div className="flex gap-2 flex-wrap">
        <span
          className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
          style={{ backgroundColor: "#00AAFF22", color: "#00AAFF" }}
        >
          P {meal.protein}g
        </span>
        <span
          className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
          style={{ backgroundColor: "#a78bfa22", color: "#a78bfa" }}
        >
          C {meal.carbs}g
        </span>
        <span
          className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
          style={{ backgroundColor: "#f59e0b22", color: "#f59e0b" }}
        >
          F {meal.fat}g
        </span>
      </div>
    </motion.div>
  );
}

function ProteinFoodCard({
  food,
  index,
}: { food: ProteinFood; index: number }) {
  return (
    <motion.div
      data-ocid={`protein.card.${index + 1}`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: (index % 5) * 0.07 }}
      className="glass-card rounded-xl p-4 flex flex-col gap-2"
    >
      <div className="flex items-start gap-2">
        <span className="text-xl flex-shrink-0">{food.emoji}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-foreground leading-tight">
            {food.name}
          </h4>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {food.serving}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-black"
            style={{
              backgroundColor: "#00AAFF22",
              color: "#00AAFF",
              border: "1px solid #00AAFF44",
            }}
          >
            {food.protein}
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{
              backgroundColor: "#f59e0b22",
              color: "#f59e0b",
              border: "1px solid #f59e0b44",
            }}
          >
            {food.kcal} kcal
          </span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {food.tip}
      </p>
    </motion.div>
  );
}

function SuperfoodCard({ food, index }: { food: Superfood; index: number }) {
  return (
    <motion.div
      data-ocid={`superfood.card.${index + 1}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: (index % 5) * 0.07 }}
      className="glass-card rounded-xl p-4 flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{food.emoji}</span>
        <h4
          className="font-black text-base uppercase tracking-wide"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            background: "linear-gradient(90deg, #00AAFF, #39FF14)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {food.name}
        </h4>
      </div>
      <div className="flex flex-wrap gap-1">
        {food.nutrients.map((n) => (
          <span
            key={n}
            className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide"
            style={{
              backgroundColor: "#39FF1418",
              color: "#39FF14",
              border: "1px solid #39FF1430",
            }}
          >
            {n}
          </span>
        ))}
      </div>
      <p className="text-xs text-foreground/80 leading-relaxed">
        {food.benefit}
      </p>
      <div className="flex items-center gap-1.5 mt-auto">
        <span className="text-[10px] text-muted-foreground">Best time:</span>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{
            backgroundColor: "#00AAFF18",
            color: "#00AAFF",
            border: "1px solid #00AAFF30",
          }}
        >
          {food.bestTime}
        </span>
      </div>
    </motion.div>
  );
}

function GoodCarbCard({ item, index }: { item: GoodCarb; index: number }) {
  const giColor =
    item.giLevel === "low"
      ? "#39FF14"
      : item.giLevel === "medium"
        ? "#f59e0b"
        : "#ef4444";
  const giBg =
    item.giLevel === "low"
      ? "#39FF1418"
      : item.giLevel === "medium"
        ? "#f59e0b18"
        : "#ef444418";
  return (
    <motion.div
      data-ocid={`carb.card.${index + 1}`}
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: (index % 4) * 0.06 }}
      className="glass-card rounded-xl p-4 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-bold text-sm text-foreground">{item.name}</h4>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex-shrink-0"
          style={{
            backgroundColor: giBg,
            color: giColor,
            border: `1px solid ${giColor}44`,
          }}
        >
          GI {item.gi} · {item.giLevel}
        </span>
      </div>
      <p className="text-xs text-foreground/80 leading-relaxed">
        {item.benefit}
      </p>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="text-[10px] text-muted-foreground">Best time:</span>
        <span className="text-[10px] font-medium text-foreground/70">
          {item.bestTime}
        </span>
      </div>
    </motion.div>
  );
}

function SupplementCard({
  supplement,
  index,
}: {
  supplement: Supplement;
  index: number;
}) {
  const categoryColor =
    supplement.category === "pre"
      ? "#f59e0b"
      : supplement.category === "post"
        ? "#00AAFF"
        : "#39FF14";
  const categoryLabel =
    supplement.category === "pre"
      ? "Pre-Workout"
      : supplement.category === "post"
        ? "Post-Workout"
        : "General & Daily";

  return (
    <motion.div
      data-ocid={`supplement.card.${index + 1}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: (index % 4) * 0.08 }}
      className="glass-card rounded-xl p-5 flex flex-col gap-3"
    >
      {/* Emoji + Name + Badge */}
      <div className="flex items-start gap-3">
        <span className="text-3xl flex-shrink-0 leading-none mt-0.5">
          {supplement.emoji}
        </span>
        <div className="flex-1 min-w-0">
          <h4
            className="font-black text-sm uppercase tracking-wide leading-tight"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}bb)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {supplement.name}
          </h4>
          <span
            className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide"
            style={{
              backgroundColor: `${categoryColor}20`,
              color: categoryColor,
              border: `1px solid ${categoryColor}40`,
            }}
          >
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Dosage + Best Time pills */}
      <div className="flex flex-wrap gap-2">
        <span
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold"
          style={{
            backgroundColor: `${categoryColor}15`,
            color: categoryColor,
            border: `1px solid ${categoryColor}30`,
          }}
        >
          💊 {supplement.dosage}
        </span>
        <span
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold"
          style={{
            backgroundColor: "oklch(0.15 0.02 260)",
            color: "oklch(0.65 0.04 260)",
            border: "1px solid oklch(0.22 0.02 260)",
          }}
        >
          🕐 {supplement.bestTime}
        </span>
      </div>

      {/* Benefits */}
      <ul className="space-y-1.5">
        {supplement.benefits.map((b) => (
          <li
            key={b}
            className="flex items-start gap-2 text-xs text-foreground/85"
          >
            <span
              className="mt-0.5 w-3.5 h-3.5 rounded-full flex-shrink-0 flex items-center justify-center text-[8px] font-black"
              style={{
                backgroundColor: `${categoryColor}25`,
                color: categoryColor,
              }}
            >
              ✓
            </span>
            {b}
          </li>
        ))}
      </ul>

      {/* Safety note */}
      <p
        className="text-[10px] leading-relaxed mt-auto pt-2"
        style={{
          color: "oklch(0.5 0.02 260)",
          borderTop: "1px solid oklch(0.18 0.015 260)",
        }}
      >
        ⚠ {supplement.safetyNote}
      </p>
    </motion.div>
  );
}

function VegToggle({
  value,
  onChange,
}: { value: DietType; onChange: (v: DietType) => void }) {
  return (
    <div
      data-ocid="diet.type_toggle"
      className="inline-flex rounded-full p-0.5 gap-0"
      style={{
        backgroundColor: "oklch(0.15 0.02 260)",
        border: "1px solid oklch(0.25 0.03 260 / 0.5)",
      }}
    >
      <button
        type="button"
        onClick={() => onChange("veg")}
        className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200"
        style={
          value === "veg"
            ? {
                backgroundColor: "#39FF14",
                color: "#0A0A0A",
                boxShadow: "0 0 12px #39FF1455",
              }
            : { color: "oklch(0.55 0.02 260)" }
        }
      >
        🥗 VEG
      </button>
      <button
        type="button"
        onClick={() => onChange("nonveg")}
        className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200"
        style={
          value === "nonveg"
            ? {
                backgroundColor: "#00AAFF",
                color: "#0A0A0A",
                boxShadow: "0 0 12px #00AAFF55",
              }
            : { color: "oklch(0.55 0.02 260)" }
        }
      >
        🍗 NON-VEG
      </button>
    </div>
  );
}

// ─── BMI Banner ───────────────────────────────────────────────────────────────

function BmiBanner({ onJumpToPlan }: { onJumpToPlan: (s: Stream) => void }) {
  const [bmiData, setBmiData] = useState<{
    bmi: number;
    stream: Stream;
    label: string;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("smartfit-bmi-v3");
      if (!raw) return;
      const parsed = JSON.parse(raw) as { bmi?: number; category?: string };
      const bmi = parsed?.bmi;
      if (typeof bmi !== "number" || Number.isNaN(bmi)) return;
      let stream: Stream = "normal";
      let label = "Maintenance";
      if (bmi < 18.5) {
        stream = "underweight";
        label = "Underweight";
      } else if (bmi < 25) {
        stream = "normal";
        label = "Maintenance";
      } else if (bmi < 30) {
        stream = "overweight";
        label = "Overweight";
      } else {
        stream = "obese";
        label = "Obese";
      }
      setBmiData({ bmi, stream, label });
    } catch {
      // ignore parse errors
    }
  }, []);

  if (bmiData) {
    const streamColors: Record<Stream, string> = {
      underweight: "#39FF14",
      normal: "#00AAFF",
      overweight: "#f59e0b",
      obese: "#ef4444",
    };
    const color = streamColors[bmiData.stream];
    return (
      <motion.div
        data-ocid="diet.bmi_banner"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="rounded-xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap"
        style={{
          background: `linear-gradient(135deg, ${color}18, ${color}08)`,
          border: `1px solid ${color}40`,
        }}
      >
        <div className="flex items-center gap-2 text-sm">
          <span className="text-base">🎯</span>
          <span className="text-foreground/90">
            Based on your BMI of{" "}
            <span className="font-black" style={{ color }}>
              {bmiData.bmi.toFixed(1)}
            </span>
            , we recommend the{" "}
            <span className="font-bold" style={{ color }}>
              {bmiData.label}
            </span>{" "}
            plan
          </span>
        </div>
        <button
          type="button"
          data-ocid="diet.jump_to_plan_button"
          onClick={() => onJumpToPlan(bmiData.stream)}
          className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: color,
            color: "#0A0A0A",
            boxShadow: `0 0 12px ${color}40`,
          }}
        >
          Jump to Plan →
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      data-ocid="diet.bmi_prompt_banner"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="rounded-xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap"
      style={{
        background: "linear-gradient(135deg, #00AAFF18, #39FF1410)",
        border: "1px solid #00AAFF33",
      }}
    >
      <div className="flex items-center gap-2 text-sm">
        <span className="text-base">💡</span>
        <span className="text-foreground/80">
          Personalized plans work best after checking your BMI
        </span>
      </div>
      <Link
        to="/bmi"
        data-ocid="diet.bmi_link"
        className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: "#00AAFF",
          color: "#0A0A0A",
          boxShadow: "0 0 12px #00AAFF40",
        }}
      >
        Check BMI →
      </Link>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DietPlans() {
  const [activeStream, setActiveStream] = useState<Stream>("normal");
  const [dietType, setDietType] = useState<DietType>("veg");
  const [proteinDietType, setProteinDietType] = useState<DietType>("veg");
  const [sugarTab, setSugarTab] = useState<SugarTab>("natural");
  const [supplementTab, setSupplementTab] = useState<SupplementTab>("pre");
  const planSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("stream") as Stream | null;
    if (s && ["underweight", "normal", "overweight", "obese"].includes(s)) {
      setActiveStream(s);
    }
  }, []);

  const handleJumpToPlan = (stream: Stream) => {
    setActiveStream(stream);
    setTimeout(() => {
      planSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const currentPlan = STREAMS.find((p) => p.id === activeStream)!;
  const currentMeals =
    dietType === "veg" ? currentPlan.veg : currentPlan.nonveg;
  const totalKcal = currentMeals.reduce((sum, m) => sum + m.kcal, 0);
  const currentProteins =
    proteinDietType === "veg" ? VEG_PROTEIN : NONVEG_PROTEIN;

  const streamColors: Record<Stream, string> = {
    underweight: "#39FF14",
    normal: "#00AAFF",
    overweight: "#f59e0b",
    obese: "#ef4444",
  };
  const activeColor = streamColors[activeStream];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Page Header */}
      <div
        className="border-b border-border/40"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1 h-7 rounded-full bg-[#00AAFF] inline-block" />
              <h1
                className="text-4xl sm:text-5xl font-black uppercase tracking-tight"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  color: "var(--foreground)",
                }}
              >
                Diet Plans
              </h1>
            </div>
            <p className="text-muted-foreground text-sm mt-1 ml-3">
              Precision nutrition blueprints matched to your BMI — complete VEG
              &amp; NON-VEG meal plans
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 space-y-12">
        {/* BMI Banner */}
        <BmiBanner onJumpToPlan={handleJumpToPlan} />

        {/* ─── Stream Selector Cards ──────────────────────────────────── */}
        <section data-ocid="diet.stream_selector">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {STREAMS.map((stream) => {
              const color = streamColors[stream.id];
              const isActive = activeStream === stream.id;
              return (
                <motion.button
                  type="button"
                  key={stream.id}
                  data-ocid={`diet.stream_tab.${stream.id}`}
                  onClick={() => setActiveStream(stream.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-start px-4 py-4 rounded-2xl transition-all duration-200 text-left"
                  style={
                    isActive
                      ? {
                          backgroundColor: `${color}18`,
                          border: `2px solid ${color}`,
                          boxShadow: `0 0 24px ${color}30`,
                        }
                      : {
                          backgroundColor: "oklch(0.11 0.015 260 / 0.6)",
                          border: "2px solid oklch(0.2 0.02 260)",
                        }
                  }
                >
                  <span
                    className="text-xs font-black uppercase tracking-widest mb-1"
                    style={{ color: isActive ? color : "oklch(0.55 0.02 260)" }}
                  >
                    {stream.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {stream.bmiRange}
                  </span>
                  {isActive && (
                    <span
                      className="mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      ✓ Active
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ─── Active Stream Content ──────────────────────────────────── */}
        <section ref={planSectionRef} data-ocid="diet.streams_section">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStream}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {/* Stream Header */}
              <div
                className="rounded-2xl p-5 mb-6"
                style={{
                  background: `linear-gradient(135deg, ${activeColor}18, ${activeColor}08)`,
                  border: `1px solid ${activeColor}30`,
                }}
              >
                {currentPlan.note && (
                  <div
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg mb-4 leading-relaxed"
                    style={{
                      backgroundColor: "#ef444418",
                      color: "#ef4444cc",
                      border: "1px solid #ef444430",
                    }}
                  >
                    {currentPlan.note}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide mb-3"
                      style={{
                        backgroundColor: `${activeColor}25`,
                        color: activeColor,
                        border: `1px solid ${activeColor}50`,
                      }}
                    >
                      🎯 {currentPlan.goalBadge}
                    </span>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                        style={{
                          backgroundColor: "#39FF1418",
                          border: "1px solid #39FF1430",
                        }}
                      >
                        <span
                          className="text-xs font-black"
                          style={{
                            color: "#39FF14",
                            fontFamily: "'Barlow Condensed', sans-serif",
                          }}
                        >
                          {currentPlan.calorieRange}
                        </span>
                      </div>
                    </div>
                    {/* Macro grams row */}
                    <div className="flex gap-3 flex-wrap mt-3">
                      <div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                        style={{
                          backgroundColor: "#00AAFF18",
                          border: "1px solid #00AAFF30",
                        }}
                      >
                        <span className="text-[10px] text-muted-foreground">
                          Protein
                        </span>
                        <span
                          className="text-sm font-black"
                          style={{ color: "#00AAFF" }}
                        >
                          {currentPlan.macrosGrams.protein}g
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                        style={{
                          backgroundColor: "#a78bfa18",
                          border: "1px solid #a78bfa30",
                        }}
                      >
                        <span className="text-[10px] text-muted-foreground">
                          Carbs
                        </span>
                        <span
                          className="text-sm font-black"
                          style={{ color: "#a78bfa" }}
                        >
                          {currentPlan.macrosGrams.carbs}g
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                        style={{
                          backgroundColor: "#f59e0b18",
                          border: "1px solid #f59e0b30",
                        }}
                      >
                        <span className="text-[10px] text-muted-foreground">
                          Fat
                        </span>
                        <span
                          className="text-sm font-black"
                          style={{ color: "#f59e0b" }}
                        >
                          {currentPlan.macrosGrams.fat}g
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-xs text-muted-foreground mb-2">
                      Macro Split
                    </div>
                    <div className="w-full sm:w-48">
                      <MacroBar
                        protein={currentPlan.macrosPct.protein}
                        carbs={currentPlan.macrosPct.carbs}
                        fat={currentPlan.macrosPct.fat}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* VEG / NON-VEG Toggle + Title */}
              <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                <div>
                  <h2
                    className="font-black text-lg uppercase tracking-wide"
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      color: activeColor,
                    }}
                  >
                    Daily Meal Plan
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    6 meals · Full day blueprint
                  </p>
                </div>
                <VegToggle value={dietType} onChange={setDietType} />
              </div>

              {/* Total Calories */}
              <div className="text-xs text-muted-foreground mb-4">
                Total from meals:{" "}
                <span className="font-bold" style={{ color: "#39FF14" }}>
                  {totalKcal.toLocaleString()} kcal
                </span>
              </div>

              {/* Meal Cards */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                data-ocid="diet.meals_list"
              >
                {currentMeals.map((meal, i) => (
                  <MealCard
                    key={`${activeStream}-${dietType}-${meal.time}`}
                    meal={meal}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ─── High Protein Foods ─────────────────────────────────────── */}
        <section data-ocid="diet.protein_section">
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <div>
              <h2
                className="font-black text-2xl uppercase tracking-wide"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  background: "linear-gradient(90deg, #00AAFF, #39FF14)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                High Protein Foods
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Top sources per 100g · with serving suggestions
              </p>
            </div>
            <VegToggle value={proteinDietType} onChange={setProteinDietType} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={proteinDietType}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              data-ocid="protein.foods_list"
            >
              {currentProteins.map((food, i) => (
                <ProteinFoodCard key={food.name} food={food} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ─── Superfoods ─────────────────────────────────────────────── */}
        <section data-ocid="diet.superfoods_section">
          <div className="mb-5">
            <h2
              className="font-black text-2xl uppercase tracking-wide"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                background: "linear-gradient(90deg, #39FF14, #00AAFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Nutrient-Dense Superfoods
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Essential micronutrients for peak performance &amp; recovery
            </p>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            data-ocid="superfoods.list"
          >
            {SUPERFOODS.map((food, i) => (
              <SuperfoodCard key={food.name} food={food} index={i} />
            ))}
          </div>
        </section>

        {/* ─── Good Sugars & Healthy Carbs ────────────────────────────── */}
        <section data-ocid="diet.carbs_section">
          <div className="mb-5">
            <h2
              className="font-black text-2xl uppercase tracking-wide"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                background: "linear-gradient(90deg, #f59e0b, #39FF14)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Good Sugars &amp; Healthy Carbs
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Smart carb choices with Glycemic Index ratings
            </p>
          </div>
          <div className="flex gap-2 mb-5">
            {(["natural", "complex"] as SugarTab[]).map((tab) => (
              <button
                type="button"
                key={tab}
                data-ocid={`diet.carb_tab.${tab}`}
                onClick={() => setSugarTab(tab)}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200"
                style={
                  sugarTab === tab
                    ? {
                        backgroundColor: "#f59e0b22",
                        color: "#f59e0b",
                        border: "1px solid #f59e0b55",
                        boxShadow: "0 0 12px #f59e0b20",
                      }
                    : {
                        backgroundColor: "oklch(0.11 0.015 260)",
                        color: "oklch(0.55 0.02 260)",
                        border: "1px solid oklch(0.2 0.02 260)",
                      }
                }
              >
                {tab === "natural" ? "🍯 Natural Sugars" : "🌾 Complex Carbs"}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={sugarTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              data-ocid="carbs.list"
            >
              {(sugarTab === "natural" ? NATURAL_SUGARS : COMPLEX_CARBS).map(
                (item, i) => (
                  <GoodCarbCard key={item.name} item={item} index={i} />
                ),
              )}
            </motion.div>
          </AnimatePresence>
          {/* GI Legend */}
          <div className="flex gap-3 mt-4 flex-wrap">
            <span className="text-xs text-muted-foreground">GI Scale:</span>
            {[
              { label: "Low GI (≤55)", color: "#39FF14" },
              { label: "Medium GI (56–69)", color: "#f59e0b" },
              { label: "High GI (70+)", color: "#ef4444" },
            ].map(({ label, color }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 text-xs"
                style={{ color }}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: color }}
                />
                {label}
              </span>
            ))}
          </div>
        </section>

        {/* ─── Recommended Supplements ────────────────────────────────── */}
        <section data-ocid="diet.supplements_section">
          <div className="mb-5">
            <h2
              className="font-black text-2xl uppercase tracking-wide"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                background: "linear-gradient(90deg, #00AAFF, #39FF14)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Recommended Supplements
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Science-backed supplements to maximize your training results
            </p>
          </div>

          {/* Tab Toggle */}
          <div
            data-ocid="supplement.tab_toggle"
            className="inline-flex rounded-xl p-1 gap-1 mb-6 flex-wrap"
            style={{
              backgroundColor: "oklch(0.11 0.015 260)",
              border: "1px solid oklch(0.2 0.02 260)",
            }}
          >
            {(
              [
                {
                  id: "pre" as SupplementTab,
                  label: "⚡ Pre-Workout",
                  color: "#f59e0b",
                },
                {
                  id: "post" as SupplementTab,
                  label: "🥛 Post-Workout",
                  color: "#00AAFF",
                },
                {
                  id: "general" as SupplementTab,
                  label: "💊 General & Daily",
                  color: "#39FF14",
                },
              ] as { id: SupplementTab; label: string; color: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                data-ocid={`supplement.tab.${tab.id}`}
                onClick={() => setSupplementTab(tab.id)}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200"
                style={
                  supplementTab === tab.id
                    ? {
                        backgroundColor: `${tab.color}22`,
                        color: tab.color,
                        border: `1px solid ${tab.color}55`,
                        boxShadow: `0 0 12px ${tab.color}20`,
                      }
                    : {
                        color: "oklch(0.5 0.02 260)",
                        border: "1px solid transparent",
                      }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Supplement Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={supplementTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              data-ocid="supplement.cards_list"
            >
              {(supplementTab === "pre"
                ? PRE_WORKOUT_SUPPLEMENTS
                : supplementTab === "post"
                  ? POST_WORKOUT_SUPPLEMENTS
                  : GENERAL_SUPPLEMENTS
              ).map((s, i) => (
                <SupplementCard key={s.name} supplement={s} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Section disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex items-start gap-2 px-4 py-3 rounded-xl text-xs"
            style={{
              backgroundColor: "oklch(0.13 0.015 260 / 0.8)",
              border: "1px solid oklch(0.22 0.02 260)",
              color: "oklch(0.55 0.02 260)",
            }}
          >
            <span className="text-base flex-shrink-0">⚠️</span>
            <span>
              These recommendations are for general information only. Consult a
              healthcare professional before starting any supplement regimen,
              especially if you have underlying health conditions or take
              prescription medications.
            </span>
          </motion.div>
        </section>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-muted-foreground pb-6 max-w-lg mx-auto"
        >
          These plans are general guidelines. Consult a registered dietitian or
          healthcare professional before making significant dietary changes,
          especially for the Obese plan.
        </motion.p>
      </div>
    </div>
  );
}
