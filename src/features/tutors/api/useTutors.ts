import { useQuery } from "@tanstack/react-query";
import { http } from "../../../lib/http";

export interface TutorSummary {
  id: string;
  name: string;
  ratePerHour: number;
  rating?: number;
  languages: string[];
}

export function useTutors() {
  return useQuery({
    queryKey: ["tutors"],
    queryFn: () => http<TutorSummary[]>("/tutors/"),
    staleTime: 60_000,
  });
}
