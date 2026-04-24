import type { backendInterface } from "../backend";
import type { Principal } from "@icp-sdk/core/principal";
import { UserRole } from "../backend";

export const mockBackend: backendInterface = {
  addAresChatMessage: async () => undefined,
  assignRole: async (_user: Principal, _role: UserRole) => undefined,
  clearAresChatHistory: async () => undefined,
  deleteUser: async (_id: bigint) => ({ __kind__: "ok" as const, ok: null }),
  getAresChatHistory: async () => [],
  getAresFitnessProfile: async () => ({
    weightKg: 75,
    heightCm: 175,
    goal: "muscle_gain",
    experienceLevel: "intermediate",
    dietType: "non-veg",
    personalityMode: "strict",
    lastWorkoutDate: "2026-04-22",
    missedDaysCount: BigInt(0),
    currentWeekCompletedDays: ["Monday", "Wednesday"],
    onboardingComplete: true,
  }),
  getCallerUserProfile: async () => ({
    name: "John Doe",
    email: "john@example.com",
  }),
  getMyRole: async () => UserRole.user,
  getUserByEmail: async (_email: string) => null,
  getUserById: async (_id: bigint) => null,
  getUserProfile: async (_user: Principal) => null,
  getUsers: async () => [
    { id: BigInt(1), username: "john_doe", email: "john@example.com" },
  ],
  logWorkoutCompleted: async (_date: string) => undefined,
  logWorkoutSkipped: async () => undefined,
  login: async (_email: string, _password: string) => ({
    __kind__: "ok" as const,
    ok: null,
  }),
  register: async (_profile) => ({ __kind__: "ok" as const, ok: null }),
  saveAresFitnessProfile: async (_profile) => undefined,
  saveCallerUserProfile: async (_profile) => undefined,
  updateUser: async (_id: bigint, _profile) => ({
    __kind__: "ok" as const,
    ok: null,
  }),
};
