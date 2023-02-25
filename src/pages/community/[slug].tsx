import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Img,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Spacer,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Widget } from "@uploadcare/react-widget";
import { useRouter } from "next/router";
import { useState } from "react";
import { env } from "../../env/client.mjs";
import AppButton from "../../lib/components/AppButton";
import AppContainer from "../../lib/components/AppContainer";
import { useAuth } from "../../lib/core/hooks/useAuth";
import { trpc } from "../../lib/core/utils/trpc";
import QuestList from "../../lib/pages/community/components/TaskList";
import { formatAddress } from "../../lib/utils/typing";

function Index() {
  const router = useRouter();
  const slug = router.query.slug;
  const toast = useToast();
  const { walletAddress } = useAuth();

  const { mutateAsync } = trpc.community.deleteOneBySlug.useMutation({
    onSuccess: (result) => {
      router.push(`/community`);
    },
  });
  const { data, isLoading } = trpc.community.getOneBySlug.useQuery(
    {
      slug: slug as string,
    },
    { enabled: !!slug }
  );

  const types = [
    {
      name: "Ongoing",
    },
    {
      name: "Scheduled",
    },
    {
      name: "Draft",
    },
    {
      name: "Completed",
    },
  ];

  return isLoading ? (
    <AppContainer>
      <Center>
        <Spinner />
      </Center>
    </AppContainer>
  ) : (
    <AppContainer>
      <Flex gap={5} alignItems="center">
        <AvatarSection />
        <Flex direction="column" gap={1}>
          <Heading>{data?.name}</Heading>

          <Flex gap={2} flexWrap="wrap">
            {types.map((type) => {
              return (
                <Box
                  key={type.name}
                  p={2}
                  borderWidth={2}
                  rounded="full"
                  px={4}
                  borderColor="black"
                >
                  <Text>{type.name}</Text>
                </Box>
              );
            })}
          </Flex>

          <Text>{data?.description}</Text>
        </Flex>

        <Spacer flexGrow={1} />

        {/* Click here to delete */}
        {walletAddress === data?.Owner.address && (
          <Box maxW="xs">
            <AppButton
              onClick={() => {
                toast.promise(mutateAsync({ slug: slug as string }), {
                  loading: {
                    title: "Deleting...",
                    colorScheme: "red",
                  },
                  success: {
                    title: "Deleted!",
                    duration: 3000,
                    isClosable: true,
                  },
                  error: {
                    title: "Error",
                    duration: 3000,
                    isClosable: true,
                  },
                });
              }}
            >
              Delete (debug)
            </AppButton>
          </Box>
        )}
      </Flex>
      <Spacer p={5} />

      {data?.Owner.address && (
        <Badge fontSize="md" variant="solid">
          <Text>Owner: {formatAddress(data?.Owner.address)}</Text>
        </Badge>
      )}

      <Spacer p={2} />

      <Spacer p={2} />

      <Box>
        <QuestList />
      </Box>
    </AppContainer>
  );
}

export default Index;

const AvatarSection = () => {
  const { isOpen, onClose, onOpen, onToggle } = useDisclosure();
  const [image, setImage] = useState<string | null>(null);

  const toast = useToast();
  const { mutateAsync } = trpc.community.updateOneBySlug.useMutation();
  const util = trpc.useContext();

  const router = useRouter();
  const slug = router.query.slug;
  const { data } = trpc.community.getOneBySlug.useQuery(
    { slug: slug as string },
    { enabled: !!slug }
  );

  return (
    <>
      <Tooltip label="Change avatar">
        <Avatar
          src={data?.avatarUrl || ""}
          size="xl"
          transition="all 0.2s"
          _hover={{
            transform: "scale(1.1)",
            cursor: "pointer",
          }}
          onClick={() => {
            onToggle();
          }}
          bgPosition="cover"
        ></Avatar>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalBody>
            {image && <Img src={image} />}
            <Widget
              publicKey={env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY}
              onChange={(file) => {
                if (file.cdnUrl) setImage(file.cdnUrl);
              }}
            />
          </ModalBody>
          {image && (
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  if (!image) return;
                  toast.promise(
                    mutateAsync({ avatarUrl: image, slug: slug as string }),
                    {
                      loading: {
                        title: "Saving...",
                        colorScheme: "blue",
                      },
                      success: () => {
                        util.community.getOneBySlug.invalidate({
                          slug: slug as string,
                        });

                        return {
                          title: "Avatar updated",
                          description: "Avatar updated successfully",
                          status: "success",
                        };
                      },
                      error: (error) => {
                        return {
                          title: "Error",
                          description: error.message,
                          status: "error",
                        };
                      },
                    }
                  );
                  onClose();
                }}
              >
                Save
              </Button>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
