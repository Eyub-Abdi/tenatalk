import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  Badge,
  VStack,
  chakra,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FiSearch, FiPlay, FiCheckCircle } from "react-icons/fi";
import { ReactNode, useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface StatProps {
  label: string;
  value: string;
  icon?: ReactNode;
}

// Create motion components
const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);

// Animated Text Component
interface AnimatedTextProps {
  text: string;
  highlight?: string;
  accent: string;
  delay?: number;
}

function AnimatedText({ text, highlight, accent, delay = 0 }: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 80 + Math.random() * 40); // Variable typing speed for natural feel
      
      return () => clearTimeout(timeout);
    } else {
      // Hide cursor after typing is complete
      const timeout = setTimeout(() => setShowCursor(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  // Cursor blinking effect
  const isTyping = currentIndex < text.length;
  useEffect(() => {
    if (showCursor) {
      const interval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 530);
      return () => clearInterval(interval);
    }
  }, [showCursor, isTyping]);

  const renderTextWithHighlight = () => {
    if (!highlight || !displayText.includes(highlight)) {
      return displayText;
    }

    const parts = displayText.split(highlight);
    return (
      <>
        {parts[0]}
        {displayText.includes(highlight) && (
          <chakra.span 
            color={accent}
            position="relative"
            _after={{
              content: '""',
              position: "absolute",
              bottom: "-2px",
              left: 0,
              right: 0,
              height: "3px",
              bg: accent,
              borderRadius: "2px",
              transform: "scaleX(0)",
              transformOrigin: "left",
              animation: currentIndex >= text.indexOf(highlight) + highlight.length 
                ? "slideIn 0.8s ease-out 0.3s forwards" 
                : "none"
            }}
            sx={{
              "@keyframes slideIn": {
                "0%": { transform: "scaleX(0)" },
                "100%": { transform: "scaleX(1)" }
              }
            }}
          >
            {highlight}
          </chakra.span>
        )}
        {parts[1]}
      </>
    );
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {renderTextWithHighlight()}
      <chakra.span
        color={accent}
        opacity={showCursor ? 1 : 0}
        transition="opacity 0.1s"
        animation={currentIndex < text.length ? "blink 1.2s infinite" : "none"}
        sx={{
          "@keyframes blink": {
            "0%, 50%": { opacity: 1 },
            "51%, 100%": { opacity: 0 }
          }
        }}
      >
        |
      </chakra.span>
    </MotionBox>
  );
}

// Floating Animation Component
function FloatingElements() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <MotionBox
          key={i}
          position="absolute"
          w="6px"
          h="6px"
          bg="brand.200"
          borderRadius="full"
          opacity={0.4}
          initial={{ 
            x: Math.random() * 400,
            y: Math.random() * 300,
            scale: 0
          }}
          animate={{ 
            y: [0, -20, 0],
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  );
}

function StatCard({ label, value, icon }: StatProps) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      whileHover={prefersReducedMotion ? {} : { 
        scale: 1.05,
        rotate: 1,
        transition: { duration: 0.2 }
      }}
    >
      <Flex
        direction="column"
        p={4}
        rounded="lg"
        bg={useColorModeValue("white", "gray.700")}
        shadow="sm"
        borderWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.600")}
        role="group"
        transition="all 0.2s"
        _hover={
          prefersReducedMotion
            ? undefined
            : { shadow: "md", transform: "translateY(-2px)" }
        }
      >
        <HStack mb={1} spacing={2} color="brand.500" fontSize="sm">
          {icon}
          <Text fontWeight="medium">{label}</Text>
        </HStack>
        <Heading size="md">{value}</Heading>
      </Flex>
    </MotionBox>
  );
}

export function Hero() {
  const gradient = useColorModeValue(
    "linear(to-br, brand.50, white)",
    "linear(to-br, gray.800, gray.900)"
  );
  const accent = useColorModeValue("brand.500", "brand.400");
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  return (
    <Box
      position="relative"
      overflow="hidden"
      bgGradient={gradient}
      pb={{ base: 16, md: 20 }}
      pt={{ base: 8, md: 20 }}
      w="100%"
      maxW="100vw"
    >
      <Box
        position="absolute"
        top={{ base: "-5%", md: "-10%" }}
        right={0}
        w={{ base: "55%", md: "45%" }}
        h={{ base: "70%", md: "80%" }}
        bg="brand.100"
        filter={
          prefersReducedMotion
            ? undefined
            : { base: "blur(70px)", md: "blur(110px)" }
        }
        opacity={0.45}
        pointerEvents="none"
        overflow="hidden"
      />
      <Container maxW="6xl" position="relative">
        <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={10}>
          <Flex align="center" gridColumn={{ base: "span 12", lg: "span 7" }}>
            <Stack spacing={6}>
              <MotionBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge
                  alignSelf="flex-start"
                  colorScheme="brand"
                  variant="subtle"
                  rounded="full"
                  px={3}
                  py={1}
                  fontWeight="medium"
                >
                  Swahili for Real Journeys
                </Badge>
              </MotionBox>
              
              <Box position="relative" overflow="hidden">
                <FloatingElements />
                <MotionHeading
                  lineHeight={1.15}
                  fontWeight={700}
                  fontSize={{ base: "2rem", sm: "2.4rem", md: "3.2rem" }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <AnimatedText 
                    text="Speak confident Swahili before you land in Tanzania."
                    highlight="confident Swahili"
                    accent={accent}
                    delay={0.5}
                  />
                </MotionHeading>
              </Box>
              <MotionText
                fontSize={{ base: "md", md: "lg" }}
                color={useColorModeValue("gray.600", "gray.300")}
                maxW={{ base: "md", md: "lg" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                Live sessions with vetted local tutors + rapid phrase packs
                crafted for safari, markets & cultural etiquette. Learn what
                actually matters for respectful travel.
              </MotionText>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ width: "100%" }}
                  >
                    <Button
                      size="lg"
                      colorScheme="brand"
                      rightIcon={<Icon as={FiPlay} />}
                      w={{ base: "full", sm: "auto" }}
                      position="relative"
                      overflow="hidden"
                      _before={{
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        transition: "left 0.6s",
                      }}
                      _hover={{
                        _before: {
                          left: "100%",
                        }
                      }}
                    >
                      Start Learning
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ width: "100%" }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      colorScheme="brand"
                      w={{ base: "full", sm: "auto" }}
                    >
                      Browse Tutors
                    </Button>
                  </motion.div>
                </Stack>
              </MotionBox>
              <MotionBox 
                pt={2}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <chakra.form
                  onSubmit={(e) => e.preventDefault()}
                  role="search"
                  aria-label="Find a tutor"
                >
                  <VisuallyHidden>
                    <label htmlFor="tutor-search">Find a tutor</label>
                  </VisuallyHidden>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <InputGroup size="lg" maxW="480px" w="full">
                      <InputLeftElement pointerEvents="none">
                        <motion.div
                          animate={{ 
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3
                          }}
                        >
                          <Icon as={FiSearch} color="gray.400" />
                        </motion.div>
                      </InputLeftElement>
                      <Input
                        id="tutor-search"
                        placeholder="Find a tutor (safari, culture, beginner...)"
                        bg={useColorModeValue("white", "gray.800")}
                        shadow="sm"
                        _focus={{ shadow: "md", borderColor: "brand.400" }}
                        w="full"
                      />
                    </InputGroup>
                  </motion.div>
                </chakra.form>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <HStack
                    mt={2}
                    spacing={{ base: 3, md: 4 }}
                    fontSize={{ base: "11px", md: "xs" }}
                    color={useColorModeValue("gray.500", "gray.400")}
                    flexWrap="wrap"
                  >
                    {[
                      "Vetted tutors",
                      "No commitment trial", 
                      "Secure payments"
                    ].map((text, index) => (
                      <motion.div
                        key={text}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.6 + (index * 0.1) }}
                      >
                        <HStack spacing={1}>
                          <Icon as={FiCheckCircle} color="brand.500" />
                          <Text>{text}</Text>
                        </HStack>
                      </motion.div>
                    ))}
                  </HStack>
                </motion.div>

                {/* Mobile stats (shown only when preview panel hidden) */}
                <SimpleGrid
                  mt={6}
                  columns={3}
                  spacing={{ base: 2, sm: 3 }}
                  display={{ base: "grid", md: "none" }}
                >
                  <StatCard
                    label="Tutors"
                    value="120+"
                    icon={<Icon as={FiCheckCircle} />}
                  />
                  <StatCard
                    label="Phrases"
                    value="800+"
                    icon={<Icon as={FiCheckCircle} />}
                  />
                  <StatCard
                    label="Rating"
                    value="4.8★"
                    icon={<Icon as={FiCheckCircle} />}
                  />
                </SimpleGrid>
              </MotionBox>
            </Stack>
          </Flex>
          <Flex
            gridColumn={{ base: "span 12", lg: "span 5" }}
            align="center"
            display={{ base: "none", md: "flex" }}
          >
            <VStack w="full" spacing={6}>
              <Box
                w="full"
                aspectRatio={4 / 3}
                rounded="xl"
                bg={useColorModeValue("white", "gray.800")}
                borderWidth="1px"
                borderColor={useColorModeValue("gray.200", "gray.700")}
                shadow="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
                overflow="hidden"
              >
                <Text
                  fontWeight="medium"
                  color="gray.500"
                  px={6}
                  textAlign="center"
                >
                  (Future) dynamic preview: phrase drills & tutor intro clip
                </Text>
                <Box
                  position="absolute"
                  top={3}
                  right={3}
                  fontSize="xs"
                  px={2}
                  py={1}
                  rounded="md"
                  bg="brand.500"
                  color="white"
                >
                  Preview
                </Box>
              </Box>
              <SimpleGrid columns={3} w="full" spacing={4}>
                <StatCard
                  label="Tutors"
                  value="120+"
                  icon={<Icon as={FiCheckCircle} />}
                />
                <StatCard
                  label="Phrases"
                  value="800+"
                  icon={<Icon as={FiCheckCircle} />}
                />
                <StatCard
                  label="Avg Rating"
                  value="4.8★"
                  icon={<Icon as={FiCheckCircle} />}
                />
              </SimpleGrid>
            </VStack>
          </Flex>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
