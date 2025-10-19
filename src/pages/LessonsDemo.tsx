import {
  Box,
  Heading,
  Text,
  Stack,
  Button,
  HStack,
  Badge,
  useToast,
} from "@chakra-ui/react";
import {
  useLessons,
  useStartLesson,
  useEndLesson,
  useLessonStats,
} from "../features/lessons/api/useLessons";
import type { LessonSummary } from "../features/lessons/api/lessonTypes";

export default function LessonsDemoPage() {
  const {
    data: lessons,
    isLoading,
    isError,
    refetch,
  } = useLessons({ status: "confirmed" });
  const stats = useLessonStats();
  const startLesson = useStartLesson();
  const endLesson = useEndLesson();
  const toast = useToast();

  const handleStart = (id: string) => {
    startLesson.mutate(id, {
      onSuccess: () =>
        toast({ title: "Started", status: "success", duration: 2000 }),
      onError: (e: unknown) => {
        const message = e instanceof Error ? e.message : "Unknown error";
        toast({
          title: "Failed to start",
          description: message,
          status: "error",
        });
      },
    });
  };

  const handleEnd = (id: string) => {
    endLesson.mutate(id, {
      onSuccess: () =>
        toast({ title: "Ended", status: "success", duration: 2000 }),
      onError: (e: unknown) => {
        const message = e instanceof Error ? e.message : "Unknown error";
        toast({
          title: "Failed to end",
          description: message,
          status: "error",
        });
      },
    });
  };

  return (
    <Box px={{ base: 4, md: 8 }} py={{ base: 10, md: 14 }} maxW="5xl" mx="auto">
      <Stack spacing={8}>
        <Heading size="lg">Lessons Demo</Heading>
        <Box>
          <Heading size="sm" mb={2}>
            Stats
          </Heading>
          {stats.isLoading && <Text fontSize="sm">Loading stats...</Text>}
          {stats.data && (
            <HStack spacing={6} fontSize="sm" flexWrap="wrap">
              <Text>Total: {stats.data.total_lessons}</Text>
              <Text>Completed: {stats.data.completed_lessons}</Text>
              <Text>Upcoming: {stats.data.upcoming_lessons}</Text>
              {stats.data.average_rating && (
                <Text>Avg Rating: {stats.data.average_rating}</Text>
              )}
            </HStack>
          )}
        </Box>
        <HStack>
          <Button size="sm" onClick={() => refetch()} isLoading={isLoading}>
            Refresh
          </Button>
        </HStack>
        {isError && <Text color="red.400">Failed to load lessons.</Text>}
        <Stack spacing={4}>
          {lessons?.length === 0 && (
            <Text fontSize="sm">No lessons found.</Text>
          )}
          {lessons?.map((l: LessonSummary) => (
            <Box
              key={l.id}
              borderWidth="1px"
              rounded="md"
              p={4}
              shadow="sm"
              _hover={{ shadow: "md" }}
            >
              <HStack justify="space-between" align="flex-start" mb={2}>
                <Heading size="sm">Lesson #{l.id.slice(0, 8)}</Heading>
                <Badge
                  colorScheme={l.status === "confirmed" ? "green" : "gray"}
                  textTransform="capitalize"
                >
                  {l.status}
                </Badge>
              </HStack>
              <Text fontSize="sm" mb={1}>
                Type: {l.lesson_type}
              </Text>
              <Text fontSize="sm" mb={1}>
                Start: {l.scheduled_start}
              </Text>
              <Text fontSize="sm" mb={3}>
                End: {l.scheduled_end}
              </Text>
              <HStack>
                <Button
                  size="xs"
                  colorScheme="brand"
                  onClick={() => handleStart(l.id)}
                  isLoading={startLesson.isPending}
                >
                  Start
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => handleEnd(l.id)}
                  isLoading={endLesson.isPending}
                >
                  End
                </Button>
              </HStack>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
