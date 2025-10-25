import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiTrash2,
} from "react-icons/fi";

const DAY_DEFS = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
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

const createHourlySlots = () => {
  const slots: string[] = [];
  for (let hour = START_HOUR; hour <= END_HOUR; hour += 1) {
    const display = `${hour.toString().padStart(2, "0")}:00`;
    slots.push(display);
  }
  return slots;
};

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
  const calendarClosedText = useColorModeValue("gray.500", "gray.400");
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
  const weeklySlots = useMemo(
    () => computeWeeklySlots(availability),
    [availability]
  );
  const monthlySlots = useMemo(
    () =>
      calendarDays.reduce(
        (total, day) => (day.inCurrentMonth ? total + day.slots : total),
        0
      ),
    [calendarDays]
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
        p={{ base: 4, md: 6 }}
      >
        <Stack spacing={4}>
          <HStack
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            spacing={4}
            flexWrap="wrap"
          >
            <Stack spacing={1}>
              <Text
                fontSize="xs"
                textTransform="uppercase"
                fontWeight="semibold"
                color="gray.500"
              >
                Availability calendar
              </Text>
              <Heading size="md">{monthLabel}</Heading>
              <Text fontSize="sm" color="gray.600">
                Your weekly template mapped onto actual dates. Days in teal are
                bookable.
              </Text>
            </Stack>
            <HStack spacing={2}>
              <IconButton
                aria-label="Previous month"
                icon={<FiChevronLeft />}
                size="sm"
                variant="ghost"
                onClick={handlePrevMonth}
              />
              <IconButton
                aria-label="Next month"
                icon={<FiChevronRight />}
                size="sm"
                variant="ghost"
                onClick={handleNextMonth}
              />
            </HStack>
          </HStack>

          <SimpleGrid columns={7} spacing={2}>
            {DAY_DEFS.map((day) => (
              <Text
                key={`calendar-head-${day.key}`}
                fontSize="xs"
                fontWeight="semibold"
                textTransform="uppercase"
                textAlign="center"
                color="gray.500"
              >
                {day.label}
              </Text>
            ))}
            {calendarDays.map((day) => {
              const dayNumber = day.date.getDate();
              const slotLabel = day.slots
                ? `${day.slots} slot${day.slots === 1 ? "" : "s"}`
                : "Closed";
              return (
                <Box
                  key={`calendar-day-${day.date.toISOString()}`}
                  borderWidth="1px"
                  borderColor={day.isToday ? calendarTodayBorder : borderColor}
                  borderRadius="md"
                  p={2}
                  bg={day.slots > 0 ? calendarActiveBg : "transparent"}
                  opacity={day.inCurrentMonth ? 1 : 0.45}
                  minH="68px"
                >
                  <Stack spacing={1} align="flex-start">
                    <Text fontSize="sm" fontWeight="semibold">
                      {dayNumber}
                    </Text>
                    <Text
                      fontSize="xs"
                      color={
                        day.slots > 0 ? calendarOpenText : calendarClosedText
                      }
                    >
                      {slotLabel}
                    </Text>
                  </Stack>
                </Box>
              );
            })}
          </SimpleGrid>

          <HStack
            justify="space-between"
            flexWrap="wrap"
            spacing={2}
            fontSize="sm"
            color="gray.600"
          >
            <Text>
              Weekly open slots: {weeklySlots} ({weeklySlots} hours)
            </Text>
            <Text>Month coverage: {monthlySlots} total slots</Text>
          </HStack>
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

function computeWeeklySlots(availability: AvailabilityState): number {
  return DAY_DEFS.reduce(
    (total, day) => total + availability[day.key].length,
    0
  );
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
