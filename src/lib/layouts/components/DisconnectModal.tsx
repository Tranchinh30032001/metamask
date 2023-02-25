import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { metaMask } from "../../core/connectors/metaMask";
import { useAuth } from "../../core/hooks/useAuth";
import { trpc } from "../../core/utils/trpc";
import type { Props } from "../DefaultLayout";
import { LOCALSTORAGE_AUTOCONNECT } from "../DefaultLayout";

export const DisconnectModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const utils = trpc.useContext();

  const onDisconnect = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    metaMask?.actions.resetState();

    // set localstorage not autoconnect
    window.localStorage.setItem(LOCALSTORAGE_AUTOCONNECT, "false");

    await logout.mutateAsync().then(() => utils.auth.invalidate());

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent mx={2}>
        <ModalHeader>Disconnect Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure you want to disconnect?</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onDisconnect}>
            Disconnect
          </Button>
          <Button variant="outline" colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
