import {
  useAccount,
  useNetwork,
  usePublicClient,
  useSwitchNetwork,
  useWalletClient,
} from 'use-wagmi';
import { getContract } from 'viem';
import { moonbeam, moonbaseAlpha } from 'use-wagmi/chains';
const nuxtConfig = useRuntimeConfig();

const contractAddress = nuxtConfig.public.nctrContract as `0x${string}`;
const usedChain = nuxtConfig.public.ENV === AppEnv.PROD ? moonbeam : moonbaseAlpha;

const contract = ref();
const claimError = ref(false);
const claimSuccess = ref(false);
const loading = ref(false);
const transactionHash = ref<`0x${string}` | undefined>(undefined);

export default function useContract() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const publicClient = usePublicClient();
  const { data: walletClient, refetch } = useWalletClient();

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
  // amount timestamp signature
  async function claimTokens(amount, timestamp, signature) {
    claimError.value = false;
    claimSuccess.value = false;
    try {
      const gas = await publicClient.value.estimateContractGas({
        address: contractAddress,
        abi,
        functionName: 'claim',
        args: [amount, timestamp, signature],
        account: address.value,
      });

      const gasLimit = (gas * 110n) / 100n;

      const tx = await contract.value.write.claim([amount, timestamp, signature], {}, { gasLimit });
      transactionHash.value = tx;
      pollTransactionStatus(tx);
    } catch (error) {
      console.error('Transaction failed', error);
      loading.value = false;
      claimError.value = true;
    }
  }

  async function pollTransactionStatus(tx: `0x${string}`) {
    loading.value = true;
    try {
      await publicClient.value.waitForTransactionReceipt({ hash: tx });
      claimSuccess.value = true;
      loading.value = false;
    } catch (error) {
      console.error(error);
      loading.value = false;
      claimError.value = true;
    }
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
    claimError,
    claimSuccess,
    loading,
    transactionHash,
  };
}
