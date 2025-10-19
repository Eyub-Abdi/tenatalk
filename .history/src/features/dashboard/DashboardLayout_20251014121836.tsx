import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Icon,
  useColorModeValue,
  Avatar,
  Divider,
  IconButton,
  useDisclosure,
  Collapse,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Portal,
  Button,
} from "@chakra-ui/react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FiCalendar,
  FiHome,
  FiSearch,
  FiSettings,
  FiMenu,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiMaximize2,
  FiMinimize2,
} from "react-icons/fi";
import { useAuth } from "../auth/AuthProvider";
import { useState } from "react";

type IconType = React.ComponentType<{ size?: string | number }>;

function NavItem({
  to,
  icon,
  label,
  isCollapsed = false,
}: {
  to: string;
  icon: IconType;
  label: string;
  isCollapsed?: boolean;
}) {
  const activeBg = useColorModeValue("brand.50", "whiteAlpha.200");
  const activeColor = useColorModeValue("brand.600", "brand.300");
  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.100");

  return (
    <NavLink to={to} end style={{ textDecoration: "none" }}>
      {({ isActive }: { isActive: boolean }) => (
        <HStack
          spacing={isCollapsed ? 0 : 3}
          px={isCollapsed ? 2 : 3}
          py={3}
          borderRadius="lg"
          bg={isActive ? activeBg : "transparent"}
          color={isActive ? activeColor : undefined}
          _hover={{ bg: isActive ? activeBg : hoverBg }}
          cursor="pointer"
          transition="all 0.2s"
          justify={isCollapsed ? "center" : "flex-start"}
          minH="44px"
        >
          <Icon as={icon} boxSize={5} />
          {!isCollapsed && (
            <Text fontWeight={isActive ? "semibold" : "medium"}>{label}</Text>
          )}
        </HStack>
      )}
    </NavLink>
  );
}

export function DashboardLayout() {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { isOpen: isCollapsed, onToggle: onToggleCollapse } = useDisclosure();
  const border = useColorModeValue("gray.200", "gray.700");
  const sidebarBg = useColorModeValue("white", "gray.800");
  const sidebarShadow = useColorModeValue("sm", "dark-lg");
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { user } = useAuth();

  // Mock user data for development when not authenticated
  const displayUser = user || {
    first_name: "Demo",
    last_name: "User",
    email: "demo@example.com",
  };

  const sidebarWidth = isCollapsed ? "80px" : "280px";

  // Sidebar content component
  const SidebarContent = ({
    isCollapsed: collapsed = false,
  }: {
    isCollapsed?: boolean;
  }) => (
    <VStack align="stretch" spacing={4} h="full">
      {/* Header */}
      <Box>
        {!collapsed ? (
          <HStack justify="space-between" align="center">
            <HStack>
              <Avatar
                size="sm"
                name={`${displayUser?.first_name} ${displayUser?.last_name}`}
                bg="brand.500"
              />
              <VStack spacing={0} align="start">
                <Text
                  fontWeight="semibold"
                  fontSize="sm"
                  noOfLines={1}
                  maxW={32}
                >
                  {displayUser?.first_name} {displayUser?.last_name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {user ? "Student" : "Demo User"}
                </Text>
              </VStack>
            </HStack>
            {!isMobile && (
              <IconButton
                icon={<Icon as={collapsed ? FiChevronRight : FiChevronLeft} />}
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              />
            )}
          </HStack>
        ) : (
          <VStack spacing={2}>
            <Avatar
              size="md"
              name={`${displayUser?.first_name} ${displayUser?.last_name}`}
              bg="brand.500"
            />
            <IconButton
              icon={<Icon as={FiChevronRight} />}
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              aria-label="Expand sidebar"
            />
          </VStack>
        )}
      </Box>

      <Divider />

      {/* Navigation */}
      <VStack align="stretch" spacing={1} flex="1">
        <NavItem
          to="/dashboard"
          icon={FiHome}
          label="Overview"
          isCollapsed={collapsed}
        />
        <NavItem
          to="/dashboard/bookings"
          icon={FiCalendar}
          label="My Bookings"
          isCollapsed={collapsed}
        />
        <NavItem
          to="/dashboard/find-tutors"
          icon={FiSearch}
          label="Find Tutors"
          isCollapsed={collapsed}
        />
        <NavItem
          to="/dashboard/settings"
          icon={FiSettings}
          label="Settings"
          isCollapsed={collapsed}
        />
      </VStack>
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
        <Box
          as="aside"
          w={sidebarWidth}
          minH="100vh"
          bg={sidebarBg}
          borderRight="1px"
          borderColor={border}
          boxShadow={sidebarShadow}
          p={4}
          transition="width 0.3s ease"
          position="relative"
          zIndex={10}
        >
          <SidebarContent isCollapsed={isCollapsed} />
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
            <DrawerBody>
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
        ml={isMobile ? 0 : 0}
        transition="margin-left 0.3s ease"
      >
        <Outlet />
      </Box>
    </Flex>
  );
}

export default DashboardLayout;
