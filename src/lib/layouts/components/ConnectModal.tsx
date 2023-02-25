// import {
//   Button,
//   Card,
//   CardBody,
//   Flex,
//   Heading,
//   Img,
//   Modal,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalHeader,
//   ModalOverlay,
//   Spacer,
//   Text,
//   useToast,
// } from "@chakra-ui/react";
// import { ethers } from "ethers";
// import { env } from "../../../env/client.mjs";
// import AppButton from "../../components/AppButton";
// import { useAuth } from "../../core/hooks/useAuth";
// import { trpc } from "../../core/utils/trpc";
// import type { Props } from "../DefaultLayout";
// import { handleConnectWallet } from "../DefaultLayout";

// export const ConnectModal: React.FC<Props> = ({ isOpen, onClose }) => {
//   const toast = useToast();
//   const { data } = trpc.auth.getNonce.useQuery();
//   const { mutateAsync, isLoading: isSigningNonce } =
//     trpc.auth.login.useMutation();
//   const { isLoggedIn, isWalletConnected, isRightChainId } = useAuth();
//   const utils = trpc.useContext();

//   const signNonce = async (nonce: string) => {
//     if (typeof window.ethereum === "undefined") return;

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const ethereum = (window as any).ethereum;

//     const from = (
//       await ethereum.request({
//         method: "eth_requestAccounts",
//       })
//     )?.[0];

//     if (!from || !nonce)
//       return toast({
//         title: "Error",
//         description: "No account or nonce",
//         status: "error",
//       });

//     const msg = [
//       {
//         name: "nonce",
//         type: "string",
//         value: nonce,
//       },
//     ];

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const res = await ethereum.request({
//       method: "eth_signTypedData",
//       params: [msg, from],
//     });

//     return mutateAsync({ signature: res, address: from });
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="xl">
//       <ModalOverlay />
//       <ModalContent mx={2}>
//         <ModalHeader>Connect Wallet</ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           <Heading size="md">Welcome to Canto.Quest</Heading>
//           <Text>You are about to connect your wallet to a new wallet.</Text>
//           <Spacer p={9} />

//           <Card variant="outline">
//             <CardBody>
//               <Heading size="md">Step 1: Connect wallet</Heading>

//               {isWalletConnected ? (
//                 <Text>Wallet connected</Text>
//               ) : (
//                 <>
//                   <Spacer p={3} />

//                   {/* Metamask */}
//                   {/* <Flex direction="column" gap={3}>
//                     <AppButton
//                       onClick={() => {
//                         handleConnectWallet().catch((err) => {
//                           toast({
//                             title: "Error",
//                             description: err.message,
//                           });
//                         });
//                       }}
//                     >
//                       <Img
//                         src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png"
//                         alt="metamask"
//                         height="30px"
//                         width="30px"
//                       />

//                       <Text ml={2}>MetaMask</Text>
//                     </AppButton>

//                     <AppButton onClick={() => toast({ title: "Coming soon" })}>
//                       <Img
//                         src="https://seeklogo.com/images/W/walletconnect-logo-EE83B50C97-seeklogo.com.png"
//                         alt="walletconnect"
//                         height="30px"
//                         width="30px"
//                       />
//                       <Text ml={2}>WalletConnect</Text>
//                     </AppButton>

//                     <AppButton
//                       onClick={() =>
//                         toast({
//                           title: "Coming soon",
//                         })
//                       }
//                     >
//                       <Img
//                         src="https://avatars.githubusercontent.com/u/18060234?s=280&v=4"
//                         alt="walletconnect"
//                         height="30px"
//                         width="30px"
//                       />
//                       <Text ml={2}>CoinbaseWallet</Text>
//                     </AppButton>
//                   </Flex> */}
//                 </>
//               )}
//             </CardBody>
//           </Card>

//           <Spacer p={4} />
//           {/* <Card variant="outline">
//             <CardBody>
//               <Heading size="md">Step 2: Sign nonce</Heading>

//               <Spacer p={3} />
//               {isLoggedIn ? (
//                 <Text>Logged in</Text>
//               ) : (
//                 <Button
//                   w="full"
//                   isDisabled={
//                     !data?.nonce || isSigningNonce || !isWalletConnected
//                   }
//                   onClick={() => {
//                     if (!data?.nonce) return;

//                     toast.promise(signNonce(data.nonce.toString()), {
//                       loading: {
//                         title: "Signing nonce",
//                       },
//                       success: (data) => {
//                         if (typeof window.ethereum?.request === "undefined") {
//                           return {
//                             title: "Error",
//                             description: "No web3 wallet",
//                           };
//                         }

//                         if (!isRightChainId) {
//                           window.ethereum?.request({
//                             method: "wallet_switchEthereumChain",
//                             params: [
//                               { chainId: `0x${env.NEXT_PUBLIC_CHAIN_ID}` },
//                             ],
//                           });

//                           return {
//                             title: "Error",
//                             description: "Wrong chain id",
//                             status: "error",
//                           };
//                         }

//                         if (isWalletConnected) onClose();

//                         utils.auth.invalidate();

//                         return {
//                           title: "Signed nonce",
//                         };
//                       },
//                       error: {
//                         title: "Error",
//                       },
//                     });
//                   }}
//                   isLoading={!data?.nonce || isSigningNonce}
//                   loadingText="Loading nonce"
//                 >
//                   Sign nonce
//                 </Button>
//               )}
//             </CardBody>
//           </Card> */}

//           <Spacer p={1} />
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// };
