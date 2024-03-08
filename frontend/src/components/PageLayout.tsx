import { Container } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export default function PageLayout({ children }: ContainerProps) {
  return (
    <Container maxW="container.xl" p={4}>
      {children}
    </Container>
  );
}
