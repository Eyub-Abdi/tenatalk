import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Avatar,
  HStack,
  Icon,
  useColorModeValue,
  IconButton,
  VisuallyHidden,
  chakra,
  Flex,
} from "@chakra-ui/react";
import {
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiPause,
  FiPlay,
  FiMessageSquare,
} from "react-icons/fi";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useState, useCallback, useRef } from "react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  country: string;
  quote: string;
  rating: number;
  avatar?: string;
}

const DATA: Testimonial[] = [
  {
    id: "1",
    name: "Maria G.",
    role: "Safari Traveler",
    country: "Italy",
    quote:
      "Learning context-based Swahili phrases gave me confidence when negotiating at local markets.",
    rating: 5,
  },
  {
    id: "2",
    name: "Ethan P.",
    role: "Wildlife Photographer",
    country: "USA",
    quote:
      "The tutor adapted lessons to the exact phrases I needed on location – far better than generic apps.",
    rating: 5,
  },
  {
    id: "3",
    name: "Sofia L.",
    role: "Cultural Volunteer",
    country: "Spain",
    quote:
      "Etiquette modules + live correction helped me avoid awkward situations and build trust quickly.",
    rating: 5,
  },
  {
    id: "4",
    name: "Jonas K.",
    role: "Backpacker",
    country: "Germany",
    quote:
      "Short phrase drills on the flight + a trial session made day one in Arusha feel easy.",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <HStack
      spacing={1}
      color={useColorModeValue("brand.500", "brand.300")}
      aria-label={`${count} star rating`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          as={FiStar}
          fill={i < count ? "currentColor" : "none"}
          strokeWidth={1.5}
          boxSize={4}
          opacity={i < count ? 1 : 0.4}
        />
      ))}
    </HStack>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  const cardBg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const decorativeColor = useColorModeValue("brand.50", "whiteAlpha.100");
  const quoteIconColor = useColorModeValue("brand.100", "whiteAlpha.200");
  return (
    <Stack
      role="group"
      spacing={4}
      p={5}
      rounded="xl"
      bg={cardBg}
      borderWidth="1px"
      borderColor={border}
      shadow="sm"
      position="relative"
      transition="all 0.25s"
      h="100%"
      _before={{
        content: '""',
        position: "absolute",
        inset: 0,
        rounded: "xl",
        bg: useColorModeValue(
          "linear-gradient(135deg, rgba(255,68,56,0.06), rgba(255,68,56,0.02))",
          "linear-gradient(135deg, rgba(255,68,56,0.15), rgba(255,68,56,0.05))"
        ),
        opacity: 0,
        transition: "inherit",
      }}
      _after={{
        content: '""',
        position: "absolute",
        top: 3,
        right: 3,
        w: 10,
        h: 10,
        rounded: "full",
        bg: decorativeColor,
        filter: "blur(4px)",
        opacity: 0.5,
        zIndex: 0,
        transition: "inherit",
      }}
      _hover={{
        shadow: "md",
        transform: "translateY(-4px)",
        _before: { opacity: 1 },
      }}
    >
      <Icon
        as={FiMessageSquare}
        boxSize={8}
        color={quoteIconColor}
        position="absolute"
        top={3}
        left={3}
        opacity={0.4}
        pointerEvents="none"
      />
      <Stars count={t.rating} />
      <Text fontSize="sm" lineHeight={1.5}>
        “{t.quote}”
      </Text>
      <HStack spacing={3} pt={2}>
        <Avatar size="sm" name={t.name} src={t.avatar} />
        <Box>
          <Text fontWeight="semibold" fontSize="sm">
            {t.name}
          </Text>
          <Text fontSize="xs" color={useColorModeValue("gray.600", "gray.400")}>
            {t.role} • {t.country}
          </Text>
        </Box>
      </HStack>
    </Stack>
  );
}

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const wasPlayingRef = useRef(true);
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const autoplayInterval = 4500;
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      initial: 0,
      loop: true,
      slideChanged(s) {
        setCurrent(s.track.details.rel);
      },
      renderMode: "precision",
      breakpoints: {
        "(min-width: 1024px)": { slides: { perView: 4, spacing: 24 } },
        "(min-width: 640px)": { slides: { perView: 2.15, spacing: 20 } },
      },
      slides: { perView: 1.05, spacing: 16 },
    },
    [
      (slider) => {
        let timeout: number | undefined;
        function clearNextTimeout() {
          timeout && window.clearTimeout(timeout);
        }
        function nextTimeout() {
          clearNextTimeout();
          if (!isPlayingRef.current || prefersReducedMotion) return;
          timeout = window.setTimeout(() => {
            slider.next();
          }, autoplayInterval);
        }
        slider.on("created", () => {
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  const goTo = useCallback(
    (idx: number) => instanceRef.current && instanceRef.current.moveToIdx(idx),
    [instanceRef]
  );

  const togglePlay = () => setIsPlaying((p) => !p);

  useEffect(() => {
    if (!instanceRef.current) return;
    if (!isPlaying) return;
  }, [isPlaying, instanceRef]);

  const navButtonStyle = {
    variant: "ghost" as const,
    size: "sm" as const,
    rounded: "full",
    colorScheme: "brand" as const,
    bg: useColorModeValue("whiteAlpha.800", "blackAlpha.500"),
    _hover: { bg: useColorModeValue("white", "blackAlpha.600") },
    shadow: "md",
  };

  const dotActiveBorder = useColorModeValue("brand.500", "brand.300");
  const dotInactiveBorder = useColorModeValue("gray.300", "gray.600");
  const sectionBg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box
      as="section"
      id="testimonials"
      py={{ base: 16, md: 24 }}
      bg={sectionBg}
    >
      <Container maxW="6xl">
        <Stack spacing={12}>
          <Stack spacing={4} textAlign="center" maxW="2xl" mx="auto">
            <Heading size="lg">What travelers are saying</Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={useColorModeValue("gray.600", "gray.300")}
            >
              Real impact from real journeys. Every session is geared toward
              practical, respectful communication.
            </Text>
          </Stack>

          <Box
            position="relative"
            onMouseEnter={() => {
              wasPlayingRef.current = isPlayingRef.current;
              if (isPlayingRef.current) setIsPlaying(false);
            }}
            onMouseLeave={() => {
              if (wasPlayingRef.current) setIsPlaying(true);
            }}
          >
            <chakra.div
              ref={sliderRef}
              className="keen-slider"
              role="region"
              aria-roledescription="carousel"
              aria-label="Traveler testimonials carousel"
            >
              {DATA.map((t, idx) => (
                <Box
                  key={t.id}
                  className="keen-slider__slide"
                  h="full"
                  display="flex"
                  role="group"
                  aria-label={`Slide ${idx + 1} of ${DATA.length}`}
                >
                  <TestimonialCard t={t} />
                </Box>
              ))}
            </chakra.div>

            <Box
              aria-hidden="true"
              pointerEvents="none"
              position="absolute"
              top={0}
              bottom={0}
              left={0}
              w={24}
              bg={`linear-gradient(to right, ${sectionBg}, rgba(255,255,255,0))`}
              _dark={{
                bg: `linear-gradient(to right, ${sectionBg}, rgba(0,0,0,0))`,
              }}
            />
            <Box
              aria-hidden="true"
              pointerEvents="none"
              position="absolute"
              top={0}
              bottom={0}
              right={0}
              w={24}
              bg={`linear-gradient(to left, ${sectionBg}, rgba(255,255,255,0))`}
              _dark={{
                bg: `linear-gradient(to left, ${sectionBg}, rgba(0,0,0,0))`,
              }}
            />
          </Box>

          <Flex
            direction={{ base: "column", sm: "row" }}
            align={{ base: "stretch", sm: "center" }}
            justify="space-between"
            gap={4}
            flexWrap="wrap"
          >
            <HStack spacing={2}>
              <IconButton
                {...navButtonStyle}
                aria-label="Previous testimonial"
                icon={<FiChevronLeft />}
                onClick={() => instanceRef.current?.prev()}
              />
              <IconButton
                {...navButtonStyle}
                aria-label="Next testimonial"
                icon={<FiChevronRight />}
                onClick={() => instanceRef.current?.next()}
              />
              <IconButton
                aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
                icon={isPlaying ? <FiPause /> : <FiPlay />}
                onClick={togglePlay}
                size="sm"
                variant="outline"
                colorScheme="brand"
              />
            </HStack>
            <HStack spacing={2} justify="center" flexWrap="wrap" flex={1}>
              {DATA.map((_, idx) => {
                const isActive = idx === current;
                return (
                  <chakra.button
                    key={idx}
                    onClick={() => goTo(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    aria-current={isActive ? "true" : undefined}
                    w={3}
                    h={3}
                    rounded="full"
                    borderWidth="2px"
                    borderColor={isActive ? dotActiveBorder : dotInactiveBorder}
                    bg={isActive ? dotActiveBorder : "transparent"}
                    transition="all 0.2s"
                    _focusVisible={{
                      boxShadow: "0 0 0 2px var(--chakra-colors-brand-500)",
                    }}
                  >
                    <VisuallyHidden>
                      {isActive ? "Current slide" : `Go to slide ${idx + 1}`}
                    </VisuallyHidden>
                  </chakra.button>
                );
              })}
            </HStack>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}
