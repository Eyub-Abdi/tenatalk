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
  Heading,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FiCalendar,
  FiHome,
  FiSearch,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiHelpCircle,
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
  const activeBg = useColorModeValue("white", "whiteAlpha.300");
  const activeColor = useColorModeValue("brand.600", "brand.200");
  const hoverBg = useColorModeValue("whiteAlpha.200", "whiteAlpha.100");
  const textColor = useColorModeValue("white", "white");

  return (
    <NavLink to={to} end style={{ textDecoration: "none" }}>
      {({ isActive }: { isActive: boolean }) => (
        <HStack
          spacing={3}
          px={3}
          py={3}
          borderRadius="lg"
          bg={isActive ? activeBg : "transparent"}
          color={isActive ? activeColor : textColor}
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

// Dashboard Header Component
function DashboardHeader({
  displayUser,
  user,
}: {
  displayUser: { first_name: string; last_name: string; email: string };
  user: any;
}) {
  const headerBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={1000}
      bg={headerBg}
      borderBottom="1px"
      borderColor={borderColor}
      px={6}
      py={4}
      shadow="sm"
    >
      <Flex align="center" justify="space-between">
        {/* Left side - Dashboard title */}
        <Box>
          <Heading size="lg" color="brand.600">
            Dashboard
          </Heading>
          <Text fontSize="sm" color="gray.500" mt={1}>
            Welcome back, {displayUser?.first_name}!
          </Text>
        </Box>

        {/* Right side - Actions */}
        <HStack spacing={4}>
          {/* Notifications */}
          <Box position="relative">
            <IconButton
              icon={<FiBell />}
              variant="ghost"
              size="lg"
              aria-label="Notifications"
            />
            <Badge
              position="absolute"
              top="0"
              right="0"
              colorScheme="red"
              borderRadius="full"
              fontSize="xs"
              px={1}
            >
              3
            </Badge>
          </Box>

          {/* Quick Actions */}
          <Button
            leftIcon={<FiSearch />}
            colorScheme="brand"
            size="sm"
            variant="outline"
          >
            Find Tutor
          </Button>

          {/* User Menu */}
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              rightIcon={<FiChevronDown />}
            >
              <HStack>
                <Avatar
                  size="sm"
                  name={`${displayUser?.first_name} ${displayUser?.last_name}`}
                  bg="brand.500"
                />
                <VStack
                  spacing={0}
                  align="start"
                  display={{ base: "none", md: "flex" }}
                >
                  <Text fontSize="sm" fontWeight="medium">
                    {displayUser?.first_name} {displayUser?.last_name}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {user ? "Student" : "Demo User"}
                  </Text>
                </VStack>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiUser />}>My Profile</MenuItem>
              <MenuItem icon={<FiSettings />}>Settings</MenuItem>
              <MenuItem icon={<FiHelpCircle />}>Help & Support</MenuItem>
              <MenuDivider />
              <MenuItem icon={<FiLogOut />} color="red.500">
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
}

export function DashboardLayout() {
  const { isOpen, onToggle, onClose } = useDisclosure();
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
            <Text
              fontWeight="semibold"
              fontSize="sm"
              noOfLines={1}
              maxW={32}
              color="white"
            >
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
    <Flex
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.900")}
      direction="column"
    >
      {/* Dashboard Header */}
      <DashboardHeader displayUser={displayUser} user={user} />

      <Flex flex="1">
        {/* Mobile menu button */}
        {isMobile && (
          <IconButton
            icon={<FiMenu />}
            onClick={onToggle}
            variant="outline"
            position="fixed"
            top={20}
            left={4}
            zIndex={20}
            bg={sidebarBg}
            aria-label="Open menu"
          />
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box
            w="280px"
            minH="calc(100vh - 80px)"
            p={4}
            position="relative"
            zIndex={10}
          >
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
        <Box
          as="main"
          flex="1"
          p={{ base: 16, lg: 8 }}
          pt={{ base: 20, lg: 8 }}
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}

export default DashboardLayout;
