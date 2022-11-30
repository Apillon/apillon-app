// import { ethers } from 'ethers';
// import Contracts, { getContractAddressForEnv } from '~~/config/contracts';

/**
 * Shared state
 * Be Careful, it is reactive !!1
 * -1 = unlimited
 */
// const contracts = reactive<{ [key: string]: any }>({});
// const availableTokens = reactive<{ [key: string]: number }>({});

export default function useContracts() {
  const { provider } = useProvider();

  /**
   * Initialize shared state
 
  if (Contracts && !!Object.keys(Contracts).length) {
    for (const contractType in Contracts) {
      if (!(contractType in availableTokens)) {
        availableTokens[contractType] = -1;
      }

      if (!(contractType in contracts)) {
        contracts[contractType] = null;
      }
    }
  }  */

  async function getMessageSignature(message: string) {
    if (!provider.value) {
      return '';
    }

    try {
      const signedMessage = await provider.value.getSigner().signMessage(message);
      return signedMessage;
    } catch (e) {
      console.error(e);
    }

    return '';
  }

  /**
   * Initialize contracts if not yet initialized or selected chain changed
   
  async function initContracts(types: string[], overrideAddresses = []) {
    if (Array.isArray(types)) {
      const { chainId } = await provider.value.getNetwork();

      await Promise.all(
        types.map(async (x, i) => {
          if (!x || !(x in contracts)) {
            return;
          }

          if (!contracts[x]) {
            initContract(x, i < overrideAddresses.length && overrideAddresses[i]);
          } else if (contracts[x].provider) {
            // Check if chain changed
            const { chainId: contractChainId } = await contracts[x].provider.getNetwork();
            if (contractChainId !== chainId) {
              initContract(x, i < overrideAddresses.length && overrideAddresses[i]);
            }
          }
        })
      );
    } else {
      console.error('array expected');
    }
  } */

  /**
   * Helper for initializing specific contract
  
  function initContract(type: string, overrideAddress: string | false = '') {
    if (Contracts) {
      if (type in Contracts) {
        contracts[type] = new ethers.Contract(
          overrideAddress || getContractAddressForEnv(type, 'development'),
          Contracts[type].abi,
          provider.value
        );
      }
    }
  } */

  /**
  function areContractsAvailable(types: string[]) {
    if (Array.isArray(types)) {
      return !types.some(x => {
        if (!x) {
          return false;
        }

        if (!(x in contracts) || !contracts[x] || !contracts[x].provider) {
          return true;
        }

        return false;
      });
    } else {
      console.error('array expected');
    }

    return false;
  } */

  /** 
  function contractError(e: any) {
    console.error(e);
    console.dir(e);

    // ignore user declined
    if (e?.code !== 4001) {
      // $store.commit('modal/RESET_CONTENT')
      // if (e?.error?.message?.includes('insufficient funds')) {
      //   // Insufficient funds
      // } else if (e?.error?.message?.includes('Purchase would exceed max supply')) {
      //   // Max supply exceeded
      // } else if (e?.error?.message?.includes('Wallet already used')) {
      //   // Wallet already used
      // } else if (e?.error?.message?.includes('Only WL addresses allowed.')) {
      //   // Wallet not whitelisted
      // } else if (e?.error?.message?.includes('transfer caller is not owner nor approved')) {
      //   // Wallet not approved to use functionality
      // } else if (
      //   e?.error?.message?.includes('transfer of token that is not own') ||
      //   e?.error?.message?.includes('getMessageSignatureInvalid tokenId')
      // ) {
      //   // Stake went through already, owner is now Gateway contract
      // } else {
      //   // Blockchain communication error
      // }
    }
  } */

  return {
    // contracts,
    // availableTokens,

    getMessageSignature,
    // initContracts,
    // areContractsAvailable,
    // contractError,
  };
}
