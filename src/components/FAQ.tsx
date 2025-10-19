import {
  Container,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface FAQEntry {
  q: string;
  a: ReactNode;
}

const FAQS: FAQEntry[] = [
  {
    q: "What is SalvatoreLingo?",
    a: (
      <Text>
        SalvatoreLingo connects learners with experienced Swahili tutors for
        live, personalized lessons and cultural immersion.
      </Text>
    ),
  },
  {
    q: "How do I book a tutor?",
    a: (
      <Text>
        Browse tutors, view their profiles and availability, then click Book to
        pick a time. Account creation is required to confirm.
      </Text>
    ),
  },
  {
    q: "Are tutors verified?",
    a: (
      <Text>
        Verified tutors display a badge check icon next to their name.
        Verification includes identity and experience review.
      </Text>
    ),
  },
  {
    q: "What do lessons cost?",
    a: (
      <Text>
        Pricing is set by each tutor. You will see the per-lesson rate on their
        card and profile before booking.
      </Text>
    ),
  },
  {
    q: "Can I cancel or reschedule?",
    a: (
      <Text>
        Yes, you will be able to cancel or request a reschedule within a grace
        period (details coming soon in policy docs).
      </Text>
    ),
  },
  {
    q: "Which payment methods are supported?",
    a: (
      <Text>
        We will support major cards and regional options when payments launch.
        For now, pricing is informational only.
      </Text>
    ),
  },
];

export function FAQ() {
  const border = useColorModeValue("gray.200", "gray.700");
  const bg = useColorModeValue("white", "gray.800");
  const expandedBg = useColorModeValue("brand.50", "gray.700");
  return (
    <Box
      id="faq"
      py={{ base: 12, md: 20 }}
      bg={useColorModeValue("gray.50", "gray.900")}
    >
      <Container maxW="6xl">
        <Stack spacing={6} mb={8} textAlign="center">
          <Heading size="lg">Frequently Asked Questions</Heading>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Quick answers to common questions about the platform.
          </Text>
        </Stack>
        <Accordion allowMultiple reduceMotion>
          {FAQS.map((item, idx) => (
            <AccordionItem
              key={idx}
              border="1px"
              borderColor={border}
              rounded="md"
              mb={3}
              bg={bg}
              _last={{ mb: 0 }}
            >
              <h3>
                <AccordionButton px={4} py={3} _expanded={{ bg: expandedBg }}>
                  <Box
                    as="span"
                    flex="1"
                    textAlign="left"
                    fontWeight="semibold"
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    {item.q}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel
                px={4}
                pt={3}
                pb={4}
                fontSize={{ base: "sm", md: "sm" }}
                lineHeight={1.5}
              >
                {item.a}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Box>
  );
}

export default FAQ;
