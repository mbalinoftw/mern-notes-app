import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LoginModal from "./components/LoginModal";
import Navbar from "./components/Navbar";
import SignUpModal from "./components/SignUpModal";
import { User } from "./models/user";
import { getLoggedInUser } from "./network/notes_api";
import NotesPage from "./pages/NotesPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";

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
      <BrowserRouter>
        <Navbar
          loggedInUser={loggedInUser}
          onSignUpClicked={openSignUpModal}
          onLoginClicked={openLoginModal}
          onLogoutSuccessful={() => {
            setLoggedInUser(null);
          }}
        />

        <Routes>
          <Route path="" element={<NotesPage loggedInUser={loggedInUser} />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>

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
