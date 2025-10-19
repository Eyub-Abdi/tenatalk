import {
  Box,
  Container,
  Stack,
  Text,
  Link as ChakraLink,
  HStack,
  VStack,
  IconButton,
  Input,
  Button,
  FormControl,
  FormLabel,
  useColorModeValue,
  VisuallyHidden,
  Divider,
} from "@chakra-ui/react";
import { FiTwitter, FiGithub, FiLinkedin, FiSend } from "react-icons/fi";
import { FormEvent } from "react";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Offers", href: "#offers" },
  { label: "Tutors", href: "#featured-tutors" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

const RESOURCE_LINKS: { label: string; href: string }[] = [
  { label: "Docs (Coming Soon)", href: "#" },
  { label: "Pricing", href: "#offers" },
  { label: "Accessibility", href: "#" },
  { label: "Status", href: "#" },
];

const COMPANY_LINKS: { label: string; href: string }[] = [
  { label: "About", href: "#offers" },
  { label: "Contact", href: "#contact" },
  { label: "Become a Teacher", href: "/become-teacher" },
  { label: "Careers", href: "#" },
  { label: "Legal", href: "#legal" },
];

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const hover = useColorModeValue("brand.600", "brand.300");
  return (
    <ChakraLink
      href={href}
      fontSize="sm"
      color={useColorModeValue("gray.600", "gray.400")}
      _hover={{ color: hover, textDecoration: "none" }}
    >
      {children}
    </ChakraLink>
  );
}

export function Footer() {
  const bg = useColorModeValue("white", "gray.900");
  const border = useColorModeValue("gray.200", "gray.700");
  const subtle = useColorModeValue("gray.500", "gray.400");
  const accent = useColorModeValue("brand.500", "brand.300");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Placeholder: integrate with real email service later
  }

  return (
    <Box
      as="footer"
      bg={bg}
      borderTopWidth="1px"
      borderColor={border}
      mt={20}
      id="footer"
    >
      <Container maxW="6xl" py={{ base: 12, md: 16 }}>
        <Stack spacing={{ base: 12, md: 16 }}>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={{ base: 10, md: 16 }}
            justify="space-between"
            align={{ base: "flex-start", md: "flex-start" }}
          >
            {/* Brand + newsletter */}
            <VStack align="flex-start" spacing={6} flexBasis={{ md: "30%" }}>
              <Text
                fontSize="xl"
                fontWeight="bold"
                bgGradient="linear(to-r, brand.500, brand.400)"
                bgClip="text"
              >
                SalvatoreLingo
              </Text>
              <Text fontSize="sm" color={subtle} maxW="sm">
                Build real Swahili communication confidence through
                human-guided, culturally respectful learning experiences.
              </Text>
              <Box
                as="address"
                id="contact"
                fontSize="sm"
                lineHeight="1.4"
                color={subtle}
                fontStyle="normal"
                aria-label="Company physical address"
              >
                <Text>Thabit Kombo, 3rd Floor</Text>
                <Text>Zanzibar, Tanzania</Text>
              </Box>
              <Box as="form" onSubmit={handleSubmit} w="full">
                <FormControl>
                  <FormLabel
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    color={subtle}
                  >
                    Stay in the loop
                  </FormLabel>
                  <HStack spacing={2} align="stretch">
                    <Input
                      type="email"
                      required
                      placeholder="Email address"
                      size="sm"
                      aria-label="Email address"
                      variant="outline"
                      _placeholder={{
                        color: useColorModeValue("gray.400", "gray.500"),
                      }}
                      focusBorderColor="brand.500"
                      _focusVisible={{
                        borderColor: "brand.500",
                        boxShadow: "none",
                      }}
                      _hover={{
                        borderColor: useColorModeValue("gray.400", "gray.500"),
                      }}
                      transition="border-color 0.15s ease"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      colorScheme="brand"
                      leftIcon={<FiSend />}
                      px={{ base: 4, md: 5 }}
                      fontWeight="semibold"
                      boxShadow={useColorModeValue("sm", "sm-dark")}
                      _hover={{
                        transform: "translateY(-1px)",
                        boxShadow: useColorModeValue("md", "dark-lg"),
                      }}
                      _active={{ transform: "translateY(0)" }}
                      transition="all 0.15s ease"
                    >
                      Subscribe
                    </Button>
                  </HStack>
                </FormControl>
              </Box>
              <HStack spacing={2} pt={2}>
                <IconButton
                  aria-label="Twitter"
                  icon={<FiTwitter />}
                  variant="ghost"
                  size="sm"
                  as={ChakraLink}
                  href="#"
                />
                <IconButton
                  aria-label="GitHub"
                  icon={<FiGithub />}
                  variant="ghost"
                  size="sm"
                  as={ChakraLink}
                  href="#"
                />
                <IconButton
                  aria-label="LinkedIn"
                  icon={<FiLinkedin />}
                  variant="ghost"
                  size="sm"
                  as={ChakraLink}
                  href="#"
                />
              </HStack>
            </VStack>

            {/* Link columns */}
            <HStack
              align="flex-start"
              spacing={{ base: 12, md: 16 }}
              flexWrap="wrap"
              flex={1}
            >
              <VStack align="flex-start" spacing={3} minW="130px">
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Navigate
                </Text>
                {NAV_LINKS.map((l) => (
                  <FooterLink key={l.href} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </VStack>
              <VStack align="flex-start" spacing={3} minW="130px">
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Resources
                </Text>
                {RESOURCE_LINKS.map((l) => (
                  <FooterLink key={l.href} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </VStack>
              <VStack align="flex-start" spacing={3} minW="130px">
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Company
                </Text>
                {COMPANY_LINKS.map((l) => (
                  <FooterLink key={l.href} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </VStack>
            </HStack>
          </Stack>

          <Stack spacing={4} fontSize="xs" id="legal">
            <Divider />
            <Text color={subtle}>
              © {new Date().getFullYear()} SalvatoreLingo. All rights reserved.
            </Text>
            <HStack spacing={4} color={subtle} flexWrap="wrap">
              <ChakraLink href="/terms" _hover={{ color: accent }}>
                Terms
              </ChakraLink>
              <ChakraLink href="/privacy" _hover={{ color: accent }}>
                Privacy
              </ChakraLink>
              <ChakraLink href="#cookies" _hover={{ color: accent }}>
                Cookies
              </ChakraLink>
              <ChakraLink href="#contact" _hover={{ color: accent }}>
                Contact
              </ChakraLink>
            </HStack>
            <VisuallyHidden>End of page</VisuallyHidden>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;
