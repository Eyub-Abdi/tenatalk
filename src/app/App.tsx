import {
  Box,
  Container,
  Heading,
  Text,
  Link,
  Flex,
  Spacer,
  Button,
} from "@chakra-ui/react";
import { Link as RouterLink, Route, Routes } from "react-router-dom";

// Temporary placeholder pages
function LandingPage() {
  return (
    <Container maxW="4xl" py={10}>
      <Heading size="lg" mb={4}>
        SalvatoreLingo
      </Heading>
      <Text mb={4}>
        Learn practical Swahili for travel and connect with local tutors.
      </Text>
      <Button as={RouterLink} to="/tutors" colorScheme="blue">
        Browse Tutors
      </Button>
    </Container>
  );
}

function TutorsPage() {
  return (
    <Container maxW="4xl" py={10}>
      <Heading size="lg" mb={4}>
        Tutors (Placeholder)
      </Heading>
      <Text>List of tutors will appear here.</Text>
    </Container>
  );
}

function NotFoundPage() {
  return (
    <Container maxW="4xl" py={10}>
      <Heading size="lg" mb={4}>
        Page Not Found
      </Heading>
      <Text>
        Return to{" "}
        <Link as={RouterLink} to="/" color="blue.500">
          home
        </Link>
        .
      </Text>
    </Container>
  );
}

// Basic layout with nav
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Flex
        as="header"
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        px={6}
        py={3}
        align="center"
        gap={6}
      >
        <Heading as={RouterLink} to="/" size="md">
          SalvatoreLingo
        </Heading>
        <Link as={RouterLink} to="/tutors" fontWeight="medium">
          Tutors
        </Link>
        <Spacer />
        <Button size="sm" variant="outline">
          Login
        </Button>
        <Button size="sm" colorScheme="blue">
          Sign Up
        </Button>
      </Flex>
      <Box flex="1">{children}</Box>
      <Box
        as="footer"
        mt={10}
        py={8}
        textAlign="center"
        fontSize="sm"
        color="gray.600"
      >
        © {new Date().getFullYear()} SalvatoreLingo
      </Box>
    </Box>
  );
}

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tutors" element={<TutorsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
