import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import { useLessonStats } from "../lessons/api/useLessons";

export default function Overview() {
  const { data, isLoading } = useLessonStats();
  const cardBg = useColorModeValue("white", "gray.800");
  return (
    <Box>
      <Heading size="lg" mb={6}>
        Overview
      </Heading>
      {isLoading && <Text>Loading...</Text>}
      {data && (
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
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
    </Box>
  );
}
