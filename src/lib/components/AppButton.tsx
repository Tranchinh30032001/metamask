import type { BoxProps, ButtonProps } from "@chakra-ui/react";
import { Button, Box } from "@chakra-ui/react";

type AppButtonProps = ButtonProps & {
  outerBox?: BoxProps;
  shadowBox?: BoxProps;
};

export default function AppButton({
  outerBox,
  shadowBox,
  ...props
}: AppButtonProps) {
  return (
    <Box position="relative" {...outerBox}>
      <Button
        colorScheme="gray"
        rounded="md"
        transition="all 0.15s ease-in-out"
        transform={`translate(-4px, -4px)`}
        _hover={{
          transform: `translate(0px, 0px)`,
        }}
        zIndex={2}
        borderWidth="2px"
        borderColor="black"
        width="full"
        {...props}
      />
      <Box
        position="absolute"
        inset={0}
        bgColor="gray.100"
        rounded={props.rounded || "md"}
        borderColor="gray.800"
        borderWidth="2px"
        zIndex={1}
        {...shadowBox}
      ></Box>
    </Box>
  );
}
