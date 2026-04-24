import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AresChat from "./pages/AresChat";
import BMICalculator from "./pages/BMICalculator";
import DietPlans from "./pages/DietPlans";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import WorkoutBuilder from "./pages/WorkoutBuilder";
import WorkoutHistory from "./pages/WorkoutHistory";
import WorkoutLibrary from "./pages/WorkoutLibrary";
import WorkoutPlans from "./pages/WorkoutPlans";
import WorkoutSession from "./pages/WorkoutSession";

const rootRoute = createRootRoute({
  component: Layout,
});

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const libraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/library",
  component: WorkoutLibrary,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignUp,
});

// Protected routes wrapper
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedRoute,
});

const builderRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/builder",
  component: WorkoutBuilder,
});

const sessionRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/session",
  component: WorkoutSession,
});

const historyRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/history",
  component: WorkoutHistory,
});

const profileRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/profile",
  component: Profile,
});

const bmiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bmi",
  component: BMICalculator,
});

const dietPlansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/diet-plans",
  component: DietPlans,
});

const workoutPlansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workout-plans",
  component: WorkoutPlans,
});

const aresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ares",
  component: AresChat,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  libraryRoute,
  loginRoute,
  signupRoute,
  bmiRoute,
  dietPlansRoute,
  workoutPlansRoute,
  aresRoute,
  protectedRoute.addChildren([
    builderRoute,
    sessionRoute,
    historyRoute,
    profileRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
