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
      <Stack spacing={6} maxW="6xl" mx="auto">
        <Stack spacing={2}>
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            size="sm"
            width="fit-content"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Heading size="xl">Create a new lesson</Heading>
          <Text fontSize="md" color={mutedText} maxW="2xl">
            Craft lesson titles like on italki—be specific about outcomes so
            students pick the right fit.
          </Text>
        </Stack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} alignItems="start">
          {/* Left column: Form inputs */}
          <Stack spacing={6}>
            <Box
              bg={cardBg}
              borderRadius="lg"
              border="1px solid"
              borderColor={borderColor}
              p={{ base: 4, md: 6 }}
              shadow="md"
            >
              <Stack spacing={5}>
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Lesson title</FormLabel>
                  <Input
                    placeholder="e.g. Conversational English for Professionals"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    size="lg"
                  />
                  <FormHelperText>
                    Choose a clear, descriptive title that highlights what
                    students will achieve.
                  </FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="semibold">
                    What will students learn?
                  </FormLabel>
                  <Textarea
                    placeholder="Share the focus, materials, or structure students can expect."
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={5}
                    resize="vertical"
                  />
                  <FormHelperText>
                    Explain goals, teaching approach, and any resources you'll
                    provide.
                  </FormHelperText>
                </FormControl>
              </Stack>
            </Box>

            <Box
              bg={cardBg}
              borderRadius="lg"
              border="1px solid"
              borderColor={borderColor}
              p={{ base: 4, md: 6 }}
              shadow="md"
            >
              <Stack spacing={5}>
                <Stack spacing={3}>
                  <HStack spacing={2}>
                    <Icon as={FiClock} color="brand.500" />
                    <Text fontWeight="semibold">Duration & price</Text>
                  </HStack>
                  <RadioGroup
                    value={duration}
                    onChange={(value) => setDuration(value as "30" | "60")}
                  >
                    <Stack spacing={3}>
                      {durationOptions.map((option) => {
                        const isActive = duration === option.value;
                        return (
                          <Box
                            key={option.value}
                            border="2px solid"
                            borderColor={
                              isActive ? "brand.500" : borderColor
                            }
                            borderRadius="lg"
                            p={4}
                            cursor="pointer"
                            bg={isActive ? highlightBg : "transparent"}
                            onClick={() =>
                              setDuration(option.value as "30" | "60")
                            }
                            transition="all 0.2s"
                            _hover={{
                              borderColor: "brand.400",
                              shadow: "sm",
                            }}
                          >
                            <HStack justify="space-between" align="start">
                              <Radio value={option.value} size="lg">
                                <Text fontWeight="medium">
                                  {option.label}
                                </Text>
                              </Radio>
                              {isActive && (
                                <Badge colorScheme="brand" fontSize="xs">
                                  Selected
                                </Badge>
                              )}
                            </HStack>
                            <Text fontSize="sm" color={mutedText} mt={2} ml={6}>
                              {option.detail}
                            </Text>
                          </Box>
                        );
                      })}
                    </Stack>
                  </RadioGroup>
                </Stack>

                <Divider />

                <Stack spacing={3}>
                  <HStack spacing={2}>
                    <Icon as={FiPackage} color="brand.500" />
                    <Text fontWeight="semibold">Lesson format</Text>
                  </HStack>
                  <RadioGroup
                    value={format}
                    onChange={(value) =>
                      setFormat(value as "single" | "package")
                    }
                  >
                    <Stack spacing={3}>
                      {formatOptions.map((option) => {
                        const isActive = format === option.value;
                        return (
                          <Box
                            key={option.value}
                            border="2px solid"
                            borderColor={
                              isActive ? "brand.500" : borderColor
                            }
                            borderRadius="lg"
                            p={4}
                            cursor="pointer"
                            bg={isActive ? highlightBg : "transparent"}
                            onClick={() =>
                              setFormat(option.value as "single" | "package")
                            }
                            transition="all 0.2s"
                            _hover={{
                              borderColor: "brand.400",
                              shadow: "sm",
                            }}
                          >
                            <HStack justify="space-between" align="start">
                              <Radio value={option.value} size="lg">
                                <Text fontWeight="medium">
                                  {option.label}
                                </Text>
                              </Radio>
                              {isActive && (
                                <Badge colorScheme="brand" fontSize="xs">
                                  Selected
                                </Badge>
                              )}
                            </HStack>
                            <Text fontSize="sm" color={mutedText} mt={2} ml={6}>
                              {option.helper}
                            </Text>
                          </Box>
                        );
                      })}
                    </Stack>
                  </RadioGroup>
                </Stack>
              </Stack>
            </Box>
          </Stack>

          {/* Right column: Preview summary */}
          <Box position="sticky" top={4}>
            <Box
              bg={summaryCardBg}
              borderRadius="lg"
              border="2px solid"
              borderColor={borderColor}
              p={6}
              shadow="lg"
            >
              <Stack spacing={4}>
                <HStack spacing={2} color="brand.500">
                  <Icon as={FiBookOpen} boxSize={5} />
                  <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase">
                    Lesson preview
                  </Text>
                </HStack>

                <VStack align="start" spacing={3}>
                  <Box>
                    <Text fontSize="xs" color={mutedText} mb={1}>
                      TITLE
                    </Text>
                    <Text fontSize="xl" fontWeight="bold">
                      {title.trim() || "Untitled lesson"}
                    </Text>
                  </Box>

                  {description.trim() && (
                    <Box>
                      <Text fontSize="xs" color={mutedText} mb={1}>
                        DESCRIPTION
                      </Text>
                      <Text fontSize="sm" color={mutedText}>
                        {description.trim()}
                      </Text>
                    </Box>
                  )}

                  <Divider />

                  <SimpleGrid columns={2} spacing={4} width="full">
                    <Box>
                      <HStack spacing={1} mb={1}>
                        <Icon as={FiClock} boxSize={3} color={mutedText} />
                        <Text fontSize="xs" color={mutedText}>
                          DURATION
                        </Text>
                      </HStack>
                      <Text fontWeight="semibold">{durationMinutes} min</Text>
                    </Box>
                    <Box>
                      <HStack spacing={1} mb={1}>
                        <Icon as={FiDollarSign} boxSize={3} color={mutedText} />
                        <Text fontSize="xs" color={mutedText}>
                          PRICE
                        </Text>
                      </HStack>
                      <Text fontWeight="semibold">{priceLabel}</Text>
                    </Box>
                    <Box>
                      <HStack spacing={1} mb={1}>
                        <Icon as={FiPackage} boxSize={3} color={mutedText} />
                        <Text fontSize="xs" color={mutedText}>
                          FORMAT
                        </Text>
                      </HStack>
                      <Text fontWeight="semibold" textTransform="capitalize">
                        {format}
                      </Text>
                    </Box>
                  </SimpleGrid>
                </VStack>

                <Divider />

                <HStack justify="space-between" spacing={3}>
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    type="button"
                    size="md"
                    flex="1"
                  >
                    Reset
                  </Button>
                  <Button
                    colorScheme="brand"
                    type="submit"
                    isLoading={createLesson.isPending}
                    size="md"
                    flex="1"
                  >
                    Publish
                  </Button>
                </HStack>
              </Stack>
            </Box>
          </Box>
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
