import {
  Box,
  Link,
  Flex,
  Spacer,
  Button,
  Heading,
  IconButton,
  Collapse,
  useDisclosure,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink, Route, Routes } from "react-router-dom";
import TermsPage from "./pages/Terms";
import PrivacyPage from "./pages/Privacy";
import LessonsDemoPage from "./pages/LessonsDemo";
import BecomeTeacher from "./pages/BecomeTeacher";
import TeacherApplication from "./pages/TeacherApplication";
import TeacherApplicationSuccess from "./pages/TeacherApplicationSuccess";
import { FiMenu, FiX } from "react-icons/fi";
import type { ReactNode } from "react";
import {
  Hero,
  Offers,
  FeaturedTutors,
  Testimonials,
  FAQ,
  Footer,
} from "./components";
import { useAuthModal } from "./features/auth/AuthModalProvider";
import { AuthModal } from "./features/auth/AuthModal";
import { useAuth } from "./features/auth/AuthProvider";
import DashboardLayout from "./features/dashboard/DashboardLayout";
import Overview from "./features/dashboard/Overview";
import Bookings from "./features/dashboard/Bookings";
import FindTutors from "./features/dashboard/FindTutors";
import Settings from "./features/dashboard/Settings";
import Availability from "./features/dashboard/Availability";
import CreateLesson from "./features/dashboard/CreateLesson";

// Pages
function LandingPage() {
  return (
    <>
      <Hero />
      <Offers />
      <FeaturedTutors />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
  );
}

// Placeholder for potential future page removed from nav
function PlaceholderPage() {
  return <Box p={10}>Placeholder Page</Box>;
}

function NotFoundPage() {
  return (
    <Box p={10}>
      Page Not Found –{" "}
      <Link as={RouterLink} to="/" color="brand.500">
        home
      </Link>
    </Box>
  );
}

// Layout
function Layout({ children }: { children: ReactNode }) {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { openLogin, openSignup } = useAuthModal();
  const { isAuthenticated, logout } = useAuth();
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgHeader = useColorModeValue("white", "gray.800");
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={1000}
        bg={bgHeader}
        borderBottom="1px"
        borderColor={borderColor}
        px={{ base: 4, md: 6 }}
        py={3}
        shadow="sm"
      >
        <Flex align="center" gap={6}>
          <Heading as={RouterLink} to="/" size="md" onClick={onClose}>
            SalvatoreLingo
          </Heading>
          <Spacer />
          {/* Desktop navigation */}
          <Flex gap={3} display={{ base: "none", md: "flex" }} align="center">
            {isAuthenticated ? (
              <Button size="sm" variant="outline" onClick={logout}>
                Logout
              </Button>
            ) : (
              <>
                <Button size="sm" variant="ghost" onClick={openLogin}>
                  Login
                </Button>
                <Button size="sm" colorScheme="brand" onClick={openSignup}>
                  Sign Up
                </Button>
              </>
            )}
          </Flex>
          {/* Mobile menu toggle */}
          <IconButton
            aria-label={isOpen ? "Close menu" : "Open menu"}
            icon={isOpen ? <FiX /> : <FiMenu />}
            variant="ghost"
            display={{ base: "inline-flex", md: "none" }}
            onClick={onToggle}
          />
        </Flex>
        {/* Mobile menu content */}
        <Collapse in={isOpen} animateOpacity style={{ marginTop: "0.5rem" }}>
          <Stack
            spacing={4}
            pt={2}
            pb={4}
            borderTop="1px"
            borderColor={borderColor}
          >
            {isAuthenticated ? (
              <Button
                w="full"
                size="sm"
                onClick={() => {
                  onClose();
                  logout();
                }}
                variant="outline"
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  w="full"
                  size="sm"
                  onClick={() => {
                    onClose();
                    openLogin();
                  }}
                  variant="ghost"
                >
                  Login
                </Button>
                <Button
                  w="full"
                  size="sm"
                  onClick={() => {
                    onClose();
                    openSignup();
                  }}
                  colorScheme="brand"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Stack>
        </Collapse>
      </Box>
      <Box flex="1">{children}</Box>
      <AuthModal />
    </Box>
  );
}

// Protected Route wrapper for dashboard
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { openLogin } = useAuthModal();

  if (!isAuthenticated) {
    // Open login modal and redirect to home
    setTimeout(() => openLogin(), 100); // Small delay to avoid React warnings
    return (
      <Layout>
        <Box p={10} textAlign="center">
          <Heading size="md" mb={4}>
            Access Restricted
          </Heading>
          <Box>Please log in to access the dashboard.</Box>
        </Box>
      </Layout>
    );
  }

  return <>{children}</>;
}

export function App() {
  return (
    <>
      <Routes>
        {/* Site routes with Layout (header) */}
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/placeholder"
          element={
            <Layout>
              <PlaceholderPage />
            </Layout>
          }
        />
        <Route
          path="/terms"
          element={
            <Layout>
              <TermsPage />
            </Layout>
          }
        />
        <Route
          path="/privacy"
          element={
            <Layout>
              <PrivacyPage />
            </Layout>
          }
        />
        <Route
          path="/lessons-demo"
          element={
            <Layout>
              <LessonsDemoPage />
            </Layout>
          }
        />
        <Route
          path="/become-teacher"
          element={
            <Layout>
              <BecomeTeacher />
            </Layout>
          }
        />
        <Route
          path="/teacher-application"
          element={
            <ProtectedRoute>
              <Layout>
                <TeacherApplication />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-application-success"
          element={
            <ProtectedRoute>
              <Layout>
                <TeacherApplicationSuccess />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Dashboard routes without Layout (no site header) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="lessons/new" element={<CreateLesson />} />
          <Route path="availability" element={<Availability />} />
          <Route path="find-tutors" element={<FindTutors />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route
          path="*"
          element={
            <Layout>
              <NotFoundPage />
            </Layout>
          }
        />
      </Routes>

      {/* AuthModal available globally */}
      <AuthModal />
    </>
  );
}
