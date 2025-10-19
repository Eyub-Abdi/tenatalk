import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Progress,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Checkbox,
  Stack,
  SimpleGrid,
  useColorModeValue,
  Alert,
  AlertIcon,
  FormErrorMessage,
  Card,
  CardBody,
  Badge,
  Icon,
  Divider,
  Switch,
  Radio,
  RadioGroup,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
} from "@chakra-ui/react";
import {
  FaGraduationCap,
  FaUsers,
  FaUser,
  FaCertificate,
  FaVideo,
  FaDollarSign,
  FaCheckCircle,
  FaPlus,
  FaTimes,
  FaCamera,
  FaChevronDown,
  FaCalendarDay,
  FaCalendarAlt,
  FaClock,
  FaBirthdayCake,
  FaStar,
  FaComments,
  FaGlobe,
  FaLanguage,
  FaChartBar,
  FaUpload,
  FaImage,
} from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// For now, let's create a comprehensive countries list with proper flag emojis
const countries = [
  { name: "Afghanistan", flag: "🇦🇫", code: "AF", dialCode: "+93" },
  { name: "Albania", flag: "🇦🇱", code: "AL", dialCode: "+355" },
  { name: "Algeria", flag: "🇩🇿", code: "DZ", dialCode: "+213" },
  { name: "Australia", flag: "🇦🇺", code: "AU", dialCode: "+61" },
  { name: "Austria", flag: "🇦🇹", code: "AT", dialCode: "+43" },
  { name: "Belgium", flag: "🇧🇪", code: "BE", dialCode: "+32" },
  { name: "Brazil", flag: "🇧🇷", code: "BR", dialCode: "+55" },
  { name: "Burundi", flag: "🇧🇮", code: "BI", dialCode: "+257" },
  { name: "Canada", flag: "🇨🇦", code: "CA", dialCode: "+1" },
  { name: "China", flag: "🇨🇳", code: "CN", dialCode: "+86" },
  {
    name: "Democratic Republic of Congo",
    flag: "🇨🇩",
    code: "CD",
    dialCode: "+243",
  },
  { name: "Egypt", flag: "🇪🇬", code: "EG", dialCode: "+20" },
  { name: "France", flag: "🇫🇷", code: "FR", dialCode: "+33" },
  { name: "Germany", flag: "🇩🇪", code: "DE", dialCode: "+49" },
  { name: "India", flag: "🇮🇳", code: "IN", dialCode: "+91" },
  { name: "Italy", flag: "🇮🇹", code: "IT", dialCode: "+39" },
  { name: "Japan", flag: "🇯🇵", code: "JP", dialCode: "+81" },
  { name: "Kenya", flag: "🇰🇪", code: "KE", dialCode: "+254" },
  { name: "Malawi", flag: "🇲🇼", code: "MW", dialCode: "+265" },
  { name: "Mozambique", flag: "🇲🇿", code: "MZ", dialCode: "+258" },
  { name: "Nigeria", flag: "🇳🇬", code: "NG", dialCode: "+234" },
  { name: "Rwanda", flag: "🇷🇼", code: "RW", dialCode: "+250" },
  { name: "Somalia", flag: "🇸🇴", code: "SO", dialCode: "+252" },
  { name: "South Africa", flag: "🇿🇦", code: "ZA", dialCode: "+27" },
  { name: "South Korea", flag: "🇰🇷", code: "KR", dialCode: "+82" },
  { name: "Spain", flag: "🇪🇸", code: "ES", dialCode: "+34" },
  { name: "Tanzania", flag: "🇹🇿", code: "TZ", dialCode: "+255" },
  { name: "Uganda", flag: "🇺🇬", code: "UG", dialCode: "+256" },
  { name: "United Kingdom", flag: "🇬🇧", code: "GB", dialCode: "+44" },
  { name: "United States", flag: "🇺🇸", code: "US", dialCode: "+1" },
  { name: "Zambia", flag: "🇿🇲", code: "ZM", dialCode: "+260" },
].sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

// Helper function to get flag image URL
const getFlagUrl = (countryCode: string) => {
  return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
};

// Custom Country Select Component
const CountrySelect = ({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const selectedCountry = countries.find((country) => country.name === value);

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<FaChevronDown />}
        w="100%"
        textAlign="left"
        fontWeight="normal"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        minH={{ base: "48px", md: "40px" }}
        fontSize={{ base: "16px", md: "14px" }}
        _hover={{ borderColor: "gray.300" }}
        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
      >
        {selectedCountry ? (
          <HStack spacing={2}>
            <Image
              src={getFlagUrl(selectedCountry.code)}
              alt={`${selectedCountry.name} flag`}
              w="20px"
              h="15px"
              fallback={<Text fontSize="sm">{selectedCountry.flag}</Text>}
            />
            <Text color="gray.800">{selectedCountry.name}</Text>
          </HStack>
        ) : (
          <Text color="gray.500">{placeholder}</Text>
        )}
      </MenuButton>
      <MenuList maxH="200px" overflowY="auto">
        {countries.map((country) => (
          <MenuItem
            key={country.code}
            onClick={() => onChange(country.name)}
            _hover={{ bg: "gray.100" }}
            minH={{ base: "48px", md: "40px" }}
            fontSize={{ base: "16px", md: "14px" }}
          >
            <HStack spacing={2}>
              <Image
                src={getFlagUrl(country.code)}
                alt={`${country.name} flag`}
                w="20px"
                h="15px"
                fallback={<Text fontSize="sm">{country.flag}</Text>}
              />
              <Text color="gray.800">{country.name}</Text>
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

// Custom Language Select Component
// Helper function to get flag image URL for languages
const getLanguageFlagUrl = (countryCode: string) => {
  if (countryCode === "world") return null; // No flag image for "Other"
  return `https://flagcdn.com/w20/${countryCode}.png`;
};

// Custom Language Select Component
const LanguageSelect = ({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const selectedLanguage = commonLanguages.find(
    (language) => language.name === value
  );

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<FaChevronDown />}
        w="100%"
        textAlign="left"
        fontWeight="normal"
        bg="white"
        border="1px solid"
        borderColor="gray.300"
        _hover={{ borderColor: "gray.400", shadow: "sm" }}
        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
        minH={{ base: "48px", md: "40px" }}
        fontSize={{ base: "16px", md: "14px" }}
      >
        {selectedLanguage ? (
          <HStack spacing={3}>
            {selectedLanguage.code === "world" ? (
              <Icon as={FaGlobe} color="gray.500" boxSize={4} />
            ) : (
              <Image
                src={
                  getLanguageFlagUrl(selectedLanguage.code) as
                    | string
                    | undefined
                }
                alt={`${selectedLanguage.name} flag`}
                w="20px"
                h="15px"
                fallback={
                  <Text
                    fontSize="lg"
                    role="img"
                    aria-label={`${selectedLanguage.name} flag`}
                  >
                    {selectedLanguage.flag}
                  </Text>
                }
              />
            )}
            <Text color="gray.800" fontWeight="medium">
              {selectedLanguage.name}
            </Text>
          </HStack>
        ) : (
          <Text color="gray.500">{placeholder}</Text>
        )}
      </MenuButton>
      <MenuList
        maxH="200px"
        overflowY="auto"
        shadow="lg"
        border="1px solid"
        borderColor="gray.200"
      >
        {commonLanguages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => onChange(language.name)}
            _hover={{ bg: "blue.50" }}
            _focus={{ bg: "blue.50" }}
            py={3}
          >
            <HStack spacing={3}>
              {language.code === "world" ? (
                <Icon as={FaGlobe} color="gray.500" boxSize={4} />
              ) : (
                <Image
                  src={getLanguageFlagUrl(language.code) as string | undefined}
                  alt={`${language.name} flag`}
                  w="20px"
                  h="15px"
                  fallback={
                    <Text
                      fontSize="lg"
                      role="img"
                      aria-label={`${language.name} flag`}
                    >
                      {language.flag}
                    </Text>
                  }
                />
              )}
              <Text color="gray.800" fontWeight="medium">
                {language.name}
              </Text>
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

// Custom Proficiency Level Select Component
const ProficiencySelect = ({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const selectedLevel = languageLevels.find((level) => level.value === value);

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<FaChevronDown />}
        w="100%"
        textAlign="left"
        fontWeight="normal"
        bg="white"
        border="1px solid"
        borderColor="gray.300"
        _hover={{ borderColor: "gray.400", shadow: "sm" }}
        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
        minH={{ base: "48px", md: "40px" }}
        fontSize={{ base: "16px", md: "14px" }}
      >
        {selectedLevel ? (
          <HStack spacing={3}>
            <Badge
              colorScheme={selectedLevel.color}
              variant="solid"
              fontSize="xs"
              px={2}
              py={1}
            >
              {selectedLevel.value.toUpperCase()}
            </Badge>
            <Text color="gray.800" fontWeight="medium">
              {selectedLevel.label}
            </Text>
          </HStack>
        ) : (
          <Text color="gray.500">{placeholder}</Text>
        )}
      </MenuButton>
      <MenuList
        maxH={{ base: "250px", md: "300px" }}
        overflowY="auto"
        shadow="lg"
        border="1px solid"
        borderColor="gray.200"
        w="100%"
        fontSize={{ base: "14px", md: "16px" }}
      >
        {languageLevels.map((level) => (
          <MenuItem
            key={level.value}
            onClick={() => onChange(level.value)}
            _hover={{ bg: `${level.color}.50` }}
            _focus={{ bg: `${level.color}.50` }}
            py={{ base: 4, md: 3 }}
            minH={{ base: "60px", md: "auto" }}
          >
            <VStack spacing={{ base: 2, md: 1 }} align="start" w="100%">
              <HStack spacing={{ base: 2, md: 3 }} w="100%">
                <Badge
                  colorScheme={level.color}
                  variant="solid"
                  fontSize={{ base: "xs", md: "xs" }}
                  px={{ base: 3, md: 2 }}
                  py={{ base: 1, md: 1 }}
                  minW={{ base: "40px", md: "auto" }}
                >
                  {level.value.toUpperCase()}
                </Badge>
                <Text
                  color="gray.800"
                  fontWeight="semibold"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  {level.label}
                </Text>
              </HStack>
              <Text
                fontSize={{ base: "xs", md: "xs" }}
                color="gray.600"
                pl={{ base: 6, md: 8 }}
                lineHeight={{ base: 1.3, md: 1.4 }}
                display={{ base: "none", md: "block" }}
              >
                {level.description}
              </Text>
            </VStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

// Custom Date Select Components
const DaySelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <Menu>
    <MenuButton
      as={Button}
      rightIcon={<FaChevronDown />}
      w="100%"
      textAlign="left"
      fontWeight="normal"
      bg="white"
      border="1px solid"
      borderColor="gray.300"
      _hover={{ borderColor: "gray.400", shadow: "sm" }}
      _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
      minH={{ base: "48px", md: "40px" }}
      fontSize={{ base: "16px", md: "14px" }}
    >
      {value ? (
        <HStack spacing={2}>
          <Icon as={FaCalendarDay} color="blue.500" />
          <Text color="gray.800" fontWeight="medium">
            {parseInt(value)}
          </Text>
        </HStack>
      ) : (
        <HStack spacing={2}>
          <Icon as={FaCalendarDay} color="gray.400" />
          <Text color="gray.500">Day</Text>
        </HStack>
      )}
    </MenuButton>
    <MenuList maxH="200px" overflowY="auto" shadow="lg">
      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
        <MenuItem
          key={day}
          onClick={() => onChange(day.toString().padStart(2, "0"))}
          _hover={{ bg: "blue.50" }}
        >
          <Text fontWeight="medium">{day}</Text>
        </MenuItem>
      ))}
    </MenuList>
  </Menu>
);

const MonthSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const months = [
    { value: "01", label: "Jan" },
    { value: "02", label: "Feb" },
    { value: "03", label: "Mar" },
    { value: "04", label: "Apr" },
    { value: "05", label: "May" },
    { value: "06", label: "Jun" },
    { value: "07", label: "Jul" },
    { value: "08", label: "Aug" },
    { value: "09", label: "Sep" },
    { value: "10", label: "Oct" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Dec" },
  ];

  const selectedMonth = months.find((month) => month.value === value);

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<FaChevronDown />}
        w="100%"
        textAlign="left"
        fontWeight="normal"
        bg="white"
        border="1px solid"
        borderColor="gray.300"
        _hover={{ borderColor: "gray.400", shadow: "sm" }}
        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
        minH={{ base: "48px", md: "40px" }}
        fontSize={{ base: "16px", md: "14px" }}
      >
        {selectedMonth ? (
          <HStack spacing={2}>
            <Icon as={FaCalendarAlt} color="blue.500" />
            <Text color="gray.800" fontWeight="medium">
              {selectedMonth.label}
            </Text>
          </HStack>
        ) : (
          <HStack spacing={2}>
            <Icon as={FaCalendarAlt} color="gray.400" />
            <Text color="gray.500">Month</Text>
          </HStack>
        )}
      </MenuButton>
      <MenuList maxH="200px" overflowY="auto" shadow="lg">
        {months.map((month) => (
          <MenuItem
            key={month.value}
            onClick={() => onChange(month.value)}
            _hover={{ bg: "blue.50" }}
          >
            <Text fontWeight="medium">{month.label}</Text>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

const YearSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <Menu>
    <MenuButton
      as={Button}
      rightIcon={<FaChevronDown />}
      w="100%"
      textAlign="left"
      fontWeight="normal"
      bg="white"
      border="1px solid"
      borderColor="gray.300"
      _hover={{ borderColor: "gray.400", shadow: "sm" }}
      _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
      minH={{ base: "48px", md: "40px" }}
      fontSize={{ base: "16px", md: "14px" }}
    >
      {value ? (
        <HStack spacing={2}>
          <Icon as={FaClock} color="blue.500" />
          <Text color="gray.800" fontWeight="medium">
            {value}
          </Text>
        </HStack>
      ) : (
        <HStack spacing={2}>
          <Icon as={FaClock} color="gray.400" />
          <Text color="gray.500">Year</Text>
        </HStack>
      )}
    </MenuButton>
    <MenuList maxH="200px" overflowY="auto" shadow="lg">
      {Array.from(
        { length: 80 },
        (_, i) => new Date().getFullYear() - 16 - i
      ).map((year) => (
        <MenuItem
          key={year}
          onClick={() => onChange(year.toString())}
          _hover={{ bg: "blue.50" }}
        >
          <Text fontWeight="medium">{year}</Text>
        </MenuItem>
      ))}
    </MenuList>
  </Menu>
);

const steps = [
  { title: "Teacher Type" },
  { title: "Personal Info" },
  { title: "Teaching Experience" },
  { title: "Video Introduction" },
  { title: "Availability" },
  { title: "Review" },
];

interface TeacherApplicationData {
  // Step 0: Teacher Type
  teacherType: "community" | "professional" | "";

  // Step 1: Personal Info
  // 2.1 Basic Information
  displayName: string;
  videoPlayform: string;

  // Zoom specific fields
  zoomMeetingLink: string;
  zoomMeetingId: string;
  zoomPasscode: string;

  // Google Meet specific fields
  googleMeetLink: string;

  from: string; // Country of origin
  livingIn: string; // Current country  // 2.2 Private Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "";
  streetAddress: string;
  city: string;
  country: string;

  // 2.3 Language Skills
  nativeLanguage: string;
  otherLanguages: { language: string; level: string }[];

  // 2.4 Profile Photo
  profilePhoto: File | null;
  photoAgreement: boolean;

  // Step 2: Teaching Experience
  teachingExperience: string;
  education: string;
  certifications: string;
  specialties: string[];
  teachingStyle: string;

  // Step 3: Video Introduction
  videoFile: File | null;
  introText: string;

  // Step 4: Availability
  hourlyRate: number;
  availability: string[];
  timezone: string;

  // Step 5: Terms
  agreedToTerms: boolean;
}

const initialData: TeacherApplicationData = {
  teacherType: "",

  // Basic Information
  displayName: "",
  videoPlayform: "italki Classroom",

  // Zoom fields
  zoomMeetingLink: "",
  zoomMeetingId: "",
  zoomPasscode: "",

  // Google Meet fields
  googleMeetLink: "",

  from: "",
  livingIn: "", // Private Information
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  streetAddress: "",
  city: "",
  country: "",

  // Language Skills
  nativeLanguage: "",
  otherLanguages: [],

  // Profile Photo
  profilePhoto: null,
  photoAgreement: false,

  // Teaching Experience
  teachingExperience: "",
  education: "",
  certifications: "",
  specialties: [],
  teachingStyle: "",

  // Video Introduction
  videoFile: null,
  introText: "",

  // Availability
  hourlyRate: 15,
  availability: [],
  timezone: "",
  agreedToTerms: false,
};

const languageLevels = [
  {
    value: "native",
    label: "Native",
    description: "Your mother tongue or language learned from birth",
    color: "purple",
  },
  {
    value: "c2",
    label: "C2 - Proficient",
    description: "Can understand virtually everything heard or read with ease",
    color: "green",
  },
  {
    value: "c1",
    label: "C1 - Advanced",
    description:
      "Can express ideas fluently and spontaneously without searching",
    color: "blue",
  },
  {
    value: "b2",
    label: "B2 - Upper Intermediate",
    description:
      "Can interact with native speakers with fluency and naturalness",
    color: "teal",
  },
  {
    value: "b1",
    label: "B1 - Intermediate",
    description: "Can deal with most situations when traveling or at work",
    color: "orange",
  },
  {
    value: "a2",
    label: "A2 - Elementary",
    description: "Can communicate in simple, routine tasks and familiar topics",
    color: "yellow",
  },
  {
    value: "a1",
    label: "A1 - Beginner",
    description: "Can understand and use basic phrases and expressions",
    color: "red",
  },
];

const commonLanguages = [
  { name: "English", flag: "🇺🇸", code: "us" },
  { name: "Swahili", flag: "��", code: "tz" },
  { name: "Arabic", flag: "🇸🇦", code: "sa" },
  { name: "French", flag: "🇫🇷", code: "fr" },
  { name: "Spanish", flag: "🇪🇸", code: "es" },
  { name: "Mandarin", flag: "🇨🇳", code: "cn" },
  { name: "Portuguese", flag: "🇧🇷", code: "br" },
  { name: "German", flag: "🇩🇪", code: "de" },
  { name: "Italian", flag: "🇮🇹", code: "it" },
  { name: "Japanese", flag: "🇯🇵", code: "jp" },
  { name: "Korean", flag: "🇰🇷", code: "kr" },
  { name: "Russian", flag: "🇷🇺", code: "ru" },
  { name: "Hindi", flag: "🇮🇳", code: "in" },
  { name: "Other", flag: "🌐", code: "world" },
];

const specialties = [
  "Beginner Swahili",
  "Business Swahili",
  "Conversational Practice",
  "Grammar & Structure",
  "Cultural Context",
  "Travel Swahili",
  "Academic Swahili",
  "Kids & Teens",
  "Exam Preparation",
];

const availabilitySlots = [
  "Monday Morning",
  "Monday Afternoon",
  "Monday Evening",
  "Tuesday Morning",
  "Tuesday Afternoon",
  "Tuesday Evening",
  "Wednesday Morning",
  "Wednesday Afternoon",
  "Wednesday Evening",
  "Thursday Morning",
  "Thursday Afternoon",
  "Thursday Evening",
  "Friday Morning",
  "Friday Afternoon",
  "Friday Evening",
  "Saturday Morning",
  "Saturday Afternoon",
  "Saturday Evening",
  "Sunday Morning",
  "Sunday Afternoon",
  "Sunday Evening",
];

export default function TeacherApplication() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [data, setData] = useState<TeacherApplicationData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const updateData = (
    field: keyof TeacherApplicationData,
    value:
      | string
      | number
      | boolean
      | string[]
      | File
      | null
      | { language: string; level: string }[]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Teacher Type
        if (!data.teacherType)
          newErrors.teacherType = "Please select a teacher type";
        break;
      case 1: // Personal Info
        // Basic Information
        if (!data.displayName)
          newErrors.displayName = "Display name is required";
        if (!data.from) newErrors.from = "Country of origin is required";
        if (!data.livingIn) newErrors.livingIn = "Current country is required";

        // Private Information
        if (!data.firstName) newErrors.firstName = "First name is required";
        if (!data.lastName) newErrors.lastName = "Last name is required";
        if (!data.dateOfBirth)
          newErrors.dateOfBirth = "Date of birth is required";
        if (!data.gender) newErrors.gender = "Gender is required";

        // Language Skills
        if (!data.nativeLanguage)
          newErrors.nativeLanguage = "Native language is required";

        // Profile Photo
        if (!data.profilePhoto)
          newErrors.profilePhoto = "Profile photo is required";
        if (!data.photoAgreement)
          newErrors.photoAgreement = "You must agree to the photo requirements";
        break;
      case 2: // Teaching Experience
        if (!data.teachingExperience)
          newErrors.teachingExperience = "Teaching experience is required";
        if (!data.education)
          newErrors.education = "Education background is required";
        if (data.specialties.length === 0)
          newErrors.specialties = "Select at least one specialty";
        break;
      case 3: // Video Introduction
        if (!data.videoFile && !data.introText) {
          newErrors.introText =
            "Either upload a video or provide written introduction";
        }
        break;
      case 4: // Availability
        if (data.hourlyRate < 10)
          newErrors.hourlyRate = "Minimum rate is $10/hour";
        if (data.availability.length === 0)
          newErrors.availability = "Select at least one availability slot";
        break;
      case 5: // Review
        if (!data.agreedToTerms)
          newErrors.agreedToTerms = "You must agree to the terms";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };

  const submitApplication = async () => {
    if (!validateStep(activeStep)) return;

    setIsSubmitting(true);
    try {
      // TODO: Submit to backend API
      console.log("Submitting application:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to success page or dashboard
      navigate("/teacher-application-success");
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={8}>
            <VStack spacing={4} textAlign="center" py={4}>
              <Box>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={2}>
                  Choose Your Teaching Path
                </Text>
                <Text fontSize="lg" color="gray.600">
                  On SalvatoreLingo there are two types of teachers. Which one
                  are you?
                </Text>
              </Box>
            </VStack>

            <FormControl isInvalid={!!errors.teacherType}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                {/* Professional Teacher */}
                <Box
                  position="relative"
                  p={8}
                  borderWidth={3}
                  borderColor={
                    data.teacherType === "professional"
                      ? "blue.400"
                      : "gray.200"
                  }
                  borderRadius="2xl"
                  cursor="pointer"
                  bg={
                    data.teacherType === "professional"
                      ? "linear-gradient(135deg, #EBF8FF 0%, #BEE3F8 100%)"
                      : "white"
                  }
                  onClick={() => updateData("teacherType", "professional")}
                  _hover={{
                    borderColor: "blue.300",
                    transform: "translateY(-4px)",
                    boxShadow: "xl",
                  }}
                  transition="all 0.3s ease"
                  boxShadow={
                    data.teacherType === "professional"
                      ? "0 10px 25px -5px rgba(59, 130, 246, 0.3)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  }
                  overflow="hidden"
                >
                  {data.teacherType === "professional" && (
                    <Box
                      position="absolute"
                      top={0}
                      right={0}
                      bg="blue.500"
                      color="white"
                      px={3}
                      py={1}
                      borderBottomLeftRadius="lg"
                      fontSize="sm"
                      fontWeight="bold"
                    >
                      <FaCheckCircle
                        size="12px"
                        style={{ marginRight: "4px" }}
                      />
                      Selected
                    </Box>
                  )}

                  <VStack spacing={6} align="start">
                    <HStack spacing={4}>
                      <Box
                        w={8}
                        h={8}
                        borderRadius="full"
                        bg={
                          data.teacherType === "professional"
                            ? "blue.500"
                            : "gray.100"
                        }
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        transition="all 0.2s"
                      >
                        <FaGraduationCap
                          size="18px"
                          color={
                            data.teacherType === "professional"
                              ? "white"
                              : "#A0AEC0"
                          }
                        />
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" fontSize="xl" color="gray.800">
                          Professional Teacher
                        </Text>
                        <Text
                          fontSize="md"
                          color="blue.600"
                          fontWeight="medium"
                        >
                          Certified & Experienced
                        </Text>
                      </VStack>
                    </HStack>

                    <VStack spacing={5} align="start" w="full">
                      <Box>
                        <HStack mb={2}>
                          <FaUser size="14px" color="#4A5568" />
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="gray.700"
                          >
                            Background
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                          Native or near-native speaker who is professionally
                          certified or experienced in teaching a language as a
                          foreign or second language. 18 years or older.
                        </Text>
                      </Box>

                      <Box>
                        <HStack mb={2}>
                          <FaCertificate size="14px" color="#4A5568" />
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="gray.700"
                          >
                            Credentials
                          </Text>
                          <Text
                            fontSize="xs"
                            color="blue.500"
                            textDecoration="underline"
                            cursor="pointer"
                            _hover={{ color: "blue.600" }}
                          >
                            Learn more
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                          Scanned documents showing your professional training
                          or experience. Example: Accredited certification in
                          language teaching or documents showing suitable
                          experience as a professional language teacher.
                        </Text>
                      </Box>

                      <Box>
                        <HStack mb={2}>
                          <FaVideo size="14px" color="#4A5568" />
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="gray.700"
                          >
                            Video Introduction
                          </Text>
                          <Text
                            fontSize="xs"
                            color="blue.500"
                            textDecoration="underline"
                            cursor="pointer"
                            _hover={{ color: "blue.600" }}
                          >
                            Learn more
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                          1-3 minute video introduction.
                        </Text>
                      </Box>

                      <Box>
                        <HStack mb={2}>
                          <FaDollarSign size="14px" color="#4A5568" />
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="gray.700"
                          >
                            Earning Potential
                          </Text>
                        </HStack>
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          lineHeight="1.6"
                          fontWeight="medium"
                        >
                          Set your own price.
                        </Text>
                      </Box>
                    </VStack>
                  </VStack>
                </Box>

                {/* Community Tutor */}
                <Box
                  position="relative"
                  p={8}
                  borderWidth={3}
                  borderColor={
                    data.teacherType === "community" ? "green.400" : "gray.200"
                  }
                  borderRadius="2xl"
                  cursor="pointer"
                  bg={
                    data.teacherType === "community"
                      ? "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)"
                      : "white"
                  }
                  onClick={() => updateData("teacherType", "community")}
                  _hover={{
                    borderColor: "green.300",
                    transform: "translateY(-4px)",
                    boxShadow: "xl",
                  }}
                  transition="all 0.3s ease"
                  boxShadow={
                    data.teacherType === "community"
                      ? "0 10px 25px -5px rgba(34, 197, 94, 0.3)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  }
                  overflow="hidden"
                >
                  {data.teacherType === "community" && (
                    <Box
                      position="absolute"
                      top={0}
                      right={0}
                      bg="green.500"
                      color="white"
                      px={3}
                      py={1}
                      borderBottomLeftRadius="lg"
                      fontSize="sm"
                      fontWeight="bold"
                    >
                      <FaCheckCircle
                        size="12px"
                        style={{ marginRight: "4px" }}
                      />
                      Selected
                    </Box>
                  )}

                  <VStack spacing={6} align="start">
                    <HStack spacing={4}>
                      <Box
                        w={8}
                        h={8}
                        borderRadius="full"
                        bg={
                          data.teacherType === "community"
                            ? "green.500"
                            : "gray.100"
                        }
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        transition="all 0.2s"
                      >
                        <FaUsers
                          size="18px"
                          color={
                            data.teacherType === "community"
                              ? "white"
                              : "#A0AEC0"
                          }
                        />
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" fontSize="xl" color="gray.800">
                          Community Tutor
                        </Text>
                        <Text
                          fontSize="md"
                          color="green.600"
                          fontWeight="medium"
                        >
                          Informal & Conversational
                        </Text>
                      </VStack>
                    </HStack>

                    <VStack spacing={5} align="start" w="full">
                      <Box>
                        <HStack mb={2}>
                          <FaUser size="14px" color="#4A5568" />
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="gray.700"
                          >
                            Background
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                          Native or near-native speaker that enjoys teaching
                          informally. 18 years or older.
                        </Text>
                      </Box>

                      <Box>
                        <HStack mb={2}>
                          <FaCertificate size="14px" color="#4A5568" />
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="gray.700"
                          >
                            Credentials
                          </Text>
                          <Text
                            fontSize="xs"
                            color="blue.500"
                            textDecoration="underline"
                            cursor="pointer"
                            _hover={{ color: "blue.600" }}
                          >
                            Learn more
                          </Text>
                        </HStack>
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          lineHeight="1.6"
                          fontWeight="medium"
                        >
                          None.
                        </Text>
                      </Box>

                      <Box>
                        <HStack mb={2}>
                          <FaVideo size="14px" color="#4A5568" />
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="gray.700"
                          >
                            Video Introduction
                          </Text>
                          <Text
                            fontSize="xs"
                            color="blue.500"
                            textDecoration="underline"
                            cursor="pointer"
                            _hover={{ color: "blue.600" }}
                          >
                            Learn more
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                          1-3 minute video introduction.
                        </Text>
                      </Box>

                      <Box>
                        <HStack mb={2}>
                          <FaDollarSign size="14px" color="#4A5568" />
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="gray.700"
                          >
                            Earning Potential
                          </Text>
                        </HStack>
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          lineHeight="1.6"
                          fontWeight="medium"
                        >
                          Set your own price.
                        </Text>
                      </Box>
                    </VStack>
                  </VStack>
                </Box>
              </SimpleGrid>
              <FormErrorMessage>{errors.teacherType}</FormErrorMessage>
            </FormControl>
          </Stack>
        );

      case 1:
        return (
          <VStack spacing={8} align="stretch">
            {/* 2.1 Basic Information */}
            <Box>
              <VStack spacing={4} align="stretch">
                <Text fontSize="xl" fontWeight="bold" color="gray.800">
                  2.1 Basic Information
                </Text>

                <FormControl isInvalid={!!errors.displayName}>
                  <FormLabel>Display Name</FormLabel>
                  <Input
                    placeholder="Ayub Abdi"
                    value={data.displayName}
                    onChange={(e) => updateData("displayName", e.target.value)}
                    size={{ base: "lg", md: "md" }}
                    fontSize={{ base: "16px", md: "14px" }}
                  />
                  <FormErrorMessage>{errors.displayName}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Video Platform</FormLabel>
                  <VStack spacing={3} align="stretch">
                    {/* SalvatoreLingo Classroom */}
                    <Box
                      p={4}
                      borderWidth={2}
                      borderColor={
                        data.videoPlayform === "italki Classroom"
                          ? "blue.500"
                          : "gray.200"
                      }
                      borderRadius="md"
                      cursor="pointer"
                      bg={
                        data.videoPlayform === "italki Classroom"
                          ? "blue.50"
                          : "white"
                      }
                      onClick={() =>
                        updateData("videoPlayform", "italki Classroom")
                      }
                    >
                      <VStack align="start" spacing={2}>
                        <HStack>
                          <Switch
                            isChecked={
                              data.videoPlayform === "italki Classroom"
                            }
                            onChange={() =>
                              updateData("videoPlayform", "italki Classroom")
                            }
                          />
                          <Text fontWeight="semibold">
                            SalvatoreLingo Classroom
                          </Text>
                          <Badge colorScheme="blue">Default</Badge>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          SalvatoreLingo Classroom is our own integrated
                          platform for hosting classes. Students can choose it
                          as video platform when they book lessons.
                        </Text>
                      </VStack>
                    </Box>

                    {/* Zoom */}
                    <Box
                      p={4}
                      borderWidth={2}
                      borderColor={
                        data.videoPlayform === "zoom" ? "blue.500" : "gray.200"
                      }
                      borderRadius="md"
                      cursor="pointer"
                      bg={data.videoPlayform === "zoom" ? "blue.50" : "white"}
                      onClick={() => updateData("videoPlayform", "zoom")}
                    >
                      <VStack align="start" spacing={3}>
                        <HStack>
                          <Switch
                            isChecked={data.videoPlayform === "zoom"}
                            onChange={() => updateData("videoPlayform", "zoom")}
                          />
                          <Text fontWeight="semibold">Zoom</Text>
                        </HStack>
                        {data.videoPlayform === "zoom" && (
                          <VStack
                            spacing={3}
                            w="full"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Input
                              placeholder="Enter Zoom meeting link"
                              value={data.zoomMeetingLink}
                              onChange={(e) =>
                                updateData("zoomMeetingLink", e.target.value)
                              }
                            />
                            <SimpleGrid columns={2} spacing={3} w="full">
                              <Input
                                placeholder="Meeting ID"
                                value={data.zoomMeetingId}
                                onChange={(e) =>
                                  updateData("zoomMeetingId", e.target.value)
                                }
                              />
                              <Input
                                placeholder="Passcode"
                                value={data.zoomPasscode}
                                onChange={(e) =>
                                  updateData("zoomPasscode", e.target.value)
                                }
                              />
                            </SimpleGrid>
                          </VStack>
                        )}
                      </VStack>
                    </Box>

                    {/* Google Meet */}
                    <Box
                      p={4}
                      borderWidth={2}
                      borderColor={
                        data.videoPlayform === "google-meet"
                          ? "blue.500"
                          : "gray.200"
                      }
                      borderRadius="md"
                      cursor="pointer"
                      bg={
                        data.videoPlayform === "google-meet"
                          ? "blue.50"
                          : "white"
                      }
                      onClick={() => updateData("videoPlayform", "google-meet")}
                    >
                      <VStack align="start" spacing={3}>
                        <HStack>
                          <Switch
                            isChecked={data.videoPlayform === "google-meet"}
                            onChange={() =>
                              updateData("videoPlayform", "google-meet")
                            }
                          />
                          <Text fontWeight="semibold">Google Meet</Text>
                        </HStack>
                        {data.videoPlayform === "google-meet" && (
                          <Input
                            placeholder="Enter Google Meet link"
                            value={data.googleMeetLink}
                            onChange={(e) =>
                              updateData("googleMeetLink", e.target.value)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </VStack>
                    </Box>
                  </VStack>
                </FormControl>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isInvalid={!!errors.from}>
                    <FormLabel>
                      From
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Note: You can&apos;t change key information such as
                        where you are from once you have finished onboarding.
                      </Text>
                    </FormLabel>
                    <CountrySelect
                      placeholder="Select your country of origin"
                      value={data.from}
                      onChange={(value) => updateData("from", value)}
                    />
                    <FormErrorMessage>{errors.from}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.livingIn}>
                    <FormLabel>Living in</FormLabel>
                    <CountrySelect
                      placeholder="Select where you currently live"
                      value={data.livingIn}
                      onChange={(value) => updateData("livingIn", value)}
                    />
                    <FormErrorMessage>{errors.livingIn}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </Box>

            <Divider />

            {/* 2.2 Private Information */}
            <Box>
              <VStack spacing={4} align="stretch">
                <VStack spacing={2} align="start">
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    2.2 Private
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Please make sure your information is identical to your
                    government-issued ID.{" "}
                    <Link color="blue.500" href="#" textDecoration="underline">
                      Learn more
                    </Link>
                  </Text>
                  <Text fontSize="xs" color="orange.500">
                    Note: You can&apos;t change key information such as your
                    name, birthday, and gender once you have finished
                    onboarding.
                  </Text>
                </VStack>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isInvalid={!!errors.firstName}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      placeholder="AYUB"
                      value={data.firstName}
                      onChange={(e) => updateData("firstName", e.target.value)}
                      size={{ base: "lg", md: "md" }}
                      fontSize={{ base: "16px", md: "14px" }}
                    />
                    <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.lastName}>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      placeholder="ABDI"
                      value={data.lastName}
                      onChange={(e) => updateData("lastName", e.target.value)}
                      size={{ base: "lg", md: "md" }}
                      fontSize={{ base: "16px", md: "14px" }}
                    />
                    <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.dateOfBirth}>
                    <FormLabel
                      color="gray.700"
                      fontWeight="semibold"
                      fontSize="md"
                      mb={3}
                    >
                      <HStack spacing={2}>
                        <Icon as={FaBirthdayCake} color="blue.500" />
                        <Text>Birthday</Text>
                      </HStack>
                    </FormLabel>
                    <Card
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="lg"
                    >
                      <CardBody p={4}>
                        <SimpleGrid
                          columns={{ base: 1, sm: 3 }}
                          spacing={{ base: 3, sm: 4 }}
                        >
                          <Box>
                            <VStack spacing={2} align="stretch">
                              <HStack spacing={2}>
                                <Icon
                                  as={FaCalendarDay}
                                  color="blue.500"
                                  boxSize={3}
                                />
                                <Text
                                  fontSize="xs"
                                  color="gray.600"
                                  fontWeight="semibold"
                                  textTransform="uppercase"
                                >
                                  Day
                                </Text>
                              </HStack>
                              <DaySelect
                                value={data.dateOfBirth.split("-")[2] || ""}
                                onChange={(value) => {
                                  const [year, month] =
                                    data.dateOfBirth.split("-");
                                  const newDate = `${year || ""}-${
                                    month || ""
                                  }-${value}`;
                                  updateData("dateOfBirth", newDate);
                                }}
                              />
                            </VStack>
                          </Box>

                          <Box>
                            <VStack spacing={2} align="stretch">
                              <HStack spacing={2}>
                                <Icon
                                  as={FaCalendarAlt}
                                  color="blue.500"
                                  boxSize={3}
                                />
                                <Text
                                  fontSize="xs"
                                  color="gray.600"
                                  fontWeight="semibold"
                                  textTransform="uppercase"
                                >
                                  Month
                                </Text>
                              </HStack>
                              <MonthSelect
                                value={data.dateOfBirth.split("-")[1] || ""}
                                onChange={(value) => {
                                  const [year, , day] =
                                    data.dateOfBirth.split("-");
                                  const newDate = `${year || ""}-${value}-${
                                    day || ""
                                  }`;
                                  updateData("dateOfBirth", newDate);
                                }}
                              />
                            </VStack>
                          </Box>

                          <Box>
                            <VStack spacing={2} align="stretch">
                              <HStack spacing={2}>
                                <Icon
                                  as={FaClock}
                                  color="blue.500"
                                  boxSize={3}
                                />
                                <Text
                                  fontSize="xs"
                                  color="gray.600"
                                  fontWeight="semibold"
                                  textTransform="uppercase"
                                >
                                  Year
                                </Text>
                              </HStack>
                              <YearSelect
                                value={data.dateOfBirth.split("-")[0] || ""}
                                onChange={(value) => {
                                  const [, month, day] =
                                    data.dateOfBirth.split("-");
                                  const newDate = `${value}-${month || ""}-${
                                    day || ""
                                  }`;
                                  updateData("dateOfBirth", newDate);
                                }}
                              />
                            </VStack>
                          </Box>
                        </SimpleGrid>

                        {data.dateOfBirth &&
                          data.dateOfBirth.split("-").every((part) => part) && (
                            <Box
                              mt={4}
                              p={3}
                              bg="blue.50"
                              borderRadius="md"
                              border="1px solid"
                              borderColor="blue.200"
                            >
                              <HStack justify="center" spacing={2}>
                                <Icon as={FaBirthdayCake} color="blue.600" />
                                <Text
                                  fontSize="sm"
                                  color="blue.700"
                                  fontWeight="medium"
                                >
                                  Selected:{" "}
                                  {new Date(
                                    data.dateOfBirth
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </Text>
                              </HStack>
                            </Box>
                          )}
                      </CardBody>
                    </Card>
                    <FormErrorMessage>{errors.dateOfBirth}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.gender}>
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup
                      value={data.gender}
                      onChange={(value) => updateData("gender", value)}
                    >
                      <HStack spacing={6}>
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                        <Radio value="other">Other</Radio>
                      </HStack>
                    </RadioGroup>
                    <FormErrorMessage>{errors.gender}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel>Street Address</FormLabel>
                  <Input
                    placeholder="Jumbi"
                    value={data.streetAddress}
                    onChange={(e) =>
                      updateData("streetAddress", e.target.value)
                    }
                  />
                </FormControl>
              </VStack>
            </Box>

            <Divider />

            {/* 2.3 Language Skills */}
            <Box bg="gray.50" p={{ base: 4, md: 6 }} borderRadius="xl">
              <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                <VStack spacing={3} align="start">
                  <HStack spacing={{ base: 2, md: 3 }}>
                    <Icon
                      as={FaGraduationCap}
                      color="blue.600"
                      boxSize={{ base: 5, md: 6 }}
                    />
                    <Text
                      fontSize={{ base: "lg", md: "xl" }}
                      fontWeight="bold"
                      color="gray.800"
                    >
                      2.3 Language Skills
                    </Text>
                  </HStack>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    color="gray.700"
                    lineHeight={1.6}
                  >
                    Please check that your listed languages and levels are
                    accurate. You will be able to set any language that is
                    listed as native or C2 as a teaching language.
                    SalvatoreLingo uses the Common European Framework of
                    Reference for Languages (CEFR) for displaying language
                    levels.{" "}
                    <Link
                      color="blue.600"
                      href="#"
                      textDecoration="underline"
                      fontWeight="medium"
                    >
                      Learn more
                    </Link>
                  </Text>
                </VStack>

                <Card bg="white" borderRadius="lg">
                  <CardBody p={{ base: 4, md: 6 }}>
                    <FormControl isInvalid={!!errors.nativeLanguage}>
                      <VStack spacing={4} align="stretch">
                        <HStack spacing={3} align="center">
                          <Icon as={FaStar} color="blue.500" boxSize={6} />
                          <Box>
                            <Text
                              fontSize={{ base: "md", md: "lg" }}
                              fontWeight="bold"
                              color="gray.800"
                              mb={1}
                            >
                              Native Language
                            </Text>
                            <Text
                              fontSize={{ base: "xs", md: "sm" }}
                              color="gray.600"
                            >
                              Your mother tongue or first language
                            </Text>
                          </Box>
                        </HStack>
                        <LanguageSelect
                          placeholder="Select your native language"
                          value={data.nativeLanguage}
                          onChange={(value) =>
                            updateData("nativeLanguage", value)
                          }
                        />
                        <FormErrorMessage>
                          {errors.nativeLanguage}
                        </FormErrorMessage>
                      </VStack>
                    </FormControl>
                  </CardBody>
                </Card>

                <Card bg="white" borderRadius="lg">
                  <CardBody p={{ base: 4, md: 6 }}>
                    <VStack spacing={{ base: 4, md: 5 }} align="stretch">
                      {/* Header Section */}
                      <VStack spacing={3} align="stretch">
                        <HStack spacing={3} align="center">
                          <Icon as={FaComments} color="green.500" boxSize={6} />
                          <Box flex={1}>
                            <Text
                              fontSize={{ base: "md", md: "lg" }}
                              fontWeight="bold"
                              color="gray.800"
                              mb={1}
                            >
                              Additional Languages
                            </Text>
                            <Text
                              fontSize={{ base: "xs", md: "sm" }}
                              color="gray.600"
                            >
                              Add other languages you speak and their
                              proficiency levels
                            </Text>
                          </Box>
                        </HStack>
                        <Button
                          size={{ base: "md", md: "sm" }}
                          leftIcon={<FaPlus />}
                          colorScheme="blue"
                          variant="solid"
                          onClick={() => {
                            updateData("otherLanguages", [
                              ...data.otherLanguages,
                              { language: "", level: "" },
                            ]);
                          }}
                          alignSelf={{ base: "stretch", sm: "flex-start" }}
                          borderRadius="full"
                          minH={{ base: "48px", md: "40px" }}
                          fontWeight="semibold"
                        >
                          Add Language
                        </Button>
                      </VStack>

                      {data.otherLanguages.length === 0 ? (
                        <Box
                          bg="gray.100"
                          borderRadius="xl"
                          p={{ base: 6, md: 8 }}
                          textAlign="center"
                        >
                          <VStack spacing={3}>
                            <Box bg="gray.200" p={3} borderRadius="full">
                              <Icon as={FaGlobe} color="gray.500" boxSize={8} />
                            </Box>
                            <VStack spacing={1}>
                              <Text
                                fontWeight="semibold"
                                fontSize={{ base: "sm", md: "md" }}
                                color="gray.700"
                              >
                                No additional languages yet
                              </Text>
                              <Text
                                color="gray.600"
                                fontSize={{ base: "xs", md: "sm" }}
                              >
                                Click &quot;Add Language&quot; above to showcase
                                your multilingual abilities
                              </Text>
                            </VStack>
                          </VStack>
                        </Box>
                      ) : (
                        <VStack spacing={3} align="stretch">
                          {data.otherLanguages.map((lang, index) => (
                            <Card key={index} bg="gray.50" borderRadius="lg">
                              <CardBody p={{ base: 4, md: 5 }}>
                                <VStack
                                  spacing={{ base: 4, md: 0 }}
                                  align="stretch"
                                >
                                  {/* Header with language number and remove button */}
                                  <HStack
                                    justify="space-between"
                                    align="center"
                                    mb={{ base: 2, md: 3 }}
                                  >
                                    <HStack spacing={2}>
                                      <Badge
                                        colorScheme="blue"
                                        size="sm"
                                        borderRadius="full"
                                        px={2}
                                      >
                                        #{index + 1}
                                      </Badge>
                                      <Text
                                        fontSize={{ base: "sm", md: "md" }}
                                        fontWeight="semibold"
                                        color="gray.700"
                                      >
                                        Additional Language
                                      </Text>
                                    </HStack>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      colorScheme="red"
                                      onClick={() => {
                                        const newLanguages =
                                          data.otherLanguages.filter(
                                            (_, i) => i !== index
                                          );
                                        updateData(
                                          "otherLanguages",
                                          newLanguages
                                        );
                                      }}
                                      aria-label="Remove language"
                                      borderRadius="full"
                                      minW="auto"
                                      h="32px"
                                      w="32px"
                                    >
                                      <FaTimes size="14px" />
                                    </Button>
                                  </HStack>

                                  {/* Language and proficiency fields */}
                                  <SimpleGrid
                                    columns={{ base: 1, md: 2 }}
                                    spacing={{ base: 4, md: 4 }}
                                  >
                                    <Box>
                                      <FormLabel
                                        fontSize={{ base: "sm", md: "sm" }}
                                        color="gray.700"
                                        fontWeight="semibold"
                                        mb={2}
                                      >
                                        <HStack spacing={2}>
                                          <Icon
                                            as={FaLanguage}
                                            color="blue.500"
                                            boxSize={4}
                                          />
                                          <Text>Language</Text>
                                        </HStack>
                                      </FormLabel>
                                      <LanguageSelect
                                        placeholder="Select language"
                                        value={lang.language}
                                        onChange={(value) => {
                                          const newLanguages = [
                                            ...data.otherLanguages,
                                          ];
                                          newLanguages[index] = {
                                            ...lang,
                                            language: value,
                                          };
                                          updateData(
                                            "otherLanguages",
                                            newLanguages
                                          );
                                        }}
                                      />
                                    </Box>
                                    <Box>
                                      <FormLabel
                                        fontSize={{ base: "sm", md: "sm" }}
                                        color="gray.700"
                                        fontWeight="semibold"
                                        mb={2}
                                      >
                                        <HStack spacing={2}>
                                          <Icon
                                            as={FaChartBar}
                                            color="green.500"
                                            boxSize={4}
                                          />
                                          <Text>Proficiency Level</Text>
                                        </HStack>
                                      </FormLabel>
                                      <ProficiencySelect
                                        placeholder="Select proficiency level"
                                        value={lang.level}
                                        onChange={(value) => {
                                          const newLanguages = [
                                            ...data.otherLanguages,
                                          ];
                                          newLanguages[index] = {
                                            ...lang,
                                            level: value,
                                          };
                                          updateData(
                                            "otherLanguages",
                                            newLanguages
                                          );
                                        }}
                                      />
                                    </Box>
                                  </SimpleGrid>
                                </VStack>
                              </CardBody>
                            </Card>
                          ))}
                        </VStack>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </Box>

            <Divider />

            {/* 2.4 Profile Photo */}
            <Card bg="white" borderRadius="xl">
              <CardBody p={{ base: 5, md: 6 }}>
                <VStack spacing={{ base: 5, md: 6 }} align="stretch">
                  {/* Header */}
                  <HStack spacing={3} align="center">
                    <Icon as={FaCamera} color="purple.500" boxSize={6} />
                    <Box>
                      <Text
                        fontSize={{ base: "lg", md: "xl" }}
                        fontWeight="bold"
                        color="gray.800"
                      >
                        2.4 My Teacher Profile Photo
                      </Text>
                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        color="gray.600"
                      >
                        Upload a professional photo that represents you
                      </Text>
                    </Box>
                  </HStack>

                  {/* Photo Upload Section */}
                  <SimpleGrid
                    columns={{ base: 1, lg: 2 }}
                    spacing={{ base: 5, md: 6 }}
                  >
                    {/* Preview Section */}
                    <VStack spacing={4} align="center">
                      <Text
                        fontWeight="semibold"
                        color="gray.700"
                        alignSelf="flex-start"
                      >
                        Photo Preview
                      </Text>

                      {/* Circle Preview */}
                      <Box position="relative">
                        <Box
                          w={{ base: "180px", md: "200px" }}
                          h={{ base: "180px", md: "200px" }}
                          borderRadius="full"
                          border="3px solid"
                          borderColor={
                            data.profilePhoto ? "green.300" : "gray.300"
                          }
                          overflow="hidden"
                          bg="gray.50"
                          position="relative"
                        >
                          {data.profilePhoto ? (
                            <Image
                              src={URL.createObjectURL(data.profilePhoto)}
                              alt="Profile preview"
                              w="100%"
                              h="100%"
                              objectFit="cover"
                            />
                          ) : (
                            <VStack
                              spacing={3}
                              justify="center"
                              h="100%"
                              color="gray.400"
                            >
                              <Icon as={FaUser} boxSize={12} />
                              <Text fontSize="sm" textAlign="center" px={4}>
                                Circle Preview
                              </Text>
                            </VStack>
                          )}
                        </Box>
                      </Box>
                    </VStack>

                    {/* Upload Section */}
                    <VStack spacing={4} align="stretch">
                      <Text fontWeight="semibold" color="gray.700">
                        Upload Requirements
                      </Text>

                      {/* Upload Area */}
                      <Box
                        p={{ base: 6, md: 8 }}
                        borderWidth={2}
                        borderColor={
                          data.profilePhoto ? "green.200" : "gray.200"
                        }
                        borderRadius="xl"
                        borderStyle="dashed"
                        textAlign="center"
                        bg={data.profilePhoto ? "green.50" : "gray.50"}
                        transition="all 0.2s"
                        _hover={{ borderColor: "blue.300", bg: "blue.50" }}
                      >
                        <VStack spacing={4}>
                          <Icon
                            as={data.profilePhoto ? FaCheckCircle : FaUpload}
                            boxSize={12}
                            color={data.profilePhoto ? "green.500" : "gray.400"}
                          />
                          <VStack spacing={2}>
                            <Text
                              fontWeight="semibold"
                              color={
                                data.profilePhoto ? "green.700" : "gray.700"
                              }
                            >
                              {data.profilePhoto
                                ? "Photo Uploaded!"
                                : "Upload Your Photo"}
                            </Text>
                            {data.profilePhoto && (
                              <Text
                                fontSize="sm"
                                color="green.600"
                                fontWeight="medium"
                              >
                                {data.profilePhoto.name}
                              </Text>
                            )}
                          </VStack>

                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              updateData("profilePhoto", file);
                            }}
                            display="none"
                            id="profile-photo-upload"
                          />

                          <Button
                            as="label"
                            htmlFor="profile-photo-upload"
                            colorScheme={data.profilePhoto ? "green" : "blue"}
                            variant={data.profilePhoto ? "outline" : "solid"}
                            cursor="pointer"
                            size={{ base: "md", md: "lg" }}
                            minH={{ base: "48px", md: "auto" }}
                          >
                            {data.profilePhoto
                              ? "Change Photo"
                              : "Choose Photo"}
                          </Button>
                        </VStack>
                      </Box>

                      {/* Requirements List */}
                      <Card
                        bg="blue.50"
                        border="1px solid"
                        borderColor="blue.200"
                      >
                        <CardBody p={4}>
                          <VStack spacing={3} align="start">
                            <HStack spacing={2}>
                              <Icon as={FaImage} color="blue.500" boxSize={4} />
                              <Text
                                fontWeight="semibold"
                                color="blue.700"
                                fontSize="sm"
                              >
                                Photo Requirements
                              </Text>
                            </HStack>
                            <VStack
                              spacing={1}
                              align="start"
                              fontSize="xs"
                              color="gray.600"
                            >
                              <Text>• Minimum 250×250 pixels resolution</Text>
                              <Text>• JPG, PNG, or BMP format only</Text>
                              <Text>• Maximum file size: 2MB</Text>
                              <Text>
                                • Clear, well-lit, professional appearance
                              </Text>
                              <Link
                                color="blue.600"
                                textDecoration="underline"
                                fontWeight="medium"
                              >
                                View detailed requirements →
                              </Link>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    </VStack>
                  </SimpleGrid>

                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <VStack spacing={2} align="start" fontSize="sm">
                      <Text fontWeight="semibold">
                        Your photo has to respect the following characteristics:
                      </Text>
                      <VStack spacing={1} align="start" pl={4}>
                        <Text>• does not show other people</Text>
                        <Text>• is not too close or too far away</Text>
                        <Text>• shows my eyes and face clearly</Text>
                        <Text>• is clear and has good lighting</Text>
                        <Text>• is friendly and personable</Text>
                      </VStack>
                    </VStack>
                  </Alert>

                  <FormControl isInvalid={!!errors.photoAgreement}>
                    <Checkbox
                      isChecked={data.photoAgreement}
                      onChange={(e) =>
                        updateData("photoAgreement", e.target.checked)
                      }
                    >
                      <Text fontSize="sm">
                        I&apos;m aware that if my profile photo does not respect
                        the listed characteristics, my application to become a
                        teacher on SalvatoreLingo could be rejected.
                      </Text>
                    </Checkbox>
                    <FormErrorMessage>{errors.photoAgreement}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        );

      case 2:
        return (
          <Stack spacing={6}>
            <FormControl isInvalid={!!errors.teachingExperience}>
              <FormLabel>Teaching Experience</FormLabel>
              <Textarea
                placeholder="Describe your teaching experience, including years of experience, age groups taught, and teaching environments..."
                value={data.teachingExperience}
                onChange={(e) =>
                  updateData("teachingExperience", e.target.value)
                }
                rows={4}
                fontSize={{ base: "16px", md: "14px" }}
                size={{ base: "lg", md: "md" }}
              />
              <FormErrorMessage>{errors.teachingExperience}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.education}>
              <FormLabel>Education Background</FormLabel>
              <Textarea
                placeholder="Your educational qualifications, degrees, and relevant training..."
                value={data.education}
                onChange={(e) => updateData("education", e.target.value)}
                rows={3}
              />
              <FormErrorMessage>{errors.education}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Certifications (Optional)</FormLabel>
              <Textarea
                placeholder="Any teaching certifications, language certificates, or professional qualifications..."
                value={data.certifications}
                onChange={(e) => updateData("certifications", e.target.value)}
                rows={3}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.specialties}>
              <FormLabel>Teaching Specialties</FormLabel>
              <Text fontSize="sm" color="gray.600" mb={3}>
                Select all areas you&apos;re comfortable teaching:
              </Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={2}>
                {specialties.map((specialty) => (
                  <Checkbox
                    key={specialty}
                    isChecked={data.specialties.includes(specialty)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateData("specialties", [
                          ...data.specialties,
                          specialty,
                        ]);
                      } else {
                        updateData(
                          "specialties",
                          data.specialties.filter((s) => s !== specialty)
                        );
                      }
                    }}
                  >
                    {specialty}
                  </Checkbox>
                ))}
              </SimpleGrid>
              <FormErrorMessage>{errors.specialties}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Teaching Style</FormLabel>
              <Textarea
                placeholder="Describe your teaching methodology and approach..."
                value={data.teachingStyle}
                onChange={(e) => updateData("teachingStyle", e.target.value)}
                rows={3}
              />
            </FormControl>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={6}>
            <Alert status="info">
              <AlertIcon />
              <Box>
                <Text fontWeight="semibold">Video Introduction</Text>
                <Text fontSize="sm">
                  Record a 2-3 minute video introducing yourself in Swahili and
                  English. This helps students get to know you before booking
                  lessons.
                </Text>
              </Box>
            </Alert>

            <FormControl>
              <FormLabel>Upload Video Introduction</FormLabel>
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) updateData("videoFile", file);
                }}
              />
              <Text fontSize="sm" color="gray.600" mt={1}>
                Max file size: 100MB. Formats: MP4, MOV, AVI
              </Text>
            </FormControl>

            <Text textAlign="center" color="gray.500" fontWeight="semibold">
              OR
            </Text>

            <FormControl isInvalid={!!errors.introText}>
              <FormLabel>Written Introduction</FormLabel>
              <Textarea
                placeholder="If you prefer, write a detailed introduction about yourself, your teaching experience, and what students can expect from your lessons..."
                value={data.introText}
                onChange={(e) => updateData("introText", e.target.value)}
                rows={6}
              />
              <FormErrorMessage>{errors.introText}</FormErrorMessage>
            </FormControl>
          </Stack>
        );

      case 4:
        return (
          <Stack spacing={6}>
            <FormControl isInvalid={!!errors.hourlyRate}>
              <FormLabel>Hourly Rate (USD)</FormLabel>
              <Input
                type="number"
                min="10"
                max="100"
                value={data.hourlyRate}
                onChange={(e) =>
                  updateData("hourlyRate", parseInt(e.target.value) || 15)
                }
              />
              <Text fontSize="sm" color="gray.600">
                Recommended range: $15-25 per hour based on experience
              </Text>
              <FormErrorMessage>{errors.hourlyRate}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Timezone</FormLabel>
              <Select
                placeholder="Select your timezone"
                value={data.timezone}
                onChange={(e) => updateData("timezone", e.target.value)}
              >
                <option value="Africa/Dar_es_Salaam">
                  East Africa Time (EAT)
                </option>
                <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                <option value="UTC">UTC</option>
                <option value="Europe/London">GMT</option>
                <option value="America/New_York">EST</option>
              </Select>
            </FormControl>

            <FormControl isInvalid={!!errors.availability}>
              <FormLabel>Availability</FormLabel>
              <Text fontSize="sm" color="gray.600" mb={3}>
                Select all time slots when you&apos;re available to teach:
              </Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={2}>
                {availabilitySlots.map((slot) => (
                  <Checkbox
                    key={slot}
                    isChecked={data.availability.includes(slot)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateData("availability", [
                          ...data.availability,
                          slot,
                        ]);
                      } else {
                        updateData(
                          "availability",
                          data.availability.filter((s) => s !== slot)
                        );
                      }
                    }}
                  >
                    {slot}
                  </Checkbox>
                ))}
              </SimpleGrid>
              <FormErrorMessage>{errors.availability}</FormErrorMessage>
            </FormControl>
          </Stack>
        );

      case 5:
        return (
          <Stack spacing={6}>
            <Heading size="md">Review Your Application</Heading>

            <Card>
              <CardBody>
                <Stack spacing={4}>
                  <Box>
                    <Text fontWeight="semibold">Personal Information</Text>
                    <Text>
                      {data.firstName} {data.lastName}
                    </Text>
                    <Text>{data.email}</Text>
                    <Text>
                      {data.city}, {data.country}
                    </Text>
                  </Box>

                  <Box>
                    <Text fontWeight="semibold">Teaching Focus</Text>
                    <HStack wrap="wrap" spacing={2}>
                      {data.specialties.map((specialty) => (
                        <Badge key={specialty} colorScheme="brand">
                          {specialty}
                        </Badge>
                      ))}
                    </HStack>
                  </Box>

                  <Box>
                    <Text fontWeight="semibold">Rate & Availability</Text>
                    <Text>${data.hourlyRate}/hour</Text>
                    <Text>{data.availability.length} time slots selected</Text>
                  </Box>
                </Stack>
              </CardBody>
            </Card>

            <FormControl isInvalid={!!errors.agreedToTerms}>
              <Checkbox
                isChecked={data.agreedToTerms}
                onChange={(e) => updateData("agreedToTerms", e.target.checked)}
              >
                I agree to the Terms of Service and Privacy Policy for teachers
              </Checkbox>
              <FormErrorMessage>{errors.agreedToTerms}</FormErrorMessage>
            </FormControl>

            <Alert status="info">
              <AlertIcon />
              <Box>
                <Text fontWeight="semibold">Next Steps</Text>
                <Text fontSize="sm">
                  After submission, our team will review your application within
                  2-3 business days. You&apos;ll receive an email with the
                  decision and next steps.
                </Text>
              </Box>
            </Alert>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxW="4xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
      <VStack spacing={{ base: 6, md: 8 }}>
        <Box textAlign="center">
          <Heading size={{ base: "md", md: "lg" }} mb={2}>
            Teacher Application
          </Heading>
          <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
            Join our community of Swahili educators
          </Text>
        </Box>

        <Box w="full">
          {/* Desktop Stepper */}
          <Box display={{ base: "none", md: "block" }}>
            <Stepper index={activeStep} orientation="horizontal" size="sm">
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>

                  <Box flexShrink="0">
                    <StepTitle fontSize="sm">{step.title}</StepTitle>
                  </Box>

                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Mobile Progress Indicator */}
          <Box display={{ base: "block", md: "none" }}>
            <HStack justify="space-between" w="full">
              <Text fontSize="sm" fontWeight="semibold">
                {steps[activeStep].title}
              </Text>
              <Text fontSize="xs" color="gray.600">
                {activeStep + 1} of {steps.length}
              </Text>
            </HStack>
          </Box>
        </Box>

        <Progress value={(activeStep / (steps.length - 1)) * 100} w="full" />

        <Card w="full" bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody p={{ base: 3, sm: 4, md: 8 }}>
            {renderStepContent()}
          </CardBody>
        </Card>

        {/* Navigation */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          w="full"
          justify="space-between"
          align="center"
        >
          <Button
            variant="outline"
            onClick={prevStep}
            isDisabled={activeStep === 0}
            w={{ base: "full", md: "auto" }}
            order={{ base: 2, md: 1 }}
          >
            Previous
          </Button>

          <Text
            fontSize="sm"
            color="gray.600"
            order={{ base: 1, md: 2 }}
            display={{ base: "none", md: "block" }}
          >
            Step {activeStep + 1} of {steps.length}
          </Text>

          {activeStep === steps.length - 1 ? (
            <Button
              colorScheme="brand"
              onClick={submitApplication}
              isLoading={isSubmitting}
              loadingText="Submitting..."
              w={{ base: "full", md: "auto" }}
              order={{ base: 3, md: 3 }}
            >
              Submit Application
            </Button>
          ) : (
            <Button
              colorScheme="brand"
              onClick={nextStep}
              w={{ base: "full", md: "auto" }}
              order={{ base: 3, md: 3 }}
            >
              Next
            </Button>
          )}
        </Stack>
      </VStack>
    </Container>
  );
}
