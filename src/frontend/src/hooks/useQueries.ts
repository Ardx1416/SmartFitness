import { useQuery } from "@tanstack/react-query";

// Placeholder for future backend integration
// Currently using localStorage for data persistence

export function useWorkouts() {
  return useQuery({
    queryKey: ["workouts"],
    queryFn: () => {
      const workouts = localStorage.getItem("workouts");
      return workouts ? JSON.parse(workouts) : [];
    },
  });
}

export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: () => {
      const sessions = localStorage.getItem("sessions");
      return sessions ? JSON.parse(sessions) : [];
    },
  });
}
