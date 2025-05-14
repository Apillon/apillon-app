import { useAccount, useClient, useSwitchChain, useConnectorClient, useAccountEffect } from '@wagmi/vue';
import { getContract } from 'viem';
import { moonbeam } from '@wagmi/vue/chains';
import { abi } from '~/lib/config/abi';
const nuxtConfig = useRuntimeConfig();

const contractAddress = nuxtConfig.public.nctrContract as `0x${string}`;
const usedChain = moonbeam;

const contract = ref();
const claimError = ref(false);
const claimSuccess = ref(false);
const loading = ref(false);
const transactionHash = ref<`0x${string}` | undefined>(undefined);

export default function useContract() {
  const { address } = useAccount();
  const { switchChain } = useSwitchChain();
  const publicClient = useClient();
  const { data: walletClient, refetch } = useConnectorClient();
  const referralStore = useReferralStore();
  const savedWallet = ref(referralStore.tokenClaim.wallet);
  useAccountEffect({ onConnect: onWalletConnected });

  /**
   * Init contract
   */
  async function initContract() {
    if (!walletClient.value) {
      await refetch();
      await sleep(200);
    }
    contract.value = null;
    contract.value = getContract({
      address: contractAddress,
      abi,
      walletClient: walletClient.value || undefined,
      publicClient: publicClient.value,
    });
  }

  // Contract Interaction
  async function getClaimStatus(): Promise<boolean> {
    try {
      return (await contract.value.read.walletClaimed([savedWallet.value])) as boolean;
    } catch (e) {
      console.error(e);
    }
    return false;
  }
  // amount timestamp signature
  async function claimTokens(amount, timestamp, signature) {
    if (!publicClient.value) return null;
    claimError.value = false;
    claimSuccess.value = false;

    try {
      const gas = await publicClient.value.estimateContractGas({
        address: contractAddress,
        abi: abi,
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
    if (!publicClient.value) return null;
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
    await switchChain({ chainId: usedChain.id });
    return true;
  }

  async function onWalletConnected() {
    await initContract();
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
    usedChain,
    address,
  };
}
