import {
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import type { FormEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiBookOpen,
  FiClock,
  FiDollarSign,
  FiPackage,
} from "react-icons/fi";
import { useCreateLesson } from "../lessons/api/useLessons";

const durationOptions = [
  {
    value: "30",
    label: "30 minute lesson",
    detail: "$8 • great for trial lessons",
  },
  {
    value: "60",
    label: "60 minute lesson",
    detail: "$20 • ideal for regular students",
  },
];

const formatOptions = [
  { value: "single", label: "Single lesson", helper: "One-off booking." },
  {
    value: "package",
    label: "Package lesson",
    helper: "Bundle this lesson into multi-session offers later.",
  },
];

export default function CreateLesson() {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const highlightBg = useColorModeValue("brand.50", "brand.900");
  const summaryCardBg = useColorModeValue("gray.50", "gray.900");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<"30" | "60">("60");
  const [format, setFormat] = useState<"single" | "package">("single");

  const price = useMemo(() => (duration === "30" ? 8 : 20), [duration]);
  const durationMinutes = useMemo(
    () => (duration === "30" ? 30 : 60),
    [duration]
  );
  const priceLabel = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price),
    [price]
  );

  const toast = useToast();
  const navigate = useNavigate();
  const createLesson = useCreateLesson();

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setDuration("60");
    setFormat("single");
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        toast({
          title: "Add a lesson title",
          description: "Students rely on titles to understand what you teach.",
          status: "warning",
        });
        return;
      }

      try {
        await createLesson.mutateAsync({
          title: trimmedTitle,
          description: description.trim() || undefined,
          duration_minutes: durationMinutes as 30 | 60,
          price_cents: price * 100,
          format,
        });
        toast({
          title: "Lesson created",
          description: "Your lesson is ready for students to book.",
          status: "success",
        });
        resetForm();
        navigate("/dashboard/bookings");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to create lesson.";
        toast({
          title: "Something went wrong",
          description: message,
          status: "error",
        });
      }
    },
    [
      createLesson,
      description,
      durationMinutes,
      format,
      navigate,
      price,
      resetForm,
      title,
      toast,
    ]
  );

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={5} maxW="5xl" mx="auto">
        <HStack justify="space-between" align="center" flexWrap="wrap" spacing={4}>
          <Stack spacing={1}>
            <HStack spacing={3}>
              <Button
                leftIcon={<FiArrowLeft />}
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
              <Heading size="lg">Create lesson</Heading>
            </HStack>
            <Text fontSize="sm" color={mutedText}>
              Be specific about outcomes so students pick the right fit.
            </Text>
          </Stack>
          <HStack spacing={2}>
            <Button
              variant="outline"
              onClick={resetForm}
              type="button"
              size="sm"
            >
              Reset
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isLoading={createLesson.isPending}
              size="sm"
            >
              Publish lesson
            </Button>
          </HStack>
        </HStack>

        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={4} alignItems="start">
          {/* Main form - spans 2 columns */}
          <Box gridColumn={{ base: "1", lg: "span 2" }}>
            <Stack spacing={4}>
              <Box
                bg={cardBg}
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                p={5}
                shadow="sm"
              >
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="semibold">
                      Lesson title
                    </FormLabel>
                    <Input
                      placeholder="e.g. Conversational English for Professionals"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                    />
                    <FormHelperText fontSize="xs">
                      Choose a clear, descriptive title.
                    </FormHelperText>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="semibold">
                      Description
                    </FormLabel>
                    <Textarea
                      placeholder="Share the focus, materials, or structure students can expect."
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      rows={3}
                      resize="vertical"
                    />
                    <FormHelperText fontSize="xs">
                      Explain goals, teaching approach, and resources.
                    </FormHelperText>
                  </FormControl>
                </Stack>
              </Box>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box
                  bg={cardBg}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={borderColor}
                  p={4}
                  shadow="sm"
                >
                  <Stack spacing={3}>
                    <HStack spacing={2}>
                      <Icon as={FiClock} color="brand.500" boxSize={4} />
                      <Text fontSize="sm" fontWeight="semibold">
                        Duration & price
                      </Text>
                    </HStack>
                    <RadioGroup
                      value={duration}
                      onChange={(value) => setDuration(value as "30" | "60")}
                    >
                      <Stack spacing={2}>
                        {durationOptions.map((option) => {
                          const isActive = duration === option.value;
                          return (
                            <Box
                              key={option.value}
                              border="1px solid"
                              borderColor={
                                isActive ? "brand.500" : borderColor
                              }
                              borderRadius="md"
                              p={3}
                              cursor="pointer"
                              bg={isActive ? highlightBg : "transparent"}
                              onClick={() =>
                                setDuration(option.value as "30" | "60")
                              }
                              transition="all 0.2s"
                              _hover={{
                                borderColor: "brand.400",
                              }}
                            >
                              <HStack justify="space-between">
                                <Radio value={option.value} size="sm">
                                  <Text fontSize="sm" fontWeight="medium">
                                    {option.label}
                                  </Text>
                                </Radio>
                                {isActive && (
                                  <Badge colorScheme="brand" fontSize="2xs">
                                    ✓
                                  </Badge>
                                )}
                              </HStack>
                              <Text fontSize="xs" color={mutedText} mt={1} ml={5}>
                                {option.detail}
                              </Text>
                            </Box>
                          );
                        })}
                      </Stack>
                    </RadioGroup>
                  </Stack>
                </Box>

                <Box
                  bg={cardBg}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={borderColor}
                  p={4}
                  shadow="sm"
                >
                  <Stack spacing={3}>
                    <HStack spacing={2}>
                      <Icon as={FiPackage} color="brand.500" boxSize={4} />
                      <Text fontSize="sm" fontWeight="semibold">
                        Format
                      </Text>
                    </HStack>
                    <RadioGroup
                      value={format}
                      onChange={(value) =>
                        setFormat(value as "single" | "package")
                      }
                    >
                      <Stack spacing={2}>
                        {formatOptions.map((option) => {
                          const isActive = format === option.value;
                          return (
                            <Box
                              key={option.value}
                              border="1px solid"
                              borderColor={
                                isActive ? "brand.500" : borderColor
                              }
                              borderRadius="md"
                              p={3}
                              cursor="pointer"
                              bg={isActive ? highlightBg : "transparent"}
                              onClick={() =>
                                setFormat(option.value as "single" | "package")
                              }
                              transition="all 0.2s"
                              _hover={{
                                borderColor: "brand.400",
                              }}
                            >
                              <HStack justify="space-between">
                                <Radio value={option.value} size="sm">
                                  <Text fontSize="sm" fontWeight="medium">
                                    {option.label}
                                  </Text>
                                </Radio>
                                {isActive && (
                                  <Badge colorScheme="brand" fontSize="2xs">
                                    ✓
                                  </Badge>
                                )}
                              </HStack>
                              <Text fontSize="xs" color={mutedText} mt={1} ml={5}>
                                {option.helper}
                              </Text>
                            </Box>
                          );
                        })}
                      </Stack>
                    </RadioGroup>
                  </Stack>
                </Box>
              </SimpleGrid>
            </Stack>
          </Box>

          {/* Preview sidebar - 1 column */}
          <Box position="sticky" top={4}>
            <Box
              bg={summaryCardBg}
              borderRadius="lg"
              border="1px solid"
              borderColor={borderColor}
              p={4}
              shadow="sm"
            >
              <Stack spacing={3}>
                <HStack spacing={2} color="brand.500">
                  <Icon as={FiBookOpen} boxSize={4} />
                  <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wide">
                    Preview
                  </Text>
                </HStack>

                <Divider />

                <VStack align="start" spacing={2}>
                  <Text fontSize="md" fontWeight="bold" noOfLines={2}>
                    {title.trim() || "Untitled lesson"}
                  </Text>

                  {description.trim() && (
                    <Text fontSize="xs" color={mutedText} noOfLines={3}>
                      {description.trim()}
                    </Text>
                  )}

                  <Divider />

                  <SimpleGrid columns={2} spacing={3} width="full" fontSize="xs">
                    <Box>
                      <HStack spacing={1} mb={0.5}>
                        <Icon as={FiClock} boxSize={3} color={mutedText} />
                        <Text color={mutedText} fontSize="2xs" textTransform="uppercase">
                          Duration
                        </Text>
                      </HStack>
                      <Text fontWeight="semibold">{durationMinutes} min</Text>
                    </Box>
                    <Box>
                      <HStack spacing={1} mb={0.5}>
                        <Icon as={FiDollarSign} boxSize={3} color={mutedText} />
                        <Text color={mutedText} fontSize="2xs" textTransform="uppercase">
                          Price
                        </Text>
                      </HStack>
                      <Text fontWeight="semibold">{priceLabel}</Text>
                    </Box>
                  </SimpleGrid>

                  <Box width="full">
                    <HStack spacing={1} mb={0.5}>
                      <Icon as={FiPackage} boxSize={3} color={mutedText} />
                      <Text color={mutedText} fontSize="2xs" textTransform="uppercase">
                        Format
                      </Text>
                    </HStack>
                    <Badge colorScheme="brand" fontSize="2xs" textTransform="capitalize">
                      {format}
                    </Badge>
                  </Box>
                </VStack>
              </Stack>
            </Box>
          </Box>
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
