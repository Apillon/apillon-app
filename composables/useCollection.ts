import type { UploadCustomRequestOptions } from 'naive-ui';
import { EvmChain, EvmChainMainnet, EvmChainTestnet, SubstrateChain } from '~/lib/types/nft';
import type { TimeValidator } from 'naive-ui/es/date-picker/src/interface';

export default function useCollection() {
  const router = useRouter();
  const message = useMessage();
  const dataStore = useDataStore();
  const bucketStore = useBucketStore();
  const paymentStore = usePaymentStore();
  const metadataStore = useMetadataStore();
  const collectionStore = useCollectionStore();

  const { t, te } = useI18n();
  const { isEnoughSpaceInStorage } = useUpload();

  const loading = ref<boolean>(false);
  const formRef = ref<NFormInst | null>(null);

  /** Polling */
  let collectionInterval: any = null as any;
  const collectionsInterval: any = null as any;
  let transactionInterval: any = null as any;

  onUnmounted(() => {
    clearInterval(collectionInterval);
    clearInterval(collectionsInterval);
    clearInterval(transactionInterval);
  });

  const isChainAvailable = (chainId: number) =>
    paymentStore.hasPlan(PLAN_NAMES.BUTTERFLY) || !enterpriseChainIDs.includes(chainId);

  const toEvmChainOption = (chain: string) => ({
    name: chain.toLowerCase(),
    label: te(`nft.evmChain.${EvmChain[chain]}`) ? t(`nft.evmChain.${EvmChain[chain]}`) : EvmChain[EvmChain[chain]],
    value: EvmChain[chain],
  });

  const enterpriseChainIDs = enumValues(EvmChain).filter(
    key => ![EvmChainMainnet.MOONBEAM, EvmChainMainnet.ASTAR, EvmChainTestnet.MOONBASE].includes(key as number)
  );

  const chains = enumKeys(EvmChainMainnet).map(c => toEvmChainOption(c));
  const chainsTestnet = enumKeys(EvmChainTestnet).map(c => toEvmChainOption(c));
  const nftChains = [
    ...chains,
    {
      name: SubstrateChain[SubstrateChain.UNIQUE],
      label: t(`nft.chain.${SubstrateChain.UNIQUE}`),
      value: SubstrateChain.UNIQUE,
    },
  ];
  const substrateChains = enumKeys(SubstrateChain)
    .filter(key => SubstrateChain[key] === SubstrateChain.ASTAR)
    .map(k => {
      return {
        name: k.toLowerCase(),
        label: t(`nft.chain.${SubstrateChain[k]}`),
        value: SubstrateChain[k],
      };
    });

  const getChainIconName = (chainId?: number) => {
    return [...nftChains, ...chainsTestnet].find(chain => chain.value === chainId)?.name?.toLowerCase();
  };
  const getChainName = (collectionChain?: number) => {
    return [...nftChains, ...chainsTestnet].find(chain => chain.value === collectionChain)?.label;
  };

  const chainTypes = enumKeys(ChainType).map(k => {
    return {
      name: k.toLowerCase(),
      label: t(`nft.chainType.${ChainType[k]}`),
      value: ChainType[k],
    };
  });

  const booleanSelect = [
    { label: t('form.booleanSelect.true'), value: true },
    { label: t('form.booleanSelect.false'), value: false },
  ];

  const availableNftChains = computed(() => nftChains.filter(c => isChainAvailable(c.value)));
  const availableNftTestChains = computed(() => chainsTestnet.filter(c => isChainAvailable(c.value)));

  const isFormDisabled = computed<boolean>(() => {
    return dataStore.isProjectUser;
  });

  const isUnique = computed(() => {
    return metadataStore.form.smartContract.chain === SubstrateChain.UNIQUE;
  });

  const addressLabel = computed(() =>
    collectionStore.active.chain === SubstrateChain.UNIQUE
      ? t('form.label.nft.addressUnique')
      : collectionStore.active.chainType === ChainType.SUBSTRATE
        ? t('form.label.nft.addressSubstrate')
        : t('form.label.nft.addressEvm')
  );

  function prepareFormData(addBaseUri = false, logo?: Optional<string>, cover?: Optional<string>) {
    const chain =
      metadataStore.form.smartContract.chain === EvmChainMainnet.ASTAR &&
      metadataStore.form.smartContract.chainType === ChainType.SUBSTRATE
        ? SubstrateChain.ASTAR
        : metadataStore.form.smartContract.chain;

    const params: Record<string, string | number | boolean | null | undefined> = {
      chain,
      logoUrl: logo,
      bannerUrl: cover,
      project_uuid: dataStore.projectUuid,
      name: metadataStore.form.smartContract.name,
      symbol: metadataStore.form.smartContract.symbol,
      collectionType: metadataStore.form.smartContract.collectionType,
      maxSupply: metadataStore.form.smartContract.supplyLimited ? metadataStore.form.smartContract.maxSupply : 0,
      isRevokable: metadataStore.form.smartContract.revocable,
      isSoulbound: metadataStore.form.smartContract.soulbound,
      isAutoIncrement: metadataStore.form.smartContract.isAutoIncrement,
      royaltiesAddress:
        metadataStore.form.smartContract.royaltiesFees === 0
          ? undefined
          : metadataStore.form.smartContract.royaltiesAddress,
    };
    if (addBaseUri) {
      params.baseUri = metadataStore.form.smartContract.baseUri;
    }
    if (!isUnique.value) {
      params.baseExtension = metadataStore.form.smartContract.baseExtension;
      params.drop = metadataStore.form.smartContract.dropPrice > 0;
      params.dropPrice = metadataStore.form.smartContract.dropPrice;
      params.dropStart = Math.floor((metadataStore.form.smartContract.dropStart || Date.now()) / 1000);
      params.dropReserve = metadataStore.form.smartContract.dropReserve;
      params.royaltiesFees = metadataStore.form.smartContract.royaltiesFees;
      params.useApillonIpfsGateway = metadataStore.form.smartContract.useApillonIpfsGateway;
      params.useIpns = metadataStore.form.smartContract.useIpns;
    }
    if (metadataStore.form.smartContract.royaltiesFees > 0) {
      params.royaltiesAddress = metadataStore.form.smartContract.royaltiesAddress;
    }
    if (
      metadataStore.form.smartContract.chainType !== ChainType.SUBSTRATE &&
      metadataStore.form.smartContract.adminAddress &&
      metadataStore.form.smartContract.adminAddress.length > 10
    ) {
      params.adminAddress = metadataStore.form.smartContract.adminAddress;
    }
    return params;
  }

  function collectionEndpoint() {
    return isUnique.value
      ? endpoints.collectionsUnique
      : metadataStore.form.smartContract.chain === EvmChainMainnet.ASTAR &&
          metadataStore.form.smartContract.chainType === ChainType.SUBSTRATE
        ? endpoints.collectionsSubstrate
        : endpoints.collections();
  }

  function disablePastDate(ts: number) {
    return ts < new Date().setHours(0, 0, 0, 0);
  }

  function disablePastTime(ts: number): TimeValidator {
    return {
      isHourDisabled: () => ts < Date.now(),
      isMinuteDisabled: () => ts < Date.now(),
      isSecondDisabled: () => ts < Date.now(),
    };
  }

  function uploadFileRequest({ file, onError, onFinish }: UploadCustomRequestOptions, logo: boolean) {
    const uploadedFile: FileListItemType = {
      ...file,
      path: file.fullPath,
      percentage: 0,
      size: file.file?.size || 0,
      timestamp: Date.now(),
      onFinish: onFinish || (() => {}),
      onError: onError || (() => {}),
    };

    if (!isEnoughSpaceInStorage([], uploadedFile)) {
      message.warning(t('validation.notEnoughSpaceInStorage', { name: file.name }));

      /** Mark file as failed */
      onError();
      return;
    } else if (!file.type?.includes('image')) {
      message.warning(t('validation.notImage'));

      /** Mark file as failed */
      onError();
      return;
    }
    if (logo) {
      metadataStore.form.visual.logo = uploadedFile;
    } else {
      metadataStore.form.visual.coverImage = uploadedFile;
    }
  }

  function openAddNft(collectionUuid: string) {
    router.push({ name: 'dashboard-service-nft-slug-add', params: { slug: collectionUuid } });
  }

  function resetAll() {
    bucketStore.resetFolder();
    bucketStore.resetUpload();
    metadataStore.resetMetadata();
  }

  /** Polling */
  function checkUnfinishedCollections() {
    const unfinishedCollection = collectionStore.items.find(
      collection =>
        collection.collectionStatus === CollectionStatus.DEPLOY_INITIATED ||
        collection.collectionStatus === CollectionStatus.DEPLOYING
    );
    if (unfinishedCollection === undefined) {
      return;
    }

    clearInterval(collectionInterval);
    collectionInterval = setInterval(async () => {
      const collections = await collectionStore.fetchCollections(false, false);
      const collection = collections.find(
        collection => collection.collection_uuid === unfinishedCollection.collection_uuid
      );
      if (!collection || collection.collectionStatus >= CollectionStatus.DEPLOYED) {
        clearInterval(collectionInterval);

        if (collectionStore.active?.collection_uuid === collection?.collection_uuid) {
          collectionStore.active = collection;
        }
      }
    }, 30000);
  }
  function checkUnfinishedCollection() {
    if (collectionStore.active.collectionStatus === CollectionStatus.CREATED) {
      return;
    }
    if (collectionStore.active.collectionStatus >= CollectionStatus.DEPLOYED) {
      clearInterval(collectionInterval);
      return;
    }

    clearInterval(collectionInterval);
    collectionInterval = setInterval(async () => {
      const collection = await collectionStore.fetchCollection(collectionStore.active.collection_uuid);
      if (!collection || collection.collectionStatus >= CollectionStatus.DEPLOYED) {
        if (collection) {
          collectionStore.active = collection;
          await collectionStore.fetchCollectionTransactions(collectionStore.active.collection_uuid, false);
        }
        clearInterval(collectionInterval);
        checkUnfinishedTransactions();
      }
    }, 10000);
  }
  function checkUnfinishedTransactions() {
    const unfinishedTransaction = collectionStore.transaction.find(
      transaction => transaction.transactionStatus < TransactionStatus.CONFIRMED
    );
    if (unfinishedTransaction === undefined) {
      clearInterval(transactionInterval);
      return;
    }

    clearInterval(transactionInterval);
    transactionInterval = setInterval(async () => {
      const transactions = await collectionStore.fetchCollectionTransactions(
        collectionStore.active.collection_uuid,
        false
      );
      const transaction = transactions.find(transaction => transaction.id === unfinishedTransaction.id);
      if (!transaction || transaction.transactionStatus >= TransactionStatus.CONFIRMED) {
        clearInterval(transactionInterval);
        collectionStore.active =
          (await collectionStore.fetchCollection(collectionStore.active.collection_uuid)) || collectionStore.active;
      }
    }, 10000);
  }

  return {
    addressLabel,
    availableNftChains,
    availableNftTestChains,
    booleanSelect,
    chains,
    chainsTestnet,
    chainTypes,
    enterpriseChainIDs,
    formRef,
    isFormDisabled,
    isUnique,
    loading,
    nftChains,
    substrateChains,
    checkUnfinishedCollections,
    checkUnfinishedCollection,
    checkUnfinishedTransactions,
    collectionEndpoint,
    disablePastDate,
    disablePastTime,
    getChainName,
    getChainIconName,
    isChainAvailable,
    openAddNft,
    prepareFormData,
    resetAll,
    uploadFileRequest,
  };
}
