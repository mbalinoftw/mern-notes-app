import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface TextInputFieldProps {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  [x: string]: any;
}

export default function TextInputField({
  type,
  name,
  label,
  placeholder,
  register,
  registerOptions,
  error,
  ...props
}: TextInputFieldProps) {
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel mb={1}>{label}</FormLabel>
      <Input mb={2} type={type} {...register(name, registerOptions)} {...props} />
      <FormErrorMessage color="red.500">{error?.message}</FormErrorMessage>
    </FormControl>
  );
}
