import { Box, Button, Flex, Grid, Heading, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddEditNoteModal from "../components/AddEditNoteModal";
import LoadingSpinner from "../components/LoadingSpinner";
import Note from "../components/Note";
import PageLayout from "../components/PageLayout";
import { Note as NoteModel } from "../models/note";
import { User } from "../models/user";
import { deleteNote, fetchNotes } from "../network/notes_api";

interface NotesPageProps {
  loggedInUser: User | null;
}

export default function NotesPage({ loggedInUser }: NotesPageProps) {
  return <>{loggedInUser ? <NotesPageLoggedIn loggedInUser={loggedInUser} /> : <NotesPageLoggedOut />}</>;
}

function NotesPageLoggedIn({ loggedInUser }: NotesPageProps) {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);
  const {
    isOpen: addEditNoteModalIsOpen,
    onOpen: openAddEditNoteModal,
    onClose: closeAddEditNoteModal,
  } = useDisclosure();

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
    <Grid gridTemplateColumns={{ md: "repeat(2,1fr)", lg: "repeat(3,1fr)" }} gap={4}>
      {notes.map((note) => (
        <Note
          note={note}
          key={note._id}
          onDelete={handleDeleteNote}
          onEdit={setNoteToEdit}
          onOpen={openAddEditNoteModal}
        />
      ))}
    </Grid>
  );

  return (
    <PageLayout>
      <Heading mb={6}>{`👋 Hello, ${loggedInUser?.username}!`}</Heading>
      <Flex justify="center">
        <Button
          mb={6}
          leftIcon={<FaPlus />}
          onClick={() => {
            setNoteToEdit(null);
            openAddEditNoteModal();
          }}
          display="block">
          Add new note
        </Button>
      </Flex>
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
      {addEditNoteModalIsOpen && (
        <AddEditNoteModal
          isOpen={addEditNoteModalIsOpen}
          onClose={closeAddEditNoteModal}
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote]);
            closeAddEditNoteModal();
          }}
        />
      )}
      {noteToEdit && (
        <AddEditNoteModal
          noteToEdit={noteToEdit}
          setNoteToEdit={setNoteToEdit}
          isOpen={addEditNoteModalIsOpen}
          onClose={closeAddEditNoteModal}
          onNoteSaved={(updatedNote) => {
            setNotes(notes.map((existingNote) => (existingNote._id === updatedNote._id ? updatedNote : existingNote)));
            setNoteToEdit(null);
            closeAddEditNoteModal();
          }}
        />
      )}
    </PageLayout>
  );
}

function NotesPageLoggedOut() {
  return (
    <Box minH="80vh" display="flex" alignItems="center">
      <PageLayout>
        <Heading as="h3" size="lg" textAlign="center">
          Please sign up or log in to access your notes.
        </Heading>
      </PageLayout>
    </Box>
  );
}
