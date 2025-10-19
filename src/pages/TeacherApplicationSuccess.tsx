import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
  Button,
  useColorModeValue,
  Alert,
  AlertIcon,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { FiCheckCircle, FiMail, FiClock, FiArrowRight } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

export default function TeacherApplicationSuccess() {
  const successColor = useColorModeValue("green.500", "green.300");

  return (
    <Container maxW="2xl" py={16}>
      <VStack spacing={8} textAlign="center">
        <Icon as={FiCheckCircle} w={20} h={20} color={successColor} />

        <VStack spacing={4}>
          <Heading size="xl">Application Submitted Successfully!</Heading>
          <Text fontSize="lg" color="gray.600">
            Thank you for applying to become a Swahili teacher on
            SalvatoreLingo.
          </Text>
        </VStack>

        <Alert status="success" borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontWeight="semibold">What happens next?</Text>
            <Text fontSize="sm">
              Our team will carefully review your application and get back to
              you within 2-3 business days.
            </Text>
          </Box>
        </Alert>

        <Box textAlign="left" w="full">
          <Heading size="md" mb={4}>
            Next Steps:
          </Heading>
          <List spacing={3}>
            <ListItem>
              <ListIcon as={FiMail} color="brand.500" />
              <Text as="span" fontWeight="semibold">
                Check your email
              </Text>{" "}
              - We&apos;ve sent you a confirmation with your application
              details.
            </ListItem>
            <ListItem>
              <ListIcon as={FiClock} color="brand.500" />
              <Text as="span" fontWeight="semibold">
                Application review
              </Text>{" "}
              - Our team will review your qualifications and teaching
              experience.
            </ListItem>
            <ListItem>
              <ListIcon as={FiCheckCircle} color="brand.500" />
              <Text as="span" fontWeight="semibold">
                Interview process
              </Text>{" "}
              - If selected, we&apos;ll contact you for a brief interview.
            </ListItem>
            <ListItem>
              <ListIcon as={FiArrowRight} color="brand.500" />
              <Text as="span" fontWeight="semibold">
                Start teaching
              </Text>{" "}
              - Once approved, you can set up your profile and start accepting
              students.
            </ListItem>
          </List>
        </Box>

        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontWeight="semibold">Questions?</Text>
            <Text fontSize="sm">
              If you have any questions about your application or the process,
              feel free to contact us at teachers@salvatorelingo.com
            </Text>
          </Box>
        </Alert>

        <VStack spacing={4}>
          <Button as={RouterLink} to="/" colorScheme="brand" size="lg">
            Return to Homepage
          </Button>
          <Button as={RouterLink} to="/become-teacher" variant="outline">
            Learn More About Teaching
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
}
