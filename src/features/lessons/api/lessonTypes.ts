export interface LessonSummary {
  id: string;
  status: string;
  lesson_type: string;
  scheduled_start: string;
  scheduled_end: string;
  teacher_name?: string;
  student_name?: string;
}

export interface LessonDetail extends LessonSummary {
  duration_minutes?: number;
  teacher_notes?: string;
  homework?: string;
  meeting_url?: string;
}

export interface StartLessonResponse {
  meeting_url: string;
}

export interface BookingSlotRequest {
  teacher_id: number;
  start_datetime: string; // ISO
  duration_minutes: number;
  lesson_type: "trial" | "regular" | "package" | "group";
  package_purchase_id?: string;
  message?: string;
}

export interface RescheduleRequestPayload {
  lesson_id: string;
  new_start: string;
  new_end: string;
  reason: string;
}

export interface FeedbackStudentPayload {
  student_rating: number;
  student_comment?: string;
  student_would_recommend?: boolean;
}

export interface FeedbackTeacherPayload {
  teacher_rating?: number;
  teacher_comment?: string;
  content_quality?: number;
  teaching_effectiveness?: number;
  engagement_level?: number;
  student_progress?: string;
  areas_for_improvement?: string;
  next_lesson_focus?: string;
}

export interface AttendanceUpdatePayload {
  student_joined_at?: string;
  student_left_at?: string;
  student_attended?: boolean;
  student_late_minutes?: number;
  connection_quality?: string;
}

export interface LessonStats {
  total_lessons: number;
  completed_lessons: number;
  upcoming_lessons: number;
  total_hours: number;
  this_month_lessons: number;
  this_week_lessons: number;
  average_rating?: number;
}
