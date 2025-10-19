import {
  Box,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  ModalFooter,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useLessons } from "../lessons/api/useLessons";
import { useCreateReschedule } from "../lessons/api/useBookingReschedule";

export default function Bookings() {
  const { data, isLoading } = useLessons({ mine: true });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [reason, setReason] = useState("");
  const { mutateAsync: rescheduleAsync, isPending } = useCreateReschedule();

  const openReschedule = (id: string) => {
    setSelectedId(id);
    onOpen();
  };

  const submitReschedule = async () => {
    if (!selectedId) return;
    await rescheduleAsync({
      lesson_id: selectedId,
      new_start: newStart,
      new_end: newEnd,
      reason,
    });
    onClose();
    setSelectedId(null);
    setNewStart("");
    setNewEnd("");
    setReason("");
  };

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Heading size="lg">My Bookings</Heading>
      </HStack>
      {isLoading && <Text>Loading...</Text>}
      {data && (
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Lesson</Th>
              <Th>Teacher</Th>
              <Th>Start</Th>
              <Th>End</Th>
              <Th>Status</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((l) => (
              <Tr key={l.id}>
                <Td>{l.lesson_type}</Td>
                <Td>{l.teacher_name ?? "-"}</Td>
                <Td>{new Date(l.scheduled_start).toLocaleString()}</Td>
                <Td>{new Date(l.scheduled_end).toLocaleString()}</Td>
                <Td>{l.status}</Td>
                <Td>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => openReschedule(l.id)}
                  >
                    Reschedule
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request Reschedule</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>New start</FormLabel>
              <Input
                type="datetime-local"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>New end</FormLabel>
              <Input
                type="datetime-local"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Reason</FormLabel>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={submitReschedule}
              isLoading={isPending}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
