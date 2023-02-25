import { Flex, Spinner } from "@chakra-ui/react";

function FullscreenLoading() {
  return (
    <Flex
      w="full"
      h="calc(100vh)"
      bg="black"
      color="white"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner size="xl" />
    </Flex>
  );
}

export default FullscreenLoading;
