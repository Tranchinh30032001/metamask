import { Container } from "chakra-paginator";
import React from "react";
import ProtectedLayout from "../../lib/layouts/ProtectedLayout";
import CreateCommunity from "../../lib/pages/community/components/CreateCommunity";

function Create() {
  return (
    <Container w="full" py={10} px={2}>
      <CreateCommunity />
    </Container>
  );
}

export default Create;

Create.layout = ProtectedLayout;
