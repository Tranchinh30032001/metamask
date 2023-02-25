import {
  Avatar,
  Badge,
  Card,
  CardBody,
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { trpc } from "../../../core/utils/trpc";
import AppCard from "../../../components/AppCard";

type Props = JSX.IntrinsicElements["div"];

function QuestList({ ...rest }: Props) {
  const router = useRouter();
  const slug = router.query.slug;
  const { data } = trpc.community.getOneBySlug.useQuery(
    { slug: slug as string },
    { enabled: !!slug }
  );

  return (
    <>
      <Heading size="lg">Quests</Heading>
      <Spacer p={2} />
      <SimpleGrid columns={2} gap={4}>
        {data?.Community_Quest.map(({ quest }) => {
          return (
            <AppCard
              key={quest.id.toString()}
              shadowBox={{
                bgColor: "yellow.400",
              }}
            >
              <CardBody>
                <Flex alignItems="center" gap={2}>
                  <Avatar
                    size="lg"
                    name={quest.title.toString()}
                    src={data.avatarUrl || ""}
                  />
                  <Text fontWeight="semibold">{data.name}</Text>
                  <Spacer flexGrow={1} />

                  <Badge rounded="md" colorScheme="green">
                    Ongoing
                  </Badge>
                </Flex>
              </CardBody>
            </AppCard>
          );
        })}
      </SimpleGrid>
    </>
  );
}

export default QuestList;
