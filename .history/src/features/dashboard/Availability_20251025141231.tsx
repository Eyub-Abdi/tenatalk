import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiRefreshCw, FiTrash2 } from "react-icons/fi";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  EventInput,
  DateSelectArg,
  EventClickArg,
} from "@fullcalendar/core";

const DAY_DEFS = [
  { key: "monday", label: "Mon", dayIndex: 1 },
  { key: "tuesday", label: "Tue", dayIndex: 2 },
  { key: "wednesday", label: "Wed", dayIndex: 3 },
  { key: "thursday", label: "Thu", dayIndex: 4 },
  { key: "friday", label: "Fri", dayIndex: 5 },
  { key: "saturday", label: "Sat", dayIndex: 6 },
  { key: "sunday", label: "Sun", dayIndex: 0 },
] as const;

type DayKey = (typeof DAY_DEFS)[number]["key"];
type AvailabilityState = Record<DayKey, string[]>;

const STORAGE_KEY = "tutor_availability_v1";
const START_HOUR = 7;
const END_HOUR = 21;

const createInitialAvailability = (): AvailabilityState =>
  DAY_DEFS.reduce(
    (acc, day) => ({
      ...acc,
      [day.key]: [],
    }),
    {} as AvailabilityState
  );

function getNextDate(baseDate: Date, targetDayKey: DayKey): Date {
  const targetDay = DAY_DEFS.find((d) => d.key === targetDayKey);
  if (!targetDay) return baseDate;

  const currentDay = baseDate.getDay();
  let daysToAdd = targetDay.dayIndex - currentDay;
  if (daysToAdd < 0) daysToAdd += 7;

  const result = new Date(baseDate);
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

function getDayKeyFromDate(date: Date): DayKey {
  const dayIndex = date.getDay();
  const dayDef = DAY_DEFS.find((d) => d.dayIndex === dayIndex);
  return dayDef ? dayDef.key : "monday";
}

const DEFAULT_WEEKDAY_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
];

const loadStoredAvailability = (): AvailabilityState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialAvailability();
    const parsed = JSON.parse(raw) as AvailabilityState;
    const base = createInitialAvailability();
    (Object.keys(parsed) as DayKey[]).forEach((day) => {
      if (day in base && Array.isArray(parsed[day])) {
        base[day] = parsed[day]
          .filter((slot) => typeof slot === "string")
          .sort();
      }
    });
    return base;
  } catch (err) {
    console.warn("Failed to read availability from storage", err);
    return createInitialAvailability();
  }
};

export default function Availability() {
  const [availability, setAvailability] = useState<AvailabilityState>(() =>
    loadStoredAvailability()
  );
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const brandColor = useColorModeValue("#4299E1", "#63B3ED");

  // Calculate the date for yesterday to make today the 2nd column
  const weekStartDate = useMemo(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday;
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(availability));
      setLastSavedAt(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn("Failed to persist availability", err);
      toast({
        title: "Could not save availability",
        description: "Storage quota may be full. Please try again later.",
        status: "warning",
        position: "top-right",
      });
    }
  }, [availability, toast]);

  const events = useMemo<EventInput[]>(() => {
    const today = new Date();
    const eventsArray: EventInput[] = [];
    let eventId = 0;

    DAY_DEFS.forEach((dayDef) => {
      const slots = availability[dayDef.key];
      if (!slots || slots.length === 0) return;

      const targetDate = getNextDate(today, dayDef.key);
      const dateStr = targetDate.toISOString().split("T")[0];

      slots.forEach((timeSlot) => {
        const [hour] = timeSlot.split(":").map(Number);
        const startTime = `${dateStr}T${timeSlot}:00`;
        const endHour = hour + 1;
        const endTime = `${dateStr}T${endHour
          .toString()
          .padStart(2, "0")}:00:00`;

        eventsArray.push({
          id: `${eventId++}`,
          title: "Available",
          start: startTime,
          end: endTime,
          backgroundColor: brandColor,
          borderColor: brandColor,
          extendedProps: {
            dayKey: dayDef.key,
            timeSlot,
          },
        });
      });
    });

    return eventsArray;
  }, [availability, brandColor]);

  const handleDateSelect = useCallback(
    (selectInfo: DateSelectArg) => {
      const startDate = selectInfo.start;
      const dayKey = getDayKeyFromDate(startDate);
      const hour = startDate.getHours();
      const timeSlot = `${hour.toString().padStart(2, "0")}:00`;

      setAvailability((prev) => {
        const current = new Set(prev[dayKey]);
        if (current.has(timeSlot)) {
          current.delete(timeSlot);
          toast({
            title: "Slot removed",
            description: `${dayKey} at ${timeSlot} marked unavailable`,
            status: "info",
            duration: 2000,
            position: "top-right",
          });
        } else {
          current.add(timeSlot);
          toast({
            title: "Slot added",
            description: `${dayKey} at ${timeSlot} marked available`,
            status: "success",
            duration: 2000,
            position: "top-right",
          });
        }
        return {
          ...prev,
          [dayKey]: Array.from(current).sort(),
        };
      });

      selectInfo.view.calendar.unselect();
    },
    [toast]
  );

  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      const { dayKey, timeSlot } = clickInfo.event.extendedProps as {
        dayKey: DayKey;
        timeSlot: string;
      };

      setAvailability((prev) => {
        const current = new Set(prev[dayKey]);
        current.delete(timeSlot);
        return {
          ...prev,
          [dayKey]: Array.from(current).sort(),
        };
      });

      toast({
        title: "Slot removed",
        description: `${dayKey} at ${timeSlot} marked unavailable`,
        status: "info",
        duration: 2000,
        position: "top-right",
      });
    },
    [toast]
  );

  const clearAll = useCallback(() => {
    setAvailability(createInitialAvailability());
    toast({
      title: "Availability cleared",
      status: "info",
      position: "top-right",
    });
  }, [toast]);

  const setDefaultWeek = useCallback(() => {
    setAvailability((prev) => {
      const updated: AvailabilityState = { ...prev };
      DAY_DEFS.forEach((day, index) => {
        if (index < 5) {
          updated[day.key] = [...DEFAULT_WEEKDAY_SLOTS];
        } else {
          updated[day.key] = [];
        }
      });
      return updated;
    });
    toast({
      title: "Weekday template applied",
      description: "Slots added for Monday to Friday 09:00-15:00.",
      status: "success",
      position: "top-right",
    });
  }, [toast]);

  return (
    <Stack spacing={6}>
      <Box>
        <Heading size="lg" mb={2}>
          Availability Calendar
        </Heading>
        <Text color="gray.600" fontSize="sm">
          Click on time slots to toggle your availability. Click existing slots
          to remove them.
        </Text>
      </Box>

      <HStack spacing={3} flexWrap="wrap">
        <Button
          leftIcon={<FiRefreshCw />}
          variant="outline"
          size="sm"
          onClick={setDefaultWeek}
        >
          Apply weekday template
        </Button>
        <Button
          leftIcon={<FiTrash2 />}
          variant="outline"
          size="sm"
          onClick={clearAll}
        >
          Clear all
        </Button>
        {lastSavedAt && (
          <Badge colorScheme="green" fontSize="xs">
            Saved {lastSavedAt}
          </Badge>
        )}
      </HStack>

      <Box
        bg={cardBg}
        borderRadius="lg"
        border="1px solid"
        borderColor={borderColor}
        p={{ base: 4, md: 5 }}
        shadow="sm"
        sx={{
          "& .fc": {
            fontFamily: "inherit",
          },
          "& .fc-button": {
            backgroundColor: brandColor,
            border: "none",
            textTransform: "capitalize",
            fontSize: "sm",
            padding: "0.5rem 1rem",
            outline: "none",
            boxShadow: "none",
          },
          "& .fc-button:hover": {
            backgroundColor: brandColor,
            opacity: 0.9,
          },
          "& .fc-button:focus": {
            outline: "none",
            boxShadow: "none",
          },
          "& .fc-button-primary:not(:disabled).fc-button-active": {
            backgroundColor: brandColor,
            border: "none",
            outline: "none",
            boxShadow: "none",
            opacity: 1,
            fontWeight: "600",
          },
          "& .fc-button-group .fc-button": {
            outline: "none !important",
            boxShadow: "none !important",
            opacity: 0.7,
          },
          "& .fc-button-group .fc-button:focus": {
            outline: "none !important",
            boxShadow: "none !important",
          },
          "& .fc-button-group .fc-button:active": {
            outline: "none !important",
            boxShadow: "none !important",
          },
          "& .fc-button-group .fc-button-active": {
            opacity: "1 !important",
            fontWeight: "600 !important",
          },
          "& .fc-col-header-cell": {
            padding: "0.75rem",
            fontWeight: "600",
            fontSize: "sm",
            textTransform: "uppercase",
            color: "gray.500",
          },
          "& .fc-timegrid-slot": {
            height: "3rem",
          },
          "& .fc-event": {
            cursor: "pointer",
            fontSize: "xs",
          },
          "& .fc-daygrid-day": {
            cursor: "pointer",
          },
          "& .fc-highlight": {
            backgroundColor: "#4299E1 !important",
            opacity: "0.3",
          },
          "& .fc-timegrid-event": {
            backgroundColor: "#48BB78 !important",
            borderColor: "#48BB78 !important",
          },
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          initialDate={weekStartDate}
          firstDay={weekStartDate.getDay()}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          slotMinTime={`${START_HOUR.toString().padStart(2, "0")}:00:00`}
          slotMaxTime={`${(END_HOUR + 1).toString().padStart(2, "0")}:00:00`}
          allDaySlot={false}
          selectable={true}
          selectMirror={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          events={events}
          height="auto"
          slotDuration="01:00:00"
          slotLabelInterval="01:00"
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
        />
      </Box>

      <Stack spacing={2}>
        <Heading size="sm">Tips</Heading>
        <Text fontSize="sm" color="gray.600">
          • Click on empty time slots to mark yourself available.
        </Text>
        <Text fontSize="sm" color="gray.600">
          • Click on existing slots (in blue) to remove availability.
        </Text>
        <Text fontSize="sm" color="gray.600">
          • Keep at least 15 hours per week available to boost your placement in
          tutor search.
        </Text>
        <Text fontSize="sm" color="gray.600">
          • Changes are saved automatically to your browser&apos;s local
          storage.
        </Text>
      </Stack>
    </Stack>
  );
}
