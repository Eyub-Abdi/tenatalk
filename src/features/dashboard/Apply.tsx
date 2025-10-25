import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { TutorApplicationWizard } from "../tutor-application/TutorApplicationWizard";

export default function Apply() {
  return (
    <Box maxW="4xl" mx="auto">
      <VStack align="stretch" spacing={10}>
        <Box>
          <Heading size="lg" mb={2}>
            Become a Tutor
          </Heading>
          <Text color="gray.600">
            Thanks for joining SalvatoreLingo! Complete the application below to
            share your teaching experience and get ready for review.
          </Text>
        </Box>

        <TutorApplicationWizard />
      </VStack>
    </Box>
  );
}
