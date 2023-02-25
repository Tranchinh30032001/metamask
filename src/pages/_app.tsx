import { ChakraProvider } from "@chakra-ui/react";
import type { Web3ReactHooks } from "@web3-react/core";
import { Web3ReactProvider } from "@web3-react/core";
import type { MetaMask } from "@web3-react/metamask";
import type { Network } from "@web3-react/network";
import { type AppType } from "next/app";
import Head from "next/head";
import {
  hooks as metaMaskHooks,
  metaMask,
} from "../lib/core/connectors/metaMask";
import { hooks as networkHooks, network } from "../lib/core/connectors/network";
import DefaultLayout from "../lib/layouts/DefaultLayout";
import "../lib/core/styles/globals.css";
import { theme } from "../lib/core/utils/theme";
import { trpc } from "../lib/core/utils/trpc";

const connectors: [MetaMask | Network, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [network, networkHooks],
];
const MyApp: AppType = ({ Component, pageProps }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const Layout = Component.layout || DefaultLayout;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const title: string = Component.title || "Canto Quest";

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>{title}</title>
      </Head>
      <Web3ReactProvider connectors={connectors}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Web3ReactProvider>
    </ChakraProvider>
  );
};

export default trpc.withTRPC(MyApp);
