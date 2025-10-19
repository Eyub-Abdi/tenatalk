import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Avatar,
  HStack,
  Icon,
  Badge,
  Button,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { FiPlay, FiStar, FiVideo, FiGlobe, FiClock } from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";

interface Tutor {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviews: number;
  pricePerLesson: number; // USD placeholder
  introVideo?: string; // future URL
  specialties: string[];
  languages: string[]; // language codes or names
  country: string;
  availabilityTag?: string; // e.g., "Fast Response"
  verified?: boolean;
}

const TUTORS: Tutor[] = [
  {
    id: "t1",
    name: "Aisha",
    rating: 4.9,
    reviews: 128,
    pricePerLesson: 12,
    specialties: ["Safari phrases", "Market negotiation"],
    languages: ["Swahili", "English"],
    country: "TZ",
    availabilityTag: "Fast response",
    verified: true,
  },
  {
    id: "t2",
    name: "Juma",
    rating: 4.8,
    reviews: 94,
    pricePerLesson: 11,
    specialties: ["Cultural etiquette", "Traveler safety"],
    languages: ["Swahili", "English", "French"],
    country: "TZ",
    availabilityTag: "New content",
    verified: true,
  },
  {
    id: "t3",
    name: "Neema",
    rating: 5.0,
    reviews: 210,
    pricePerLesson: 15,
    specialties: ["Beginners", "Pronunciation"],
    languages: ["Swahili", "English", "German"],
    country: "TZ",
    verified: true,
  },
  {
    id: "t4",
    name: "Salim",
    rating: 4.7,
    reviews: 77,
    pricePerLesson: 10,
    specialties: ["Traveler basics", "Custom phrase packs"],
    languages: ["Swahili", "English", "Italian"],
    country: "TZ",
    verified: false,
  },
];

function Rating({ value }: { value: number }) {
  const color = useColorModeValue("brand.600", "brand.300");
  return (
    <HStack
      spacing={1}
      fontSize="xs"
      color={color}
      aria-label={`Rating ${value}`}
    >
      <Icon as={FiStar} />
      <Text>{value.toFixed(1)}</Text>
    </HStack>
  );
}

function TutorCard({ tutor }: { tutor: Tutor }) {
  const cardBg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const proIconColor = useColorModeValue("brand.500", "brand.300");
  // Badge check icon for a stronger verified badge visual
  const ProIcon = HiBadgeCheck;
  return (
    <Stack
      spacing={4}
      p={4}
      rounded="xl"
      bg={cardBg}
      borderWidth="1px"
      borderColor={border}
      shadow="sm"
      position="relative"
      transition="all 0.25s"
      _hover={{ shadow: "md", transform: "translateY(-4px)" }}
    >
      <Box
        position="relative"
        rounded="lg"
        overflow="hidden"
        aspectRatio={4 / 3}
        bg={useColorModeValue("gray.100", "gray.700")}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon
          as={FiVideo}
          boxSize={10}
          color={useColorModeValue("gray.400", "gray.500")}
        />
        <Button
          size="xs"
          leftIcon={<FiPlay />}
          position="absolute"
          bottom={2}
          left={2}
          colorScheme="brand"
          variant="solid"
        >
          Preview
        </Button>
      </Box>
      <HStack spacing={3} align="flex-start">
        <Avatar name={tutor.name} size="sm" />
        <Stack spacing={1} flex={1} minW={0}>
          <HStack justify="space-between" align="flex-start">
            <HStack spacing={1} align="center" maxW="full">
              <Heading
                size="sm"
                noOfLines={1}
                display="flex"
                alignItems="center"
                gap={1}
              >
                {tutor.name}
                {tutor.verified && (
                  <Icon
                    as={ProIcon}
                    color={proIconColor}
                    boxSize={4}
                    aria-label="Verified tutor"
                    title="Verified tutor"
                  />
                )}
              </Heading>
            </HStack>
            <Rating value={tutor.rating} />
          </HStack>
          <HStack
            spacing={2}
            fontSize="xs"
            color={useColorModeValue("gray.600", "gray.400")}
          >
            <HStack spacing={1}>
              <Icon as={FiGlobe} />
              <Text noOfLines={1}>{tutor.languages.join(", ")}</Text>
            </HStack>
            <Text>• {tutor.reviews} reviews</Text>
          </HStack>
        </Stack>
      </HStack>
      <Stack spacing={2}>
        <HStack spacing={2} flexWrap="wrap">
          {tutor.specialties.slice(0, 3).map((s) => (
            <Badge
              key={s}
              colorScheme="brand"
              variant="subtle"
              fontSize="10px"
              px={2}
              py={0.5}
              rounded="full"
            >
              {s}
            </Badge>
          ))}
        </HStack>
        <HStack
          fontSize="sm"
          color={useColorModeValue("gray.700", "gray.300")}
          justify="space-between"
        >
          <HStack spacing={1}>
            <Icon as={FiClock} />
            <Text>{tutor.pricePerLesson}$ / lesson</Text>
          </HStack>
          {tutor.availabilityTag && (
            <Badge
              colorScheme="green"
              variant="solid"
              fontSize="10px"
              rounded="full"
            >
              {tutor.availabilityTag}
            </Badge>
          )}
        </HStack>
      </Stack>
      <Flex gap={2} pt={1}>
        <Button size="sm" variant="outline" flex={1} colorScheme="brand">
          Profile
        </Button>
        <Button size="sm" flex={1} colorScheme="brand">
          Book
        </Button>
      </Flex>
    </Stack>
  );
}

export function FeaturedTutors() {
  return (
    <Box as="section" id="featured-tutors" py={{ base: 16, md: 24 }}>
      <Container maxW="6xl">
        <Stack spacing={10}>
          <Stack spacing={4} maxW="2xl">
            <Heading size="lg">Featured tutors</Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={useColorModeValue("gray.600", "gray.300")}
            >
              Handpicked for practical, respectful, traveler-focused Swahili
              learning.
            </Text>
          </Stack>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
            {TUTORS.map((t) => (
              <TutorCard key={t.id} tutor={t} />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}
