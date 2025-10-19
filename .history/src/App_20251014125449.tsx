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
import { AuthModal } from "./features/auth/AuthModal";
import DashboardLayout from "./features/dashboard/DashboardLayout";
import Overview from "./features/dashboard/Overview";
import Bookings from "./features/dashboard/Bookings";
import FindTutors from "./features/dashboard/FindTutors";
import Settings from "./features/dashboard/Settings";
import { useAuth } from "./features/auth/AuthProvider";

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
            <Button as={RouterLink} to="/dashboard" size="sm" variant="outline">
              Dashboard
            </Button>
            <Button size="sm" colorScheme="brand">
              My Account
            </Button>
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
            <Button
              as={RouterLink}
              to="/dashboard"
              w="full"
              size="sm"
              onClick={onClose}
              variant="outline"
            >
              Dashboard
            </Button>
            <Button w="full" size="sm" onClick={onClose} colorScheme="brand">
              My Account
            </Button>
          </Stack>
        </Collapse>
      </Box>
      <Box flex="1">{children}</Box>
      <AuthModal />
    </Box>
  );
}

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/placeholder" element={<PlaceholderPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/lessons-demo" element={<LessonsDemoPage />} />
        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="find-tutors" element={<FindTutors />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
