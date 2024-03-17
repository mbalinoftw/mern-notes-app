import { useRef } from "react";
import { Note as NoteModel } from "../models/note";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { formatDate } from "../utils/formatDate";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";

interface NoteProps {
  note: NoteModel;
  onEdit: (note: NoteModel) => void;
  onDelete: (note: NoteModel) => void;
  onOpen(): void;
}

export default function Note({ note, onEdit, onDelete, onOpen }: NoteProps) {
  const { title, text, createdAt, updatedAt } = note;
  const { isOpen: deleteWarningIsOpen, onOpen: openDeleteWarning, onClose: closeDeleteWarning } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null); 

  let createdUpdatedText: string;
  if (updatedAt > createdAt) {
    createdUpdatedText = `Updated: ${formatDate(updatedAt)}`;
  } else {
    createdUpdatedText = `Created: ${formatDate(createdAt)}`;
  }

  return (
    <>
      <Card
        p={2}
        cursor="pointer"
        transition="box-shadow 0.3s"
        _hover={{
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}>
        <CardBody minH={40}>
          <Heading noOfLines={1} size="md" mb={2} textTransform="uppercase">
            {title}
          </Heading>
          <Text noOfLines={4}>{text}</Text>
        </CardBody>
        <CardFooter>
          <Flex alignItems="center" justify="space-between" w="full">
            <Text fontSize="sm" color="gray.500">
              {createdUpdatedText}
            </Text>
            <ButtonGroup>
              <IconButton
                isRound
                aria-label="Edit note"
                icon={<FaRegEdit />}
                onClick={() => {
                  onEdit(note);
                  onOpen();
                }}
              />
              <IconButton isRound aria-label="Delete note" icon={<FaRegTrashCan />} onClick={openDeleteWarning} />
            </ButtonGroup>
          </Flex>
        </CardFooter>
      </Card>

      <AlertDialog isOpen={deleteWarningIsOpen} leastDestructiveRef={cancelRef} onClose={closeDeleteWarning}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Note
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can't undo this action.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteWarning}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => onDelete(note)} ml={3}>
                Yes, delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
