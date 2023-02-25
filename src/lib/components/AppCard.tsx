import type { BoxProps, CardProps } from "@chakra-ui/react";
import { Box, Card } from "@chakra-ui/react";

type AppCardProps = CardProps & {
  outerBox?: BoxProps;
  shadowBox?: BoxProps;
};

export default function AppCard({
  outerBox,
  shadowBox,
  ...props
}: AppCardProps) {
  return (
    <Box position="relative" {...outerBox}>
      <Card
        colorScheme="gray"
        rounded="md"
        transition="all 0.15s ease-in-out"
        transform={`translate(0px, 0px)`}
        _hover={{
          transform: `translate(-6px, -6px)`,
        }}
        bgColor="white"
        zIndex={2}
        borderWidth="2px"
        borderColor="black"
        width="full"
        {...props}
      />
      <Box
        position="absolute"
        inset={0}
        bgColor="white"
        rounded={props.rounded || "md"}
        borderColor="gray.800"
        borderWidth="2px"
        zIndex={1}
        {...shadowBox}
      ></Box>
    </Box>
  );
}
