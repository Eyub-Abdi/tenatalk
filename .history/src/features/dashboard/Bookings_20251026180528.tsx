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
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const iconBoxBg = useColorModeValue("brand.50", "brand.900");
  const iconColor = useColorModeValue("#0d6efd", "#4299E1");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.700");
  const modalInfoBg = useColorModeValue("brand.50", "brand.900");

  const { data, isLoading, isError, error, refetch } = useLessons({
    mine: true,
  });
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
      {
        label: "Needs attention",
        value: "attention" as const,
        count: stats.attention,
      },
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
    return diffDays > 0
      ? `in ${diffDays} days`
      : `${Math.abs(diffDays)} days ago`;
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
        return (
          !Number.isNaN(startMs) && startMs >= now && !pastStatuses.has(status)
        );
      }
      if (filter === "past") {
        return (
          pastStatuses.has(status) || (!Number.isNaN(startMs) && startMs < now)
        );
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
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
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
          const message =
            err instanceof Error ? err.message : "Unable to start the lesson.";
          toast({
            title: "Start failed",
            description: message,
            status: "error",
          });
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
          const message =
            err instanceof Error
              ? err.message
              : "Unable to complete the lesson.";
          toast({
            title: "Complete failed",
            description: message,
            status: "error",
          });
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
        <Box
          bg={cardBg}
          borderRadius="xl"
          p={6}
          border="1px solid"
          borderColor={borderColor}
          shadow="sm"
        >
          <Stack
            direction={{ base: "column", lg: "row" }}
            justify="space-between"
            align={{ base: "flex-start", lg: "center" }}
            spacing={4}
          >
            <Stack spacing={2}>
              <Heading size="lg" fontWeight="700">My Bookings</Heading>
              <Text fontSize="md" color={mutedText}>
                Review upcoming lessons, respond to reschedule requests, and keep
                students in the loop.
              </Text>
            </Stack>
            <Button
              size="md"
              colorScheme="brand"
              variant="outline"
              leftIcon={<FiRefreshCw />}
              onClick={() => refetch()}
              isLoading={isLoading}
              fontWeight="500"
            >
              Refresh
            </Button>
          </Stack>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
          <Box
            bg={cardBg}
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
            p={6}
            shadow="sm"
            transition="all 0.2s"
            _hover={{ shadow: "md", transform: "translateY(-2px)" }}
          >
            <Stack spacing={3}>
              <HStack justify="space-between">
                <Text
                  fontSize="xs"
                  textTransform="uppercase"
                  color={mutedText}
                  fontWeight="600"
                  letterSpacing="wide"
                >
                  Upcoming lessons
                </Text>
                <Box
                  bg="brand.50"
                  p={2}
                  borderRadius="md"
                  color="brand.500"
                >
                  <FiCalendar size={18} />
                </Box>
              </HStack>
              <Heading size="2xl" fontWeight="700">{stats.upcoming}</Heading>
              <Text fontSize="sm" color={mutedText} fontWeight="500">
                {nextLessonText}
              </Text>
              <Text fontSize="xs" color="brand.500" fontWeight="600">
                {nextLessonRelative}
              </Text>
            </Stack>
          </Box>
          <Box
            bg={cardBg}
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
            p={6}
            shadow="sm"
            transition="all 0.2s"
            _hover={{ shadow: "md", transform: "translateY(-2px)" }}
          >
            <Stack spacing={3}>
              <HStack justify="space-between">
                <Text
                  fontSize="xs"
                  textTransform="uppercase"
                  color={mutedText}
                  fontWeight="600"
                  letterSpacing="wide"
                >
                  Needs attention
                </Text>
                <Box
                  bg="orange.50"
                  p={2}
                  borderRadius="md"
                  color="orange.500"
                >
                  <FiEdit3 size={18} />
                </Box>
              </HStack>
              <Heading size="2xl" fontWeight="700">{stats.attention}</Heading>
              <Text fontSize="sm" color={mutedText}>
                Pending approvals and reschedule requests
              </Text>
            </Stack>
          </Box>
          <Box
            bg={cardBg}
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
            p={6}
            shadow="sm"
            transition="all 0.2s"
            _hover={{ shadow: "md", transform: "translateY(-2px)" }}
          >
            <Stack spacing={3}>
              <HStack justify="space-between">
                <Text
                  fontSize="xs"
                  textTransform="uppercase"
                  color={mutedText}
                  fontWeight="600"
                  letterSpacing="wide"
                >
                  Completed this week
                </Text>
                <Box
                  bg="green.50"
                  p={2}
                  borderRadius="md"
                  color="green.500"
                >
                  <FiCheckCircle size={18} />
                </Box>
              </HStack>
              <Heading size="2xl" fontWeight="700">{stats.completedThisWeek}</Heading>
              <Text fontSize="sm" color={mutedText}>
                Keep progress organised with lesson notes
              </Text>
            </Stack>
          </Box>
        </SimpleGrid>

        <HStack spacing={3} flexWrap="wrap">
          {filters.map((item) => (
            <Button
              key={item.value}
              onClick={() => setFilter(item.value)}
              colorScheme={filter === item.value ? "brand" : undefined}
              variant={filter === item.value ? "solid" : "outline"}
              size="md"
              fontWeight="500"
              borderRadius="lg"
            >
              {item.label}
              <Badge
                ml={2}
                colorScheme={filter === item.value ? "whiteAlpha" : "gray"}
                fontSize="xs"
                px={2}
                py={0.5}
                borderRadius="md"
              >
                {item.count}
              </Badge>
            </Button>
          ))}
        </HStack>

        {isError && (
          <Alert status="error" variant="left-accent" borderRadius="xl">
            <AlertIcon />
            <Box>
              <AlertTitle fontSize="sm" fontWeight="600">Unable to load bookings</AlertTitle>
              <AlertDescription fontSize="sm">
                {errorMessage ?? "Please try again."}
              </AlertDescription>
            </Box>
          </Alert>
        )}

        <Box
          bg={cardBg}
          borderRadius="xl"
          border="1px solid"
          borderColor={borderColor}
          shadow="sm"
          overflowX="auto"
        >
          <Table size="md" variant="simple">
            <Thead bg={useColorModeValue("gray.50", "gray.700")}>
              <Tr>
                <Th fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wide">Student</Th>
                <Th fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wide">Lesson window</Th>
                <Th fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wide">Status</Th>
                <Th fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wide" textAlign="right">Actions</Th>
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
                        Adjust your filter or add availability so students can
                        book you.
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
                  const canComplete = ![
                    "completed",
                    "cancelled",
                    "pending",
                  ].includes(statusKey);
                  const isStarting =
                    startLesson.isPending &&
                    startLesson.variables === booking.id;
                  const isCompleting =
                    endLesson.isPending && endLesson.variables === booking.id;

                  return (
                    <Tr key={booking.id} _hover={{ bg: hoverBg }} transition="background 0.2s">
                      <Td py={4}>
                        <Stack spacing={1}>
                          <HStack spacing={2}>
                            <Box
                              bg={iconBoxBg}
                              p={2}
                              borderRadius="md"
                            >
                              <FiUser color={iconColor} size={16} />
                            </Box>
                            <Text fontWeight="600" fontSize="sm">
                              {booking.student_name || "Unassigned student"}
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color={mutedText} ml={10}>
                            {booking.lesson_type}
                          </Text>
                        </Stack>
                      </Td>
                      <Td py={4}>
                        <Stack spacing={1}>
                          <Text fontWeight="500" fontSize="sm">
                            {formatDateTime.format(
                              new Date(booking.scheduled_start)
                            )}
                          </Text>
                          <Text fontSize="xs" color="brand.500" fontWeight="600">
                            {relativeLabel(booking.scheduled_start)}
                          </Text>
                          {durationMinutes && (
                            <Badge colorScheme="purple" fontSize="xs" px={2} py={0.5} borderRadius="md">
                              {durationMinutes} min
                            </Badge>
                          )}
                        </Stack>
                      </Td>
                      <Td py={4}>
                        <Badge 
                          colorScheme={meta.colorScheme} 
                          fontSize="xs" 
                          px={3} 
                          py={1} 
                          borderRadius="md"
                          fontWeight="600"
                        >
                          {meta.label}
                        </Badge>
                      </Td>
                      <Td textAlign="right" py={4}>
                        <ButtonGroup size="sm" variant="outline" spacing={2}>
                          <Tooltip label="Start lesson" hasArrow placement="top">
                            <Button
                              leftIcon={<FiPlay />}
                              onClick={() => handleStartLesson(booking)}
                              isDisabled={!canStart}
                              isLoading={isStarting}
                              colorScheme="green"
                              fontWeight="500"
                            >
                              Start
                            </Button>
                          </Tooltip>
                          <Tooltip label="Mark complete" hasArrow placement="top">
                            <Button
                              leftIcon={<FiCheckCircle />}
                              onClick={() => handleEndLesson(booking)}
                              isDisabled={!canComplete}
                              isLoading={isCompleting}
                              colorScheme="blue"
                              fontWeight="500"
                            >
                              Complete
                            </Button>
                          </Tooltip>
                          <Tooltip label="Propose a new time" hasArrow placement="top">
                            <Button
                              leftIcon={<FiEdit3 />}
                              onClick={() => openReschedule(booking)}
                              colorScheme="brand"
                              fontWeight="500"
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
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="xl" shadow="xl">
          <ModalHeader fontWeight="700" fontSize="xl">Request reschedule</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedBooking && (
              <Box 
                mb={5} 
                p={4} 
                bg={useColorModeValue("brand.50", "brand.900")} 
                borderRadius="lg"
              >
                <Text fontWeight="600" fontSize="md" mb={1}>
                  {selectedBooking.student_name || "Unassigned student"}
                </Text>
                <Text fontSize="sm" color={mutedText}>
                  Current time:{" "}
                  <Text as="span" fontWeight="500">
                    {formatDateTime.format(
                      new Date(selectedBooking.scheduled_start)
                    )}
                  </Text>
                </Text>
              </Box>
            )}
            <Stack spacing={4}>
              <FormControl>
                <FormLabel fontWeight="500" fontSize="sm">New start time</FormLabel>
                <Input
                  type="datetime-local"
                  value={newStart}
                  onChange={(e) => setNewStart(e.target.value)}
                  size="lg"
                  borderRadius="lg"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="500" fontSize="sm">New end time</FormLabel>
                <Input
                  type="datetime-local"
                  value={newEnd}
                  onChange={(e) => setNewEnd(e.target.value)}
                  size="lg"
                  borderRadius="lg"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="500" fontSize="sm">Reason (optional)</FormLabel>
                <Textarea
                  placeholder="Let the student know why you need to move the session..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  borderRadius="lg"
                  resize="vertical"
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button onClick={handleCloseModal} variant="ghost" size="lg" fontWeight="500">
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={submitReschedule}
              isLoading={isPending}
              size="lg"
              fontWeight="500"
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
