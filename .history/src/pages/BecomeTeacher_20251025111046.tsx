import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiDollarSign, FiClock, FiUsers, FiHeart } from "react-icons/fi";

const benefits = [
  {
    icon: FiDollarSign,
    title: "Competitive Pay",
    description:
      "Earn $15-25 per hour teaching Swahili to motivated students worldwide.",
  },
  {
    icon: FiClock,
    title: "Flexible Schedule",
    description: "Set your own hours and teach when it works best for you.",
  },
  {
    icon: FiUsers,
    title: "Global Community",
    description:
      "Connect with students from around the world and share your culture.",
  },
  {
    icon: FiHeart,
    title: "Make an Impact",
    description:
      "Help students build confidence and connections through language learning.",
  },
];

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ComponentType;
  title: string;
  description: string;
}) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      p={6}
      bg={cardBg}
      border="1px"
      borderColor={borderColor}
      borderRadius="md"
      textAlign="center"
    >
      <Icon as={icon} w={8} h={8} color="brand.500" mb={4} />
      <Heading size="md" mb={3}>
        {title}
      </Heading>
      <Text color="gray.600" fontSize="sm">
        {description}
      </Text>
    </Box>
  );
}

export default function BecomeTeacher() {
  return (
    <Box py={{ base: 12, md: 20 }}>
      <Container maxW="6xl">
        <VStack spacing={{ base: 12, md: 16 }} textAlign="center">
          {/* Header */}
          <VStack spacing={6} maxW="3xl">
            <Heading size={{ base: "xl", md: "2xl" }}>
              Become a Swahili Teacher
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="gray.600">
              Share your passion for Swahili culture and language with students
              around the world. Join our community of dedicated educators making
              a real impact.
            </Text>
          </VStack>

          {/* Benefits Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
            {benefits.map((benefit) => (
              <BenefitCard
                key={benefit.title}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </SimpleGrid>

          {/* Requirements */}
          <Box maxW="4xl" textAlign="left">
            <Heading size="lg" mb={6} textAlign="center">
              What We&apos;re Looking For
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <VStack align="start" spacing={4}>
                <Heading size="md">Experience & Skills</Heading>
                <Stack spacing={2}>
                  <Text>• Native or fluent Swahili speaker</Text>
                  <Text>• Teaching experience (formal or informal)</Text>
                  <Text>• Strong communication skills</Text>
                  <Text>• Patience and enthusiasm for teaching</Text>
                </Stack>
              </VStack>
              <VStack align="start" spacing={4}>
                <Heading size="md">Technical Requirements</Heading>
                <Stack spacing={2}>
                  <Text>• Reliable internet connection</Text>
                  <Text>• Computer with camera and microphone</Text>
                  <Text>• Quiet teaching environment</Text>
                  <Text>• Availability for at least 10 hours per week</Text>
                </Stack>
              </VStack>
            </SimpleGrid>
          </Box>

          {/* CTA */}
          <VStack spacing={4}>
            <Heading size="md">Ready to Get Started?</Heading>
            <Text color="gray.600" maxW="2xl" textAlign="center">
              Join hundreds of teachers who are already making a difference in
              students&apos; lives while earning competitive income on their own
              schedule.
            </Text>
            <HStack spacing={4}>
              <Button
                as={RouterLink}
                to="/teacher-application"
                colorScheme="brand"
                size="lg"
              >
                Apply Now
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
