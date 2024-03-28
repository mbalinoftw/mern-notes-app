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
import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials, signUp } from "../network/notes_api";
import PasswordInputField from "./PasswordInputField";
import TextInputField from "./TextInputField";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpSuccesful: (user: User) => void;
}

export default function SignUpModal({ isOpen, onClose, onSignUpSuccesful }: SignUpModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpCredentials>();

  async function onSubmit(credentials: SignUpCredentials) {
    try {
      const newUser = await signUp(credentials);
      onSignUpSuccesful(newUser);
      onClose();
    } catch (error) {
      console.error(error);
      alert(error);
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
              registerOptions={{ required: "Register your username" }}
              error={errors.username}
            />
            <TextInputField
              type="email"
              name="email"
              label="Email"
              register={register}
              registerOptions={{ required: "Register your email" }}
              error={errors.email}
            />
            <PasswordInputField
              register={register}
              registerOptions={{ required: "Register your password" }}
              error={errors.password}
            />
          </ModalBody>
          <ModalFooter>
            <Button w="full" colorScheme="blue" type="submit" disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
              Sign up
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
