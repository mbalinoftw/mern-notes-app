import { User } from "../models/user";
import { useForm } from "react-hook-form";
import {
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import PasswordInputField from "./PasswordInputField";
import TextInputField from "./TextInputField";
import { LoginCredentials, login } from "../network/notes_api";
import { useState } from "react";
import { UnauthorizedError } from "../errors/http_errors";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccesful: (user: User) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccesful }: LoginModalProps) {
  const [errorText, setErrorText] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();

  async function onSubmit(credentials: LoginCredentials) {
    try {
      const user = await login(credentials);
      onLoginSuccesful(user);
      setErrorText(null);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        setErrorText(error.message);
      } else {
        alert(error);
      }
      console.error(error);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="2xl">Log in</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <TextInputField
              type="text"
              name="username"
              label="Username"
              register={register}
              registerOptions={{ required: "Required" }}
              error={errors.username}
            />
            <PasswordInputField
              register={register}
              registerOptions={{ required: "Required" }}
              error={errors.password}
            />
          </ModalBody>
          <ModalFooter>
            <Button w="full" colorScheme="blue" type="submit" disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
              Log in
            </Button>
          </ModalFooter>
          {errorText && (
            <Alert status="error">
              <AlertIcon />
              {errorText}
            </Alert>
          )}
        </form>
      </ModalContent>
    </Modal>
  );
}
