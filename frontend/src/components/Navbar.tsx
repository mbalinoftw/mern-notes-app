import { Box, Button, ButtonGroup, Container, Flex, HStack, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { User } from "../models/user";
import { logout } from "../network/notes_api";
import { GiNotebook } from "react-icons/gi";

interface NavbarProps {
  loggedInUser: User | null;
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
  onLogoutSuccessful: () => void;
}

export default function Navbar({ loggedInUser, onSignUpClicked, onLoginClicked, onLogoutSuccessful }: NavbarProps) {
  return (
    <Box as="nav" bgColor="gray.100">
      <Container maxW="container.xl" p={4}>
        <Flex gap={6} align="center" justify="space-between">
          <Link to="/">
            <HStack spacing={1}>
              <GiNotebook size={28} />
              <Heading size="lg">NotesApp</Heading>
            </HStack>
          </Link>
          {loggedInUser ? (
            <NavbarLoggedIn user={loggedInUser} onLogoutSuccessful={onLogoutSuccessful} />
          ) : (
            <NavbarLoggedOut onSignUpClicked={onSignUpClicked} onLoginClicked={onLoginClicked} />
          )}
        </Flex>
      </Container>
    </Box>
  );
}

interface NavbarLoggedInViewProps {
  user: User;
  onLogoutSuccessful: () => void;
}

function NavbarLoggedIn({ user, onLogoutSuccessful }: NavbarLoggedInViewProps) {
  async function logoutUser() {
    try {
      await logout();
      onLogoutSuccessful();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }
  return (
    <Flex align="center" gap={2}>
      <Text>Signed in as: {user.username}</Text>
      <Button onClick={logoutUser}>Log out</Button>
    </Flex>
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
