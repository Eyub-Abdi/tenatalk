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
} from "@chakra-ui/react";
import { NavLink, Outlet } from "react-router-dom";
import { FiCalendar, FiHome, FiSearch, FiSettings } from "react-icons/fi";
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
  const activeBg = useColorModeValue("blue.50", "whiteAlpha.200");
  const activeColor = useColorModeValue("brand.600", "brand.300");
  return (
    <NavLink to={to} end style={{ textDecoration: "none" }}>
      {({ isActive }: { isActive: boolean }) => (
        <HStack
          spacing={3}
          px={3}
          py={2}
          borderRadius="md"
          bg={isActive ? activeBg : "transparent"}
          color={isActive ? activeColor : undefined}
        >
          <Icon as={icon} />
          <Text fontWeight={isActive ? "semibold" : "medium"}>{label}</Text>
        </HStack>
      )}
    </NavLink>
  );
}

export function DashboardLayout() {
  const border = useColorModeValue("gray.200", "gray.700");
  const { user } = useAuth();

  // Mock user data for development when not authenticated
  const displayUser = user || {
    first_name: "Demo",
    last_name: "User",
    email: "demo@example.com"
  };

  return (
    <Flex minH="100vh">
      <Box
        as="aside"
        w={{ base: "full", md: 64 }}
        borderRight="1px"
        borderColor={border}
        p={4}
        display={{ base: "none", md: "block" }}
      >
        <VStack align="stretch" spacing={4}>
          <HStack>
            <Avatar size="sm" name={`${displayUser?.first_name} ${displayUser?.last_name}`} />
            <VStack spacing={0} align="start">
              <Text fontWeight="semibold" noOfLines={1} maxW={40}>
                {displayUser?.first_name} {displayUser?.last_name}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {user ? "Student" : "Demo User"}
              </Text>
            </VStack>
          </HStack>
          <Divider />
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
      <Box as="main" flex="1" p={{ base: 4, md: 8 }}>
        <Outlet />
      </Box>
    </Flex>
  );
}

export default DashboardLayout;
