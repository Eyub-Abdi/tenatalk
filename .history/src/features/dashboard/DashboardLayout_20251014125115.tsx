import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Icon,
  useColorModeValue,
  Avatar,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Button,
} from "@chakra-ui/react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FiCalendar,
  FiHome,
  FiSearch,
  FiSettings,
  FiMenu,
} from "react-icons/fi";
import { useAuth } from "../auth/AuthProvider";

type IconType = React.ComponentType<{ size?: string | number }>;

function NavItem({
  to,
  icon,
  label,
}: {
  to: string;
  icon: IconType;
  label: string;
}) {
  const activeBg = useColorModeValue("brand.50", "whiteAlpha.200");
  const activeColor = useColorModeValue("brand.600", "brand.300");
  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.100");

  return (
    <NavLink to={to} end style={{ textDecoration: "none" }}>
      {({ isActive }: { isActive: boolean }) => (
        <HStack
          spacing={3}
          px={3}
          py={3}
          borderRadius="lg"
          bg={isActive ? activeBg : "transparent"}
          color={isActive ? activeColor : undefined}
          _hover={{ bg: isActive ? activeBg : hoverBg }}
          cursor="pointer"
          transition="all 0.2s"
          justify="flex-start"
          minH="44px"
        >
          <Icon as={icon} boxSize={5} />
          <Text fontWeight={isActive ? "semibold" : "medium"}>{label}</Text>
        </HStack>
      )}
    </NavLink>
  );
}

export function DashboardLayout() {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const border = useColorModeValue("gray.200", "gray.700");
  const sidebarBg = useColorModeValue("white", "gray.800");
  const sidebarShadow = useColorModeValue("md", "dark-lg");
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { user } = useAuth();

  // Mock user data for development when not authenticated
  const displayUser = user || {
    first_name: "Demo",
    last_name: "User",
    email: "demo@example.com",
  };

  // Sidebar content component
  const SidebarContent = () => (
    <VStack spacing={4} align="stretch" h="full">
      {/* User Profile Card */}
      <Box
        bg="brand.500"
        border="1px"
        borderColor="brand.600"
        borderRadius="xl"
        p={4}
        boxShadow={sidebarShadow}
      >
        <HStack>
          <Avatar
            size="sm"
            name={`${displayUser?.first_name} ${displayUser?.last_name}`}
            bg="white"
            color="brand.500"
          />
          <VStack spacing={0} align="start">
            <Text fontWeight="semibold" fontSize="sm" noOfLines={1} maxW={32} color="white">
              {displayUser?.first_name} {displayUser?.last_name}
            </Text>
            <Text fontSize="xs" color="brand.100">
              {user ? "Student" : "Demo User"}
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Navigation Card */}
      <Box
        bg="brand.500"
        border="1px"
        borderColor="brand.600"
        borderRadius="xl"
        p={4}
        boxShadow={sidebarShadow}
        flex="1"
      >
        <VStack align="stretch" spacing={2}>
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color="brand.100"
            textTransform="uppercase"
            mb={2}
          >
            Navigation
          </Text>
          <NavItem to="/dashboard" icon={FiHome} label="Overview" />
          <NavItem
            to="/dashboard/bookings"
            icon={FiCalendar}
            label="My Bookings"
          />
          <NavItem
            to="/dashboard/find-tutors"
            icon={FiSearch}
            label="Find Tutors"
          />
          <NavItem
            to="/dashboard/settings"
            icon={FiSettings}
            label="Settings"
          />
        </VStack>
      </Box>

      {/* Quick Actions Card */}
      <Box
        bg="brand.500"
        border="1px"
        borderColor="brand.600"
        borderRadius="xl"
        p={4}
        boxShadow={sidebarShadow}
      >
        <VStack align="stretch" spacing={2}>
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color="brand.100"
            textTransform="uppercase"
            mb={2}
          >
            Quick Actions
          </Text>
          <Button
            size="sm"
            bg="white"
            color="brand.500"
            variant="solid"
            justifyContent="flex-start"
            leftIcon={<Icon as={FiSearch} />}
            _hover={{ bg: "brand.50" }}
          >
            Book Lesson
          </Button>
          <Button
            size="sm"
            bg="white"
            color="brand.500"
            variant="solid"
            justifyContent="flex-start"
            leftIcon={<Icon as={FiCalendar} />}
            _hover={{ bg: "brand.50" }}
          >
            My Schedule
          </Button>
        </VStack>
      </Box>
    </VStack>
  );

  return (
    <Flex minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      {/* Mobile menu button */}
      {isMobile && (
        <IconButton
          icon={<FiMenu />}
          onClick={onToggle}
          variant="outline"
          position="fixed"
          top={4}
          left={4}
          zIndex={20}
          bg={sidebarBg}
          aria-label="Open menu"
        />
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box w="280px" minH="100vh" p={4} position="relative" zIndex={10}>
          <SidebarContent />
        </Box>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">
          <DrawerOverlay />
          <DrawerContent bg={sidebarBg}>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">
              <Text fontSize="lg" fontWeight="bold" color="brand.600">
                Dashboard
              </Text>
            </DrawerHeader>
            <DrawerBody p={4}>
              <Box onClick={onClose}>
                <SidebarContent />
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}

      {/* Main Content */}
      <Box as="main" flex="1" p={{ base: 16, lg: 8 }} pt={{ base: 20, lg: 8 }}>
        <Outlet />
      </Box>
    </Flex>
  );
}

export default DashboardLayout;
