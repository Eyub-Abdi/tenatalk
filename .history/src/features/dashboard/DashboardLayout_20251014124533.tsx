import {import {

  Box,  Box,

  Flex,  Flex,

  HStack,  HStack,

  VStack,  VStack,

  Text,  Text,

  Icon,  Icon,

  useColorModeValue,  useColorModeValue,

  Avatar,  Avatar,

  IconButton,  IconButton,

  useDisclosure,  useDisclosure,

  Drawer,  Drawer,

  DrawerBody,  DrawerBody,

  DrawerHeader,  DrawerHeader,

  DrawerOverlay,  DrawerOverlay,

  DrawerContent,  DrawerContent,

  DrawerCloseButton,  DrawerCloseButton,

  useBreakpointValue,  useBreakpointValue,

  Button,  Button,

} from "@chakra-ui/react";} from "@chakra-ui/react";

import { NavLink, Outlet } from "react-router-dom";import { NavLink, Outlet } from "react-router-dom";

import {import {

  FiCalendar,  FiCalendar,

  FiHome,  FiHome,

  FiSearch,  FiSearch,

  FiSettings,  FiSettings,

  FiMenu,  FiMenu,

} from "react-icons/fi";} from "react-icons/fi";

import { useAuth } from "../auth/AuthProvider";import { useAuth } from "../auth/AuthProvider";



type IconType = React.ComponentType<{ size?: string | number }>;type IconType = React.ComponentType<{ size?: string | number }>;



function NavItem({function NavItem({

  to,  to,

  icon,  icon,

  label,  label,

}: {}: {

  to: string;  to: string;

  icon: IconType;  icon: IconType;

  label: string;  label: string;

}) {}) {

  const activeBg = useColorModeValue("brand.50", "whiteAlpha.200");  const activeBg = useColorModeValue("brand.50", "whiteAlpha.200");

  const activeColor = useColorModeValue("brand.600", "brand.300");  const activeColor = useColorModeValue("brand.600", "brand.300");

  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.100");  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.100");



  return (  return (

    <NavLink to={to} end style={{ textDecoration: "none" }}>    <NavLink to={to} end style={{ textDecoration: "none" }}>

      {({ isActive }: { isActive: boolean }) => (      {({ isActive }: { isActive: boolean }) => (

        <HStack        <HStack

          spacing={3}          spacing={3}

          px={3}          px={3}

          py={3}          py={3}

          borderRadius="lg"          borderRadius="lg"

          bg={isActive ? activeBg : "transparent"}          bg={isActive ? activeBg : "transparent"}

          color={isActive ? activeColor : undefined}          color={isActive ? activeColor : undefined}

          _hover={{ bg: isActive ? activeBg : hoverBg }}          _hover={{ bg: isActive ? activeBg : hoverBg }}

          cursor="pointer"          cursor="pointer"

          transition="all 0.2s"          transition="all 0.2s"

          justify="flex-start"          justify="flex-start"

          minH="44px"          minH="44px"

        >        >

          <Icon as={icon} boxSize={5} />          <Icon as={icon} boxSize={5} />

          <Text fontWeight={isActive ? "semibold" : "medium"}>{label}</Text>          <Text fontWeight={isActive ? "semibold" : "medium"}>{label}</Text>

        </HStack>        </HStack>

      )}      )}

    </NavLink>    </NavLink>

  );  );

}}



export function DashboardLayout() {export function DashboardLayout() {

  const { isOpen, onToggle, onClose } = useDisclosure();  const { isOpen, onToggle, onClose } = useDisclosure();

  const border = useColorModeValue("gray.200", "gray.700");  const border = useColorModeValue("gray.200", "gray.700");

  const sidebarBg = useColorModeValue("white", "gray.800");  const sidebarBg = useColorModeValue("white", "gray.800");

  const sidebarShadow = useColorModeValue("md", "dark-lg");  const sidebarShadow = useColorModeValue("md", "dark-lg");

  const isMobile = useBreakpointValue({ base: true, lg: false });  const isMobile = useBreakpointValue({ base: true, lg: false });

  const { user } = useAuth();  const { user } = useAuth();



  // Mock user data for development when not authenticated  // Mock user data for development when not authenticated

  const displayUser = user || {  const displayUser = user || {

    first_name: "Demo",    first_name: "Demo",

    last_name: "User",    last_name: "User",

    email: "demo@example.com",    email: "demo@example.com",

  };  };



  // Sidebar content component  // Sidebar content component

  const SidebarContent = () => (  const SidebarContent = () => (

    <VStack spacing={4} align="stretch" h="full">    <VStack spacing={4} align="stretch" h="full">

      {/* User Profile Card */}      {/* User Profile Card */}

      <Box      <Box

        bg={sidebarBg}        bg={sidebarBg}

        border="1px"        border="1px"

        borderColor={border}        borderColor={border}

        borderRadius="xl"        borderRadius="xl"

        p={4}        p={4}

        boxShadow={sidebarShadow}        boxShadow={sidebarShadow}

      >      >

        <HStack>        <HStack>

          <Avatar          <Avatar

            size="sm"            size="sm"

            name={`${displayUser?.first_name} ${displayUser?.last_name}`}            name={`${displayUser?.first_name} ${displayUser?.last_name}`}

            bg="brand.500"            bg="brand.500"

          />          />

          <VStack spacing={0} align="start">          <VStack spacing={0} align="start">

            <Text fontWeight="semibold" fontSize="sm" noOfLines={1} maxW={32}>            <Text fontWeight="semibold" fontSize="sm" noOfLines={1} maxW={32}>

              {displayUser?.first_name} {displayUser?.last_name}              {displayUser?.first_name} {displayUser?.last_name}

            </Text>            </Text>

            <Text fontSize="xs" color="gray.500">            <Text fontSize="xs" color="gray.500">

              {user ? "Student" : "Demo User"}              {user ? "Student" : "Demo User"}

            </Text>            </Text>

          </VStack>          </VStack>

        </HStack>        </HStack>

      </Box>      </Box>



      {/* Navigation Card */}      {/* Navigation Card */}

      <Box      <Box

        bg={sidebarBg}        bg={sidebarBg}

        border="1px"        border="1px"

        borderColor={border}        borderColor={border}

        borderRadius="xl"        borderRadius="xl"

        p={4}        p={4}

        boxShadow={sidebarShadow}        boxShadow={sidebarShadow}

        flex="1"        flex="1"

      >      >

        <VStack align="stretch" spacing={2}>        <VStack align="stretch" spacing={2}>

          <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" mb={2}>          <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" mb={2}>

            Navigation            Navigation

          </Text>          </Text>

          <NavItem to="/dashboard" icon={FiHome} label="Overview" />          <NavItem to="/dashboard" icon={FiHome} label="Overview" />

          <NavItem to="/dashboard/bookings" icon={FiCalendar} label="My Bookings" />          <NavItem to="/dashboard/bookings" icon={FiCalendar} label="My Bookings" />

          <NavItem to="/dashboard/find-tutors" icon={FiSearch} label="Find Tutors" />          <NavItem to="/dashboard/find-tutors" icon={FiSearch} label="Find Tutors" />

          <NavItem to="/dashboard/settings" icon={FiSettings} label="Settings" />          <NavItem to="/dashboard/settings" icon={FiSettings} label="Settings" />

        </VStack>        </VStack>

      </Box>      </Box>



      {/* Quick Actions Card */}      {/* Quick Actions Card */}

      <Box      <Box

        bg={sidebarBg}        bg={sidebarBg}

        border="1px"        border="1px"

        borderColor={border}        borderColor={border}

        borderRadius="xl"        borderRadius="xl"

        p={4}        p={4}

        boxShadow={sidebarShadow}        boxShadow={sidebarShadow}

      >      >

        <VStack align="stretch" spacing={2}>        <VStack align="stretch" spacing={2}>

          <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" mb={2}>          <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" mb={2}>

            Quick Actions            Quick Actions

          </Text>          </Text>

          <Button          <Button

            size="sm"            size="sm"

            colorScheme="brand"            colorScheme="brand"

            variant="ghost"            variant="ghost"

            justifyContent="flex-start"            justifyContent="flex-start"

            leftIcon={<Icon as={FiSearch} />}            leftIcon={<Icon as={FiSearch} />}

          >          >

            Book Lesson            Book Lesson

          </Button>          </Button>

          <Button          <Button

            size="sm"            size="sm"

            variant="ghost"            variant="ghost"

            justifyContent="flex-start"            justifyContent="flex-start"

            leftIcon={<Icon as={FiCalendar} />}            leftIcon={<Icon as={FiCalendar} />}

          >          >

            My Schedule            My Schedule

          </Button>          </Button>

        </VStack>        </VStack>

      </Box>      </Box>

    </VStack>    </VStack>

  );  );



  return (  return (

    <Flex minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>    <Flex minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>

      {/* Mobile menu button */}      {/* Mobile menu button */}

      {isMobile && (      {isMobile && (

        <IconButton        <IconButton

          icon={<FiMenu />}          icon={<FiMenu />}

          onClick={onToggle}          onClick={onToggle}

          variant="outline"          variant="outline"

          position="fixed"          position="fixed"

          top={4}          top={4}

          left={4}          left={4}

          zIndex={20}          zIndex={20}

          bg={sidebarBg}          bg={sidebarBg}

          aria-label="Open menu"          aria-label="Open menu"

        />        />

      )}      )}



      {/* Desktop Sidebar */}      {/* Desktop Sidebar */}

      {!isMobile && (      {!isMobile && (

        <Box        <Box

          w="280px"          w="280px"

          minH="100vh"          minH="100vh"

          p={4}          p={4}

          position="relative"          position="relative"

          zIndex={10}          zIndex={10}

        >        >

          <SidebarContent />          <SidebarContent />

        </Box>        </Box>

      )}      )}



      {/* Mobile Drawer */}      {/* Mobile Drawer */}

      {isMobile && (      {isMobile && (

        <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">        <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">

          <DrawerOverlay />          <DrawerOverlay />

          <DrawerContent bg={sidebarBg}>          <DrawerContent bg={sidebarBg}>

            <DrawerCloseButton />            <DrawerCloseButton />

            <DrawerHeader borderBottomWidth="1px">            <DrawerHeader borderBottomWidth="1px">

              <Text fontSize="lg" fontWeight="bold" color="brand.600">              <Text fontSize="lg" fontWeight="bold" color="brand.600">

                Dashboard                Dashboard

              </Text>              </Text>

            </DrawerHeader>            </DrawerHeader>

            <DrawerBody p={4}>            <DrawerBody p={4}>

              <Box onClick={onClose}>              <Box onClick={onClose}>

                <SidebarContent />                <SidebarContent />

              </Box>              </Box>

            </DrawerBody>            </DrawerBody>

          </DrawerContent>          </DrawerContent>

        </Drawer>        </Drawer>

      )}      )}



      {/* Main Content */}      {/* Main Content */}

      <Box      <Box

        as="main"        as="main"

        flex="1"        flex="1"

        p={{ base: 16, lg: 8 }}        p={{ base: 16, lg: 8 }}

        pt={{ base: 20, lg: 8 }}        pt={{ base: 20, lg: 8 }}

      >      >

        <Outlet />        <Outlet />

      </Box>      </Box>

    </Flex>    </Flex>

  );  );

}}



export default DashboardLayout;export default DashboardLayout;

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

  const sidebarWidth = isCollapsed ? "80px" : "280px";

  // Sidebar header with controls
  const SidebarHeader = ({ isDetached = false }: { isDetached?: boolean }) => (
    <VStack spacing={3}>
      <HStack justify="space-between" align="center" w="full">
        <HStack>
          <Avatar
            size="sm"
            name={`${displayUser?.first_name} ${displayUser?.last_name}`}
            bg="brand.500"
          />
          {!isCollapsed && (
            <VStack spacing={0} align="start">
              <Text fontWeight="semibold" fontSize="sm" noOfLines={1} maxW={32}>
                {displayUser?.first_name} {displayUser?.last_name}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {user ? "Student" : "Demo User"}
              </Text>
            </VStack>
          )}
        </HStack>

        <HStack spacing={1}>
          {/* Collapse/Expand button */}
          <IconButton
            icon={<Icon as={isCollapsed ? FiChevronRight : FiChevronLeft} />}
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          />

          {/* Detach/Dock button */}
          {!isMobile && (
            <IconButton
              icon={<Icon as={isDetached ? FiMinimize2 : FiMaximize2} />}
              variant="ghost"
              size="sm"
              onClick={() => setSidebarMode(isDetached ? "docked" : "detached")}
              aria-label={isDetached ? "Dock sidebar" : "Detach sidebar"}
            />
          )}

          {/* Hide button (only when detached) */}
          {isDetached && (
            <IconButton
              icon={<Icon as={FiX} />}
              variant="ghost"
              size="sm"
              onClick={() => setSidebarMode("hidden")}
              aria-label="Hide sidebar"
            />
          )}
        </HStack>
      </HStack>
    </VStack>
  );

  // Sidebar content component
  const SidebarContent = ({
    isCollapsed: collapsed = false,
    isDetached = false,
  }: {
    isCollapsed?: boolean;
    isDetached?: boolean;
  }) => (
    <VStack spacing={4} align="stretch" h="full">
      {/* User Profile Card */}
      <Box
        bg={sidebarBg}
        border="1px"
        borderColor={border}
        borderRadius="xl"
        p={4}
        boxShadow={sidebarShadow}
      >
        <SidebarHeader isDetached={isDetached} />
      </Box>

      {/* Navigation Card */}
      <Box
        bg={sidebarBg}
        border="1px"
        borderColor={border}
        borderRadius="xl"
        p={4}
        boxShadow={sidebarShadow}
        flex="1"
      >
        <VStack align="stretch" spacing={2}>
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color="gray.500"
            textTransform="uppercase"
            mb={2}
          >
            {!collapsed && "Navigation"}
          </Text>
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
      </Box>

      {/* Quick Actions Card */}
      <Box
        bg={sidebarBg}
        border="1px"
        borderColor={border}
        borderRadius="xl"
        p={4}
        boxShadow={sidebarShadow}
      >
        <VStack align="stretch" spacing={2}>
          {!collapsed && (
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
              mb={2}
            >
              Quick Actions
            </Text>
          )}
          <Button
            size="sm"
            colorScheme="brand"
            variant="ghost"
            justifyContent={collapsed ? "center" : "flex-start"}
            leftIcon={collapsed ? undefined : <Icon as={FiSearch} />}
          >
            {collapsed ? <Icon as={FiSearch} /> : "Book Lesson"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            justifyContent={collapsed ? "center" : "flex-start"}
            leftIcon={collapsed ? undefined : <Icon as={FiCalendar} />}
          >
            {collapsed ? <Icon as={FiCalendar} /> : "My Schedule"}
          </Button>
        </VStack>
      </Box>
    </VStack>
  );

  return (
    <Flex
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.900")}
      position="relative"
    >
      {/* Show sidebar button when hidden */}
      {sidebarMode === "hidden" && !isMobile && (
        <Button
          leftIcon={<FiMenu />}
          onClick={() => setSidebarMode("docked")}
          position="fixed"
          top={4}
          left={4}
          zIndex={30}
          size="sm"
          colorScheme="brand"
          variant="solid"
        >
          Show Sidebar
        </Button>
      )}

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

      {/* Desktop Sidebar Container - Docked Mode */}
      {!isMobile && sidebarMode === "docked" && (
        <Box
          w={sidebarWidth}
          minH="100vh"
          p={4}
          transition="width 0.3s ease"
          position="relative"
          zIndex={10}
        >
          <SidebarContent isCollapsed={isCollapsed} isDetached={false} />
        </Box>
      )}

      {/* Desktop Sidebar Container - Detached Mode */}
      {!isMobile && sidebarMode === "detached" && (
        <Portal>
          <Box
            position="fixed"
            left={`${detachedPosition.x}px`}
            top={`${detachedPosition.y}px`}
            w={sidebarWidth}
            h="calc(100vh - 40px)"
            p={4}
            zIndex={1000}
            transition="width 0.3s ease"
            cursor="move"
            onMouseDown={(e) => {
              if (!isCollapsed) {
                const startX = e.clientX - detachedPosition.x;
                const startY = e.clientY - detachedPosition.y;

                const handleMouseMove = (e: MouseEvent) => {
                  setDetachedPosition({
                    x: Math.max(
                      0,
                      Math.min(window.innerWidth - 300, e.clientX - startX)
                    ),
                    y: Math.max(
                      0,
                      Math.min(window.innerHeight - 100, e.clientY - startY)
                    ),
                  });
                };

                const handleMouseUp = () => {
                  document.removeEventListener("mousemove", handleMouseMove);
                  document.removeEventListener("mouseup", handleMouseUp);
                };

                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
              }
            }}
          >
            <SidebarContent isCollapsed={isCollapsed} isDetached={true} />
          </Box>
        </Portal>
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
        ml={isMobile || sidebarMode !== "docked" ? 0 : 0}
        transition="margin-left 0.3s ease"
      >
        <Outlet />
      </Box>
    </Flex>
  );
}

export default DashboardLayout;
