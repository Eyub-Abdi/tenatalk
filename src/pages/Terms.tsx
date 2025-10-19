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

export default function TermsPage() {
  const subtle = useColorModeValue("gray.600", "gray.400");
  const accent = useColorModeValue("brand.600", "brand.300");
  return (
    <Box maxW="4xl" mx="auto" px={{ base: 4, md: 8 }} py={{ base: 12, md: 16 }}>
      <Stack spacing={8}>
        <Heading size="lg">Terms of Service</Heading>
        <Text fontSize="sm" color={subtle}>
          Last updated: September 13, 2025
        </Text>
        <Text color={subtle} fontSize="md">
          These Terms of Service (&quot;Terms&quot;) govern your access to and
          use of the SalvatoreLingo platform (the &quot;Service&quot;). By
          accessing or using the Service you agree to be bound by these Terms.
        </Text>

        <Heading as="h2" size="md">
          1. Eligibility
        </Heading>
        <Text color={subtle}>
          You must be at least 13 years old (or the minimum legal age in your
          jurisdiction) to use the Service. If you are under the age of
          majority, you represent that you have your parent or legal
          guardian&apos;s permission.
        </Text>

        <Heading as="h2" size="md">
          2. Accounts
        </Heading>
        <Text color={subtle}>
          You are responsible for safeguarding your account credentials. You
          must promptly notify us of any unauthorized use. We may suspend or
          terminate your account if we suspect misuse.
        </Text>

        <Heading as="h2" size="md">
          3. Acceptable Use
        </Heading>
        <Text color={subtle}>
          You agree not to misuse the Service or help anyone else do so.
          Prohibited conduct includes (a) infringing intellectual property
          rights, (b) attempting to probe, scan, or test vulnerabilities of the
          Service, (c) interfering with other users&apos; access, and (d) using
          the Service for fraudulent, abusive, or illegal activities.
        </Text>

        <Heading as="h2" size="md">
          4. Tutor & Learner Interactions
        </Heading>
        <Text color={subtle}>
          All scheduling, messaging, and lesson activities must remain
          on-platform. Off-platform solicitation that circumvents platform
          safeguards is prohibited.
        </Text>

        <Heading as="h2" size="md">
          5. Payments & Cancellations
        </Heading>
        <Text color={subtle}>
          Lesson purchases, refunds, and cancellation windows will be described
          at checkout or in future pricing documentation. Where applicable, you
          authorize us (or our payment processor) to charge stored payment
          methods.
        </Text>

        <Heading as="h2" size="md">
          6. Intellectual Property
        </Heading>
        <Text color={subtle}>
          All platform code, design, logos, and original learning content are
          owned by SalvatoreLingo or its licensors. Users retain ownership of
          original uploads but grant us a limited license to host and display
          that content to deliver the Service.
        </Text>

        <Heading as="h2" size="md">
          7. Content Standards
        </Heading>
        <Text color={subtle}>
          You agree that any content you submit (profiles, messages, materials)
          will be accurate, respectful, culturally sensitive, and lawful. We may
          remove content that violates these Terms.
        </Text>

        <Heading as="h2" size="md">
          8. Disclaimers
        </Heading>
        <Text color={subtle}>
          The Service is provided on an &quot;AS IS&quot; and &quot;AS
          AVAILABLE&quot; basis without warranties of any kind, express or
          implied. We disclaim all implied warranties of merchantability,
          fitness for a particular purpose, and non-infringement.
        </Text>

        <Heading as="h2" size="md">
          9. Limitation of Liability
        </Heading>
        <Text color={subtle}>
          To the maximum extent permitted by law, SalvatoreLingo shall not be
          liable for any indirect, incidental, special, consequential, or
          punitive damages, or any loss of profits or revenues.
        </Text>

        <Heading as="h2" size="md">
          10. Termination
        </Heading>
        <Text color={subtle}>
          We may suspend or terminate your access at any time if you violate
          these Terms. Upon termination, sections intended to survive (including
          IP, disclaimers, and limitations) remain in effect.
        </Text>

        <Heading as="h2" size="md">
          11. Changes to Terms
        </Heading>
        <Text color={subtle}>
          We may modify these Terms. Material changes will be indicated by
          updating the &quot;Last updated&quot; date. Continued use after
          changes constitutes acceptance.
        </Text>

        <Heading as="h2" size="md">
          12. Contact
        </Heading>
        <Text color={subtle}>
          Questions about these Terms can be sent once our support channel is
          live. For now, please reference the address below.
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
