import type { FormItemRule, UploadCustomRequestOptions } from 'naive-ui';
import IconInfo from '../components/parts/Icon/Info.vue';
import { EvmChain, SubstrateChain } from '~/lib/types/nft';
import type { TimeValidator } from 'naive-ui/es/date-picker/src/interface';

export default function useCollection() {
  const router = useRouter();
  const { t, te } = useI18n();
  const message = useMessage();
  const dataStore = useDataStore();
  const bucketStore = useBucketStore();
  const collectionStore = useCollectionStore();

  const { isEnoughSpaceInStorage } = useUpload();

  const loading = ref<boolean>(false);
  const formRef = ref<NFormInst | null>(null);

  const chains = enumKeys(Chains)
    .filter(key => Chains[key] !== Chains.ASTAR_SHIBUYA)
    .map(k => {
      return { name: k.toLowerCase(), label: t(`nft.chain.${Chains[k]}`), value: Chains[k] };
    });
  const nftChains = [
    ...chains,
    {
      name: SubstrateChain.UNIQUE,
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
  const evmChains = enumKeys(EvmChain)
    .filter(key => [EvmChain.ETHEREUM, EvmChain.SEPOLIA].includes(EvmChain[key]))
    .map(k => {
      return { name: k.toLowerCase(), label: t(`nft.evmChain.${EvmChain[k]}`), value: EvmChain[k] };
    });

  const chainTypes = enumKeys(ChainType).map(k => {
    return {
      name: k.toLowerCase(),
      label: t(`nft.chainType.${ChainType[k]}`),
      value: ChainType[k],
    };
  });
  const collectionTypes = enumKeys(NFTCollectionType).map(k => {
    return {
      name: k.toLowerCase(),
      label: t(`nft.collection.type.${NFTCollectionType[k]}`),
      value: NFTCollectionType[k],
    };
  });

  const supplyTypes = [
    { label: t('form.supplyTypes.unlimited'), value: 0 },
    { label: t('form.supplyTypes.limited'), value: 1 },
  ];
  const booleanSelect = [
    { label: t('form.booleanSelect.true'), value: true },
    { label: t('form.booleanSelect.false'), value: false },
  ];

  const isFormDisabled = computed<boolean>(() => {
    return dataStore.isProjectUser;
  });

  const isSupplyLimited = computed(() => {
    return collectionStore.form.behavior.supplyLimited === 1;
  });

  const isUnique = computed(() => {
    return collectionStore.form.behavior.chain === SubstrateChain.UNIQUE;
  });

  /**
   * Rules
   */
  const rulesBaseUri: FormItemRule[] = [
    ruleRequired(t('validation.collection.baseUriRequired')),
    {
      type: 'url',
      message: t('validation.collection.baseUri'),
    },
  ];
  const rulesMaxSupply: FormItemRule[] = [
    {
      max: NFT_MAX_SUPPLY,
      validator: validateMaxSupply,
      message: t('validation.collection.maxSupplyReached', {
        max: NFT_MAX_SUPPLY,
      }),
    },
  ];
  const rulesDropPrice: FormItemRule[] = [
    ruleRequired(t('validation.collection.dropPrice')),
    {
      validator: validateDropPrice,
      message: t('validation.collection.dropPrice'),
    },
  ];
  const rulesDropReserve: FormItemRule[] = [
    ruleRequired(t('validation.collection.dropReserve')),
    {
      validator: validateReserve,
      message: t('validation.collection.dropReserve'),
    },
  ];
  const rulesRoyaltiesAddress: FormItemRule[] = [
    {
      required: isRoyaltyRequired(),
      message: t('validation.collection.royaltiesAddressRequired'),
    },
    {
      validator: validateRoyaltiesAddress,
      message: t('validation.collection.royaltiesAddress'),
    },
  ];
  const rulesRoyaltyFee: FormItemRule[] = [
    ruleRequired(t('validation.collection.royaltiesFeesRequired')),
    {
      validator: validateNaturalNumber,
      message: t('validation.collection.royaltiesFees'),
    },
  ];
  const validateSingleIdRequired: FormItemRule[] = [
    ruleRequired(t('validation.nftIdRequired')),
    {
      validator: validateSingleNftIdUnique,
      message: t('validation.nftIdDuplicate'),
    },
  ];

  const rules: NFormRules = {
    symbol: ruleRequired(t('validation.collection.symbolRequired')),
    'base.symbol': ruleRequired(t('validation.collection.symbolRequired')),
    name: ruleRequired(t('validation.collection.nameRequired')),
    'base.name': ruleRequired(t('validation.collection.nameRequired')),
    chain: ruleRequired(t('validation.collection.chainRequired')),
    'base.chain': ruleRequired(t('validation.collection.chainRequired')),
    'base.chainType': ruleRequired(t('validation.collection.chainTypeRequired')),
    collectionType: ruleRequired(t('validation.collection.typeRequired')),
    'base.collectionType': ruleRequired(t('validation.collection.typeRequired')),
    baseUri: rulesBaseUri,
    'behavior.baseUri': rulesBaseUri,
    baseExtension: ruleRequired(t('validation.collection.baseExtensionRequired')),
    'behavior.baseExtension': ruleRequired(t('validation.collection.baseExtensionRequired')),
    maxSupply: rulesMaxSupply,
    dropPrice: rulesDropPrice,
    'behavior.dropPrice': rulesDropPrice,
    dropStart: {
      validator: validateDropStart,
      message: t('validation.collection.dropStart'),
    },
    'behavior.dropStart': {
      validator: validateDropStart,
      message: t('validation.collection.dropStart'),
    },
    dropReserve: rulesDropReserve,
    'behavior.dropReserve': rulesDropReserve,
    royaltiesAddress: rulesRoyaltiesAddress,
    'behavior.royaltiesAddress': rulesRoyaltiesAddress,
    royaltiesFees: rulesRoyaltyFee,
    'behavior.royaltiesFees': rulesRoyaltyFee,
  };

  const rulesSingle: NFormRules = {
    id: validateSingleIdRequired,
    collectionUuid: ruleRequired(t('validation.nftCollection')),
    name: ruleRequired(t('validation.nftName')),
    description: ruleRequired(t('validation.nftDescription')),
  };

  function prepareFormData(addBaseUri = false) {
    const chain =
      collectionStore.form.behavior.chain === Chains.ASTAR &&
      collectionStore.form.behavior.chainType === ChainType.SUBSTRATE
        ? SubstrateChain.ASTAR
        : collectionStore.form.behavior.chain;

    const params: Record<string, string | number | boolean | null | undefined> = {
      chain,
      project_uuid: dataStore.projectUuid,
      name: collectionStore.form.base.name,
      symbol: collectionStore.form.base.symbol,
      collectionType: collectionStore.form.behavior.collectionType,
      maxSupply: collectionStore.form.behavior.supplyLimited === 1 ? collectionStore.form.behavior.maxSupply : 0,
      isRevokable: collectionStore.form.behavior.revocable,
      isSoulbound: collectionStore.form.behavior.soulbound,
      royaltiesAddress:
        collectionStore.form.behavior.royaltiesFees === 0 ? undefined : collectionStore.form.behavior.royaltiesAddress,
    };
    if (addBaseUri) {
      params.baseUri = collectionStore.form.behavior.baseUri;
    }
    if (!isUnique.value) {
      params.baseExtension = collectionStore.form.behavior.baseExtension;
      params.drop = collectionStore.form.behavior.drop;
      params.dropPrice = collectionStore.form.behavior.dropPrice;
      params.dropStart = Math.floor((collectionStore.form.behavior.dropStart || Date.now()) / 1000);
      params.dropReserve = collectionStore.form.behavior.dropReserve;
      params.royaltiesFees = collectionStore.form.behavior.royaltiesFees;
      params.useApillonIpfsGateway = collectionStore.form.behavior.useApillonIpfsGateway;
      params.useIpns = collectionStore.form.behavior.useIpns;
    }
    if (collectionStore.form.behavior.royaltiesFees > 0) {
      params.royaltiesAddress = collectionStore.form.behavior.royaltiesAddress;
    }
    return params;
  }

  function collectionEndpoint() {
    return isUnique.value
      ? endpoints.collectionsUnique
      : collectionStore.form.behavior.chain === Chains.ASTAR &&
          collectionStore.form.behavior.chainType === ChainType.SUBSTRATE
        ? endpoints.collectionsSubstrate
        : endpoints.collections();
  }

  /**
   * Validations
   */
  function validateReserve(_: FormItemRule, value: number): boolean {
    return (
      collectionStore.form.behavior.supplyLimited === 0 ||
      collectionStore.form.behavior.maxSupply === 0 ||
      value <= collectionStore.form.behavior.maxSupply
    );
  }
  function validateMaxSupply(_: FormItemRule, value: number): boolean {
    return value <= NFT_MAX_SUPPLY && (isSupplyLimited.value ? value > 0 : true);
  }
  function validateDropStart(_: FormItemRule, value: number): boolean {
    return !collectionStore.form.behavior.drop || value > Date.now();
  }
  function validateDropPrice(_: FormItemRule, value: number): boolean {
    return !collectionStore.form.behavior.drop || (value > 0 && value < Number.MAX_SAFE_INTEGER);
  }
  function validateRoyaltiesAddress(_: FormItemRule, value: string): boolean {
    return (
      !isRoyaltyRequired() ||
      (isUnique.value
        ? substrateAddressValidate(_, value, SubstrateChainPrefix.UNIQUE)
        : collectionStore.form.behavior.chainType === ChainType.SUBSTRATE
          ? substrateAddressValidate(_, value, SubstrateChainPrefix.ASTAR)
          : validateEvmAddress(_, value))
    );
  }
  function validateSingleNftIdUnique(_: FormItemRule): boolean {
    if (collectionStore.metadata.length >= 1) {
      return !collectionStore.metadata.find(item => item.id === collectionStore.form.single.id);
    }
    return true;
  }

  function isRoyaltyRequired() {
    return (
      (collectionStore.form.behavior.chainType === ChainType.EVM && collectionStore.form.behavior.royaltiesFees > 0) ||
      (collectionStore.form.behavior.chainType === ChainType.SUBSTRATE && collectionStore.form.behavior.drop)
    );
  }

  function disablePastDate(ts: number) {
    return ts < new Date().setHours(0, 0, 0, 0);
  }

  function disablePastTime(ts: number): TimeValidator {
    return {
      isHourDisabled: (hour: number) => ts < Date.now(),
      isMinuteDisabled: (minute: number, hour: number | null) => ts < Date.now(),
      isSecondDisabled: (second: number, minute: number | null, hour: number | null) => ts < Date.now(),
    };
  }

  function chainCurrency() {
    switch (collectionStore.form.behavior.chain) {
      case Chains.ASTAR:
        return 'ASTR';
      default:
        return 'GLMR';
    }
  }

  function uploadFileRequest({ file, onError, onFinish }: UploadCustomRequestOptions, logo: boolean) {
    const uploadedFile: FileListItemType = {
      ...file,
      fullPath: file.fullPath,
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
    } else if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      message.warning(t('validation.notImage'));

      /** Mark file as failed */
      onError();
      return;
    }
    if (logo) {
      collectionStore.form.base.logo = uploadedFile;
    } else {
      collectionStore.form.base.coverImage = uploadedFile;
    }
  }

  function openAddNft(collectionUuid: string) {
    router.push({ name: 'dashboard-service-nft-slug-add', params: { slug: collectionUuid } });
  }

  function onChainChange(chain: number) {
    if (chain === Chains.ASTAR_SHIBUYA) {
      collectionStore.form.behavior.chainType = ChainType.SUBSTRATE;
    } else if (chain !== Chains.ASTAR) {
      collectionStore.form.behavior.chainType = ChainType.EVM;
    }
  }

  function resetAll() {
    bucketStore.resetFolder();
    bucketStore.resetUpload();
    collectionStore.resetCache();
    collectionStore.resetForms();
    collectionStore.resetMetadata();
    collectionStore.metadataStored = null;
  }

  return {
    loading,
    formRef,
    chains,
    chainTypes,
    collectionTypes,
    evmChains,
    isUnique,
    nftChains,
    substrateChains,
    supplyTypes,
    booleanSelect,
    rules,
    rulesSingle,
    isFormDisabled,
    chainCurrency,
    collectionEndpoint,
    disablePastDate,
    disablePastTime,
    onChainChange,
    openAddNft,
    prepareFormData,
    resetAll,
    uploadFileRequest,
  };
}
