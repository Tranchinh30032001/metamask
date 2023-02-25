import { env } from "../../../env/client.mjs";
import { hooks } from "../connectors/metaMask";
import { trpc } from "../utils/trpc";

const { useIsActive, useChainId } = hooks;

export const useAuth = () => {
  const { data, isLoading } = trpc.auth.getSession.useQuery();
  const isActive = useIsActive();
  const isRightChainId = useChainId() === env.NEXT_PUBLIC_CHAIN_ID;
  const logout = trpc.auth.logout.useMutation();

  return {
    isLoggedIn: data?.isLoggedIn && isActive,
    isWalletConnected: isActive,
    isRightChainId,
    logout,
    isLoading,
    walletAddress:
      (isActive && (window?.ethereum as any)?.selectedAddress) || null,
  };
};
