import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LoginModal from "./components/LoginModal";
import Navbar from "./components/Navbar";
import SignUpModal from "./components/SignUpModal";
import { User } from "./models/user";
import { getLoggedInUser } from "./network/notes_api";
import NotesPage from "./pages/NotesPage";

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
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

      <NotesPage loggedInUser={loggedInUser} />

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
    </>
  );
}
