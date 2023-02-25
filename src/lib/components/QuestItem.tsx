import { Box, Flex, FlexProps, Text } from "@chakra-ui/react";
import React from "react";

type Props = {
  title?: string;
  icon?: React.ReactNode;
} & FlexProps;

function QuestItem({ title, icon, ...rest }: Props) {
  return (
    <Box position="relative">
      <Flex
        bgColor="black"
        textColor="white"
        fontWeight="medium"
        p={2}
        alignItems="center"
        gap={2}
        rounded="2xl"
        fontSize="sm"
        px={4}
        position="relative"
        zIndex={2}
        transform="translate(-4px,-4px)"
        transition="all 0.17s ease-in-out"
        cursor="pointer"
        _hover={{
          transform: "translate(0,0)",
        }}
        {...rest}
      >
        {icon}

        <Text>{title}</Text>
      </Flex>
      <Box
        backgroundColor="white"
        borderWidth={2}
        borderColor={rest.backgroundColor || "black"}
        position="absolute"
        inset={0}
        rounded={rest.rounded || "2xl"}
        zIndex={1}
      />
    </Box>
  );
}

export default QuestItem;
