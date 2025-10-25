import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { TutorApplicationWizard } from "../features/tutor-application/TutorApplicationWizard";

export default function TeacherApplicationPage() {
  return (
    <Box py={{ base: 12, md: 16 }}>
      <Container maxW="5xl">
        <VStack align="stretch" spacing={10}>
          <VStack align="start" spacing={3}>
            <Heading size={{ base: "lg", md: "xl" }}>
              Tutor Application
            </Heading>
            <Text color="gray.600" maxW="3xl">
              Tell us about your teaching experience, upload your introduction video,
              and share the subjects you love. You can pause and come back any time—
              your progress stays saved on this device until you submit.
            </Text>
          </VStack>

          <TutorApplicationWizard />
        </VStack>
      </Container>
    </Box>
  );
}
