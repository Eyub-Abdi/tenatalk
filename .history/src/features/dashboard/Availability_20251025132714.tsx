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
import type { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";

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
  const [monthCursor, setMonthCursor] = useState(() =>
    startOfMonth(new Date())
  );
  const toast = useToast();
  const timeSlots = useMemo(() => createHourlySlots(), []);
  const activeBg = useColorModeValue("brand.100", "brand.500Alpha.200");
  const inactiveBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBg = useColorModeValue("gray.100", "gray.700");
  const timeBg = useColorModeValue("gray.50", "gray.800");
  const activeText = useColorModeValue("brand.700", "white");
  const inactiveText = useColorModeValue("gray.600", "gray.200");
  const activeHoverBg = useColorModeValue("brand.200", "brand.500Alpha.300");
  const inactiveHoverBg = useColorModeValue("gray.100", "gray.600");
  const cardBg = useColorModeValue("white", "gray.800");
  const calendarActiveBg = useColorModeValue("brand.50", "brand.500Alpha.200");
  const calendarOpenText = useColorModeValue("brand.700", "brand.100");
  const calendarTodayBorder = useColorModeValue("brand.400", "brand.300");

  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }),
    []
  );
  const monthLabel = useMemo(
    () => monthFormatter.format(monthCursor),
    [monthCursor, monthFormatter]
  );
  const calendarDays = useMemo<CalendarDay[]>(
    () => buildCalendarDays(monthCursor, availability),
    [availability, monthCursor]
  );

  const handlePrevMonth = useCallback(() => {
    setMonthCursor(
      (prev: Date) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }, []);

  const handleNextMonth = useCallback(() => {
    setMonthCursor(
      (prev: Date) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
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

  const toggleSlot = useCallback((day: DayKey, slot: string) => {
    setAvailability((prev) => {
      const current = new Set(prev[day]);
      if (current.has(slot)) {
        current.delete(slot);
      } else {
        current.add(slot);
      }
      return {
        ...prev,
        [day]: Array.from(current).sort(),
      };
    });
  }, []);

  const clearAll = () => {
    setAvailability(createInitialAvailability());
    toast({
      title: "Availability cleared",
      status: "info",
      position: "top-right",
    });
  };

  const setDefaultWeek = () => {
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
  };

  return (
    <Stack spacing={8}>
      <Box>
        <Heading size="lg" mb={2}>
          Availability
        </Heading>
        <Text color="gray.600">
          Click a time slot to toggle your availability. Changes are saved
          locally and will sync with the backend once the scheduling API is
          ready.
        </Text>
      </Box>

      <HStack spacing={3}>
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
        {lastSavedAt && <Badge colorScheme="green">Saved {lastSavedAt}</Badge>}
      </HStack>

      <Box
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        bg={cardBg}
        shadow="sm"
        p={{ base: 4, md: 5 }}
      >
        <Stack spacing={4}>
          <HStack
            justify="space-between"
            align="center"
            spacing={4}
            flexWrap="wrap"
          >
            <Stack spacing={0.5}>
              <Heading size="md">{monthLabel}</Heading>
              <Text fontSize="xs" color="gray.500">
                Weekly template mapped to dates. Teal = bookable.
              </Text>
            </Stack>
            <HStack spacing={1}>
              <IconButton
                aria-label="Previous month"
                icon={<FiChevronLeft />}
                size="sm"
                variant="outline"
                onClick={handlePrevMonth}
              />
              <IconButton
                aria-label="Next month"
                icon={<FiChevronRight />}
                size="sm"
                variant="outline"
                onClick={handleNextMonth}
              />
            </HStack>
          </HStack>

          <Box>
            <SimpleGrid columns={7} spacing={1} mb={1}>
              {DAY_DEFS.map((day) => (
                <Text
                  key={`calendar-head-${day.key}`}
                  fontSize="2xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  textAlign="center"
                  color="gray.500"
                  py={1}
                >
                  {day.label}
                </Text>
              ))}
            </SimpleGrid>
            <SimpleGrid columns={7} spacing={1}>
              {calendarDays.map((day) => {
                const dayNumber = day.date.getDate();
                return (
                  <Box
                    key={`calendar-day-${day.date.toISOString()}`}
                    borderWidth="1px"
                    borderColor={
                      day.isToday
                        ? calendarTodayBorder
                        : day.slots > 0
                        ? "brand.300"
                        : borderColor
                    }
                    borderRadius="md"
                    p={2}
                    bg={day.slots > 0 ? calendarActiveBg : "transparent"}
                    opacity={day.inCurrentMonth ? 1 : 0.4}
                    minH="56px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    transition="all 0.2s"
                    _hover={{
                      shadow: day.inCurrentMonth ? "sm" : "none",
                      borderColor: day.inCurrentMonth
                        ? "brand.400"
                        : borderColor,
                    }}
                  >
                    <Text
                      fontSize="xs"
                      fontWeight={day.isToday ? "bold" : "semibold"}
                      color={day.isToday ? "brand.600" : undefined}
                    >
                      {dayNumber}
                    </Text>
                    {day.slots > 0 && (
                      <Text
                        fontSize="2xs"
                        color={calendarOpenText}
                        fontWeight="medium"
                      >
                        {day.slots}h
                      </Text>
                    )}
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>
        </Stack>
      </Box>

      <Box overflowX="auto">
        <Box minW="760px">
          <Grid
            templateColumns={`100px repeat(${DAY_DEFS.length}, 1fr)`}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            overflow="hidden"
          >
            <GridItem
              bg={headerBg}
              p={3}
              borderRight="1px solid"
              borderColor={borderColor}
            >
              <Text fontWeight="semibold" fontSize="sm">
                Time
              </Text>
            </GridItem>
            {DAY_DEFS.map((day) => (
              <GridItem
                key={day.key}
                bg={headerBg}
                p={3}
                borderRight="1px solid"
                borderColor={borderColor}
                textAlign="center"
              >
                <Text fontWeight="semibold" fontSize="sm">
                  {day.label}
                </Text>
              </GridItem>
            ))}

            {timeSlots.map((slot) => (
              <Fragment key={slot}>
                <GridItem
                  p={2}
                  borderTop="1px solid"
                  borderRight="1px solid"
                  borderColor={borderColor}
                  bg={timeBg}
                >
                  <Text fontSize="sm" fontWeight="medium">
                    {slot}
                  </Text>
                </GridItem>
                {DAY_DEFS.map((day) => {
                  const isActive = availability[day.key].includes(slot);
                  return (
                    <GridItem
                      key={`${day.key}-${slot}`}
                      borderTop="1px solid"
                      borderRight="1px solid"
                      borderColor={borderColor}
                      p={1.5}
                    >
                      <Tooltip
                        label={isActive ? "Available" : "Unavailable"}
                        openDelay={250}
                      >
                        <Button
                          size="sm"
                          width="full"
                          height="36px"
                          bg={isActive ? activeBg : inactiveBg}
                          color={isActive ? activeText : inactiveText}
                          variant={isActive ? "solid" : "outline"}
                          borderColor={isActive ? "brand.300" : borderColor}
                          onClick={() => toggleSlot(day.key, slot)}
                          _hover={{
                            bg: isActive ? activeHoverBg : inactiveHoverBg,
                          }}
                        >
                          {isActive ? "Open" : "Closed"}
                        </Button>
                      </Tooltip>
                    </GridItem>
                  );
                })}
              </Fragment>
            ))}
          </Grid>
        </Box>
      </Box>

      <Flex direction="column" gap={2}>
        <Heading size="sm">Tips</Heading>
        <Text fontSize="sm" color="gray.600">
          • Keep at least 15 hours per week available to boost your placement in
          tutor search results.
        </Text>
        <Text fontSize="sm" color="gray.600">
          • Ensure your availability matches the timezone settings in your
          account preferences.
        </Text>
        <Text fontSize="sm" color="gray.600">
          • We&apos;ll sync these slots automatically once the scheduling API
          goes live.
        </Text>
      </Flex>
    </Stack>
  );
}

type CalendarDay = {
  date: Date;
  inCurrentMonth: boolean;
  slots: number;
  isToday: boolean;
};

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildCalendarDays(
  cursor: Date,
  availability: AvailabilityState
): CalendarDay[] {
  const start = startOfMonth(cursor);
  const year = start.getFullYear();
  const month = start.getMonth();
  const firstDayOffset = (start.getDay() + 6) % 7; // Monday-first
  const days: CalendarDay[] = [];

  for (let offset = firstDayOffset; offset > 0; offset -= 1) {
    const date = new Date(year, month, 1 - offset);
    days.push(createCalendarDay(date, false, availability));
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    days.push(createCalendarDay(date, true, availability));
  }

  while (days.length < 42) {
    const last = days[days.length - 1]?.date ?? start;
    const nextDate = new Date(
      last.getFullYear(),
      last.getMonth(),
      last.getDate() + 1
    );
    days.push(createCalendarDay(nextDate, false, availability));
  }

  return days;
}

function createCalendarDay(
  date: Date,
  inCurrentMonth: boolean,
  availability: AvailabilityState
): CalendarDay {
  const dayKey = getDayKeyFromDate(date);
  const slots = availability[dayKey]?.length ?? 0;
  return {
    date,
    inCurrentMonth,
    slots,
    isToday: isSameDay(date, new Date()),
  };
}

function getDayKeyFromDate(date: Date): DayKey {
  const index = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday-first index
  return DAY_DEFS[index].key;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
