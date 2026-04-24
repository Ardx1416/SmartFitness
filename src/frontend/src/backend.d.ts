import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Results = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export type UserId = bigint;
export interface CallerProfile {
    name: string;
    email: string;
}
export interface ChatMessage {
    id: string;
    mode: string;
    sender: string;
    message: string;
    timestamp: bigint;
}
export interface UpdateUserProfile {
    username: string;
    email: string;
    passwordHash: string;
}
export interface AresFitnessProfile {
    experienceLevel?: string;
    currentWeekCompletedDays: Array<string>;
    heightCm?: number;
    goal?: string;
    onboardingComplete: boolean;
    missedDaysCount: bigint;
    personalityMode: string;
    lastWorkoutDate?: string;
    weightKg?: number;
    dietType?: string;
}
export interface CreateUserProfile {
    username: string;
    password: string;
    email: string;
}
export interface UserProfile {
    id?: UserId;
    username: string;
    email: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAresChatMessage(msg: ChatMessage): Promise<void>;
    assignRole(user: Principal, role: UserRole): Promise<void>;
    clearAresChatHistory(): Promise<void>;
    deleteUser(id: UserId): Promise<Results>;
    getAresChatHistory(): Promise<Array<ChatMessage>>;
    getAresFitnessProfile(): Promise<AresFitnessProfile | null>;
    getCallerUserProfile(): Promise<CallerProfile | null>;
    getMyRole(): Promise<UserRole>;
    getUserByEmail(email: string): Promise<UserProfile | null>;
    getUserById(id: UserId): Promise<UserProfile | null>;
    getUserProfile(user: Principal): Promise<CallerProfile | null>;
    getUsers(): Promise<Array<UserProfile>>;
    logWorkoutCompleted(date: string): Promise<void>;
    logWorkoutSkipped(): Promise<void>;
    login(email: string, password: string): Promise<Results>;
    register(createUserProfile: CreateUserProfile): Promise<Results>;
    saveAresFitnessProfile(profile: AresFitnessProfile): Promise<void>;
    saveCallerUserProfile(profile: CallerProfile): Promise<void>;
    updateUser(id: UserId, profile: UpdateUserProfile): Promise<Results>;
}
