import {
  useAccount,
  useNetwork,
  usePublicClient,
  useSwitchNetwork,
  useWalletClient,
} from 'use-wagmi';
import { getContract } from 'viem';
import { moonbeam, moonbaseAlpha } from 'use-wagmi/chains';
import { abi } from '../lib/config/abi';

export default function useContract() {
  const nuxtConfig = useRuntimeConfig();

  const { chain } = useNetwork();
  const { address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const publicClient = usePublicClient();
  const { data: walletClient, refetch } = useWalletClient();

  const contractAddress = nuxtConfig.public.nctrContract as `0x${string}`;
  const usedChain = nuxtConfig.public.ENV === AppEnv.PROD ? moonbeam : moonbaseAlpha;
  const contract = ref();

  /**
   * Init contract
   */
  async function initContract() {
    if (!walletClient.value) {
      await refetch();
      await sleep(200);
    }

    await ensureCorrectNetwork();

    contract.value = getContract({
      address: contractAddress,
      abi,
      walletClient: walletClient.value || undefined,
      publicClient: publicClient.value,
    });
  }

  // Contract Interaction
  async function getClaimStatus() {
    return (await contract.value.read.walletClaimed([address.value])) as boolean;
  }

  async function claimTokens(signature, timestamp, amount) {
    return await contract.value.read.claim([signature, timestamp, amount]);
  }

  // Helper
  async function ensureCorrectNetwork() {
    if (!chain || !chain.value || chain.value.id !== usedChain.id) {
      await switchNetwork(usedChain.id);
      return true;
    }
  }

  return {
    initContract,
    getClaimStatus,
    claimTokens,
    ensureCorrectNetwork,
  };
}
