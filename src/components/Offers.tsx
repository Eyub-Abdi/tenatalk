import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  useColorModeValue,
  Image,
  AspectRatio,
} from "@chakra-ui/react";
import { FiUserCheck, FiUsers, FiMessageCircle } from "react-icons/fi";
import { ReactNode } from "react";

interface OfferItem {
  title: string;
  description: string;
  icon: ReactNode;
  highlight?: boolean;
  image: string;
  imageAlt: string;
}

const OFFERS: OfferItem[] = [
  {
    title: "1-on-1 Lessons",
    description:
      "Personalized live sessions focused on your goals: travel, culture, business, or everyday conversation.",
    icon: <FiUserCheck />,
    image: "/images/1 on 1 online Lessons.jpg",
    imageAlt:
      "Tutor and learner engaged in a focused 1-on-1 online Swahili lesson",
  },
  {
    title: "Group Class",
    description:
      "Collaborative learning with small groups to practice real scenarios and boost confidence.",
    icon: <FiUsers />,
    image: "/images/group-lession.jpg",
    imageAlt: "Group Swahili lesson with multiple learners interacting",
  },
  {
    title: "Practice for Free",
    description:
      "Access free drills and future community features to reinforce what you learn between sessions.",
    icon: <FiMessageCircle />,
    image: "/images/Practice.jpg",
    imageAlt: "Casual free Swahili practice resources on a desk",
  },
];

export function Offers() {
  const cardBg = useColorModeValue("white", "gray.800");
  const sectionBg = useColorModeValue("gray.50", "gray.900");
  const border = useColorModeValue("gray.200", "gray.700");
  const iconColor = useColorModeValue("brand.600", "brand.300");

  const iconBg = useColorModeValue("gray.100", "gray.700");
  const descColor = useColorModeValue("gray.600", "gray.400");
  return (
    <Box as="section" id="offers" py={{ base: 14, md: 20 }} bg={sectionBg}>
      <Container maxW="6xl">
        <Stack spacing={6} mb={10} textAlign="center">
          <Heading size="lg">What We Offer</Heading>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Flexible ways to build real Swahili communication confidence.
          </Text>
        </Stack>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3 }}
          spacing={{ base: 6, md: 8 }}
        >
          {OFFERS.map((o) => {
            return (
              <Stack
                key={o.title}
                spacing={4}
                p={0}
                rounded="xl"
                bg={cardBg}
                borderWidth="1px"
                borderColor={border}
                position="relative"
                shadow="sm"
                transition="all 0.25s"
                _hover={{ shadow: "md", transform: "translateY(-4px)" }}
              >
                <Box position="relative" roundedTop="xl" overflow="hidden">
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={o.image}
                      alt={o.imageAlt}
                      objectFit="cover"
                      loading="lazy"
                      transition="filter 0.4s"
                      _hover={{ filter: "brightness(1.05)" }}
                    />
                  </AspectRatio>
                </Box>
                <Stack
                  spacing={4}
                  px={6}
                  pb={6}
                  pt={4}
                  position="relative"
                  zIndex={1}
                >
                  <Box
                    boxSize={12}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    rounded="full"
                    bg={iconBg}
                    color={iconColor}
                    fontSize="xl"
                    flexShrink={0}
                  >
                    {/* Icon provided directly as element */}
                    {o.icon}
                  </Box>
                  <Stack spacing={2} position="relative" zIndex={1}>
                    <Heading size="sm">{o.title}</Heading>
                    <Text fontSize="sm" color={descColor}>
                      {o.description}
                    </Text>
                  </Stack>
                </Stack>
              </Stack>
            );
          })}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default Offers;
