import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
  Textarea,
  VStack,
  Wrap,
  WrapItem,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiArrowRight, FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface TutorApplicationState {
  teaching_languages: string[];
  video_introduction: File | null;
  has_webcam: boolean;
  video_requirements_agreed: boolean;
  about_me: string;
  me_as_teacher: string;
  lessons_teaching_style: string;
  teaching_materials: string;
  education_experience: string;
  teaching_experience: string;
  industry_experience: string;
  profile_visibility: "public" | "private";
  teaching_interests: string[];
}

type StoredApplication = {
  formSnapshot: Omit<TutorApplicationState, "video_introduction">;
};

const APPLICATION_STORAGE_KEY = "tutor_application_progress_v1";

const TEACHING_INTEREST_OPTIONS = [
  "Music",
  "Sports & Fitness",
  "Food",
  "Films & TV Series",
  "Reading",
  "Writing",
  "Art",
  "History",
  "Science",
  "Business & Finance",
  "Medical & Healthcare",
  "Tech",
  "Pets & Animals",
  "Gaming",
  "Travel",
  "Legal Services",
  "Marketing",
  "Fashion & Beauty",
  "Environment & Nature",
  "Animation & Comics",
];

const getInitialApplicationState = (): TutorApplicationState => ({
  teaching_languages: [],
  video_introduction: null,
  has_webcam: false,
  video_requirements_agreed: false,
  about_me: "",
  me_as_teacher: "",
  lessons_teaching_style: "",
  teaching_materials: "",
  education_experience: "",
  teaching_experience: "",
  industry_experience: "",
  profile_visibility: "public",
  teaching_interests: [],
});

export function TutorApplicationWizard() {
  const [form, setForm] = useState<TutorApplicationState>(() =>
    getInitialApplicationState()
  );
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasHydrated = useRef(false);
  const skipPersistence = useRef(false);
  const toast = useToast();
  const navigate = useNavigate();

  const sanitizeForStorage = useCallback(
    (state: TutorApplicationState): StoredApplication["formSnapshot"] => {
      const { video_introduction, ...rest } = state;
      return rest;
    },
    []
  );

  const resetProgress = useCallback(() => {
    skipPersistence.current = true;
    localStorage.removeItem(APPLICATION_STORAGE_KEY);
    setForm(getInitialApplicationState());
    setVideoPreviewUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
  }, []);

  useEffect(() => {
    if (hasHydrated.current) return;
    try {
      const stored = localStorage.getItem(APPLICATION_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as StoredApplication;
      if (parsed.formSnapshot) {
        setForm((prev) => ({ ...prev, ...parsed.formSnapshot }));
      }
    } catch (err) {
      console.warn("Failed to load tutor application progress", err);
    } finally {
      hasHydrated.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    if (skipPersistence.current) {
      skipPersistence.current = false;
      return;
    }

    const payload: StoredApplication = {
      formSnapshot: sanitizeForStorage(form),
    };

    try {
      localStorage.setItem(APPLICATION_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn("Failed to persist tutor application progress", err);
    }
  }, [form, sanitizeForStorage]);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const handleVideoChange = (file: File | null) => {
    setForm((prev) => ({ ...prev, video_introduction: file }));
    setVideoPreviewUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const handleSubmit = () => {
    if (form.teaching_languages.length === 0) {
      toast({
        title: "Select at least one teaching language",
        status: "error",
        position: "top-right",
      });
      return;
    }
    if (!form.video_introduction) {
      toast({
        title: "Video introduction is required",
        status: "error",
        position: "top-right",
      });
      return;
    }
    if (!form.video_requirements_agreed) {
      toast({
        title: "Confirm the video requirements",
        status: "error",
        position: "top-right",
      });
      return;
    }
    if (
      !form.about_me ||
      !form.me_as_teacher ||
      !form.lessons_teaching_style
    ) {
      toast({
        title: "Complete your tutor introduction",
        status: "error",
        position: "top-right",
      });
      return;
    }
    if (form.teaching_interests.length < 5) {
      toast({
        title: "Pick at least 5 teaching interests",
        status: "error",
        position: "top-right",
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Application submitted",
        description: "Thanks! We will review your tutor profile and follow up via email.",
        status: "success",
        position: "top-right",
      });
      resetProgress();
      navigate("/teacher-application-success");
    }, 2000);
  };

  const submitDisabled =
    isSubmitting ||
    form.teaching_languages.length === 0 ||
    !form.video_introduction ||
    !form.video_requirements_agreed ||
    !form.about_me ||
    !form.me_as_teacher ||
    !form.lessons_teaching_style ||
    form.teaching_interests.length < 5;

  return (
    <VStack align="stretch" spacing={8} pb={16}>
      <Box>
        <Heading size="lg" mb={2}>
          Tutor Application
        </Heading>
        <Text color="gray.600">
          Complete the sections below to submit your teaching application. You can
          leave and return any time—your progress is saved locally.
        </Text>
      </Box>

      <HStack justify="flex-end">
        <Button size="sm" variant="ghost" onClick={resetProgress}>
          Clear saved progress
        </Button>
      </HStack>

      <Box
        bg="gray.50"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        p={6}
      >
        <Heading size="md" mb={4}>
          Teaching Languages
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Select the language(s) you are confident teaching. Only languages at a
          native or C2 level are currently accepted.
        </Text>
        <Alert status="info" mb={4}>
          <AlertIcon />
          Due to the volume of applications, English submissions are paused. Other
          languages remain open.
        </Alert>
        <FormControl>
          <FormLabel>Teaching languages</FormLabel>
          <CheckboxGroup
            value={form.teaching_languages}
            onChange={(values) =>
              setForm((prev) => ({
                ...prev,
                teaching_languages: values as string[],
              }))
            }
          >
            <Stack>
              <Checkbox value="swahili">Swahili</Checkbox>
              <HStack>
                <Checkbox value="english" isDisabled>
                  English
                </Checkbox>
                <Badge colorScheme="red">Not accepting applications</Badge>
              </HStack>
            </Stack>
          </CheckboxGroup>
        </FormControl>
      </Box>

      <Box
        bg="gray.50"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        p={6}
      >
        <Heading size="md" mb={4}>
          Video Introduction
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Record a short video introducing yourself and your teaching style.
        </Text>
        <VStack spacing={4} align="stretch">
          <HStack spacing={3}>
            <Button size="sm" variant="outline">
              Video instructions
            </Button>
            <Button size="sm" variant="outline">
              Sample 1
            </Button>
            <Button size="sm" variant="outline">
              Sample 2
            </Button>
          </HStack>

          <Alert status="warning">
            <AlertIcon />
            Review the requirements below carefully. Applications without a valid
            introduction video are automatically rejected.
          </Alert>

          <Stack spacing={1} fontSize="sm" color="gray.600">
            <Text fontWeight="semibold">File requirements</Text>
            <Text>• Maximum size: 200 MB</Text>
            <Text>• Recommended aspect ratio: 16:9</Text>
            <Text>• Length: 1-4 minutes</Text>
            <Text color="red.500">• Video submission is mandatory</Text>
          </Stack>

          <FormControl isRequired>
            <FormLabel>Upload video</FormLabel>
            <Box
              border="2px dashed"
              borderColor="gray.300"
              borderRadius="lg"
              p={8}
              textAlign="center"
              bg="white"
              position="relative"
              _hover={{ borderColor: "brand.300", bg: "brand.50" }}
              transition="all 0.2s"
            >
              <Input
                type="file"
                accept="video/*"
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                opacity="0"
                cursor="pointer"
                onChange={(e) => handleVideoChange(e.target.files?.[0] ?? null)}
              />
              <VStack spacing={2}>
                <Icon as={FiUpload} boxSize={8} color="gray.400" />
                <Text fontWeight="semibold" color="gray.700">
                  Click to upload your introduction video
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Accepted formats: MP4, AVI, MOV
                </Text>
              </VStack>
            </Box>
          </FormControl>

          {videoPreviewUrl && (
            <Box>
              <FormLabel>Video preview</FormLabel>
              <Box
                border="2px solid"
                borderColor="brand.200"
                borderRadius="lg"
                p={4}
                bg="brand.50"
              >
                <video
                  src={videoPreviewUrl}
                  controls
                  preload="metadata"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    borderRadius: "8px",
                    backgroundColor: "#000",
                  }}
                >
                  <track kind="captions" />
                  Your browser does not support the video tag.
                </video>
                <HStack justify="space-between" align="center" mt={3}>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      {form.video_introduction?.name}
                    </Text>
                    {form.video_introduction && (
                      <Text fontSize="xs" color="gray.600">
                        Size: {(form.video_introduction.size / 1024 / 1024).toFixed(2)} MB
                      </Text>
                    )}
                  </VStack>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="red"
                    onClick={() => handleVideoChange(null)}
                  >
                    Remove video
                  </Button>
                </HStack>
              </Box>
            </Box>
          )}

          <Stack spacing={2}>
            <Text fontSize="sm" fontWeight="semibold">
              Your video should:
            </Text>
            <Checkbox size="sm">Show you speaking the teaching language</Checkbox>
            <Checkbox size="sm">Be recorded in landscape orientation</Checkbox>
            <Checkbox size="sm">Have clear audio and lighting</Checkbox>
            <Checkbox size="sm">Exclude personal contact details</Checkbox>
          </Stack>

          <Checkbox
            isChecked={form.has_webcam}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, has_webcam: e.target.checked }))
            }
          >
            I have a webcam and can host video lessons.
          </Checkbox>

          <Checkbox
            isChecked={form.video_requirements_agreed}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                video_requirements_agreed: e.target.checked,
              }))
            }
            size="sm"
          >
            I understand my video must follow these rules and may appear on
            SalvatoreLingo channels.
          </Checkbox>
        </VStack>
      </Box>

      <Box
        bg="gray.50"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        p={6}
      >
        <Heading size="md" mb={4}>
          Tutor Introduction
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Share details that help students understand your background and lesson
          style.
        </Text>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>About me</FormLabel>
            <Textarea
              placeholder="Tell students about yourself..."
              value={form.about_me}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, about_me: e.target.value }))
              }
              maxLength={700}
            />
            <Text fontSize="xs" color="gray.500" textAlign="right">
              {form.about_me.length}/700
            </Text>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Me as a teacher</FormLabel>
            <Textarea
              placeholder="Describe your teaching approach..."
              value={form.me_as_teacher}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, me_as_teacher: e.target.value }))
              }
              maxLength={700}
            />
            <Text fontSize="xs" color="gray.500" textAlign="right">
              {form.me_as_teacher.length}/700
            </Text>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>My lessons & teaching style</FormLabel>
            <Textarea
              placeholder="Explain how you structure lessons..."
              value={form.lessons_teaching_style}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  lessons_teaching_style: e.target.value,
                }))
              }
              maxLength={700}
            />
            <Text fontSize="xs" color="gray.500" textAlign="right">
              {form.lessons_teaching_style.length}/700
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel>Teaching materials (optional)</FormLabel>
            <Textarea
              placeholder="List the materials you rely on..."
              value={form.teaching_materials}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  teaching_materials: e.target.value,
                }))
              }
            />
            <Wrap spacing={2} mt={2}>
              {["PDF", "Slides", "Audio", "Video", "Flashcards", "Homework"].map(
                (item) => (
                  <WrapItem key={item}>
                    <Badge>{item}</Badge>
                  </WrapItem>
                )
              )}
            </Wrap>
          </FormControl>
        </VStack>
      </Box>

      <Box
        bg="gray.50"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        p={6}
      >
        <Heading size="md" mb={4}>
          Background
        </Heading>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Education experience</FormLabel>
            <Textarea
              placeholder="Summarize your education history..."
              value={form.education_experience}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  education_experience: e.target.value,
                }))
              }
            />
          </FormControl>

          <FormControl>
            <FormLabel>Teaching experience</FormLabel>
            <Textarea
              placeholder="Share any teaching roles you've held..."
              value={form.teaching_experience}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  teaching_experience: e.target.value,
                }))
              }
            />
          </FormControl>

          <FormControl>
            <FormLabel>Industry experience</FormLabel>
            <Textarea
              placeholder="Mention relevant industry background..."
              value={form.industry_experience}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  industry_experience: e.target.value,
                }))
              }
            />
          </FormControl>

          <Checkbox
            isChecked={form.profile_visibility === "public"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                profile_visibility: e.target.checked ? "public" : "private",
              }))
            }
          >
            Make my profile public once approved.
          </Checkbox>
        </VStack>
      </Box>

      <Box
        bg="gray.50"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        p={6}
      >
        <Heading size="md" mb={4}>
          Teaching Interests
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Pick up to five topics you love discussing. This helps match you with new
          students.
        </Text>
        <CheckboxGroup
          value={form.teaching_interests}
          onChange={(values) =>
            setForm((prev) => ({
              ...prev,
              teaching_interests: values as string[],
            }))
          }
        >
          <Wrap spacing={3}>
            {TEACHING_INTEREST_OPTIONS.map((interest) => (
              <WrapItem key={interest}>
                <Checkbox
                  value={interest}
                  isDisabled={
                    form.teaching_interests.length >= 5 &&
                    !form.teaching_interests.includes(interest)
                  }
                >
                  {interest}
                </Checkbox>
              </WrapItem>
            ))}
          </Wrap>
        </CheckboxGroup>
        <Text fontSize="xs" color="gray.500" mt={2}>
          Selected: {form.teaching_interests.length}/5
        </Text>
      </Box>

      <HStack justify="flex-end">
        <VStack spacing={2} align="end">
          <Button
            colorScheme="brand"
            onClick={handleSubmit}
            rightIcon={<Icon as={FiArrowRight} />}
            isLoading={isSubmitting}
            isDisabled={submitDisabled}
          >
            Submit application
          </Button>
          <Text fontSize="xs" color="gray.500">
            Demo mode – submissions are mocked while the API is offline.
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
}
