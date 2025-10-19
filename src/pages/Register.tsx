import {
  Box,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  useToast,
  Icon,
  VisuallyHidden,
  Divider,
  HStack,
  Select,
  Checkbox,
  Progress,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useRegister } from "@features/auth/useAuthApi";
import { FcGoogle } from "react-icons/fc";
import type { RegisterPayload } from "@features/auth/authTypes";

export default function RegisterPage() {
  const registerMutation = useRegister();
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<RegisterPayload>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirm: "",
    user_type: "student",
    preferred_language: "en",
    phone_number: "",
    terms_accepted: false,
  });

  const passwordStrength = (() => {
    const p = form.password;
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

  const loading = registerMutation.isPending;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password_confirm) {
      toast({ title: "Passwords do not match", status: "error" });
      return;
    }
    if (!form.terms_accepted) {
      toast({ title: "You must accept terms", status: "error" });
      return;
    }
    registerMutation.mutate(form, {
      onSuccess: () => {
        toast({
          title: "Registration successful",
          description: "Check your email for verification.",
          status: "success",
        });
        navigate("/login");
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

  const googleAuth = () => {
    const base =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
    window.location.href = `${base}/accounts/google/login/`;
  };

  const handleChange = <K extends keyof RegisterPayload>(
    field: K,
    value: RegisterPayload[K]
  ) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  return (
    <Box maxW="720px" mx="auto" py={16} px={4}>
      <Heading size="lg" mb={2} textAlign="center">
        Create your account
      </Heading>
      <Text textAlign="center" color="gray.600" mb={8} fontSize="sm">
        Join SalvatoreLingo and start mastering languages today.
      </Text>
      <Stack spacing={8}>
        <form onSubmit={submit} noValidate>
          <Stack spacing={6}>
            {registerMutation.isError && (
              <Alert status="error" rounded="md" fontSize="sm">
                <AlertIcon /> {registerMutation.error?.message}
              </Alert>
            )}
            <HStack spacing={4} align="flex-start">
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  value={form.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  autoComplete="given-name"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  value={form.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  autoComplete="family-name"
                />
              </FormControl>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                autoComplete="email"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Phone</FormLabel>
              <Input
                value={form.phone_number}
                onChange={(e) => handleChange("phone_number", e.target.value)}
                autoComplete="tel"
              />
            </FormControl>
            <HStack spacing={4} align="flex-start">
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    autoComplete="new-password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.5rem"
                      size="xs"
                      variant="ghost"
                      onClick={() => setShowPassword((s) => !s)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Confirm</FormLabel>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password_confirm}
                  onChange={(e) =>
                    handleChange("password_confirm", e.target.value)
                  }
                  autoComplete="new-password"
                />
              </FormControl>
            </HStack>
            <FormControl>
              <FormLabel>Password strength</FormLabel>
              <Stack spacing={1}>
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
            </FormControl>
            <HStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>User Type</FormLabel>
                <Select
                  value={form.user_type}
                  onChange={(e) => handleChange("user_type", e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="tutor">Tutor</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Language</FormLabel>
                <Select
                  value={form.preferred_language}
                  onChange={(e) =>
                    handleChange("preferred_language", e.target.value)
                  }
                >
                  <option value="en">English</option>
                  <option value="sw">Swahili</option>
                </Select>
              </FormControl>
            </HStack>
            <Checkbox
              isChecked={form.terms_accepted}
              onChange={(e) => handleChange("terms_accepted", e.target.checked)}
              size="sm"
            >
              I agree to the Terms & Privacy Policy
            </Checkbox>
            <Button
              type="submit"
              colorScheme="brand"
              isLoading={loading}
              w="full"
            >
              Create Account
            </Button>
          </Stack>
        </form>
        <Divider />
        <Stack spacing={4}>
          <Button
            variant="outline"
            w="full"
            onClick={googleAuth}
            isDisabled={loading}
            leftIcon={<Icon as={FcGoogle} boxSize={5} />}
          >
            <VisuallyHidden>Continue with Google</VisuallyHidden>
            Continue with Google
          </Button>
        </Stack>
        <Text fontSize="sm" color="gray.600" textAlign="center">
          Already have an account?{" "}
          <Link
            as={RouterLink}
            to="/login"
            color="brand.500"
            fontWeight="semibold"
          >
            Login
          </Link>
        </Text>
      </Stack>
    </Box>
  );
}
