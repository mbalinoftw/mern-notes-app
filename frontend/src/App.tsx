import { useState, useEffect } from "react";
import { Note as NoteModel } from "./models/note";
import PageLayout from "./components/PageLayout";
import Note from "./components/Note";
import { Button, Grid, useDisclosure } from "@chakra-ui/react";
import { fetchNotes } from "./network/notes_api";
import CreateNoteModal from "./components/CreateNoteModal";

export default function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await fetchNotes();
        setNotes(data);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    };
    loadNotes();
  }, []);

  return (
    <PageLayout>
      <Button onClick={onOpen} mx="auto" display="block">
        Add new note
      </Button>

      <Grid my={4} gridTemplateColumns={{ sm: "repeat(2,1fr)", lg: "repeat(3,1fr)" }} gap={4}>
        {notes.map((note) => (
          <Note note={note} key={note._id} />
        ))}
      </Grid>
      {isOpen && (
        <CreateNoteModal
          isOpen={isOpen}
          onClose={onClose}
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote]);
            onClose();
          }}
        />
      )}
    </PageLayout>
  );
}
