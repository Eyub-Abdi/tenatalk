import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../../../lib/http";
import { lessonKeys } from "./useLessons";
import { BookingSlotRequest, RescheduleRequestPayload } from "./lessonTypes";

async function bookCalendarSlot(payload: BookingSlotRequest) {
  return http<unknown>("/lessons/calendar/book/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function createRescheduleRequest(payload: RescheduleRequestPayload) {
  return http<unknown>("/lessons/reschedules/create/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function useBookSlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookingSlotRequest) => bookCalendarSlot(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: lessonKeys.lists() });
    },
  });
}

export function useCreateReschedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RescheduleRequestPayload) =>
      createRescheduleRequest(payload),
    onSuccess: (_data: unknown, vars: RescheduleRequestPayload) => {
      qc.invalidateQueries({ queryKey: lessonKeys.detail(vars.lesson_id) });
      qc.invalidateQueries({ queryKey: lessonKeys.lists() });
    },
  });
}
