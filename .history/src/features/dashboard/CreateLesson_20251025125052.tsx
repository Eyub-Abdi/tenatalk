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
    <Box as="form" onSubmit={handleSubmit} maxW="4xl">
      <Stack spacing={6}>
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
          <Heading size="lg">Create a new lesson</Heading>
          <Text fontSize="sm" color={mutedText}>
            Craft lesson titles like on italki—be specific about outcomes so
            students pick the right fit.
          </Text>
        </Stack>

        <Stack
          spacing={6}
          bg={cardBg}
          borderRadius="md"
          border="1px solid"
          borderColor={borderColor}
          p={{ base: 4, md: 6 }}
          shadow="sm"
        >
          <FormControl isRequired>
            <FormLabel>Lesson title</FormLabel>
            <Input
              placeholder="e.g. Conversational English for Professionals"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>What will students learn?</FormLabel>
            <Textarea
              placeholder="Share the focus, materials, or structure students can expect."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
            />
          </FormControl>

          <Stack spacing={3}>
            <Text fontWeight="semibold">Duration & price</Text>
            <RadioGroup
              value={duration}
              onChange={(value) => setDuration(value as "30" | "60")}
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {durationOptions.map((option) => {
                  const isActive = duration === option.value;
                  return (
                    <Box
                      key={option.value}
                      border="1px solid"
                      borderColor={isActive ? "brand.500" : borderColor}
                      borderRadius="md"
                      p={4}
                      cursor="pointer"
                      bg={isActive ? "brand.50" : "transparent"}
                      onClick={() => setDuration(option.value as "30" | "60")}
                      transition="all 0.2s"
                    >
                      <HStack justify="space-between" align="start">
                        <Radio value={option.value}>{option.label}</Radio>
                        {isActive && (
                          <Badge colorScheme="brand">Selected</Badge>
                        )}
                      </HStack>
                      <Text fontSize="sm" color={mutedText} mt={2}>
                        {option.detail}
                      </Text>
                    </Box>
                  );
                })}
              </SimpleGrid>
            </RadioGroup>
          </Stack>

          <Stack spacing={3}>
            <Text fontWeight="semibold">Lesson format</Text>
            <RadioGroup
              value={format}
              onChange={(value) => setFormat(value as "single" | "package")}
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {formatOptions.map((option) => {
                  const isActive = format === option.value;
                  return (
                    <Box
                      key={option.value}
                      border="1px solid"
                      borderColor={isActive ? "brand.500" : borderColor}
                      borderRadius="md"
                      p={4}
                      cursor="pointer"
                      bg={isActive ? "brand.50" : "transparent"}
                      onClick={() =>
                        setFormat(option.value as "single" | "package")
                      }
                      transition="all 0.2s"
                    >
                      <HStack justify="space-between" align="start">
                        <Radio value={option.value}>{option.label}</Radio>
                        {isActive && (
                          <Badge colorScheme="brand">Selected</Badge>
                        )}
                      </HStack>
                      <Text fontSize="sm" color={mutedText} mt={2}>
                        {option.helper}
                      </Text>
                    </Box>
                  );
                })}
              </SimpleGrid>
            </RadioGroup>
          </Stack>

          <Divider />

          <Stack spacing={2}>
            <HStack spacing={2} color={mutedText}>
              <FiBookOpen />
              <Text fontSize="sm">Lesson summary</Text>
            </HStack>
            <Text fontSize="lg" fontWeight="bold">
              {title.trim() || "Untitled lesson"}
            </Text>
            <Text fontSize="sm" color={mutedText}>
              {durationMinutes} minutes · {priceLabel} ·{" "}
              {format === "single" ? "single lesson" : "package lesson"}
            </Text>
          </Stack>

          <HStack justify="flex-end" spacing={3}>
            <Button variant="ghost" onClick={resetForm} type="button">
              Reset
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isLoading={createLesson.isPending}
            >
              Publish lesson
            </Button>
          </HStack>
        </Stack>
      </Stack>
    </Box>
  );
}
