export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  imageUrl: string;
  videoUrl: string;
}

export const exercises: Exercise[] = [
  // ── EXISTING EXERCISES ──────────────────────────────────────────────────────
  {
    id: "bench-press",
    name: "Bench Press",
    description:
      "A compound upper body exercise that primarily targets the chest, shoulders, and triceps using a barbell.",
    muscleGroups: ["Chest", "Shoulders", "Triceps"],
    equipment: ["Barbell", "Bench"],
    difficulty: "intermediate",
    category: "chest",
    imageUrl: "/assets/generated/bench-press.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/VmB1G1K7v94",
  },
  {
    id: "incline-bench-press",
    name: "Incline Bench Press",
    description:
      "A variation of the bench press performed on an inclined bench to target the upper chest muscles.",
    muscleGroups: ["Upper Chest", "Shoulders", "Triceps"],
    equipment: ["Barbell", "Incline Bench"],
    difficulty: "intermediate",
    category: "chest",
    imageUrl: "/assets/generated/exercise-bench-press.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/8iPEnn-ltC8",
  },
  {
    id: "dumbbell-flyes",
    name: "Dumbbell Flyes",
    description:
      "An isolation exercise for the chest that involves a wide arc motion to stretch and contract the pectoral muscles.",
    muscleGroups: ["Chest"],
    equipment: ["Dumbbells", "Bench"],
    difficulty: "beginner",
    category: "chest",
    imageUrl: "/assets/generated/dumbbell-flyes.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/eozdVDA78K0",
  },
  {
    id: "cable-crossover",
    name: "Cable Crossover",
    description:
      "A cable machine exercise that provides constant tension throughout the movement for chest development.",
    muscleGroups: ["Chest", "Shoulders"],
    equipment: ["Cable Machine"],
    difficulty: "intermediate",
    category: "chest",
    imageUrl: "/assets/generated/cable-crossover.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/taI4XduLpTk",
  },
  {
    id: "push-up",
    name: "Push-Up",
    description:
      "A bodyweight exercise that works the chest, shoulders, and triceps using your own body weight as resistance.",
    muscleGroups: ["Chest", "Shoulders", "Triceps", "Core"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "chest",
    imageUrl: "/assets/generated/push-up.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
  },
  {
    id: "barbell-row",
    name: "Barbell Row",
    description:
      "A compound back exercise that builds thickness and strength in the upper and middle back muscles.",
    muscleGroups: ["Back", "Biceps", "Rear Delts"],
    equipment: ["Barbell"],
    difficulty: "intermediate",
    category: "back",
    imageUrl: "/assets/generated/barbell-row.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/G8l_8chR5BE",
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    description:
      "A cable machine exercise that targets the latissimus dorsi muscles to build a wider back.",
    muscleGroups: ["Lats", "Biceps", "Rear Delts"],
    equipment: ["Cable Machine"],
    difficulty: "beginner",
    category: "back",
    imageUrl: "/assets/generated/lat-pulldown.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/SAiordnZQl4",
  },
  {
    id: "pull-up",
    name: "Pull-Up",
    description:
      "A challenging bodyweight exercise that builds upper body strength, targeting the lats and biceps.",
    muscleGroups: ["Lats", "Biceps", "Core"],
    equipment: ["Pull-Up Bar"],
    difficulty: "intermediate",
    category: "back",
    imageUrl: "/assets/generated/pull-up.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g",
  },
  {
    id: "deadlift",
    name: "Deadlift",
    description:
      "The king of compound exercises, working the entire posterior chain including back, glutes, and hamstrings.",
    muscleGroups: ["Back", "Glutes", "Hamstrings", "Core"],
    equipment: ["Barbell"],
    difficulty: "advanced",
    category: "back",
    imageUrl: "/assets/generated/deadlift.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/op9kVnSso6Q",
  },
  {
    id: "squat",
    name: "Barbell Squat",
    description:
      "The fundamental lower body compound movement that builds strength and mass in the quads, glutes, and hamstrings.",
    muscleGroups: ["Quads", "Glutes", "Hamstrings", "Core"],
    equipment: ["Barbell", "Squat Rack"],
    difficulty: "intermediate",
    category: "legs",
    imageUrl: "/assets/generated/squat.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/ultWZbUMPL8",
  },
  {
    id: "leg-press",
    name: "Leg Press",
    description:
      "A machine-based lower body exercise that allows heavy loading of the quads, glutes, and hamstrings.",
    muscleGroups: ["Quads", "Glutes", "Hamstrings"],
    equipment: ["Leg Press Machine"],
    difficulty: "beginner",
    category: "legs",
    imageUrl: "/assets/generated/leg-press.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/IZxyjW7MPJQ",
  },
  {
    id: "lunges",
    name: "Lunges",
    description:
      "A unilateral lower body exercise that improves balance and targets the quads, glutes, and hamstrings.",
    muscleGroups: ["Quads", "Glutes", "Hamstrings"],
    equipment: ["None", "Dumbbells"],
    difficulty: "beginner",
    category: "legs",
    imageUrl: "/assets/generated/lunges.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/QOVaHwm-Q6U",
  },
  {
    id: "leg-curl",
    name: "Leg Curl",
    description:
      "An isolation exercise for the hamstrings performed on a leg curl machine.",
    muscleGroups: ["Hamstrings"],
    equipment: ["Leg Curl Machine"],
    difficulty: "beginner",
    category: "legs",
    imageUrl: "/assets/generated/leg-curl.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/1Tq3QdYUuHs",
  },
  {
    id: "overhead-press",
    name: "Overhead Press",
    description:
      "A compound shoulder exercise that builds strength and mass in the deltoids and upper body.",
    muscleGroups: ["Shoulders", "Triceps", "Core"],
    equipment: ["Barbell"],
    difficulty: "intermediate",
    category: "shoulders",
    imageUrl: "/assets/generated/overhead-press.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/2yjwXTZQDDI",
  },
  {
    id: "lateral-raises",
    name: "Lateral Raises",
    description:
      "An isolation exercise for the lateral deltoids that creates shoulder width and definition.",
    muscleGroups: ["Lateral Deltoids"],
    equipment: ["Dumbbells"],
    difficulty: "beginner",
    category: "shoulders",
    imageUrl: "/assets/generated/lateral-raises.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/3VcKaXpzqRo",
  },
  {
    id: "front-raises",
    name: "Front Raises",
    description:
      "An isolation exercise targeting the anterior deltoids to build front shoulder strength and definition.",
    muscleGroups: ["Front Deltoids"],
    equipment: ["Dumbbells", "Barbell"],
    difficulty: "beginner",
    category: "shoulders",
    imageUrl: "/assets/generated/front-raises.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/gkfSuCTQFQY",
  },
  {
    id: "shoulder-press-db",
    name: "Dumbbell Shoulder Press",
    description:
      "A dumbbell variation of the overhead press that allows greater range of motion and unilateral development.",
    muscleGroups: ["Shoulders", "Triceps"],
    equipment: ["Dumbbells"],
    difficulty: "intermediate",
    category: "shoulders",
    imageUrl: "/assets/generated/exercise-shoulder-press.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/qEwKCR5JCog",
  },
  {
    id: "bicep-curl",
    name: "Bicep Curl",
    description:
      "The classic arm exercise that isolates the biceps for maximum growth and peak development.",
    muscleGroups: ["Biceps"],
    equipment: ["Dumbbells", "Barbell"],
    difficulty: "beginner",
    category: "arms",
    imageUrl: "/assets/generated/exercise-curl.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/ykJmrZ5v0Oo",
  },
  {
    id: "tricep-pushdown",
    name: "Tricep Pushdown",
    description:
      "A cable exercise that isolates the triceps for definition and strength in the back of the upper arm.",
    muscleGroups: ["Triceps"],
    equipment: ["Cable Machine"],
    difficulty: "beginner",
    category: "arms",
    imageUrl: "/assets/generated/exercise-tricep-pushdown.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/2-LAMcpzODU",
  },
  {
    id: "hammer-curl",
    name: "Hammer Curl",
    description:
      "A neutral-grip curl variation that targets the brachialis and brachioradialis for arm thickness.",
    muscleGroups: ["Biceps", "Brachialis", "Forearms"],
    equipment: ["Dumbbells"],
    difficulty: "beginner",
    category: "arms",
    imageUrl: "/assets/generated/exercise-curl.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/zC3nLlEvin4",
  },
  {
    id: "skull-crushers",
    name: "Skull Crushers",
    description:
      "A lying tricep extension exercise that provides excellent stretch and contraction for tricep development.",
    muscleGroups: ["Triceps"],
    equipment: ["Barbell", "EZ Bar", "Bench"],
    difficulty: "intermediate",
    category: "arms",
    imageUrl: "/assets/generated/exercise-tricep-pushdown.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/d_KZxkY_0cM",
  },
  {
    id: "plank",
    name: "Plank",
    description:
      "An isometric core exercise that builds stability and endurance in the entire core musculature.",
    muscleGroups: ["Core", "Shoulders", "Glutes"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "core",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/pSHjTRCQxIw",
  },
  {
    id: "crunches",
    name: "Crunches",
    description:
      "A classic abdominal exercise that targets the rectus abdominis for core strength and definition.",
    muscleGroups: ["Abs"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "core",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/Xyd_fa5zoEU",
  },
  {
    id: "russian-twist",
    name: "Russian Twist",
    description:
      "A rotational core exercise that targets the obliques and improves rotational strength.",
    muscleGroups: ["Obliques", "Abs"],
    equipment: ["None", "Weight Plate"],
    difficulty: "intermediate",
    category: "core",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/wkD8rjkodUI",
  },
  {
    id: "running",
    name: "Treadmill Running",
    description:
      "Cardiovascular exercise that improves endurance, burns calories, and strengthens the cardiovascular system.",
    muscleGroups: ["Legs", "Core", "Cardiovascular"],
    equipment: ["Treadmill"],
    difficulty: "beginner",
    category: "cardio",
    imageUrl: "/assets/generated/exercise-squat.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/kVnyY17VS9Y",
  },
  {
    id: "jump-rope",
    name: "Jump Rope",
    description:
      "A high-intensity cardio exercise that improves coordination, agility, and cardiovascular fitness.",
    muscleGroups: ["Calves", "Shoulders", "Cardiovascular"],
    equipment: ["Jump Rope"],
    difficulty: "beginner",
    category: "cardio",
    imageUrl: "/assets/generated/exercise-squat.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/FJmRQ5iTXKE",
  },

  // ── MOVEMENT PATTERNS ────────────────────────────────────────────────────────
  // Hinge Pattern
  {
    id: "kettlebell-swing",
    name: "Kettlebell Swing",
    description:
      "An explosive hip-hinge movement that develops posterior chain power, cardiovascular fitness, and full-body coordination.",
    muscleGroups: ["Glutes", "Hamstrings", "Core", "Shoulders"],
    equipment: ["Kettlebell"],
    difficulty: "intermediate",
    category: "Movement Patterns",
    imageUrl: "/assets/generated/deadlift.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/VlyWtxtAN_Y",
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    description:
      "A hip-hinge exercise emphasizing the hamstrings and glutes through a controlled eccentric stretch with minimal knee bend.",
    muscleGroups: ["Hamstrings", "Glutes", "Lower Back"],
    equipment: ["Barbell", "Dumbbells"],
    difficulty: "intermediate",
    category: "Movement Patterns",
    imageUrl: "/assets/generated/deadlift.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/JCXUYuzwNrM",
  },
  {
    id: "good-morning",
    name: "Good Morning",
    description:
      "A barbell hinge movement that strengthens the posterior chain, particularly the hamstrings, glutes, and spinal erectors.",
    muscleGroups: ["Hamstrings", "Glutes", "Spinal Erectors"],
    equipment: ["Barbell"],
    difficulty: "intermediate",
    category: "Movement Patterns",
    imageUrl: "/assets/generated/deadlift.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/YA-h3n9L4YU",
  },
  // Carry Pattern
  {
    id: "farmers-walk",
    name: "Farmer's Walk",
    description:
      "A loaded carry exercise that builds total-body strength, grip endurance, and core stability by walking with heavy weights.",
    muscleGroups: ["Forearms", "Traps", "Core", "Legs"],
    equipment: ["Dumbbells", "Kettlebell"],
    difficulty: "beginner",
    category: "Movement Patterns",
    imageUrl: "/assets/generated/exercise-deadlift.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/Tgi5SNDbBZQ",
  },
  {
    id: "suitcase-carry",
    name: "Suitcase Carry",
    description:
      "A unilateral loaded carry that challenges lateral core stability and anti-lateral-flexion strength while walking.",
    muscleGroups: ["Core", "Obliques", "Forearms", "Traps"],
    equipment: ["Dumbbell", "Kettlebell"],
    difficulty: "beginner",
    category: "Movement Patterns",
    imageUrl: "/assets/generated/exercise-deadlift.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/1fb0Q2d0cd0",
  },
  {
    id: "waiters-walk",
    name: "Waiter's Walk",
    description:
      "An overhead carry variation that builds shoulder stability, thoracic extension, and core control under load.",
    muscleGroups: ["Shoulders", "Core", "Traps", "Forearms"],
    equipment: ["Dumbbell", "Kettlebell"],
    difficulty: "intermediate",
    category: "Movement Patterns",
    imageUrl: "/assets/generated/overhead-press.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/j5ZoC9p6J-s",
  },
  // Rotational / Anti-Rotational
  {
    id: "woodchopper",
    name: "Woodchopper",
    description:
      "A rotational cable or band exercise that trains the obliques and core through a diagonal chopping motion.",
    muscleGroups: ["Obliques", "Core", "Shoulders"],
    equipment: ["Cable Machine", "Resistance Band"],
    difficulty: "beginner",
    category: "Movement Patterns",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/pAplQXk3dkU",
  },
  {
    id: "pallof-press",
    name: "Pallof Press",
    description:
      "An anti-rotation core exercise using a cable or band that trains the core to resist rotational forces.",
    muscleGroups: ["Core", "Obliques", "Glutes"],
    equipment: ["Cable Machine", "Resistance Band"],
    difficulty: "beginner",
    category: "Movement Patterns",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/axgv7H_VQOo",
  },
  // Locomotion
  {
    id: "bear-crawl",
    name: "Bear Crawl",
    description:
      "A ground-based locomotion pattern that builds shoulder stability, core strength, and contralateral coordination.",
    muscleGroups: ["Core", "Shoulders", "Quads", "Glutes"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "Movement Patterns",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/Wgt1vdZ_YYk",
  },
  {
    id: "crab-walk",
    name: "Crab Walk",
    description:
      "A reverse quadruped locomotion exercise that strengthens the posterior chain, triceps, and core in a supine position.",
    muscleGroups: ["Glutes", "Triceps", "Core", "Hamstrings"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "Movement Patterns",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/Xwcbm93mM-o",
  },
  {
    id: "duck-walk",
    name: "Duck Walk",
    description:
      "A deep squat locomotion drill that improves hip mobility, quad strength, and ankle flexibility.",
    muscleGroups: ["Quads", "Glutes", "Calves", "Hip Flexors"],
    equipment: ["None"],
    difficulty: "intermediate",
    category: "Movement Patterns",
    imageUrl: "/assets/generated/squat.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/WpRHF2XEuqg",
  },

  // ── MOBILITY & FLEXIBILITY ───────────────────────────────────────────────────
  // Dynamic Stretching
  {
    id: "cat-cow",
    name: "Cat-Cow Stretch",
    description:
      "A dynamic spinal mobility drill that alternates between flexion and extension to warm up the spine and improve posture.",
    muscleGroups: ["Spine", "Core", "Hip Flexors"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "Mobility & Flexibility",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/kqnua4rHVVA",
  },
  {
    id: "worlds-greatest-stretch",
    name: "World's Greatest Stretch",
    description:
      "A multi-joint dynamic stretch that simultaneously opens the hip flexors, thoracic spine, and hamstrings in one flowing movement.",
    muscleGroups: ["Hip Flexors", "Thoracic Spine", "Hamstrings", "Glutes"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "Mobility & Flexibility",
    imageUrl: "/assets/generated/lunges.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/Ug8QSNLpQ7c",
  },
  {
    id: "leg-swings",
    name: "Leg Swings",
    description:
      "A dynamic hip mobility drill performed by swinging the leg forward/back and side-to-side to increase range of motion.",
    muscleGroups: ["Hip Flexors", "Hamstrings", "Adductors", "Glutes"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "Mobility & Flexibility",
    imageUrl: "/assets/generated/lunges.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/sFh6DGbDDxg",
  },
  // Static Stretching
  {
    id: "pigeon-pose",
    name: "Pigeon Pose",
    description:
      "A deep static hip opener that targets the piriformis and hip external rotators, relieving tightness from sitting.",
    muscleGroups: ["Hip Flexors", "Piriformis", "Glutes"],
    equipment: ["None"],
    difficulty: "intermediate",
    category: "Mobility & Flexibility",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/T1hP0jHhF9Y",
  },
  {
    id: "couch-stretch",
    name: "Couch Stretch",
    description:
      "An intense static stretch for the hip flexors and quads performed with the rear foot elevated against a wall.",
    muscleGroups: ["Hip Flexors", "Quads", "Rectus Femoris"],
    equipment: ["None"],
    difficulty: "intermediate",
    category: "Mobility & Flexibility",
    imageUrl: "/assets/generated/lunges.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/rn2k0hNnPAQ",
  },
  {
    id: "hamstring-stretch",
    name: "Hamstring Stretch",
    description:
      "A foundational static stretch targeting the hamstrings to improve posterior chain flexibility and reduce injury risk.",
    muscleGroups: ["Hamstrings", "Lower Back"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "Mobility & Flexibility",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/v9KLarLNZRg",
  },
  // SMR / Foam Rolling
  {
    id: "foam-roll-calves",
    name: "Foam Roll – Calves",
    description:
      "Self-myofascial release for the calf muscles using a foam roller to reduce tightness and improve ankle mobility.",
    muscleGroups: ["Calves", "Soleus"],
    equipment: ["Foam Roller"],
    difficulty: "beginner",
    category: "Mobility & Flexibility",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/lF0yME-gIBk",
  },
  {
    id: "foam-roll-lats",
    name: "Foam Roll – Lats",
    description:
      "Targeted foam rolling of the latissimus dorsi to release tension and improve shoulder and thoracic mobility.",
    muscleGroups: ["Lats", "Thoracic Spine"],
    equipment: ["Foam Roller"],
    difficulty: "beginner",
    category: "Mobility & Flexibility",
    imageUrl: "/assets/generated/exercise-lat-pulldown.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/yXPVFh9LYAM",
  },
  {
    id: "lacrosse-ball-foot",
    name: "Lacrosse Ball Foot Roll",
    description:
      "Plantar fascia release using a lacrosse ball to improve foot mobility and reduce heel pain.",
    muscleGroups: ["Plantar Fascia", "Foot"],
    equipment: ["Lacrosse Ball"],
    difficulty: "beginner",
    category: "Mobility & Flexibility",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/4Za71Uk86R4",
  },
  // Yoga & Pilates
  {
    id: "sun-salutation",
    name: "Sun Salutation",
    description:
      "A flowing sequence of yoga poses that warms up the entire body, improves flexibility, and builds mindful movement.",
    muscleGroups: ["Full Body", "Core", "Shoulders", "Hip Flexors"],
    equipment: ["Yoga Mat"],
    difficulty: "beginner",
    category: "Mobility & Flexibility",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/73sjOu0g58M",
  },
  {
    id: "downward-dog",
    name: "Downward Dog",
    description:
      "A foundational yoga pose that stretches the hamstrings, calves, and spine while building shoulder and core strength.",
    muscleGroups: ["Hamstrings", "Calves", "Shoulders", "Core"],
    equipment: ["Yoga Mat"],
    difficulty: "beginner",
    category: "Mobility & Flexibility",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/j97SSGsnCAQ",
  },
  {
    id: "childs-pose",
    name: "Child's Pose",
    description:
      "A restorative yoga pose that gently stretches the hips, thighs, and lower back while promoting relaxation.",
    muscleGroups: ["Hip Flexors", "Lower Back", "Glutes"],
    equipment: ["Yoga Mat"],
    difficulty: "beginner",
    category: "Mobility & Flexibility",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/qZ_KaHbQ-08",
  },

  // ── BALANCE & STABILITY ──────────────────────────────────────────────────────
  // Static Balance
  {
    id: "tree-pose",
    name: "Tree Pose",
    description:
      "A single-leg yoga balance pose that improves proprioception, ankle stability, and mental focus.",
    muscleGroups: ["Glutes", "Core", "Calves", "Hip Abductors"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "Balance & Stability",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/wFBBTd37Ybw",
  },
  {
    id: "single-leg-stand",
    name: "Single-Leg Stand",
    description:
      "A fundamental balance drill performed on one leg, with progressions including eyes closed or unstable surfaces.",
    muscleGroups: ["Glutes", "Core", "Calves", "Ankle Stabilizers"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "Balance & Stability",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/Z8RFNknEPiM",
  },
  // Dynamic Balance
  {
    id: "heel-to-toe-walk",
    name: "Heel-to-Toe Walk",
    description:
      "A dynamic balance exercise where each step places the heel directly in front of the opposite toe, challenging coordination.",
    muscleGroups: ["Calves", "Core", "Hip Stabilizers"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "Balance & Stability",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/fy08GU5o8dQ",
  },
  {
    id: "lateral-leg-swings",
    name: "Lateral Leg Swings",
    description:
      "A dynamic balance drill swinging the leg side-to-side to improve hip abductor/adductor control and single-leg stability.",
    muscleGroups: ["Hip Abductors", "Hip Adductors", "Core"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "Balance & Stability",
    imageUrl: "/assets/generated/lunges.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/VKepv4WCXiA",
  },
  {
    id: "single-leg-hop",
    name: "Single-Leg Hops",
    description:
      "A plyometric balance exercise that trains reactive stability and landing mechanics on one leg.",
    muscleGroups: ["Glutes", "Quads", "Calves", "Core"],
    equipment: ["None"],
    difficulty: "intermediate",
    category: "Balance & Stability",
    imageUrl: "/assets/generated/exercise-squat.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/LPfpEuIMlQk",
  },
  // Tool-Based Stability
  {
    id: "bosu-ball-squat",
    name: "BOSU Ball Squat",
    description:
      "A squat performed on the dome side of a BOSU ball to challenge ankle and knee stability under load.",
    muscleGroups: ["Quads", "Glutes", "Core", "Ankle Stabilizers"],
    equipment: ["BOSU Ball"],
    difficulty: "intermediate",
    category: "Balance & Stability",
    imageUrl: "/assets/generated/squat.dim_800x600.png",
    videoUrl: "https://www.youtube.com/embed/ANZxVHfP9pg",
  },
  {
    id: "stability-ball-pike",
    name: "Stability Ball Pike",
    description:
      "An advanced core exercise using a stability ball to perform a pike movement, demanding shoulder and core stability.",
    muscleGroups: ["Core", "Shoulders", "Hip Flexors"],
    equipment: ["Stability Ball"],
    difficulty: "advanced",
    category: "Balance & Stability",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/wtcqHGfSoM8",
  },
  {
    id: "balance-board-tilt",
    name: "Balance Board Tilts",
    description:
      "Standing on a balance board and controlling tilt in all directions to develop ankle proprioception and reactive stability.",
    muscleGroups: ["Ankle Stabilizers", "Calves", "Core"],
    equipment: ["Balance Board"],
    difficulty: "beginner",
    category: "Balance & Stability",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/Tt3gTBBN4KA",
  },

  // ── CORRECTIVE & REHABILITATIVE ─────────────────────────────────────────────
  // Postural Correction
  {
    id: "face-pull",
    name: "Face Pull",
    description:
      "A cable exercise targeting the rear deltoids and external rotators to correct rounded shoulders and improve posture.",
    muscleGroups: ["Rear Deltoids", "External Rotators", "Traps"],
    equipment: ["Cable Machine", "Resistance Band"],
    difficulty: "beginner",
    category: "Corrective & Rehab",
    imageUrl: "/assets/generated/exercise-shoulder-press.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/rep-qVOkqgk",
  },
  {
    id: "bird-dog",
    name: "Bird-Dog",
    description:
      "A quadruped stability exercise extending opposite arm and leg to strengthen the lower back and improve spinal alignment.",
    muscleGroups: ["Lower Back", "Glutes", "Core", "Shoulders"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "Corrective & Rehab",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/wiFNA3sqjCA",
  },
  {
    id: "wall-angel",
    name: "Wall Angel",
    description:
      "A postural correction drill performed against a wall to improve thoracic extension and scapular mobility.",
    muscleGroups: ["Thoracic Spine", "Rear Deltoids", "Traps", "Rhomboids"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "Corrective & Rehab",
    imageUrl: "/assets/generated/exercise-shoulder-press.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/8blMoMFBFa8",
  },
  {
    id: "dead-bug",
    name: "Dead Bug",
    description:
      "A supine core stability exercise that trains anti-extension and contralateral limb coordination for lower back health.",
    muscleGroups: ["Core", "Hip Flexors", "Lower Back"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "Corrective & Rehab",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/4XLEnwUr1d8",
  },
  // Joint-Specific Prehab
  {
    id: "ankle-circles",
    name: "Ankle Circles",
    description:
      "A joint mobility drill rotating the ankle through its full range of motion to improve flexibility and reduce injury risk.",
    muscleGroups: ["Ankle", "Calves", "Tibialis Anterior"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "Corrective & Rehab",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/bHVJtMYv2Ds",
  },
  {
    id: "wrist-stretches",
    name: "Wrist Stretches",
    description:
      "A series of wrist flexion, extension, and rotation stretches to maintain joint health for pressing and gripping movements.",
    muscleGroups: ["Wrist Flexors", "Wrist Extensors", "Forearms"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "Corrective & Rehab",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/MQEXBzIvqOA",
  },
  {
    id: "hip-90-90",
    name: "Hip 90/90 Stretch",
    description:
      "A seated hip mobility drill with both legs at 90-degree angles to simultaneously stretch internal and external hip rotators.",
    muscleGroups: ["Hip External Rotators", "Hip Internal Rotators", "Glutes"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "Corrective & Rehab",
    imageUrl: "/assets/generated/exercise-plank.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/r84UKqFh92c",
  },
  {
    id: "shoulder-cir",
    name: "Shoulder CARs",
    description:
      "Controlled Articular Rotations for the shoulder joint that improve active range of motion and joint health.",
    muscleGroups: ["Shoulders", "Rotator Cuff", "Rear Deltoids"],
    equipment: ["None"],
    difficulty: "beginner",
    category: "Corrective & Rehab",
    imageUrl: "/assets/generated/exercise-shoulder-press.dim_600x400.png",
    videoUrl: "https://www.youtube.com/embed/8blMoMFBFa8",
  },
];

export const categories = [
  "all",
  "chest",
  "back",
  "legs",
  "shoulders",
  "arms",
  "core",
  "cardio",
  "Movement Patterns",
  "Mobility & Flexibility",
  "Balance & Stability",
  "Corrective & Rehab",
];
