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
import { ReactNode, useMemo } from "react";
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

// Word-by-word reveal animation
interface AnimatedTextProps {
  text: string;
  highlight?: string;
  accent: string;
  delay?: number;
}

function AnimatedText({ text, highlight, accent, delay = 0 }: AnimatedTextProps) {
  const words = text.split(' ');
  
  return (
    <MotionBox
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.12, delayChildren: delay }}
    >
      {words.map((word, index) => {
        const isHighlighted = highlight && word.includes(highlight.split(' ')[0]);
        
        return (
          <motion.span
            key={index}
            variants={{
              hidden: { 
                opacity: 0, 
                y: 50,
                rotateX: -90,
                filter: "blur(10px)"
              },
              visible: { 
                opacity: 1, 
                y: 0,
                rotateX: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }
              }
            }}
            style={{ 
              display: 'inline-block',
              marginRight: '0.3em',
              transformOrigin: '50% 100%'
            }}
          >
            {isHighlighted ? (
              <Box as="span" position="relative" display="inline-block">
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: delay + (index * 0.12) + 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(120deg, ${accent}20 0%, ${accent}40 100%)`,
                    borderRadius: '4px',
                    transformOrigin: 'left center',
                    zIndex: -1
                  }}
                />
                <chakra.span
                  color={accent}
                  fontWeight="bold"
                  px={1}
                  position="relative"
                  _after={{
                    content: '""',
                    position: 'absolute',
                    bottom: '-2px',
                    left: '50%',
                    width: '0%',
                    height: '3px',
                    backgroundColor: accent,
                    borderRadius: '2px',
                    transform: 'translateX(-50%)',
                    animation: `expand 0.6s ease-out ${delay + (index * 0.12) + 0.8}s forwards`
                  }}
                  sx={{
                    "@keyframes expand": {
                      "to": { width: '100%' }
                    }
                  }}
                >
                  {word}
                </chakra.span>
              </Box>
            ) : (
              word
            )}
          </motion.span>
        );
      })}
    </MotionBox>
  );
}

// Enhanced Floating Elements with Particles
function FloatingElements() {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 4 + Math.random() * 3,
    type: Math.random() > 0.7 ? 'square' : 'circle'
  }));

  return (
    <Box position="absolute" inset={0} pointerEvents="none" overflow="hidden">
      {particles.map((particle) => (
        <MotionBox
          key={particle.id}
          position="absolute"
          left={`${particle.initialX}%`}
          top={`${particle.initialY}%`}
          w={`${particle.size}px`}
          h={`${particle.size}px`}
          borderRadius={particle.type === 'circle' ? "full" : "2px"}
          initial={{ 
            opacity: 0,
            scale: 0,
            rotate: 0,
            filter: "blur(3px)"
          }}
          animate={{ 
            opacity: [0, 0.3, 0.8, 0.3, 0],
            scale: [0, 0.5, 1, 1.2, 0],
            rotate: [0, 180, 360],
            y: [0, -100, -200],
            x: [0, Math.sin(particle.id) * 50, Math.cos(particle.id) * 30],
            filter: ["blur(3px)", "blur(0px)", "blur(1px)", "blur(3px)"]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          background={`linear-gradient(45deg, var(--chakra-colors-brand-300), var(--chakra-colors-brand-500))`}
          boxShadow="0 0 20px var(--chakra-colors-brand-200)"
        />
      ))}
      
      {/* Gradient Orbs */}
      {[...Array(3)].map((_, i) => (
        <MotionBox
          key={`orb-${i}`}
          position="absolute"
          w="120px"
          h="120px"
          borderRadius="full"
          background={`radial-gradient(circle, var(--chakra-colors-brand-200), transparent 70%)`}
          initial={{ 
            x: Math.random() * 300,
            y: Math.random() * 200,
            scale: 0,
            opacity: 0
          }}
          animate={{ 
            x: [0, 100, -50, 0],
            y: [0, -80, 60, 0],
            scale: [0, 1, 0.8, 0],
            opacity: [0, 0.2, 0.4, 0]
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </Box>
  );
}

function StatCard({ label, value, icon }: StatProps) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
  return (
    <MotionBox
      initial={{ opacity: 0, y: 30, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={prefersReducedMotion ? {} : { 
        scale: 1.08,
        rotateY: 5,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        transition: { 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <Flex
        direction="column"
        p={4}
        rounded="xl"
        bg={useColorModeValue("white", "gray.700")}
        shadow="sm"
        borderWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.600")}
        role="group"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, var(--chakra-colors-brand-400), var(--chakra-colors-brand-600))",
          transform: "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.3s ease"
        }}
        _hover={
          prefersReducedMotion
            ? undefined
            : { 
                shadow: "xl", 
                transform: "translateY(-4px)",
                _before: {
                  transform: "scaleX(1)"
                }
              }
        }
        transition="all 0.3s ease"
      >
        <HStack mb={2} spacing={2} color="brand.500" fontSize="sm">
          <motion.div
            whileHover={{ 
              scale: 1.2, 
              rotate: 10,
              color: "var(--chakra-colors-brand-600)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {icon}
          </motion.div>
          <Text fontWeight="medium">{label}</Text>
        </HStack>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <Heading size="md" color="brand.600">{value}</Heading>
        </motion.div>
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
                  <MotionBox
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Button
                      size="lg"
                      colorScheme="brand"
                      rightIcon={
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Icon as={FiPlay} />
                        </motion.div>
                      }
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
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                        transition: "left 0.8s ease-out",
                      }}
                      _hover={{
                        _before: {
                          left: "100%",
                        },
                        transform: "translateY(-2px)"
                      }}
                    >
                      Start Learning
                    </Button>
                  </MotionBox>
                  
                  <MotionBox
                    whileHover={{ 
                      scale: 1.05,
                      borderColor: "brand.400",
                      boxShadow: "0 0 20px rgba(var(--chakra-colors-brand-500), 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      colorScheme="brand"
                      w={{ base: "full", sm: "auto" }}
                      position="relative"
                      _hover={{
                        bg: "brand.50",
                        transform: "translateY(-2px)"
                      }}
                    >
                      Browse Tutors
                    </Button>
                  </MotionBox>
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
                  <MotionBox
                    whileFocus={{ 
                      scale: 1.02,
                      boxShadow: "0 0 30px rgba(var(--chakra-colors-brand-500), 0.2)"
                    }}
                    whileHover={{
                      boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <InputGroup size="lg" maxW="480px" w="full">
                      <InputLeftElement pointerEvents="none">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            repeatDelay: 2,
                            ease: "easeInOut"
                          }}
                        >
                          <Icon as={FiSearch} color="brand.400" />
                        </motion.div>
                      </InputLeftElement>
                      <Input
                        id="tutor-search"
                        placeholder="Find a tutor (safari, culture, beginner...)"
                        bg={useColorModeValue("white", "gray.800")}
                        shadow="sm"
                        borderWidth="2px"
                        borderColor="transparent"
                        _focus={{ 
                          shadow: "lg", 
                          borderColor: "brand.400",
                          bg: useColorModeValue("brand.50", "gray.700")
                        }}
                        _hover={{
                          borderColor: "brand.200"
                        }}
                        w="full"
                        transition="all 0.3s ease"
                      />
                    </InputGroup>
                  </MotionBox>
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
