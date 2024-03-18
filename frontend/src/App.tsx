import { useState, useEffect } from "react";
import { Note as NoteModel } from "./models/note";
import PageLayout from "./components/PageLayout";
import Note from "./components/Note";
import { Button, Grid, Text, useDisclosure } from "@chakra-ui/react";
import { deleteNote, fetchNotes } from "./network/notes_api";
import AddEditNoteModal from "./components/AddEditNoteModal";
import LoadingSpinner from "./components/LoadingSpinner";

export default function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const loadNotes = async () => {
      setNotesLoading(true);
      try {
        const data = await fetchNotes();
        setShowNotesLoadingError(false);
        setNotes(data);
      } catch (error) {
        console.error(error);
        setShowNotesLoadingError(true);
      } finally {
        setNotesLoading(false);
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

  const renderNotesGrid = (
    <Grid gridTemplateColumns={{ sm: "repeat(2,1fr)", lg: "repeat(3,1fr)" }} gap={4}>
      {notes.map((note) => (
        <Note note={note} key={note._id} onDelete={handleDeleteNote} onEdit={setNoteToEdit} onOpen={onOpen} />
      ))}
    </Grid>
  );

  return (
    <PageLayout>
      <Button
        mb={6}
        onClick={() => {
          setNoteToEdit(null);
          onOpen();
        }}
        mx="auto"
        display="block">
        Add new note
      </Button>
      {notesLoading && <LoadingSpinner />}
      {showNotesLoadingError && <Text>Something went wrong. Please refresh the page.</Text>}

      {!notesLoading && !showNotesLoadingError && (
        <>
          {notes.length > 0 ? (
            renderNotesGrid
          ) : (
            <Text fontSize="2xl" align="center">
              You don't have any notes yet.
            </Text>
          )}
        </>
      )}

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
          setNoteToEdit={setNoteToEdit}
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
