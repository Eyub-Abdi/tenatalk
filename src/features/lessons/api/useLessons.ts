import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../../../lib/http";
import {
  LessonSummary,
  LessonDetail,
  StartLessonResponse,
  FeedbackStudentPayload,
  FeedbackTeacherPayload,
  AttendanceUpdatePayload,
  LessonStats,
} from "./lessonTypes";

// Query Keys
export const lessonKeys = {
  all: ["lessons"] as const,
  lists: () => [...lessonKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...lessonKeys.lists(), { filters }] as const,
  detail: (id: string) => [...lessonKeys.all, "detail", id] as const,
  stats: () => [...lessonKeys.all, "stats"] as const,
};

// Fetch functions
async function fetchLessons(filters: Record<string, unknown> = {}) {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v != null && v !== "") as [
      string,
      string
    ][]
  );
  return http<LessonSummary[]>(`/lessons/?${params.toString()}`);
}

async function fetchLesson(id: string) {
  return http<LessonDetail>(`/lessons/${id}/`);
}

async function startLesson(id: string) {
  return http<StartLessonResponse>(`/lessons/${id}/start/`, { method: "POST" });
}

async function endLesson(id: string) {
  return http<LessonDetail>(`/lessons/${id}/end/`, { method: "POST" });
}

async function updateStudentFeedback(
  id: string,
  payload: FeedbackStudentPayload
) {
  return http<unknown>(`/lessons/${id}/feedback/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

async function updateTeacherFeedback(
  id: string,
  payload: FeedbackTeacherPayload
) {
  return http<unknown>(`/lessons/${id}/feedback/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

async function updateAttendance(id: string, payload: AttendanceUpdatePayload) {
  return http<unknown>(`/lessons/${id}/attendance/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

async function fetchStats() {
  return http<LessonStats>(`/lessons/stats/`);
}

// Hooks
export function useLessons(filters: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: lessonKeys.list(filters),
    queryFn: () => fetchLessons(filters),
    staleTime: 60_000,
  });
}

export function useLesson(id: string) {
  return useQuery({
    queryKey: lessonKeys.detail(id),
    queryFn: () => fetchLesson(id),
    enabled: !!id,
  });
}

export function useStartLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => startLesson(id),
    onSuccess: (_data: StartLessonResponse, id: string) => {
      qc.invalidateQueries({ queryKey: lessonKeys.detail(id) });
      qc.invalidateQueries({ queryKey: lessonKeys.lists() });
    },
  });
}

export function useEndLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => endLesson(id),
    onSuccess: (_data: LessonDetail, id: string) => {
      qc.invalidateQueries({ queryKey: lessonKeys.detail(id) });
      qc.invalidateQueries({ queryKey: lessonKeys.lists() });
    },
  });
}

export function useUpdateStudentFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: FeedbackStudentPayload;
    }) => updateStudentFeedback(id, payload),
    onSuccess: (
      _data: unknown,
      vars: { id: string; payload: FeedbackStudentPayload }
    ) => {
      qc.invalidateQueries({ queryKey: lessonKeys.detail(vars.id) });
    },
  });
}

export function useUpdateTeacherFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: FeedbackTeacherPayload;
    }) => updateTeacherFeedback(id, payload),
    onSuccess: (
      _data: unknown,
      vars: { id: string; payload: FeedbackTeacherPayload }
    ) => {
      qc.invalidateQueries({ queryKey: lessonKeys.detail(vars.id) });
    },
  });
}

export function useUpdateAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AttendanceUpdatePayload;
    }) => updateAttendance(id, payload),
    onSuccess: (
      _data: unknown,
      vars: { id: string; payload: AttendanceUpdatePayload }
    ) => {
      qc.invalidateQueries({ queryKey: lessonKeys.detail(vars.id) });
    },
  });
}

export function useLessonStats() {
  return useQuery({
    queryKey: lessonKeys.stats(),
    queryFn: fetchStats,
    staleTime: 30_000,
  });
}
