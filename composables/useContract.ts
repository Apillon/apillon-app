import {
  mainnet,
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

  const contractAddress = '0xddf5F225218fd09Ffa39712aFd9a4Bc34b21b473'; // HARDCODED THIS ONE
  const usedChain = nuxtConfig.public.ENV === AppEnv.PROD ? moonbeam : moonbaseAlpha;
  const contract = ref();

  async function getClaimStatus() {
    return (await contract.value.read.walletClaimed([address.value])) as boolean;
  }

  /**
   * Helper for init contract
   */
  async function initContract() {
    if (!walletClient.value) {
      await refetch();
      await sleep(200);
    }
    if (!chain || !chain.value || chain?.value.id !== usedChain.id) {
      switchNetwork(usedChain.id);
    }

    contract.value = getContract({
      address: contractAddress,
      abi,
      walletClient: walletClient.value || undefined,
      publicClient: publicClient.value,
    });

    console.log(contract.value.read);
  }

  return {
    initContract,
    getClaimStatus,
  };
}
