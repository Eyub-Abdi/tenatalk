import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  InputGroup,
  InputRightElement,
  Checkbox,
  Select,
  Alert,
  AlertIcon,
  Divider,
  Box,
  Progress,
  Text,
  Icon,
  VisuallyHidden,
} from "@chakra-ui/react";
import { SimpleGrid, List, ListItem, Link } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiMail, FiUser, FiLock, FiGlobe, FiPhone, FiMapPin, FiCheck, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useAuthModal } from "./AuthModalProvider";
import { useState, useEffect } from "react";
import { useLogin, useRegister } from "./useAuthApi";
import { useAuth } from "./AuthProvider";

export function AuthModal() {
  const { isOpen, view, close, openLogin, openSignup } = useAuthModal();
  const { setAuth } = useAuth();
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
  });
  const [signupStep, setSignupStep] = useState<0 | 1 | 2>(0); // 0 email verify,1 details,2 preferences
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
          toast({ title: "Logged in", status: "success" });
          close();
        },
        onError: (err) => {
          toast({
            title: "Login failed",
            description: err.message,
            status: "error",
          });
        },
      }
    );
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupStep === 0) return; // guard
    if (formRegister.password !== formRegister.password_confirm) {
      toast({ title: "Passwords do not match", status: "error" });
      return;
    }
    if (!formRegister.terms_accepted) {
      toast({ title: "You must accept terms", status: "error" });
      return;
    }
    // Build payload matching backend expectations (exclude wizard-only flags)
    const payload: WizardRegisterState = {
      email: formRegister.email,
      password: formRegister.password,
      password_confirm: formRegister.password_confirm,
      first_name: formRegister.first_name,
      last_name: formRegister.last_name,
      user_type: formRegister.user_type,
      preferred_language: formRegister.preferred_language,
      phone_number: formRegister.phone_number,
      terms_accepted: formRegister.terms_accepted,
      country: formRegister.country,
    };
    // Narrow to RegisterPayload subset (extra keys like country allowed if backend ignores or extend API later)
    registerMutation.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Registration successful",
          description: "Please check your email for verification.",
          status: "success",
        });
        openLogin();
      },
      onError: (err) => {
        toast({
          title: "Registration failed",
          description: err.message,
          status: "error",
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
      size="xl"
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent overflow="hidden">
        <ModalHeader pb={2}>
          {view === "login" ? "Welcome back" : "Create your account"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
                        {loginMutation.isError && (
                          <Alert status="error" rounded="md" fontSize="sm">
                            <AlertIcon /> {loginMutation.error?.message}
                          </Alert>
                        )}
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
                <Box mb={6}>
                  <Stack direction="row" spacing={2} align="center" justify="center" mb={2}>
                    {[0, 1, 2].map((step) => (
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
                  </Text>
                </Box>

                <Stack spacing={6}>
                  {registerMutation.isError && (
                    <Alert status="error" rounded="md" fontSize="sm">
                      <AlertIcon /> {registerMutation.error?.message}
                    </Alert>
                  )}
                  {signupStep === 0 && (
                    <Box 
                      bg={stepBg} 
                      p={6} 
                      borderRadius="xl"
                      border="1px solid"
                      borderColor={stepBorderColor}
                    >
                      <Stack spacing={4} align="center" textAlign="center" mb={6}>
                        <Box 
                          p={3} 
                          borderRadius="full" 
                          bg="brand.100" 
                          color="brand.600"
                        >
                          <Icon as={FiMail} boxSize={6} />
                        </Box>
                        <Stack spacing={2}>
                          <Text fontSize="lg" fontWeight="semibold" color="gray.900">
                            Let&apos;s get started
                          </Text>
                          <Text fontSize="sm" color="gray.600" maxW="300px">
                            Enter your email to begin. We will send a verification
                            link to get you started.
                          </Text>
                        </Stack>
                      </Stack>
                      
                      <FormControl isRequired mb={6}>
                        <FormLabel fontSize="sm" fontWeight="medium">Email Address</FormLabel>
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
                              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)"
                            }}
                            _hover={{ borderColor: "gray.300" }}
                          />
                        </InputGroup>
                      </FormControl>
                      <Stack spacing={4} mb={6}>
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
                              <Text fontSize="sm" fontWeight="medium" color="blue.900">
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
                      p={6} 
                      borderRadius="xl"
                      border="1px solid"
                      borderColor={stepBorderColor}
                    >
                      <Stack spacing={4} align="center" textAlign="center" mb={6}>
                        <Box 
                          p={3} 
                          borderRadius="full" 
                          bg="brand.100" 
                          color="brand.600"
                        >
                          <Icon as={FiUser} boxSize={6} />
                        </Box>
                        <Stack spacing={1}>
                          <Text fontSize="lg" fontWeight="semibold" color="gray.900">
                            Tell us about yourself
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            We need some basic information to set up your account
                          </Text>
                        </Stack>
                      </Stack>
                      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={6}>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">First Name</FormLabel>
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
                              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)"
                            }}
                            _hover={{ borderColor: "gray.300" }}
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">Last Name</FormLabel>
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
                              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)"
                            }}
                            _hover={{ borderColor: "gray.300" }}
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">Password</FormLabel>
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
                                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)"
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
                          <FormLabel fontSize="sm" fontWeight="medium">Confirm Password</FormLabel>
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
                                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)"
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
                          />
                        </FormControl>
                      </SimpleGrid>
                      <Box mb={4}>
                        <FormLabel mb={1}>Password strength</FormLabel>
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
                      <Stack direction="row" justify="space-between">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSignupStep(0)}
                        >
                          Back
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="brand"
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
                    <Box>
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        textTransform="uppercase"
                        mb={3}
                        letterSpacing="wide"
                        color="gray.500"
                      >
                        Preferences
                      </Text>
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
                          onClick={handleRegister}
                          isLoading={loading}
                        >
                          Create Account
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
