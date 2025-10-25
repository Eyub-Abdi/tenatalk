import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Progress,
  SimpleGrid,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  FiCheckCircle,
  FiCircle,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";
import { useLessonStats } from "../lessons/api/useLessons";

type ChecklistItem = {
  id: string;
  label: string;
  helper?: string;
  completed: boolean;
  action?: { label: string; to: string };
};

export default function Overview() {
  const { data, isLoading } = useLessonStats();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedText = useColorModeValue("gray.600", "gray.400");

  const computeChecklist = useCallback((): ChecklistItem[] => {
    if (typeof window === "undefined") {
      return [
        {
          id: "languages",
          label: "Add teaching languages",
          completed: false,
          action: { label: "Update", to: "/teacher-application" },
        },
        {
          id: "bio",
          label: "Write your tutor bio",
          completed: false,
          action: { label: "Write", to: "/teacher-application" },
        },
        {
          id: "interests",
          label: "Pick 5 teaching interests",
          completed: false,
          action: { label: "Pick", to: "/teacher-application" },
        },
        {
          id: "availability",
          label: "Publish weekly availability",
          completed: false,
          action: { label: "Set availability", to: "/dashboard/availability" },
        },
      ];
    }

    let snapshot: Record<string, unknown> = {};
    try {
      const stored = localStorage.getItem("tutor_application_progress_v1");
      if (stored) {
        const parsed = JSON.parse(stored) as {
          formSnapshot?: Record<string, unknown>;
        };
        snapshot = parsed.formSnapshot ?? {};
      }
    } catch (err) {
      console.warn("Failed to parse tutor application progress", err);
    }

    let hasAvailability = false;
    try {
      const availabilityRaw = localStorage.getItem("tutor_availability_v1");
      if (availabilityRaw) {
        const parsed = JSON.parse(availabilityRaw) as Record<string, unknown>;
        hasAvailability = Object.values(parsed).some(
          (slots) => Array.isArray(slots) && slots.length > 0
        );
      }
    } catch (err) {
      console.warn("Failed to parse saved availability", err);
    }

    const teachingLanguages = Array.isArray(snapshot.teaching_languages)
      ? (snapshot.teaching_languages as unknown[])
      : [];
    const aboutMe = typeof snapshot.about_me === "string" ? snapshot.about_me : "";
    const teachingStyle =
      typeof snapshot.lessons_teaching_style === "string"
        ? snapshot.lessons_teaching_style
        : "";
    const interests = Array.isArray(snapshot.teaching_interests)
      ? (snapshot.teaching_interests as unknown[])
      : [];

    return [
      {
        id: "languages",
        label: "Add teaching languages",
        helper: "At least one language is required to appear in search.",
        completed: teachingLanguages.length > 0,
        action: { label: teachingLanguages.length ? "Manage" : "Add", to: "/teacher-application" },
      },
      {
        id: "bio",
        label: "Write your tutor bio",
        helper: "Aim for at least 160 characters so students get to know you.",
        completed: aboutMe.trim().length >= 160,
        action: { label: aboutMe ? "Edit" : "Write", to: "/teacher-application" },
      },
      {
        id: "teaching-style",
        label: "Describe your teaching style",
        helper: "Explain how lessons feel in 120+ characters.",
        completed: teachingStyle.trim().length >= 120,
        action: { label: teachingStyle ? "Edit" : "Describe", to: "/teacher-application" },
      },
      {
        id: "interests",
        label: "Pick 5 teaching interests",
        helper: "Helps match you with students who share your interests.",
        completed: interests.length >= 5,
        action: { label: interests.length ? "Manage" : "Pick", to: "/teacher-application" },
      },
      {
        id: "availability",
        label: "Publish weekly availability",
        helper: "Open slots so students can book you right away.",
        completed: hasAvailability,
        action: {
          label: hasAvailability ? "Adjust" : "Set availability",
          to: "/dashboard/availability",
        },
      },
    ];
  }, []);

  const [checklist, setChecklist] = useState<ChecklistItem[]>(() =>
    computeChecklist()
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => setChecklist(computeChecklist());
    sync();
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("storage", sync);
    };
  }, [computeChecklist]);

  const completionMetrics = useMemo(() => {
    const total = checklist.length;
    const completed = checklist.filter((item) => item.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percent };
  }, [checklist]);

  const earningsSummary = useMemo(() => {
    const averageRate = 20; // USD per lesson placeholder
    const completedLessons = data?.completed_lessons ?? 0;
    const upcomingLessons = data?.upcoming_lessons ?? 0;
    const monthLessons = data?.this_month_lessons ?? 0;
    const weekLessons = data?.this_week_lessons ?? 0;

    const totalEarned = completedLessons * averageRate;
    const pendingPayout = upcomingLessons * averageRate;
    const monthToDate = monthLessons * averageRate;

    const assumedWeeks = 4;
    const previousLessonCount = Math.max(monthLessons - weekLessons, 0);
    const previousWeeklyAverage = previousLessonCount > 0
      ? previousLessonCount / Math.max(assumedWeeks - 1, 1)
      : 0;
    const changeBase = previousWeeklyAverage || (monthLessons ? monthLessons / assumedWeeks : 0);
    const changePercent = changeBase
      ? Math.round(((weekLessons - changeBase) / changeBase) * 100)
      : 0;

    return {
      totalEarned,
      pendingPayout,
      monthToDate,
      changePercent,
    };
  }, [data]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    []
  );

  const formatCurrency = useCallback(
    (value: number) => currencyFormatter.format(value),
    [currencyFormatter]
  );

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Overview
      </Heading>
      {isLoading && <Text>Loading...</Text>}
      {data && (
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={6}>
          <Stat bg={cardBg} p={4} borderRadius="md" shadow="sm">
            <StatLabel>Total</StatLabel>
            <StatNumber>{data.total_lessons}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} borderRadius="md" shadow="sm">
            <StatLabel>Upcoming</StatLabel>
            <StatNumber>{data.upcoming_lessons}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} borderRadius="md" shadow="sm">
            <StatLabel>Completed</StatLabel>
            <StatNumber>{data.completed_lessons}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} borderRadius="md" shadow="sm">
            <StatLabel>Total Hours</StatLabel>
            <StatNumber>{data.total_hours}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} borderRadius="md" shadow="sm">
            <StatLabel>Month</StatLabel>
            <StatNumber>{data.this_month_lessons}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} borderRadius="md" shadow="sm">
            <StatLabel>Week</StatLabel>
            <StatNumber>{data.this_week_lessons}</StatNumber>
          </Stat>
        </SimpleGrid>
      )}

      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
        <Box bg={cardBg} borderRadius="md" border="1px solid" borderColor={borderColor} p={6} shadow="sm">
          <Stack spacing={4}>
            <Box>
              <Heading size="md">Profile completion</Heading>
              <Text color={mutedText} fontSize="sm">
                Finishing these steps helps unlock higher placement in tutor search.
              </Text>
            </Box>
            <Box>
              <Progress value={completionMetrics.percent} colorScheme="brand" borderRadius="full" />
              <HStack justify="space-between" mt={2} fontSize="sm" color={mutedText}>
                <Text>{completionMetrics.percent}% complete</Text>
                <Text>
                  {completionMetrics.completed}/{completionMetrics.total} tasks done
                </Text>
              </HStack>
            </Box>
            <Stack spacing={3}>
              {checklist.map((item) => {
                const iconColor = item.completed ? "green.500" : "gray.400";
                return (
                  <HStack key={item.id} align="flex-start" spacing={3}>
                    <Icon
                      as={item.completed ? FiCheckCircle : FiCircle}
                      boxSize={5}
                      color={iconColor}
                      mt={1}
                    />
                    <Box flex="1">
                      <Text fontWeight="semibold" fontSize="sm">
                        {item.label}
                      </Text>
                      {item.helper && (
                        <Text fontSize="xs" color={mutedText} mt={0.5}>
                          {item.helper}
                        </Text>
                      )}
                    </Box>
                    {!item.completed && item.action && (
                      <Button
                        as={RouterLink}
                        to={item.action.to}
                        size="xs"
                        variant="ghost"
                        colorScheme="brand"
                      >
                        {item.action.label}
                      </Button>
                    )}
                  </HStack>
                );
              })}
            </Stack>
          </Stack>
        </Box>

        <Box bg={cardBg} borderRadius="md" border="1px solid" borderColor={borderColor} p={6} shadow="sm">
          <Stack spacing={4}>
            <Box>
              <Heading size="md">Earnings snapshot</Heading>
              <Text color={mutedText} fontSize="sm">
                Estimates based on your recent lessons and a $20/hr placeholder rate.
              </Text>
            </Box>
            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
              <Box>
                <Text fontSize="xs" color={mutedText} textTransform="uppercase" fontWeight="semibold">
                  Total earned
                </Text>
                <HStack mt={1} spacing={2}>
                  <Icon as={FiDollarSign} color="brand.500" />
                  <Text fontSize="lg" fontWeight="bold">
                    {formatCurrency(earningsSummary.totalEarned)}
                  </Text>
                </HStack>
              </Box>
              <Box>
                <Text fontSize="xs" color={mutedText} textTransform="uppercase" fontWeight="semibold">
                  Pending payout
                </Text>
                <Text mt={1} fontSize="lg" fontWeight="bold">
                  {formatCurrency(earningsSummary.pendingPayout)}
                </Text>
              </Box>
              <Box>
                <Text fontSize="xs" color={mutedText} textTransform="uppercase" fontWeight="semibold">
                  Month-to-date
                </Text>
                <Text mt={1} fontSize="lg" fontWeight="bold">
                  {formatCurrency(earningsSummary.monthToDate)}
                </Text>
              </Box>
            </SimpleGrid>
            <HStack spacing={2} align="center">
              <Icon as={FiTrendingUp} color={earningsSummary.changePercent >= 0 ? "green.500" : "red.500"} />
              <Badge colorScheme={earningsSummary.changePercent >= 0 ? "green" : "red"}>
                {earningsSummary.changePercent >= 0 ? "+" : ""}
                {earningsSummary.changePercent}% vs last week
              </Badge>
              <Text fontSize="sm" color={mutedText}>
                Track more detail once payouts API is connected.
              </Text>
            </HStack>
          </Stack>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
