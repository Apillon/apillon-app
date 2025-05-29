import type { FormItemRule, UploadCustomRequestOptions } from 'naive-ui';
import { EvmChain, EvmChainMainnet, EvmChainTestnet, SubstrateChain } from '~/lib/types/nft';
import type { TimeValidator } from 'naive-ui/es/date-picker/src/interface';

export default function useCollection() {
  const router = useRouter();
  const message = useMessage();
  const { t, te } = useI18n();
  const dataStore = useDataStore();
  const bucketStore = useBucketStore();
  const paymentStore = usePaymentStore();
  const metadataStore = useMetadataStore();
  const collectionStore = useCollectionStore();

  const { isEnoughSpaceInStorage } = useUpload();

  const loading = ref<boolean>(false);
  const formRef = ref<NFormInst | null>(null);

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

  const isSupplyLimited = computed(() => {
    return metadataStore.form.smartContract.supplyLimited;
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

  /**
   * Rules
   */
  const rules: NFormRules = {
    symbol: ruleRequired(t('validation.collection.symbolRequired')),
    name: ruleRequired(t('validation.collection.nameRequired')),
    chain: ruleRequired(t('validation.collection.chainRequired')),
    chainType: ruleRequired(t('validation.collection.chainTypeRequired')),
    collectionType: ruleRequired(t('validation.collection.typeRequired')),
    baseUri: [
      ruleRequired(t('validation.collection.baseUriRequired')),
      { type: 'url', message: t('validation.collection.baseUri') },
    ],
    baseExtension: ruleRequired(t('validation.collection.baseExtensionRequired')),
    maxSupply: {
      max: NFT_MAX_SUPPLY,
      validator: validateMaxSupply,
      message: t('validation.collection.maxSupplyReached', { max: NFT_MAX_SUPPLY }),
    },
    dropPrice: [
      ruleRequired(t('validation.collection.dropPrice')),
      { validator: validateDropPrice, message: t('validation.collection.dropPrice') },
    ],
    dropStart: {
      validator: validateDropStart,
      message: t('validation.collection.dropStart'),
    },
    dropReserve: [
      ruleRequired(t('validation.collection.dropReserve')),
      { validator: validateReserve, message: t('validation.collection.dropReserve') },
    ],
    royaltiesAddress: [
      { required: isRoyaltyRequired(), message: t('validation.collection.royaltiesAddressRequired') },
      { validator: validateRoyaltiesAddress, message: t('validation.collection.royaltiesAddress') },
    ],
    royaltiesFees: [
      ruleRequired(t('validation.collection.royaltiesFeesRequired')),
      { validator: validateNaturalNumber, message: t('validation.collection.royaltiesFees') },
    ],
  };

  const rulesSingle: NFormRules = {
    collectionUuid: ruleRequired(t('validation.nft.collection')),
    id: [
      ruleRequired(t('validation.nft.idRequired')),
      { validator: validateSingleNftIdUnique, message: t('validation.nft.idDuplicate') },
    ],
    image: ruleRequired(t('validation.nft.image')),
    name: ruleRequired(t('validation.nft.name')),
    description: ruleRequired(t('validation.nft.description')),
    attributes: { validator: validateAttributes, message: t('validation.nft.attributes') },
  };

  function prepareFormData(addBaseUri = false) {
    const chain =
      metadataStore.form.smartContract.chain === EvmChainMainnet.ASTAR &&
      metadataStore.form.smartContract.chainType === ChainType.SUBSTRATE
        ? SubstrateChain.ASTAR
        : metadataStore.form.smartContract.chain;

    const params: Record<string, string | number | boolean | null | undefined> = {
      chain,
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

  /**
   * Validations
   */
  function validateReserve(_: FormItemRule, value: number): boolean {
    return (
      !metadataStore.form.smartContract.supplyLimited ||
      metadataStore.form.smartContract.maxSupply === 0 ||
      value <= metadataStore.form.smartContract.maxSupply
    );
  }
  function validateMaxSupply(_: FormItemRule, value: number): boolean {
    return value <= NFT_MAX_SUPPLY && (isSupplyLimited.value ? value > 0 : true);
  }
  function validateDropStart(_: FormItemRule, value: number): boolean {
    return metadataStore.form.smartContract.dropPrice === 0 || value > Date.now();
  }
  function validateDropPrice(_: FormItemRule, value: number): boolean {
    return metadataStore.form.smartContract.dropPrice === 0 || (value >= 0.00001 && value <= 10000000000);
  }
  function validateRoyaltiesAddress(_: FormItemRule, value: string): boolean {
    return (
      !isRoyaltyRequired() ||
      (isUnique.value
        ? substrateAddressValidate(_, value, SubstrateChainPrefix.UNIQUE)
        : metadataStore.form.smartContract.chainType === ChainType.SUBSTRATE
          ? substrateAddressValidate(_, value, SubstrateChainPrefix.ASTAR)
          : validateEvmAddress(_, value))
    );
  }
  function validateSingleNftIdUnique(_: FormItemRule): boolean {
    if (metadataStore.metadata.length >= 1) {
      return !metadataStore.metadata.find(item => item.id === metadataStore.form.single.id);
    }
    return true;
  }
  function validateAttributes(_: FormItemRule, values: AttributeInterface[]): boolean {
    return values.every(v => !!v.display_type && !!v.trait_type && v.value);
  }

  function isRoyaltyRequired() {
    return (
      (metadataStore.form.smartContract.chainType === ChainType.EVM &&
        metadataStore.form.smartContract.royaltiesFees > 0) ||
      (metadataStore.form.smartContract.chainType === ChainType.SUBSTRATE &&
        metadataStore.form.smartContract.dropPrice > 0)
    );
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
    rules,
    rulesSingle,
    substrateChains,
    collectionEndpoint,
    disablePastDate,
    disablePastTime,
    isChainAvailable,
    openAddNft,
    prepareFormData,
    resetAll,
    uploadFileRequest,
  };
}
