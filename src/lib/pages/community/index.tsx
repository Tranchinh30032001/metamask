import { Button, Flex, Heading, Spacer } from "@chakra-ui/react";
import { type NextPage } from "next";
import Link from "next/link";
import { trpc } from "../../core/utils/trpc";
import AppButton from "../../components/AppButton";
import AppContainer from "../../components/AppContainer";
import { hooks } from "../../core/connectors/metaMask";
import CommunityList from "./components/CommunityList";

const {
  useChainId,
  useAccounts,
  useIsActivating,
  useIsActive,
  useProvider,
  useENSNames,
} = hooks;

const HomePage: NextPage = () => {
  return (
    <AppContainer>
      <Flex justifyContent="between" alignItems="center">
        <Heading size="lg">Community</Heading>

        <Spacer flexGrow={1} />

        <Link href="/community/create">
          <AppButton>Create Community</AppButton>
        </Link>
      </Flex>
      <CommunityList />
    </AppContainer>
  );
};

export default HomePage;
