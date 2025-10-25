import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  List, ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Select,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  CheckboxGroup,
  Wrap,
  WrapItem,
  VStack,
  HStack,
  Heading,
  Alert,
  AlertIcon,
  Badge,
  VisuallyHidden,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiGlobe,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "./AuthModalProvider";
import { useAuth } from "./AuthProvider";
import { useLogin, useRegister } from "./useAuthApi";

export function AuthModal() {
  const { isOpen, view, close, openLogin, openSignup } = useAuthModal();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const loginMutation = useLogin();
  const registerMutation = useRegister<WizardRegisterState>();
  const [showPassword, setShowPassword] = useState(false);
  const [formLogin, setFormLogin] = useState({ email: "", password: "" });

  // Color mode values
  const stepBg = useColorModeValue("gray.50", "gray.700");
  const stepBorderColor = useColorModeValue("gray.200", "gray.600");
  interface WizardRegisterState {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
    user_type: string;
    preferred_language: string;
    phone_number: string;
    country: string;
    terms_accepted: boolean;
    // Teaching fields for step 3
    teaching_languages: string[];
    video_introduction: File | null;
    about_me: string;
    me_as_teacher: string;
    lessons_teaching_style: string;
    teaching_materials: string;
    has_webcam: boolean;
    video_requirements_agreed: boolean;
    education_experience: string;
    teaching_certificates: string[];
    teaching_experience: string;
    industry_experience: string;
    specialty_certificates: string[];
    profile_visibility: "public" | "private";
    teaching_interests: string[];
  }
  const [formRegister, setFormRegister] = useState<WizardRegisterState>({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirm: "",
    user_type: "student",
    preferred_language: "en",
    phone_number: "",
    country: "",
    terms_accepted: false,
    // Teaching fields
    teaching_languages: [],
    video_introduction: null,
    about_me: "",
    me_as_teacher: "",
    lessons_teaching_style: "",
    teaching_materials: "",
    has_webcam: false,
    video_requirements_agreed: false,
    education_experience: "",
    teaching_certificates: [],
    teaching_experience: "",
    industry_experience: "",
    specialty_certificates: [],
    profile_visibility: "public",
    teaching_interests: [],
  });
  const [signupStep, setSignupStep] = useState<0 | 1 | 2 | 3>(0); // 0 email verify,1 details,2 preferences,3 teaching info
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Auto-detect country (placeholder - real impl would call geo API)
  useEffect(() => {
    if (!formRegister.country) {
      try {
        const locale = Intl.DateTimeFormat().resolvedOptions().locale;
        const guess = locale.split("-")[1] || "";
        if (guess)
          setFormRegister((f) => ({ ...f, country: guess.toUpperCase() }));
      } catch {
        // ignore
      }
    }
  }, [formRegister.country]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email: formLogin.email, password: formLogin.password },
      {
        onSuccess: (d) => {
          setAuth(d.user, d.access, d.refresh);
          toast({
            title: "Logged in successfully",
            status: "success",
            position: "top-right",
          });
          close();
          navigate("/dashboard");
        },
        onError: (err) => {
          toast({
            title: "Login failed",
            description: err.message,
            status: "error",
            position: "top-right",
          });
        },
      }
    );
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupStep === 0) return; // guard
    if (formRegister.password !== formRegister.password_confirm) {
      toast({
        title: "Passwords do not match",
        status: "error",
        position: "top-right",
      });
      return;
    }
    if (!formRegister.terms_accepted) {
      toast({
        title: "You must accept terms",
        status: "error",
        position: "top-right",
      });
      return;
    }
    // Build payload matching backend expectations (exclude wizard-only flags)
    const payload: WizardRegisterState = {
      ...formRegister, // Include all fields from the form
    };
    // Narrow to RegisterPayload subset (extra keys like country allowed if backend ignores or extend API later)
    registerMutation.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Registration successful",
          description: "Please check your email for verification.",
          status: "success",
          position: "top-right",
        });
        openLogin();
      },
      onError: (err) => {
        toast({
          title: "Registration failed",
          description: err.message,
          status: "error",
          position: "top-right",
        });
      },
    });
  };

  const loading = loginMutation.isPending || registerMutation.isPending;
  const passwordStrength = (() => {
    const p = formRegister.password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score; // 0-4
  })();
  const strengthLabel = ["Very weak", "Weak", "Fair", "Good", "Strong"][
    passwordStrength
  ];
  const pwReq = {
    length: formRegister.password.length >= 8,
    upper: /[A-Z]/.test(formRegister.password),
    digit: /[0-9]/.test(formRegister.password),
    special: /[^A-Za-z0-9]/.test(formRegister.password),
  };

  const googleAuth = () => {
    const base =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
    window.location.href = `${base}/accounts/google/login/`; // backend should redirect to provider
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      isCentered
      size={{ base: "full", sm: "md", md: "lg" }}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent overflow="hidden" maxH="90vh">
        <ModalHeader pb={2}>
          {view === "login" ? "Welcome back" : "Create your account"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={4} px={6}>
          <Tabs
            index={view === "login" ? 0 : 1}
            onChange={(i) => {
              if (i === 0) {
                openLogin();
                // reset signup wizard when leaving
                setSignupStep(0);
              } else {
                openSignup();
              }
            }}
            variant="enclosed"
            isFitted
          >
            <TabList mb={4}>
              <Tab _selected={{ bg: "gray.50", borderColor: "gray.300" }}>
                Login
              </Tab>
              <Tab _selected={{ bg: "gray.50", borderColor: "gray.300" }}>
                Sign Up
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0} pt={0}>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={8}
                  align="flex-start"
                >
                  <Box flex="1" minW={0}>
                    <form onSubmit={handleLogin}>
                      <Stack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>Email</FormLabel>
                          <Input
                            type="email"
                            autoComplete="email"
                            value={formLogin.email}
                            onChange={(e) =>
                              setFormLogin((f) => ({
                                ...f,
                                email: e.target.value,
                              }))
                            }
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel>Password</FormLabel>
                          <InputGroup>
                            <Input
                              type={showPassword ? "text" : "password"}
                              autoComplete="current-password"
                              value={formLogin.password}
                              onChange={(e) =>
                                setFormLogin((f) => ({
                                  ...f,
                                  password: e.target.value,
                                }))
                              }
                            />
                            <InputRightElement width="3rem">
                              <Button
                                h="1.75rem"
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label={
                                  showPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                                p={0}
                                minW="auto"
                                _hover={{ bg: "transparent" }}
                              >
                                <Icon
                                  as={showPassword ? FiEyeOff : FiEye}
                                  color="gray.500"
                                />
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>
                        <Button
                          type="submit"
                          colorScheme="brand"
                          isLoading={loading}
                          w="full"
                        >
                          Login
                        </Button>
                      </Stack>
                    </form>
                  </Box>
                  <Divider
                    orientation="vertical"
                    display={{ base: "none", md: "block" }}
                  />
                  <Stack flex="1" spacing={4} align="center" textAlign="center">
                    <Text fontSize="sm" color="gray.600" px={4}>
                      Or continue with
                    </Text>
                    <Button
                      variant="outline"
                      w="full"
                      onClick={googleAuth}
                      isDisabled={loading}
                      leftIcon={<Icon as={FcGoogle} boxSize={5} />}
                    >
                      <VisuallyHidden>Continue with Google</VisuallyHidden>
                      Google
                    </Button>
                    <Text fontSize="xs" color="gray.500" maxW="260px">
                      We never post to any account. You’ll choose a password
                      later if needed.
                    </Text>
                  </Stack>
                </Stack>
              </TabPanel>
              <TabPanel px={0} pt={0}>
                {/* Progress Indicator */}
                <Box mb={4}>
                  <Stack
                    direction="row"
                    spacing={2}
                    align="center"
                    justify="center"
                    mb={1}
                  >
                    {(formRegister.user_type === "tutor" ? [0, 1, 2, 3] : [0, 1, 2]).map((step) => (
                      <Box key={step} display="flex" alignItems="center">
                        <Box
                          w="8px"
                          h="8px"
                          borderRadius="full"
                          bg={signupStep >= step ? "brand.500" : "gray.300"}
                          transition="all 0.2s"
                        />
                        {step < 2 && (
                          <Box
                            w="20px"
                            h="1px"
                            bg={signupStep > step ? "brand.500" : "gray.300"}
                            transition="all 0.2s"
                          />
                        )}
                      </Box>
                    ))}
                  </Stack>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    textAlign="center"
                    fontWeight="medium"
                  >
                    {signupStep === 0 && "Verify Email"}
                    {signupStep === 1 && "Personal Details"}
                    {signupStep === 2 && "Preferences"}
                    {signupStep === 3 && "Teaching Info"}
                  </Text>
                </Box>

                <Stack spacing={6}>
                  {signupStep === 0 && (
                    <Box
                      bg={stepBg}
                      p={4}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor={stepBorderColor}
                    >
                      <Stack
                        spacing={3}
                        align="center"
                        textAlign="center"
                        mb={4}
                      >
                        <Box
                          p={3}
                          borderRadius="full"
                          bg="brand.100"
                          color="brand.600"
                        >
                          <Icon as={FiMail} boxSize={6} />
                        </Box>
                        <Stack spacing={2}>
                          <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            color="gray.900"
                          >
                            Let&apos;s get started
                          </Text>
                          <Text fontSize="sm" color="gray.600" maxW="300px">
                            Enter your email to begin. We will send a
                            verification link to get you started.
                          </Text>
                        </Stack>
                      </Stack>

                      <FormControl isRequired mb={4}>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          Email Address
                        </FormLabel>
                        <InputGroup>
                          <Input
                            type="email"
                            value={formRegister.email}
                            autoComplete="email"
                            onChange={(e) =>
                              setFormRegister((f) => ({
                                ...f,
                                email: e.target.value,
                              }))
                            }
                            placeholder="you@example.com"
                            size="lg"
                            bg="white"
                            borderWidth="2px"
                            _focus={{
                              borderColor: "brand.500",
                              boxShadow:
                                "0 0 0 1px var(--chakra-colors-brand-500)",
                            }}
                            _hover={{ borderColor: "gray.300" }}
                          />
                        </InputGroup>
                      </FormControl>
                      <Stack spacing={3} mb={4}>
                        <Button
                          variant="outline"
                          w="full"
                          onClick={googleAuth}
                          leftIcon={<Icon as={FcGoogle} boxSize={5} />}
                          size="lg"
                          borderWidth="2px"
                          _hover={{ borderColor: "gray.400", bg: "gray.50" }}
                        >
                          Continue with Google
                        </Button>
                        <Box position="relative">
                          <Divider />
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            textAlign="center"
                            bg={stepBg}
                            px={3}
                            position="absolute"
                            top="-6px"
                            left="50%"
                            transform="translateX(-50%)"
                          >
                            Or continue with email
                          </Text>
                        </Box>
                      </Stack>
                      {!emailSent && (
                        <Button
                          colorScheme="brand"
                          w="full"
                          size="lg"
                          rightIcon={<Icon as={FiArrowRight} />}
                          onClick={() => {
                            if (
                              !formRegister.email ||
                              !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(
                                formRegister.email
                              )
                            ) {
                              toast({
                                title: "Enter a valid email",
                                status: "error",
                              });
                              return;
                            }
                            // Simulate sending email
                            setEmailSent(true);
                            toast({
                              title: "Verification email sent",
                              description: "Check your inbox for the link.",
                              status: "info",
                            });
                          }}
                        >
                          Send verification link
                        </Button>
                      )}
                      {emailSent && !emailVerified && (
                        <Box
                          p={4}
                          bg="blue.50"
                          borderRadius="lg"
                          border="1px solid"
                          borderColor="blue.200"
                        >
                          <Stack spacing={4} align="center" textAlign="center">
                            <Icon as={FiMail} boxSize={8} color="blue.500" />
                            <Stack spacing={2}>
                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="blue.900"
                              >
                                Check your email
                              </Text>
                              <Text fontSize="xs" color="blue.700">
                                We sent a verification link to{" "}
                                <Text as="span" fontWeight="medium">
                                  {formRegister.email}
                                </Text>
                              </Text>
                            </Stack>
                            <Stack direction="row" spacing={2} w="full">
                              <Button
                                colorScheme="blue"
                                size="sm"
                                flex={1}
                                rightIcon={<Icon as={FiCheck} />}
                                onClick={() => {
                                  setEmailVerified(true);
                                  setSignupStep(1);
                                  toast({
                                    title: "Email verified (simulated)",
                                    status: "success",
                                  });
                                }}
                              >
                                I verified my email
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                colorScheme="blue"
                                onClick={() => {
                                  setEmailSent(false);
                                }}
                              >
                                Resend
                              </Button>
                            </Stack>
                          </Stack>
                        </Box>
                      )}
                    </Box>
                  )}
                  {signupStep === 1 && (
                    <Box
                      bg={stepBg}
                      p={4}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor={stepBorderColor}
                    >
                      <Stack
                        spacing={3}
                        align="center"
                        textAlign="center"
                        mb={4}
                      >
                        <Box
                          p={3}
                          borderRadius="full"
                          bg="brand.100"
                          color="brand.600"
                        >
                          <Icon as={FiUser} boxSize={6} />
                        </Box>
                        <Stack spacing={1}>
                          <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            color="gray.900"
                          >
                            Tell us about yourself
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            We need some basic information to set up your
                            account
                          </Text>
                        </Stack>
                      </Stack>
                      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mb={4}>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">
                            First Name
                          </FormLabel>
                          <Input
                            value={formRegister.first_name}
                            onChange={(e) =>
                              setFormRegister((f) => ({
                                ...f,
                                first_name: e.target.value,
                              }))
                            }
                            placeholder="John"
                            size="lg"
                            bg="white"
                            borderWidth="2px"
                            _focus={{
                              borderColor: "brand.500",
                              boxShadow:
                                "0 0 0 1px var(--chakra-colors-brand-500)",
                            }}
                            _hover={{ borderColor: "gray.300" }}
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">
                            Last Name
                          </FormLabel>
                          <Input
                            value={formRegister.last_name}
                            onChange={(e) =>
                              setFormRegister((f) => ({
                                ...f,
                                last_name: e.target.value,
                              }))
                            }
                            placeholder="Doe"
                            size="lg"
                            bg="white"
                            borderWidth="2px"
                            _focus={{
                              borderColor: "brand.500",
                              boxShadow:
                                "0 0 0 1px var(--chakra-colors-brand-500)",
                            }}
                            _hover={{ borderColor: "gray.300" }}
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">
                            Password
                          </FormLabel>
                          <InputGroup>
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={formRegister.password}
                              autoComplete="new-password"
                              onChange={(e) =>
                                setFormRegister((f) => ({
                                  ...f,
                                  password: e.target.value,
                                }))
                              }
                              placeholder="Create a strong password"
                              size="lg"
                              bg="white"
                              borderWidth="2px"
                              _focus={{
                                borderColor: "brand.500",
                                boxShadow:
                                  "0 0 0 1px var(--chakra-colors-brand-500)",
                              }}
                              _hover={{ borderColor: "gray.300" }}
                            />
                            <InputRightElement width="3rem">
                              <Button
                                h="1.75rem"
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label={
                                  showPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                                p={0}
                                minW="auto"
                                _hover={{ bg: "transparent" }}
                              >
                                <Icon
                                  as={showPassword ? FiEyeOff : FiEye}
                                  color="gray.500"
                                />
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">
                            Confirm Password
                          </FormLabel>
                          <InputGroup>
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={formRegister.password_confirm}
                              autoComplete="new-password"
                              onChange={(e) =>
                                setFormRegister((f) => ({
                                  ...f,
                                  password_confirm: e.target.value,
                                }))
                              }
                              placeholder="Confirm your password"
                              size="lg"
                              bg="white"
                              borderWidth="2px"
                              _focus={{
                                borderColor: "brand.500",
                                boxShadow:
                                  "0 0 0 1px var(--chakra-colors-brand-500)",
                              }}
                              _hover={{ borderColor: "gray.300" }}
                            />
                            <InputRightElement width="3rem">
                              <Button
                                h="1.75rem"
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label={
                                  showPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                                p={0}
                                minW="auto"
                                _hover={{ bg: "transparent" }}
                              >
                                <Icon
                                  as={showPassword ? FiEyeOff : FiEye}
                                  color="gray.500"
                                />
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>
                        <FormControl>
                          <FormLabel>Country</FormLabel>
                          <Input
                            value={formRegister.country}
                            onChange={(e) =>
                              setFormRegister((f) => ({
                                ...f,
                                country: e.target.value,
                              }))
                            }
                            placeholder="e.g. Tanzania"
                            size="lg"
                            bg="white"
                            borderWidth="2px"
                            _focus={{
                              borderColor: "brand.500",
                              boxShadow:
                                "0 0 0 1px var(--chakra-colors-brand-500)",
                            }}
                            _hover={{ borderColor: "gray.300" }}
                          />
                        </FormControl>
                      </SimpleGrid>

                      {/* Password Strength */}
                      <Box
                        mb={4}
                        p={3}
                        bg="gray.50"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.200"
                      >
                        <FormLabel mb={2} fontSize="sm" fontWeight="medium">
                          Password strength
                        </FormLabel>
                        <Stack spacing={1} mb={2}>
                          <Progress
                            size="xs"
                            value={(passwordStrength / 4) * 100}
                            colorScheme={
                              passwordStrength >= 4
                                ? "green"
                                : passwordStrength === 3
                                ? "blue"
                                : passwordStrength === 2
                                ? "yellow"
                                : "red"
                            }
                            rounded="sm"
                          />
                          <Text fontSize="xs" color="gray.500">
                            {strengthLabel}
                          </Text>
                        </Stack>
                        <List spacing={1} fontSize="xs" color="gray.600">
                          <ListItem>
                            • 8+ characters{" "}
                            {pwReq.length && (
                              <Text as="span" color="green.500">
                                ✔
                              </Text>
                            )}
                          </ListItem>
                          <ListItem>
                            • Uppercase letter{" "}
                            {pwReq.upper && (
                              <Text as="span" color="green.500">
                                ✔
                              </Text>
                            )}
                          </ListItem>
                          <ListItem>
                            • Number{" "}
                            {pwReq.digit && (
                              <Text as="span" color="green.500">
                                ✔
                              </Text>
                            )}
                          </ListItem>
                          <ListItem>
                            • Special character{" "}
                            {pwReq.special && (
                              <Text as="span" color="green.500">
                                ✔
                              </Text>
                            )}
                          </ListItem>
                        </List>
                      </Box>
                      <Stack direction="row" justify="space-between" pt={4}>
                        <Button
                          size="lg"
                          variant="outline"
                          leftIcon={<Icon as={FiArrowLeft} />}
                          onClick={() => setSignupStep(0)}
                        >
                          Back
                        </Button>
                        <Button
                          size="lg"
                          colorScheme="brand"
                          rightIcon={<Icon as={FiArrowRight} />}
                          onClick={() => {
                            if (
                              !formRegister.first_name ||
                              !formRegister.last_name
                            ) {
                              toast({
                                title: "Enter your name",
                                status: "error",
                              });
                              return;
                            }
                            if (formRegister.password.length < 8) {
                              toast({
                                title: "Password too weak",
                                status: "error",
                              });
                              return;
                            }
                            setSignupStep(2);
                          }}
                        >
                          Next
                        </Button>
                      </Stack>
                    </Box>
                  )}
                  {signupStep === 2 && (
                    <Box
                      bg={stepBg}
                      p={4}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor={stepBorderColor}
                    >
                      <Stack
                        spacing={3}
                        align="center"
                        textAlign="center"
                        mb={4}
                      >
                        <Box
                          p={3}
                          borderRadius="full"
                          bg="brand.100"
                          color="brand.600"
                        >
                          <Icon as={FiGlobe} boxSize={6} />
                        </Box>
                        <Stack spacing={1}>
                          <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            color="gray.900"
                          >
                            Almost there!
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            Help us customize your learning experience
                          </Text>
                        </Stack>
                      </Stack>
                      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mb={4}>
                        <FormControl isRequired>
                          <FormLabel>User Type</FormLabel>
                          <Select
                            value={formRegister.user_type}
                            onChange={(e) =>
                              setFormRegister((f) => ({
                                ...f,
                                user_type: e.target.value,
                              }))
                            }
                          >
                            <option value="student">Student</option>
                            <option value="tutor">Tutor</option>
                          </Select>
                        </FormControl>
                        <FormControl>
                          <FormLabel>Preferred Language</FormLabel>
                          <Select
                            value={formRegister.preferred_language}
                            onChange={(e) =>
                              setFormRegister((f) => ({
                                ...f,
                                preferred_language: e.target.value,
                              }))
                            }
                          >
                            <option value="en">English</option>
                            <option value="sw">Swahili</option>
                          </Select>
                        </FormControl>
                        <FormControl>
                          <FormLabel>Phone (optional)</FormLabel>
                          <Input
                            value={formRegister.phone_number}
                            onChange={(e) =>
                              setFormRegister((f) => ({
                                ...f,
                                phone_number: e.target.value,
                              }))
                            }
                            autoComplete="tel"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Country</FormLabel>
                          <Input
                            value={formRegister.country}
                            onChange={(e) =>
                              setFormRegister((f) => ({
                                ...f,
                                country: e.target.value,
                              }))
                            }
                          />
                        </FormControl>
                      </SimpleGrid>
                      <Checkbox
                        isChecked={formRegister.terms_accepted}
                        onChange={(e) =>
                          setFormRegister((f) => ({
                            ...f,
                            terms_accepted: e.target.checked,
                          }))
                        }
                        size="sm"
                        mb={4}
                      >
                        I agree to the{" "}
                        <Link href="/terms" color="brand.500">
                          Terms
                        </Link>{" "}
                        &{" "}
                        <Link href="/privacy" color="brand.500">
                          Privacy Policy
                        </Link>
                      </Checkbox>
                      <Stack direction="row" justify="space-between" mb={4}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSignupStep(1)}
                        >
                          Back
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="brand"
                          onClick={() => {
                            if (formRegister.user_type === "tutor") {
                              setSignupStep(3);
                            } else {
                              handleRegister();
                            }
                          }}
                          isLoading={loading}
                        >
                          {formRegister.user_type === "tutor" ? "Next" : "Create Account"}
                        </Button>
                      </Stack>
                      <Divider />
                      <Stack spacing={3} align="center" textAlign="center">
                        <Text fontSize="sm" color="gray.600">
                          Or sign up with
                        </Text>
                        <Button
                          variant="outline"
                          w="full"
                          onClick={googleAuth}
                          isDisabled={loading}
                          leftIcon={<Icon as={FcGoogle} boxSize={5} />}
                        >
                          {" "}
                          <VisuallyHidden>
                            Continue with Google
                          </VisuallyHidden>{" "}
                          Google
                        </Button>
                        <Text fontSize="xs" color="gray.500" maxW="260px">
                          We only use your name & email for account creation.
                        </Text>
                      </Stack>
                    </Box>
                  )}
                  
                  {/* Step 3: Teaching Information (only for tutors) */}
                  {signupStep === 3 && (
                    <VStack spacing={6} align="stretch">
                      {/* 3.1 Teaching Languages */}
                      <Box bg={stepBg} p={6} borderRadius="lg" border="1px solid" borderColor={stepBorderColor}>
                        <Heading size="md" mb={4}>3.1 Teaching Languages</Heading>
                        <Text fontSize="sm" color="gray.600" mb={4}>
                          Please select the language(s) you want to teach. Only native languages and languages spoken above a C2 level will appear in the selection below.
                        </Text>
                        
                        <Alert status="info" mb={4}>
                          <AlertIcon />
                          Due to the high number of applications, we've closed admissions for these languages for now. Please check back for weekly updates.
                        </Alert>
                        
                        <FormControl mb={4}>
                          <FormLabel>Teaching Languages</FormLabel>
                          <CheckboxGroup 
                            value={formRegister.teaching_languages} 
                            onChange={(values) => setFormRegister(f => ({...f, teaching_languages: values as string[]}))}
                          >
                            <Stack>
                              <Checkbox value="swahili">Swahili</Checkbox>
                              <HStack>
                                <Checkbox value="english" isDisabled>English</Checkbox>
                                <Badge colorScheme="red" size="sm">Not accepting applications</Badge>
                              </HStack>
                            </Stack>
                          </CheckboxGroup>
                        </FormControl>
                      </Box>

                      {/* 3.2 Video Introduction */}
                      <Box bg={stepBg} p={6} borderRadius="lg" border="1px solid" borderColor={stepBorderColor}>
                        <Heading size="md" mb={4}>3.2 Video Introduction</Heading>
                        <Text fontSize="sm" color="gray.600" mb={4}>
                          Use the following instruction to make the perfect video introduction.
                        </Text>
                        
                        <VStack spacing={4} align="stretch">
                          <HStack spacing={4}>
                            <Button size="sm" variant="outline">Video instructions</Button>
                            <Button size="sm" variant="outline">Video example 1</Button>
                            <Button size="sm" variant="outline">Video example 2</Button>
                          </HStack>
                          
                          <Alert status="warning">
                            <AlertIcon />
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="semibold">Check the video requirements</Text>
                              <Text fontSize="xs">By submitting your video to italki, you acknowledge that you agree to italki's Terms of Service. Please be sure not to violate others' copyright or privacy rights.</Text>
                            </VStack>
                          </Alert>
                          
                          <Stack spacing={2}>
                            <Text fontSize="sm" fontWeight="semibold">File Requirements:</Text>
                            <Text fontSize="xs" color="gray.600">• File size may not exceed 200 MB</Text>
                            <Text fontSize="xs" color="gray.600">• For the best result, the video aspect ratio should be 16:9</Text>
                            <Text fontSize="xs" color="gray.600">• Please take some time to read the Video Introduction Requirements before you update your video</Text>
                            <Text fontSize="xs" color="red.500">• Mandatory: It's mandatory for every teacher to upload a video introduction</Text>
                          </Stack>
                          
                          <FormControl isRequired>
                            <FormLabel>Upload your video</FormLabel>
                            <Input
                              type="file"
                              accept="video/*"
                              onChange={(e) => setFormRegister(f => ({...f, video_introduction: e.target.files?.[0] || null}))}
                            />
                          </FormControl>
                          
                          <Stack spacing={2}>
                            <Text fontSize="sm" fontWeight="semibold">Your video has to respect the following characteristics:</Text>
                            <Checkbox size="sm">It shows me fluently speaking my teaching language(s)</Checkbox>
                            <Checkbox size="sm">It is filmed horizontally</Checkbox>
                            <Checkbox size="sm">Its time length is approximately 1 to 4 minutes</Checkbox>
                            <Checkbox size="sm">It has good lighting and clear sound</Checkbox>
                            <Checkbox size="sm">It does NOT include personal contact information or external advertisements</Checkbox>
                          </Stack>
                          
                          <Checkbox
                            isChecked={formRegister.has_webcam}
                            onChange={(e) => setFormRegister(f => ({...f, has_webcam: e.target.checked}))}
                          >
                            I have a webcam and I can offer video-based lessons.
                          </Checkbox>
                          
                          <Checkbox
                            isChecked={formRegister.video_requirements_agreed}
                            onChange={(e) => setFormRegister(f => ({...f, video_requirements_agreed: e.target.checked}))}
                            size="sm"
                          >
                            I'm aware that if my introduction video does not meet italki's requirements, my application may be rejected. Additionally, I agree to italki publishing my introduction video to italki's official channels on third-party video hosting and streaming services, such as YouTube, Vimeo, Youku, or others, as to ensure accessibility and visibility to italki students regardless of location.
                          </Checkbox>
                        </VStack>
                      </Box>

                      {/* 3.3 Teacher Introduction */}
                      <Box bg={stepBg} p={6} borderRadius="lg" border="1px solid" borderColor={stepBorderColor}>
                        <Heading size="md" mb={4}>3.3 Teacher Introduction</Heading>
                        <Text fontSize="sm" color="gray.600" mb={4}>
                          Note: You can't add external links or use language that violates our terms of service.
                        </Text>
                        
                        <VStack spacing={4} align="stretch">
                          <FormControl isRequired>
                            <FormLabel>About Me</FormLabel>
                            <Textarea
                              placeholder="Tell students about yourself..."
                              value={formRegister.about_me}
                              onChange={(e) => setFormRegister(f => ({...f, about_me: e.target.value}))}
                              maxLength={700}
                            />
                            <Text fontSize="xs" color="gray.500" textAlign="right">{formRegister.about_me.length}/700</Text>
                          </FormControl>
                          
                          <FormControl isRequired>
                            <FormLabel>Me as a Teacher</FormLabel>
                            <Textarea
                              placeholder="Describe your teaching approach..."
                              value={formRegister.me_as_teacher}
                              onChange={(e) => setFormRegister(f => ({...f, me_as_teacher: e.target.value}))}
                              maxLength={700}
                            />
                            <Text fontSize="xs" color="gray.500" textAlign="right">{formRegister.me_as_teacher.length}/700</Text>
                          </FormControl>
                          
                          <FormControl isRequired>
                            <FormLabel>My lessons & teaching style</FormLabel>
                            <Textarea
                              placeholder="Explain your lesson structure and teaching methods..."
                              value={formRegister.lessons_teaching_style}
                              onChange={(e) => setFormRegister(f => ({...f, lessons_teaching_style: e.target.value}))}
                              maxLength={700}
                            />
                            <Text fontSize="xs" color="gray.500" textAlign="right">{formRegister.lessons_teaching_style.length}/700</Text>
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>My teaching material (Optional)</FormLabel>
                            <Textarea
                              placeholder="Describe the materials you use in teaching..."
                              value={formRegister.teaching_materials}
                              onChange={(e) => setFormRegister(f => ({...f, teaching_materials: e.target.value}))}
                            />
                            <Wrap spacing={2} mt={2}>
                              <WrapItem><Badge size="sm">PDF file</Badge></WrapItem>
                              <WrapItem><Badge size="sm">Text Documents</Badge></WrapItem>
                              <WrapItem><Badge size="sm">Presentation slides/PPT</Badge></WrapItem>
                              <WrapItem><Badge size="sm">Audio files</Badge></WrapItem>
                              <WrapItem><Badge size="sm">Image files</Badge></WrapItem>
                              <WrapItem><Badge size="sm">Video files</Badge></WrapItem>
                              <WrapItem><Badge size="sm">Flashcards</Badge></WrapItem>
                              <WrapItem><Badge size="sm">Articles and news</Badge></WrapItem>
                              <WrapItem><Badge size="sm">Quizzes</Badge></WrapItem>
                              <WrapItem><Badge size="sm">Test templates and examples</Badge></WrapItem>
                              <WrapItem><Badge size="sm">Graphs and charts</Badge></WrapItem>
                              <WrapItem><Badge size="sm">Homework Assignments</Badge></WrapItem>
                            </Wrap>
                          </FormControl>
                        </VStack>
                      </Box>

                      {/* 3.4 Background */}
                      <Box bg={stepBg} p={6} borderRadius="lg" border="1px solid" borderColor={stepBorderColor}>
                        <Heading size="md" mb={4}>3.4 Background</Heading>
                        <Text fontSize="sm" color="gray.600" mb={4}>
                          Please upload relevant documents showing your training or experience as a language teacher.
                          Uploaded files are ONLY visible to italki staff.
                        </Text>
                        
                        <VStack spacing={4} align="stretch">
                          <FormControl>
                            <FormLabel>Education experience</FormLabel>
                            <Textarea
                              placeholder="Describe your educational background..."
                              value={formRegister.education_experience}
                              onChange={(e) => setFormRegister(f => ({...f, education_experience: e.target.value}))}
                            />
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>Teaching experience</FormLabel>
                            <Textarea
                              placeholder="Describe your teaching experience..."
                              value={formRegister.teaching_experience}
                              onChange={(e) => setFormRegister(f => ({...f, teaching_experience: e.target.value}))}
                            />
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>Industry experience</FormLabel>
                            <Textarea
                              placeholder="Describe any relevant industry experience..."
                              value={formRegister.industry_experience}
                              onChange={(e) => setFormRegister(f => ({...f, industry_experience: e.target.value}))}
                            />
                          </FormControl>
                          
                          <Checkbox
                            isChecked={formRegister.profile_visibility === "public"}
                            onChange={(e) => setFormRegister(f => ({...f, profile_visibility: e.target.checked ? "public" : "private"}))}
                          >
                            Public - title and description visible on my teaching profile (You can always change this later in your privacy settings).
                          </Checkbox>
                        </VStack>
                      </Box>

                      {/* 3.5 Teaching Preference */}
                      <Box bg={stepBg} p={6} borderRadius="lg" border="1px solid" borderColor={stepBorderColor}>
                        <Heading size="md" mb={4}>3.5 Teaching preference</Heading>
                        <Text fontSize="sm" color="gray.600" mb={4}>
                          Please choose your top interests to help you better match with new students (5 / 5)
                        </Text>
                        
                        <CheckboxGroup 
                          value={formRegister.teaching_interests} 
                          onChange={(values) => setFormRegister(f => ({...f, teaching_interests: values as string[]}))}
                        >
                          <Wrap spacing={3}>
                            {[
                              "Music", "Sports & Fitness", "Food", "Films & TV Series", "Reading", "Writing", 
                              "Art", "History", "Science", "Business & Finance", "Medical & Healthcare", 
                              "Tech", "Pets & Animals", "Gaming", "Travel", "Legal Services", "Marketing", 
                              "Fashion & Beauty", "Environment & Nature", "Animation & Comics"
                            ].map(interest => (
                              <WrapItem key={interest}>
                                <Checkbox 
                                  value={interest} 
                                  isDisabled={formRegister.teaching_interests.length >= 5 && !formRegister.teaching_interests.includes(interest)}
                                >
                                  {interest}
                                </Checkbox>
                              </WrapItem>
                            ))}
                          </Wrap>
                        </CheckboxGroup>
                        
                        <Text fontSize="xs" color="gray.500" mt={2}>
                          Selected: {formRegister.teaching_interests.length}/5
                        </Text>
                      </Box>

                      {/* Navigation buttons */}
                      <HStack justify="space-between" pt={4}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSignupStep(2)}
                          leftIcon={<Icon as={FiArrowLeft} />}
                        >
                          Back
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="brand"
                          onClick={handleRegister}
                          isLoading={loading}
                          rightIcon={<Icon as={FiArrowRight} />}
                          isDisabled={
                            formRegister.teaching_languages.length === 0 ||
                            !formRegister.video_introduction ||
                            !formRegister.video_requirements_agreed ||
                            !formRegister.about_me ||
                            !formRegister.me_as_teacher ||
                            !formRegister.lessons_teaching_style ||
                            formRegister.teaching_interests.length < 5
                          }
                        >
                          Complete Registration
                        </Button>
                      </HStack>
                    </VStack>
                  )}
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter pt={2}>
          <Button variant="ghost" size="sm" onClick={close} mr={2}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
