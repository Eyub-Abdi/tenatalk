import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  Select,
  Switch,
  HStack,
  Avatar,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiSave } from "react-icons/fi";

export default function Settings() {
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Profile state
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    timezone: "UTC",
    language: "English",
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully.",
      status: "success",
      duration: 3000,
      position: "top-right",
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: "Preferences updated",
      description: "Your preferences have been saved successfully.",
      status: "success",
      duration: 3000,
      position: "top-right",
    });
  };

  return (
    <Stack spacing={6}>
      <Box>
        <Heading size="lg" mb={2}>
          Settings
        </Heading>
        <Text color="gray.600" fontSize="sm">
          Manage your account settings and preferences
        </Text>
      </Box>

      <Tabs colorScheme="brand" variant="soft-rounded">
        <TabList gap={2}>
          <Tab
            _selected={{
              bg: "brand.500",
              color: "white",
            }}
            fontSize="sm"
            fontWeight="500"
          >
            Profile
          </Tab>
          <Tab
            _selected={{
              bg: "brand.500",
              color: "white",
            }}
            fontSize="sm"
            fontWeight="500"
          >
            Account
          </Tab>
          <Tab
            _selected={{
              bg: "brand.500",
              color: "white",
            }}
            fontSize="sm"
            fontWeight="500"
          >
            Notifications
          </Tab>
        </TabList>

        <TabPanels>
          {/* Profile Tab */}
          <TabPanel px={0} py={6}>
            <Stack spacing={6}>
              <Box
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="lg"
                p={6}
              >
                <VStack spacing={6} align="stretch">
                  <HStack spacing={4}>
                    <Avatar size="xl" name={profile.fullName} />
                    <VStack align="start" spacing={1}>
                      <Button size="sm" variant="outline">
                        Change Photo
                      </Button>
                      <Text fontSize="xs" color="gray.500">
                        JPG, PNG or GIF. Max size 5MB
                      </Text>
                    </VStack>
                  </HStack>

                  <Divider />

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="500">
                      Full Name
                    </FormLabel>
                    <Input
                      value={profile.fullName}
                      onChange={(e) =>
                        setProfile({ ...profile, fullName: e.target.value })
                      }
                      placeholder="Enter your full name"
                      size="md"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="500">
                      Email
                    </FormLabel>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      placeholder="your@email.com"
                      size="md"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="500">
                      Phone Number
                    </FormLabel>
                    <Input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      placeholder="+1 (555) 000-0000"
                      size="md"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="500">
                      Bio
                    </FormLabel>
                    <Textarea
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      placeholder="Tell students about yourself..."
                      rows={4}
                      resize="vertical"
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {profile.bio.length}/500 characters
                    </Text>
                  </FormControl>

                  <Button
                    leftIcon={<FiSave />}
                    colorScheme="blue"
                    size="md"
                    alignSelf="flex-start"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                </VStack>
              </Box>
            </Stack>
          </TabPanel>

          {/* Account Tab */}
          <TabPanel px={0} py={6}>
            <Stack spacing={6}>
              <Box
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="lg"
                p={6}
              >
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading size="sm" mb={4}>
                      Regional Settings
                    </Heading>

                    <Stack spacing={4}>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="500">
                          Timezone
                        </FormLabel>
                        <Select
                          value={profile.timezone}
                          onChange={(e) =>
                            setProfile({ ...profile, timezone: e.target.value })
                          }
                          size="md"
                        >
                          <option value="UTC">UTC (GMT+0)</option>
                          <option value="America/New_York">
                            Eastern Time (GMT-5)
                          </option>
                          <option value="America/Chicago">
                            Central Time (GMT-6)
                          </option>
                          <option value="America/Denver">
                            Mountain Time (GMT-7)
                          </option>
                          <option value="America/Los_Angeles">
                            Pacific Time (GMT-8)
                          </option>
                          <option value="Europe/London">
                            London (GMT+0)
                          </option>
                          <option value="Europe/Paris">Paris (GMT+1)</option>
                          <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="500">
                          Language
                        </FormLabel>
                        <Select
                          value={profile.language}
                          onChange={(e) =>
                            setProfile({ ...profile, language: e.target.value })
                          }
                          size="md"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                          <option value="Italian">Italian</option>
                          <option value="Japanese">Japanese</option>
                          <option value="Chinese">Chinese</option>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="sm" mb={4}>
                      Security
                    </Heading>
                    <Stack spacing={3}>
                      <Button variant="outline" size="md" alignSelf="flex-start">
                        Change Password
                      </Button>
                      <Button
                        variant="outline"
                        colorScheme="red"
                        size="md"
                        alignSelf="flex-start"
                      >
                        Delete Account
                      </Button>
                    </Stack>
                  </Box>

                  <Button
                    leftIcon={<FiSave />}
                    colorScheme="brand"
                    size="md"
                    alignSelf="flex-start"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                </VStack>
              </Box>
            </Stack>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel px={0} py={6}>
            <Stack spacing={6}>
              <Box
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="lg"
                p={6}
              >
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading size="sm" mb={4}>
                      Notification Preferences
                    </Heading>

                    <Stack spacing={4}>
                      <HStack justify="space-between">
                        <Box>
                          <Text fontSize="sm" fontWeight="500">
                            Email Notifications
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Receive booking confirmations and updates via email
                          </Text>
                        </Box>
                        <Switch
                          isChecked={preferences.emailNotifications}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              emailNotifications: e.target.checked,
                            })
                          }
                          colorScheme="brand"
                          size="lg"
                        />
                      </HStack>

                      <Divider />

                      <HStack justify="space-between">
                        <Box>
                          <Text fontSize="sm" fontWeight="500">
                            SMS Notifications
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Receive booking reminders via text message
                          </Text>
                        </Box>
                        <Switch
                          isChecked={preferences.smsNotifications}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              smsNotifications: e.target.checked,
                            })
                          }
                          colorScheme="brand"
                          size="lg"
                        />
                      </HStack>

                      <Divider />

                      <HStack justify="space-between">
                        <Box>
                          <Text fontSize="sm" fontWeight="500">
                            Marketing Emails
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Receive tips, offers, and product updates
                          </Text>
                        </Box>
                        <Switch
                          isChecked={preferences.marketingEmails}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              marketingEmails: e.target.checked,
                            })
                          }
                          colorScheme="brand"
                          size="lg"
                        />
                      </HStack>
                    </Stack>
                  </Box>

                  <Button
                    leftIcon={<FiSave />}
                    colorScheme="brand"
                    size="md"
                    alignSelf="flex-start"
                    onClick={handleSavePreferences}
                  >
                    Save Preferences
                  </Button>
                </VStack>
              </Box>
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}
