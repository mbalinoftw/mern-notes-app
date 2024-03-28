import { User } from "../models/user";
import { useForm } from "react-hook-form";
import {
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

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccesful: (user: User) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccesful }: LoginModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();

  async function onSubmit(credentials: LoginCredentials) {
    try {
      const user = await login(credentials);
      onLoginSuccesful(user);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign up</ModalHeader>
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
        </form>
      </ModalContent>
    </Modal>
  );
}
