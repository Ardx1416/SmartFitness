import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";

export interface CreateUserProfile {
  username: string;
  email: string;
  password: string;
}

// ─── Auth State (sessionStorage-based session) ────────────────────────────────
const SESSION_KEY = "ironforge_session_email";
const USERS_KEY = "ironforge_users";

interface StoredUser {
  username: string;
  email: string;
  passwordHash: string;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSessionEmail(): string | null {
  return sessionStorage.getItem(SESSION_KEY);
}

export function setSessionEmail(email: string): void {
  sessionStorage.setItem(SESSION_KEY, email);
}

export function clearSessionEmail(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

// ─── parseCanisterError ────────────────────────────────────────────────────────
export function parseCanisterError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);

  if (
    raw.includes("IC0508") ||
    raw.includes("reject_code: 5") ||
    raw.includes('"reject_code":5') ||
    (raw.includes("Canister") && raw.includes("is stopped")) ||
    raw.includes("non_replicated_rejection") ||
    raw.includes("Reject code: 5")
  ) {
    return "Service temporarily unavailable. Please try again in a moment.";
  }

  if (
    raw.length < 200 &&
    !raw.includes("Request ID") &&
    !raw.includes("reject_message") &&
    !raw.includes("HTTP details") &&
    !raw.includes("statusText")
  ) {
    return raw;
  }

  return "Something went wrong. Please try again.";
}

// ─── useAuthStatus ─────────────────────────────────────────────────────────────
export function useAuthStatus() {
  const query = useQuery({
    queryKey: ["authStatus"],
    queryFn: () => {
      const email = getSessionEmail();
      return { isAuthenticated: !!email, email };
    },
    staleTime: Number.POSITIVE_INFINITY,
  });

  return {
    isAuthenticated: query.data?.isAuthenticated ?? false,
    email: query.data?.email ?? null,
    isLoading: query.isLoading,
  };
}

// ─── useRegister ───────────────────────────────────────────────────────────────
export function useRegister() {
  const { actor } = useActor(createActor);

  return useMutation({
    mutationFn: async (profile: CreateUserProfile) => {
      // 1. Check local duplicate first (fast path)
      const users = getStoredUsers();
      if (users.some((u) => u.email === profile.email)) {
        throw new Error("An account with this email already exists.");
      }

      const passwordHash = simpleHash(profile.password);

      // 2. Register in backend canister (primary source of truth)
      if (actor) {
        try {
          const result = await actor.register({
            username: profile.username,
            email: profile.email,
            password: passwordHash,
          });
          if (result.__kind__ === "err") {
            // If backend says duplicate, treat it as such
            if (
              result.err.toLowerCase().includes("exist") ||
              result.err.toLowerCase().includes("taken")
            ) {
              throw new Error("An account with this email already exists.");
            }
            // Other backend errors — still allow local fallback registration
          }
        } catch (e) {
          // If it's our own thrown error (duplicate), rethrow
          if (e instanceof Error && e.message.includes("already exists")) {
            throw e;
          }
          // Otherwise canister is unavailable — fall through to local-only
        }
      }

      // 3. Always persist locally as cache/fallback
      const newUser: StoredUser = {
        username: profile.username,
        email: profile.email,
        passwordHash,
      };
      saveStoredUsers([...users, newUser]);

      return { email: profile.email };
    },
  });
}

// ─── useLogin ──────────────────────────────────────────────────────────────────
export function useLogin() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: { email: string; password: string }) => {
      const passwordHash = simpleHash(password);

      // 1. Try backend canister login first
      if (actor) {
        try {
          const result = await actor.login(email, passwordHash);
          if (result.__kind__ === "ok") {
            // Backend authenticated successfully — also sync to localStorage
            const users = getStoredUsers();
            if (!users.some((u) => u.email === email)) {
              saveStoredUsers([
                ...users,
                { username: email.split("@")[0], email, passwordHash },
              ]);
            }
            return { email };
          }
          if (result.__kind__ === "err") {
            // Backend explicitly rejected — invalid credentials
            throw new Error("Invalid email or password.");
          }
        } catch (e) {
          if (
            e instanceof Error &&
            e.message === "Invalid email or password."
          ) {
            throw e;
          }
          // Canister unavailable — fall through to localStorage
        }
      }

      // 2. Fallback: validate against localStorage
      const users = getStoredUsers();
      const user = users.find((u) => u.email === email);
      if (!user || user.passwordHash !== passwordHash) {
        throw new Error("Invalid email or password.");
      }
      return { email };
    },
    onSuccess: ({ email }) => {
      setSessionEmail(email);
      queryClient.invalidateQueries({ queryKey: ["authStatus"] });
    },
  });
}

// ─── useLogout ─────────────────────────────────────────────────────────────────
export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    clearSessionEmail();
    queryClient.invalidateQueries({ queryKey: ["authStatus"] });
    queryClient.clear();
  };
}
