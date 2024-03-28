import { User } from "../models/user";
import { useForm } from "react-hook-form";
import { SignUpCredentials, signUp } from "../network/notes_api";
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
import TextInputField from "./TextInputField";
import PasswordInputField from "./PasswordInputField";

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
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInputField
              type="text"
              name="username"
              label="Username"
              register={register}
              registerOptions={{ required: "Required" }}
              error={errors.username}
            />
            <TextInputField
              type="email"
              name="email"
              label="Email"
              register={register}
              registerOptions={{ required: "Required" }}
              error={errors.email}
            />

            <PasswordInputField
              name="password"
              label="Password"
              register={register}
              registerOptions={{ required: "Required" }}
              error={errors.password}
            />

          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            w="full"
            colorScheme="blue"
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}>
            Sign up
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
