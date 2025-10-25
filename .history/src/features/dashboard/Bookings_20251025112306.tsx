import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiEdit3,
  FiPlay,
  FiRefreshCw,
  FiUser,
} from "react-icons/fi";
import type { LessonSummary } from "../lessons/api/lessonTypes";
import {
  useEndLesson,
  useLessons,
  useStartLesson,
} from "../lessons/api/useLessons";
import { useCreateReschedule } from "../lessons/api/useBookingReschedule";

export default function Bookings() {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedText = useColorModeValue("gray.600", "gray.400");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useLessons({ mine: true });
  const bookings = useMemo(() => data ?? [], [data]);

  const startLesson = useStartLesson();
  const endLesson = useEndLesson();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBooking, setSelectedBooking] = useState<LessonSummary | null>(
    null
  );
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [reason, setReason] = useState("");
  const { mutateAsync: rescheduleAsync, isPending } = useCreateReschedule();

  const attentionStatuses = useMemo(
    () => new Set(["pending", "awaiting_confirmation", "reschedule_requested"]),
    []
  );
  const pastStatuses = useMemo(
    () => new Set(["completed", "cancelled", "no_show", "declined"]),
    []
  );

  type FilterOption = "attention" | "upcoming" | "past" | "all";
  const [filter, setFilter] = useState<FilterOption>("attention");

  const statusMeta = useMemo(
    () => ({
      pending: { label: "Pending", colorScheme: "orange" },
      awaiting_confirmation: {
        label: "Awaiting confirmation",
        colorScheme: "yellow",
      },
      reschedule_requested: {
        label: "Reschedule requested",
        colorScheme: "purple",
      },
      confirmed: { label: "Confirmed", colorScheme: "green" },
      scheduled: { label: "Scheduled", colorScheme: "green" },
      in_progress: { label: "In progress", colorScheme: "blue" },
      completed: { label: "Completed", colorScheme: "gray" },
      cancelled: { label: "Cancelled", colorScheme: "red" },
      no_show: { label: "No show", colorScheme: "red" },
      declined: { label: "Declined", colorScheme: "red" },
    }),
    []
  );

  const stats = useMemo(() => {
    const now = Date.now();
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

  let upcoming = 0;
  let attention = 0;
  let completedThisWeek = 0;
  let past = 0;
    let nextLesson: LessonSummary | null = null;

    bookings.forEach((booking) => {
      const status = (booking.status ?? "").toLowerCase();
      const startMs = Date.parse(booking.scheduled_start);
      if (Number.isNaN(startMs)) {
        return;
      }

      if (!pastStatuses.has(status) && startMs >= now) {
        upcoming += 1;
        if (!nextLesson || startMs < Date.parse(nextLesson.scheduled_start)) {
          nextLesson = booking;
        }
      }

      if (attentionStatuses.has(status)) {
        attention += 1;
      }

      if (status === "completed" && startMs >= startOfWeek.getTime()) {
        completedThisWeek += 1;
      }

      if (pastStatuses.has(status) || startMs < now) {
        past += 1;
      }
    });

    return { upcoming, attention, completedThisWeek, nextLesson, past };
  }, [attentionStatuses, bookings, pastStatuses]);

  const filters = useMemo(
    () => [
      { label: "Needs attention", value: "attention" as const, count: stats.attention },
      { label: "Upcoming", value: "upcoming" as const, count: stats.upcoming },
      { label: "Past", value: "past" as const, count: stats.past },
      { label: "All", value: "all" as const, count: bookings.length },
    ],
    [bookings.length, stats.attention, stats.past, stats.upcoming]
  );

  const formatDateTime = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    []
  );

  const relativeLabel = useCallback((iso: string) => {
    const targetMs = Date.parse(iso);
    if (Number.isNaN(targetMs)) {
      return "";
    }
    const diffMs = targetMs - Date.now();
    const diffMinutes = Math.round(diffMs / 60000);
    if (Math.abs(diffMinutes) < 60) {
      if (diffMinutes === 0) return "happening now";
      return diffMinutes > 0
        ? `in ${diffMinutes} min`
        : `${Math.abs(diffMinutes)} min ago`;
    }
    const diffHours = Math.round(diffMinutes / 60);
    if (Math.abs(diffHours) < 24) {
      return diffHours > 0
        ? `in ${diffHours} hr`
        : `${Math.abs(diffHours)} hr ago`;
    }
    const diffDays = Math.round(diffHours / 24);
    return diffDays > 0 ? `in ${diffDays} days` : `${Math.abs(diffDays)} days ago`;
  }, []);

  const filteredBookings = useMemo(() => {
    const now = Date.now();
    const sorted = [...bookings].sort((a, b) => {
      const diff =
        Date.parse(a.scheduled_start) - Date.parse(b.scheduled_start);
      return filter === "past" ? -diff : diff;
    });

    return sorted.filter((booking) => {
      const status = (booking.status ?? "").toLowerCase();
      const startMs = Date.parse(booking.scheduled_start);
      if (filter === "attention") {
        return attentionStatuses.has(status);
      }
      if (filter === "upcoming") {
        return !Number.isNaN(startMs) && startMs >= now && !pastStatuses.has(status);
      }
      if (filter === "past") {
        return pastStatuses.has(status) || (!Number.isNaN(startMs) && startMs < now);
      }
      return true;
    });
  }, [attentionStatuses, bookings, filter, pastStatuses]);

  const openReschedule = useCallback(
    (booking: LessonSummary) => {
      setSelectedBooking(booking);
      const startValue = formatDatetimeLocal(booking.scheduled_start);
      const endValue = formatDatetimeLocal(booking.scheduled_end);
      setNewStart(startValue);
      setNewEnd(endValue);
      setReason("");
      onOpen();
    },
    [onOpen]
  );

  const resetRescheduleState = useCallback(() => {
    setSelectedBooking(null);
    setNewStart("");
    setNewEnd("");
    setReason("");
  }, []);

  const handleCloseModal = useCallback(() => {
    onClose();
    resetRescheduleState();
  }, [onClose, resetRescheduleState]);

  const submitReschedule = useCallback(async () => {
    if (!selectedBooking) return;

    if (!newStart || !newEnd) {
      toast({
        title: "Missing times",
        description: "Add both a start and end time before submitting.",
        status: "warning",
      });
      return;
    }

    const startIso = toIsoString(newStart);
    const endIso = toIsoString(newEnd);
    if (!startIso || !endIso) {
      toast({
        title: "Invalid times",
        description: "Double-check the dates you selected and try again.",
        status: "error",
      });
      return;
    }

    if (Date.parse(endIso) <= Date.parse(startIso)) {
      toast({
        title: "End time must be after start time",
        status: "error",
      });
      return;
    }

    try {
      await rescheduleAsync({
        lesson_id: selectedBooking.id,
        new_start: startIso,
        new_end: endIso,
        reason,
      });
      toast({
        title: "Reschedule requested",
        description: "We'll notify the student about the proposed change.",
        status: "success",
      });
      handleCloseModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast({
        title: "Unable to submit",
        description: message,
        status: "error",
      });
    }
  }, [
    handleCloseModal,
    newEnd,
    newStart,
    reason,
    rescheduleAsync,
    selectedBooking,
    toast,
  ]);

  const handleStartLesson = useCallback(
    (booking: LessonSummary) => {
      startLesson.mutate(booking.id, {
        onSuccess: () => {
          toast({
            title: "Lesson started",
            description: "Good luck with your session!",
            status: "success",
            duration: 2500,
          });
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : "Unable to start the lesson.";
          toast({ title: "Start failed", description: message, status: "error" });
        },
      });
    },
    [startLesson, toast]
  );

  const handleEndLesson = useCallback(
    (booking: LessonSummary) => {
      endLesson.mutate(booking.id, {
        onSuccess: () => {
          toast({
            title: "Lesson completed",
            description: "Nice work—log any notes while it's fresh.",
            status: "success",
            duration: 2500,
          });
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : "Unable to complete the lesson.";
          toast({ title: "Complete failed", description: message, status: "error" });
        },
      });
    },
    [endLesson, toast]
  );

  const nextLessonText = stats.nextLesson
    ? `${formatDateTime.format(new Date(stats.nextLesson.scheduled_start))}`
    : "No upcoming lessons";

  const nextLessonRelative = stats.nextLesson
    ? relativeLabel(stats.nextLesson.scheduled_start)
    : "Add availability so students can book you.";

  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <Box>
      <Stack spacing={6}>
        <Stack
          direction={{ base: "column", lg: "row" }}
          justify="space-between"
          align={{ base: "flex-start", lg: "center" }}
          spacing={4}
        >
          <Stack spacing={1}>
            <Heading size="lg">My Bookings</Heading>
            <Text fontSize="sm" color={mutedText}>
              Review upcoming lessons, respond to reschedule requests, and keep students in the loop.
            </Text>
          </Stack>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<FiRefreshCw />}
            onClick={() => refetch()}
            isLoading={isLoading}
          >
            Refresh
          </Button>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Box
            bg={cardBg}
            borderRadius="md"
            border="1px solid"
            borderColor={borderColor}
            p={4}
            shadow="sm"
          >
            <Stack spacing={1}>
              <Text fontSize="xs" textTransform="uppercase" color={mutedText} fontWeight="semibold">
                Upcoming lessons
              </Text>
              <Heading size="md">{stats.upcoming}</Heading>
              <HStack spacing={2} color={mutedText} fontSize="sm">
                <FiCalendar />
                <Text>{nextLessonText}</Text>
              </HStack>
              <Text fontSize="xs" color={mutedText}>{nextLessonRelative}</Text>
            </Stack>
          </Box>
          <Box
            bg={cardBg}
            borderRadius="md"
            border="1px solid"
            borderColor={borderColor}
            p={4}
            shadow="sm"
          >
            <Stack spacing={1}>
              <Text fontSize="xs" textTransform="uppercase" color={mutedText} fontWeight="semibold">
                Needs attention
              </Text>
              <Heading size="md">{stats.attention}</Heading>
              <Text fontSize="sm" color={mutedText}>
                Includes pending approvals and reschedule requests.
              </Text>
            </Stack>
          </Box>
          <Box
            bg={cardBg}
            borderRadius="md"
            border="1px solid"
            borderColor={borderColor}
            p={4}
            shadow="sm"
          >
            <Stack spacing={1}>
              <Text fontSize="xs" textTransform="uppercase" color={mutedText} fontWeight="semibold">
                Completed this week
              </Text>
              <Heading size="md">{stats.completedThisWeek}</Heading>
              <Text fontSize="sm" color={mutedText}>
                Log post-lesson notes to keep progress organised.
              </Text>
            </Stack>
          </Box>
        </SimpleGrid>

        <ButtonGroup size="sm" variant="outline" isAttached overflowX="auto">
          {filters.map((item) => (
            <Button
              key={item.value}
              onClick={() => setFilter(item.value)}
              colorScheme={filter === item.value ? "brand" : undefined}
              variant={filter === item.value ? "solid" : "outline"}
            >
              {item.label}
              <Badge ml={2} colorScheme={filter === item.value ? "blackAlpha" : "gray"}>
                {item.count}
              </Badge>
            </Button>
          ))}
        </ButtonGroup>

        {isError && (
          <Alert status="error" variant="left-accent" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle fontSize="sm">Unable to load bookings</AlertTitle>
              <AlertDescription fontSize="sm">
                {errorMessage ?? "Please try again."}
              </AlertDescription>
            </Box>
          </Alert>
        )}

        <Box
          bg={cardBg}
          borderRadius="md"
          border="1px solid"
          borderColor={borderColor}
          shadow="sm"
          overflowX="auto"
        >
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Student</Th>
                <Th>Lesson window</Th>
                <Th>Status</Th>
                <Th textAlign="right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading &&
                [0, 1, 2].map((index) => (
                  <Tr key={`skeleton-${index}`}>
                    <Td colSpan={4}>
                      <Skeleton height="32px" mb={2} />
                      <Skeleton height="24px" />
                    </Td>
                  </Tr>
                ))}

              {!isLoading && filteredBookings.length === 0 && (
                <Tr>
                  <Td colSpan={4}>
                    <Stack spacing={1} py={6} textAlign="center">
                      <FiCalendar size="20" style={{ margin: "0 auto" }} />
                      <Text fontWeight="medium">No bookings to show</Text>
                      <Text fontSize="sm" color={mutedText}>
                        Adjust your filter or add availability so students can book you.
                      </Text>
                    </Stack>
                  </Td>
                </Tr>
              )}

              {!isLoading &&
                filteredBookings.map((booking) => {
                  const statusKey = (booking.status ?? "").toLowerCase();
                  const meta = statusMeta[statusKey] ?? {
                    label: booking.status,
                    colorScheme: "gray",
                  };
                  const durationMinutes = computeDurationMinutes(
                    booking.scheduled_start,
                    booking.scheduled_end
                  );
                  const canStart = !pastStatuses.has(statusKey);
                  const canComplete = !["completed", "cancelled", "pending"].includes(
                    statusKey
                  );
                  const isStarting =
                    startLesson.isPending && startLesson.variables === booking.id;
                  const isCompleting =
                    endLesson.isPending && endLesson.variables === booking.id;

                  return (
                    <Tr key={booking.id}>
                      <Td>
                        <Stack spacing={1}>
                          <HStack spacing={2}>
                            <FiUser color="#718096" />
                            <Text fontWeight="semibold">
                              {booking.student_name || "Unassigned student"}
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color={mutedText}>
                            Lesson type: {booking.lesson_type}
                          </Text>
                        </Stack>
                      </Td>
                      <Td>
                        <Stack spacing={1}>
                          <Text>{formatDateTime.format(new Date(booking.scheduled_start))}</Text>
                          <Text fontSize="xs" color={mutedText}>
                            {relativeLabel(booking.scheduled_start)}
                          </Text>
                          {durationMinutes && (
                            <Badge colorScheme="purple">{durationMinutes} min</Badge>
                          )}
                        </Stack>
                      </Td>
                      <Td>
                        <Badge colorScheme={meta.colorScheme}>{meta.label}</Badge>
                      </Td>
                      <Td textAlign="right">
                        <ButtonGroup size="xs" variant="outline" spacing={2}>
                          <Tooltip label="Start lesson" hasArrow>
                            <Button
                              leftIcon={<FiPlay />}
                              onClick={() => handleStartLesson(booking)}
                              isDisabled={!canStart}
                              isLoading={isStarting}
                            >
                              Start
                            </Button>
                          </Tooltip>
                          <Tooltip label="Mark complete" hasArrow>
                            <Button
                              leftIcon={<FiCheckCircle />}
                              onClick={() => handleEndLesson(booking)}
                              isDisabled={!canComplete}
                              isLoading={isCompleting}
                            >
                              Complete
                            </Button>
                          </Tooltip>
                          <Tooltip label="Propose a new time" hasArrow>
                            <Button
                              leftIcon={<FiEdit3 />}
                              onClick={() => openReschedule(booking)}
                            >
                              Reschedule
                            </Button>
                          </Tooltip>
                        </ButtonGroup>
                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </Box>
      </Stack>

      <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request reschedule</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedBooking && (
              <Box mb={4}>
                <Text fontWeight="semibold">{selectedBooking.student_name || "Unassigned student"}</Text>
                <Text fontSize="sm" color={mutedText}>
                  Current: {formatDateTime.format(new Date(selectedBooking.scheduled_start))}
                </Text>
              </Box>
            )}
            <FormControl mb={3}>
              <FormLabel>New start</FormLabel>
              <Input
                type="datetime-local"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>New end</FormLabel>
              <Input
                type="datetime-local"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Reason</FormLabel>
              <Textarea
                placeholder="Let the student know why you need to move the session."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={handleCloseModal} variant="ghost">
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={submitReschedule}
              isLoading={isPending}
            >
              Submit request
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

function formatDatetimeLocal(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const pad = (value: number) => value.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toIsoString(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function computeDurationMinutes(startIso: string, endIso: string) {
  const startMs = Date.parse(startIso);
  const endMs = Date.parse(endIso);
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
    return null;
  }
  const diff = Math.round((endMs - startMs) / 60000);
  return diff > 0 ? diff : null;
}
