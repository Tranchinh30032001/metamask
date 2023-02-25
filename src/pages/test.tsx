import { Box, Spacer, Text, useToast } from "@chakra-ui/react";
import { signTypedData } from "@metamask/eth-sig-util";
import React from "react";
import AppButton from "../lib/components/AppButton";
import AppContainer from "../lib/components/AppContainer";
import { trpc } from "../lib/core/utils/trpc";

function Test() {
  const { data } = trpc.auth.getNonce.useQuery();
  const { mutateAsync } = trpc.auth.login.useMutation();
  const toast = useToast();

  const signNonce = async (nonce: string) => {
    if (typeof window.ethereum === "undefined") return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ethereum = (window as any).ethereum;

    const from = (
      await ethereum.request({
        method: "eth_requestAccounts",
      })
    )?.[0];

    if (!from || !nonce)
      return toast({
        title: "Error",
        description: "No account or nonce",
        status: "error",
      });

    const msg = [
      {
        name: "nonce",
        type: "string",
        value: nonce,
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await ethereum.request({
      method: "eth_signTypedData",
      params: [msg, from],
    });

    return mutateAsync({ signature: res, address: from });
  };

  return (
    <AppContainer>
      <Text>Nonce: {data?.nonce}</Text>

      <Spacer p={2} />
      <Box maxW="xs">
        <AppButton
          onClick={async () => {
            const nonce = data?.nonce;
            if (!nonce) return;

            toast.promise(signNonce(nonce.toString()), {
              loading: {
                title: "Signing in...",
                description: "Signing in...",
                variant: "subtle",
                duration: null,
                isClosable: true,
                colorScheme: "blue",
              },
              success: (data) => {
                console.table(data);

                return {
                  title: `Signed in!`,
                  description: "Signed in!",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                };
              },
              error: (error) => {
                return {
                  title: "Error",
                  description: error.message,
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                };
              },
            });
          }}
        >
          Sign
        </AppButton>
      </Box>
    </AppContainer>
  );
}

export default Test;
