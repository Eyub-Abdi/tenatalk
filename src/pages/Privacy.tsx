import {
  Box,
  Heading,
  Text,
  Stack,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiCheckCircle } from "react-icons/fi";

export default function PrivacyPage() {
  const subtle = useColorModeValue("gray.600", "gray.400");
  const accent = useColorModeValue("brand.600", "brand.300");
  return (
    <Box maxW="4xl" mx="auto" px={{ base: 4, md: 8 }} py={{ base: 12, md: 16 }}>
      <Stack spacing={8}>
        <Heading size="lg">Privacy Policy</Heading>
        <Text fontSize="sm" color={subtle}>
          Last updated: September 13, 2025
        </Text>
        <Text color={subtle}>
          This Privacy Policy describes how we collect, use, and safeguard
          personal information when you use the SalvatoreLingo platform. We are
          committed to respecting user privacy and applying data minimization
          principles.
        </Text>

        <Heading as="h2" size="md">
          1. Information We Plan to Collect
        </Heading>
        <Text color={subtle}>
          Account basics (name, email, password hash), learning preferences,
          time zone, and limited usage analytics to improve tutor matching and
          lesson relevance.
        </Text>

        <Heading as="h2" size="md">
          2. Future Optional Data
        </Heading>
        <Text color={subtle}>
          Profile photo, spoken languages, proficiency level, and lesson goals
          may be optionally provided to improve experience quality.
        </Text>

        <Heading as="h2" size="md">
          3. Usage Data
        </Heading>
        <Text color={subtle}>
          We may log feature interactions (e.g., search usage, lesson booking
          steps) to guide UX improvements. We will avoid invasive tracking and
          will not sell personal data.
        </Text>

        <Heading as="h2" size="md">
          4. Cookies & Local Storage
        </Heading>
        <Text color={subtle}>
          Authentication tokens and minimal preference flags (e.g., theme) may
          be stored locally. No third-party advertising cookies will be used in
          early versions.
        </Text>

        <Heading as="h2" size="md">
          5. Data Security
        </Heading>
        <Text color={subtle}>
          We intend to apply industry practices including salted password
          hashing, TLS encryption, role-based access controls, and periodic
          dependency patching.
        </Text>

        <Heading as="h2" size="md">
          6. Data Retention
        </Heading>
        <Text color={subtle}>
          We will retain user data only as long as needed to provide the Service
          or comply with legal obligations. Inactive accounts may be archived or
          anonymized after a defined period.
        </Text>

        <Heading as="h2" size="md">
          7. User Controls
        </Heading>
        <Text color={subtle}>
          Users may request account deletion or correction of inaccurate profile
          information when account management tooling is released.
        </Text>

        <Heading as="h2" size="md">
          8. Third Parties
        </Heading>
        <Text color={subtle}>
          If we integrate video, payment, or messaging infrastructure, limited
          data may be shared with those processors strictly to deliver the
          Service. Each vendor will be reviewed for security posture.
        </Text>

        <Heading as="h2" size="md">
          9. International Use
        </Heading>
        <Text color={subtle}>
          As we operate from Zanzibar, Tanzania, data may be processed locally
          or in other regions depending on infrastructure providers.
          Cross-border safeguards will be applied where required.
        </Text>

        <Heading as="h2" size="md">
          10. Changes to This Policy
        </Heading>
        <Text color={subtle}>
          We may update this Policy. Material changes will update the date
          above. Continued use after changes signifies acceptance.
        </Text>

        <Heading as="h2" size="md">
          11. Contact
        </Heading>
        <Text color={subtle}>
          Questions about privacy can be referenced to the address below until
          formal support channels are active.
        </Text>

        <Box pt={4} fontSize="sm" color={subtle}>
          <Heading as="h3" size="sm" mb={2}>
            Address
          </Heading>
          <List spacing={1}>
            <ListItem>
              <ListIcon as={FiCheckCircle} color={accent} />
              Thabit Kombo, 3rd Floor
            </ListItem>
            <ListItem>
              <ListIcon as={FiCheckCircle} color={accent} />
              Zanzibar, Tanzania
            </ListItem>
          </List>
        </Box>
      </Stack>
    </Box>
  );
}
