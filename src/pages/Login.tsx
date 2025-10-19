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
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useLogin } from "@features/auth/useAuthApi";
import { useAuth } from "@features/auth/AuthProvider";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const loginMutation = useLogin();
  const { setAuth } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const loading = loginMutation.isPending;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email: form.email, password: form.password },
      {
        onSuccess: (d) => {
          setAuth(d.user, d.access, d.refresh);
          toast({ title: "Logged in", status: "success" });
          navigate("/dashboard");
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

  const googleAuth = () => {
    const base =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
    window.location.href = `${base}/accounts/google/login/`;
  };

  return (
    <Box maxW="480px" mx="auto" py={16} px={4}>
      <Heading size="lg" mb={2} textAlign="center">
        Welcome back
      </Heading>
      <Text textAlign="center" color="gray.600" mb={8} fontSize="sm">
        Sign in to continue your learning journey.
      </Text>
      <Stack spacing={6}>
        <form onSubmit={submit} noValidate>
          <Stack spacing={5}>
            {loginMutation.isError && (
              <Alert status="error" rounded="md" fontSize="sm">
                <AlertIcon /> {loginMutation.error?.message}
              </Alert>
            )}
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                autoComplete="email"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  autoComplete="current-password"
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
          Don&apos;t have an account?{" "}
          <Link
            as={RouterLink}
            to="/register"
            color="brand.500"
            fontWeight="semibold"
          >
            Create one
          </Link>
        </Text>
      </Stack>
    </Box>
  );
}
