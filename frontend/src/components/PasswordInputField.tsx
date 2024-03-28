import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

interface PasswordInputFieldProps {
  placeholder?: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  [x: string]: any;
}

export default function PasswordInputField({ register, registerOptions, error, ...props }: PasswordInputFieldProps) {
  const [show, setShow] = useState(false);
  const handleClickShowPassword = () => setShow(!show);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>Password</FormLabel>
      <InputGroup>
        <Input type={show ? "text" : "password"} {...register("password", registerOptions)} {...props} />
        <InputRightElement>
          <IconButton
            aria-label="show password"
            rounded="md"
            variant="ghost"
            _hover={{ backgroundColor: "transparent" }}
            onClick={handleClickShowPassword}
            icon={show ? <HiOutlineEyeOff /> : <HiOutlineEye />}></IconButton>
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage color="red.500">{error?.message}</FormErrorMessage>
    </FormControl>
  );
}
