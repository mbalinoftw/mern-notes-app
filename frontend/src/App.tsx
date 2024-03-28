import { Button, Flex, Grid, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AddEditNoteModal from "./components/AddEditNoteModal";
import LoadingSpinner from "./components/LoadingSpinner";
import LoginModal from "./components/LoginModal";
import Navbar from "./components/Navbar";
import Note from "./components/Note";
import PageLayout from "./components/PageLayout";
import SignUpModal from "./components/SignUpModal";
import { Note as NoteModel } from "./models/note";
import { deleteNote, fetchNotes, getLoggedInUser } from "./network/notes_api";
import { User } from "./models/user";

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: signUpModalIsOpen, onOpen: openSignUpModal, onClose: closeSignUpModal } = useDisclosure();
  const { isOpen: loginModalIsOpen, onOpen: openLoginModal, onClose: closeLoginModal } = useDisclosure();

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const user = await getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLoggedInUser();
  }, []);

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
    <>
      <Navbar
        loggedInUser={loggedInUser}
        onSignUpClicked={openSignUpModal}
        onLoginClicked={openLoginModal}
        onLogoutSuccessful={() => {
          setLoggedInUser(null);
        }}
      />
      <PageLayout>
        <Flex justify="center">
          <Button
            mb={6}
            onClick={() => {
              setNoteToEdit(null);
              onOpen();
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
              setNotes(
                notes.map((existingNote) => (existingNote._id === updatedNote._id ? updatedNote : existingNote))
              );
              setNoteToEdit(null);
              onClose();
            }}
          />
        )}
        {signUpModalIsOpen && (
          <SignUpModal
            isOpen={signUpModalIsOpen}
            onClose={closeSignUpModal}
            onSignUpSuccesful={(user) => {
              setLoggedInUser(user);
              closeSignUpModal();
            }}
          />
        )}
        {loginModalIsOpen && (
          <LoginModal
            isOpen={loginModalIsOpen}
            onClose={closeLoginModal}
            onLoginSuccesful={(user) => {
              setLoggedInUser(user);
              closeLoginModal();
            }}
          />
        )}
      </PageLayout>
    </>
  );
}