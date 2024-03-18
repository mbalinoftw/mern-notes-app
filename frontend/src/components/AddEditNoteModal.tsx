import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  ModalFooter,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { Note } from "../models/note";
import { useForm } from "react-hook-form";
import { NoteInput, createNote, updateNote } from "../network/notes_api";

interface AddEditNoteModalProps {
  noteToEdit?: Note | null;
  setNoteToEdit?: ((note: Note | null) => void) | undefined;
  isOpen: boolean;
  onClose(): void;
  onNoteSaved: (note: Note) => void;
}

export default function AddEditNoteModal({
  noteToEdit,
  setNoteToEdit,
  isOpen,
  onClose,
  onNoteSaved,
}: AddEditNoteModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoteInput>({
    defaultValues: {
      title: noteToEdit?.title || "",
      text: noteToEdit?.text || "",
    },
  });

  async function onSubmit(input: NoteInput) {
    try {
      let noteResponse: Note;
      if (noteToEdit) {
        noteResponse = await updateNote(noteToEdit._id, input);
      } else {
        noteResponse = await createNote(input);
      }
      onNoteSaved(noteResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{noteToEdit ? "Edit note" : "Add note"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.title}>
              <FormLabel>Title</FormLabel>
              <Input type="text" {...register("title", { required: "Title is required" })} />
              <FormErrorMessage color="red.500">{errors.title?.message}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel>Text</FormLabel>
              <Textarea placeholder="" size="sm" {...register("text")} />
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup spacing={4}>
            <Button
              variant="ghost"
              onClick={() => {
                if (setNoteToEdit && noteToEdit) {
                  setNoteToEdit(null);
                }
                onClose();
              }}>
              Cancel
            </Button>
            <Button colorScheme="blue" mr={3} type="submit" disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
              Save
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
