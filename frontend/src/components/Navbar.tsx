import { Button, ButtonGroup, Container, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { User } from "../models/user";

interface NavbarProps {
  loggedInUser: User | null;
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
  onLogoutSuccessful: () => void;
}

export default function Navbar({ loggedInUser, onSignUpClicked, onLoginClicked, onLogoutSuccessful }: NavbarProps) {
  return (
    <nav className="">
      <Container maxW="container.xl" p={4}>
        <Flex gap={6} align="center" justify="space-between">
          <Text>NotesApp</Text>
          {loggedInUser ? (
            <NavbarLoggedIn user={loggedInUser} onLogoutSuccessful={onLogoutSuccessful} />
          ) : (
            <NavbarLoggedOut onSignUpClicked={onSignUpClicked} onLoginClicked={onLoginClicked} />
          )}
        </Flex>
      </Container>
    </nav>
  );
}

interface NavbarLoggedInViewProps {
  user: User;
  onLogoutSuccessful: () => void;
}

function NavbarLoggedIn({ user, onLogoutSuccessful }: NavbarLoggedInViewProps) {
  async function logout() {
    try {
      await logout();
      onLogoutSuccessful();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }
  return (
    <div>
      <Text>Signed in as: {user.username}</Text>
      <Button onClick={logout}>Log out</Button>
    </div>
  );
}

interface NavBarLoggedOutViewProps {
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
}

function NavbarLoggedOut({ onSignUpClicked, onLoginClicked }: NavBarLoggedOutViewProps) {
  return (
    <ButtonGroup gap={0}>
      <Button onClick={onSignUpClicked}>Sign Up</Button>
      <Button onClick={onLoginClicked}>Log In</Button>
    </ButtonGroup>
  );
}
