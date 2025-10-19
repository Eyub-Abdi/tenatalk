import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTutors } from "../tutors/api/useTutors";
import { useBookSlot } from "../lessons/api/useBookingReschedule";

export default function FindTutors() {
  const { data, isLoading } = useTutors();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [start, setStart] = useState("");
  const [duration, setDuration] = useState(60);
  const [lessonType, setLessonType] = useState<
    "trial" | "regular" | "package" | "group"
  >("trial");
  const [message, setMessage] = useState("");
  const { mutateAsync: bookAsync, isPending } = useBookSlot();

  const openBook = (id: number) => {
    setTeacherId(id);
    onOpen();
  };

  const submitBooking = async () => {
    if (!teacherId) return;
    await bookAsync({
      teacher_id: teacherId,
      start_datetime: start,
      duration_minutes: duration,
      lesson_type: lessonType,
      message,
    });
    onClose();
    setTeacherId(null);
    setStart("");
    setDuration(60);
    setLessonType("trial");
    setMessage("");
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Find Tutors
      </Heading>
      {isLoading && <Text>Loading...</Text>}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {data?.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <Heading size="md">{t.name}</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text>Languages: {t.languages.join(", ")}</Text>
                <Text>Rate: ${t.ratePerHour}/hr</Text>
                <Button
                  colorScheme="brand"
                  size="sm"
                  onClick={() => openBook(Number(t.id))}
                >
                  Book
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Book a lesson</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Start time</FormLabel>
              <Input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Duration (minutes)</FormLabel>
              <NumberInput
                min={30}
                max={180}
                step={15}
                value={duration}
                onChange={(_, v) => setDuration(Number.isNaN(v) ? 60 : v)}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Lesson type</FormLabel>
              <Select
                value={lessonType}
                onChange={(e) =>
                  setLessonType(
                    e.target.value as "trial" | "regular" | "package" | "group"
                  )
                }
              >
                <option value="trial">Trial</option>
                <option value="regular">Regular</option>
                <option value="package">Package</option>
                <option value="group">Group</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Message (optional)</FormLabel>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={submitBooking}
              isLoading={isPending}
            >
              Book
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
