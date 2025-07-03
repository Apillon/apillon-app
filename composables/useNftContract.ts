import { useChainId, useChains, useClient, useConnectorClient } from '@wagmi/vue';
import type { Address, Client, Transport, Chain, Account } from 'viem';
import { createPublicClient, getContract, http } from 'viem';
import { nftAbi } from '~/lib/config/abi';

const contracts = reactive<{ [key: string]: any }>({});
const readContracts = reactive<{ [key: string]: any }>({});
const publicClients = reactive<Record<number, Client<Transport, Chain | undefined, Account | undefined>>>({});

export default function useNftContract() {
  const chainId = useChainId();
  const chains = useChains();
  const publicClient = useClient();
  const { data: walletClient, refetch } = useConnectorClient();

  const activeChain = computed(() => chains.value.find(chain => chain.id === chainId.value)) || chains[0];

  function initPublicClient(id: number) {
    chains.value.forEach(chain => {
      if (id === chain.id) {
        publicClients[chain.id] = createPublicClient({
          chain,
          transport: http(),
        });
      }
    });
  }

  function getPublicClient(id: number) {
    if (!(id in publicClients)) {
      initPublicClient(id);
    }
    return publicClients[id];
  }

  /**
   * Init contract
   */
  async function initContract(contractAddress: Address) {
    if (!walletClient.value) {
      await refetch();
      await sleep(200);
    }
    if (!(contractAddress in contracts)) {
      contracts[contractAddress] = getContract({
        address: contractAddress,
        abi: nftAbi,
        walletClient: walletClient.value,
        publicClient: publicClient.value,
      });
    }

    return contracts[contractAddress];
  }

  async function initReadContract(address: Address, chainId: number) {
    if (!(address in contracts)) {
      readContracts[address] = getContract({
        address,
        abi: nftAbi,
        client: getPublicClient(chainId),
      });
    }

    return readContracts[address];
  }

  /** Actions */
  async function getAllTokens(address: Address, chainId: number): Promise<number[]> {
    try {
      const contract = await initReadContract(address, chainId);
      return (await contract.read.allTokens()).map(i => Number(i));
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  return {
    activeChain,
    getAllTokens,
    getPublicClient,
    initContract,
    initReadContract,
  };
}
