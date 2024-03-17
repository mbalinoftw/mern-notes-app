import { useState, useEffect } from "react";
import { Note as NoteModel } from "./models/note";
import PageLayout from "./components/PageLayout";
import Note from "./components/Note";
import { Button, Grid, useDisclosure } from "@chakra-ui/react";
import { deleteNote, fetchNotes } from "./network/notes_api";
import AddEditNoteModal from "./components/AddEditNoteModal";

export default function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);
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

  async function handleDeleteNote(note: NoteModel) {
    try {
      await deleteNote(note._id);
      setNotes(notes.filter((existingNote) => existingNote._id !== note._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <PageLayout>
      <Button onClick={onOpen} mx="auto" display="block">
        Add new note
      </Button>

      <Grid my={4} gridTemplateColumns={{ sm: "repeat(2,1fr)", lg: "repeat(3,1fr)" }} gap={4}>
        {notes.map((note) => (
          <Note note={note} key={note._id} onDelete={handleDeleteNote} onEdit={setNoteToEdit} onOpen={onOpen} />
        ))}
      </Grid>
      {isOpen && (
        <AddEditNoteModal
          isOpen={isOpen}
          onClose={onClose}
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote]);
            onClose();
          }}
        />
      )}
      {noteToEdit && (
        <AddEditNoteModal
          noteToEdit={noteToEdit}
          isOpen={isOpen}
          onClose={onClose}
          onNoteSaved={(updatedNote) => {
            setNotes(notes.map((existingNote) => (existingNote._id === updatedNote._id ? updatedNote : existingNote)));
            setNoteToEdit(null);
            onClose();
          }}
        />
      )}
    </PageLayout>
  );
}
