import type { ContainerProps } from "@chakra-ui/react";
import { Spacer, Container } from "@chakra-ui/react";
import React from "react";

type Props = {
  children: React.ReactNode;
} & ContainerProps;

function AppContainer({ children, ...rest }: Props) {
  return (
    <Container maxW="6xl" {...rest}>
      <Spacer p={3} />
      {children}
    </Container>
  );
}

export default AppContainer;
