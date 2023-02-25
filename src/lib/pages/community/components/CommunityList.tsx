import {
  AspectRatio,
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardBody,
  Center,
  Heading,
  Image,
  SimpleGrid,
  Spacer,
  Spinner,
  useMediaQuery,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  Container,
  Next,
  PageGroup,
  Paginator,
  Previous,
  usePaginator,
} from "chakra-paginator";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "../../../core/utils/trpc";
import AppContainer from "../../../components/AppContainer";

const LIMIT = 12;

const CommunityList = () => {
  const { currentPage, setCurrentPage } = usePaginator({
    initialState: { currentPage: 1 },
  });
  const { data, isLoading } = trpc.community.getAll.useQuery({
    limit: LIMIT,
    offset: (currentPage - 1) * LIMIT,
  });
  const router = useRouter();

  useEffect(() => {
    setCurrentPage(parseInt(router.query.page as string) || 1);
  }, [router.query.page, setCurrentPage]);
  const [isBiggerThan600] = useMediaQuery("(min-width: 800px)");

  const avatars = [
    {
      name: "Ryan Florence",
      src: "https://bit.ly/ryan-florence",
    },
    {
      name: "Segun Adebayo",
      src: "https://bit.ly/sage-adebayo",
    },
    {
      name: "Kent Dodds",
      src: "https://bit.ly/prosper-baba",
    },
    {
      name: "Prosper Otemuyiwa",
      src: "https://bit.ly/prosper-baba",
    },
  ];

  return isLoading ? (
    <AppContainer>
      <Center>
        <Spinner />
      </Center>
    </AppContainer>
  ) : (
    <Box>
      <SimpleGrid columns={isBiggerThan600 ? 6 : 3} gap={2} mt={4}>
        {data?.communities?.map((community) => (
          <Link
            href={`/community/${community.slug}`}
            key={community.id.toString()}
          >
            <Card variant="outline" borderColor="black" borderWidth={2}>
              <CardBody>
                <AspectRatio ratio={1} width="100px">
                  <Image
                    src={community.avatarUrl || ""}
                    rounded="2xl"
                    alt="community"
                  />
                </AspectRatio>
                <Spacer p={1} />

                <Heading size="sx" isTruncated>
                  {community.name}
                </Heading>
                <Spacer p={2} />
                <Wrap>
                  <AvatarGroup size="sm" max={3}>
                    {avatars.map((avatar) => (
                      <WrapItem key={avatar.name}>
                        <Avatar name={avatar.name} src={avatar.src} size="sm" />
                      </WrapItem>
                    ))}
                  </AvatarGroup>
                </Wrap>
              </CardBody>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
      {!!data?.count && (
        <>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <Paginator
            pagesQuantity={Math.ceil(data?.count / LIMIT)}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            normalStyles={{
              width: "3rem",
              height: "3rem",
            }}
            activeStyles={{
              width: "3rem",
              height: "3rem",
              background: "gray.300",
            }}
          >
            <Container align="center" justify="space-between" w="full" p={4}>
              <Previous>
                Previous
                {/* Or an icon from `react-icons` */}
              </Previous>
              <PageGroup isInline align="center" />
              <Next>
                Next
                {/* Or an icon from `react-icons` */}
              </Next>
            </Container>
          </Paginator>
        </>
      )}
    </Box>
  );
};

export default CommunityList;
