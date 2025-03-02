import type { FormItemRule, UploadCustomRequestOptions } from 'naive-ui';
import IconInfo from '../components/parts/Icon/Info.vue';
import { EvmChain, SubstrateChain } from '~/lib/types/nft';

export default function useCollection() {
  const { t, te } = useI18n();
  const router = useRouter();
  const message = useMessage();
  const dataStore = useDataStore();
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
    return collectionStore.form.base.chain === SubstrateChain.UNIQUE;
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
    ruleRequired(t('validation.nft.idRequired')),
    {
      validator: validateSingleNftIdUnique,
      message: t('validation.nft.idDuplicate'),
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
    collectionUuid: ruleRequired(t('validation.nft.collection')),
    name: ruleRequired(t('validation.nft.name')),
    description: ruleRequired(t('validation.nft.description')),
  };

  function prepareFormData(addBaseUri = false) {
    const chain =
      collectionStore.form.base.chain === Chains.ASTAR &&
      collectionStore.form.base.chainType === ChainType.SUBSTRATE
        ? SubstrateChain.ASTAR
        : collectionStore.form.base.chain;

    return {
      chain,
      project_uuid: dataStore.projectUuid,
      name: collectionStore.form.base.name,
      symbol: collectionStore.form.base.symbol,
      collectionType: collectionStore.form.base.collectionType,
      maxSupply:
        collectionStore.form.behavior.supplyLimited === 1
          ? collectionStore.form.behavior.maxSupply
          : 0,
      isRevokable: collectionStore.form.behavior.revocable,
      isSoulbound: collectionStore.form.behavior.soulbound,
      royaltiesFees: isUnique.value ? undefined : collectionStore.form.behavior.royaltiesFees,
      royaltiesAddress:
        collectionStore.form.behavior.royaltiesFees === 0
          ? undefined
          : collectionStore.form.behavior.royaltiesAddress,
      baseUri: addBaseUri ? collectionStore.form.behavior.baseUri : undefined,
      baseExtension: isUnique.value ? undefined : collectionStore.form.behavior.baseExtension,
      drop: isUnique.value ? undefined : collectionStore.form.behavior.drop,
      dropPrice: isUnique.value ? undefined : collectionStore.form.behavior.dropPrice,
      dropStart: isUnique.value
        ? undefined
        : Math.floor((collectionStore.form.behavior.dropStart || Date.now()) / 1000),
      dropReserve: isUnique.value ? undefined : collectionStore.form.behavior.dropReserve || 0,
      useApillonIpfsGateway: isUnique.value
        ? undefined
        : collectionStore.form.base.useApillonIpfsGateway,
      useIpns: isUnique.value ? undefined : collectionStore.form.base.useIpns,
    };
  }

  function collectionEndpoint() {
    return isUnique.value
      ? endpoints.collectionsUnique
      : collectionStore.form.base.chain === Chains.ASTAR &&
          collectionStore.form.base.chainType === ChainType.SUBSTRATE
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
    return !collectionStore.form.behavior.drop || (value >= 0.00001 && value <= 10000000000);
  }
  function validateRoyaltiesAddress(_: FormItemRule, value: string): boolean {
    return (
      !isRoyaltyRequired() ||
      (isUnique.value
        ? substrateAddressValidate(_, value, SubstrateChainPrefix.UNIQUE)
        : collectionStore.form.base.chainType === ChainType.SUBSTRATE
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
      (collectionStore.form.base.chainType === ChainType.EVM &&
        collectionStore.form.behavior.royaltiesFees > 0) ||
      (collectionStore.form.base.chainType === ChainType.SUBSTRATE &&
        collectionStore.form.behavior.drop)
    );
  }

  function disablePastDate(ts: number) {
    return ts < new Date().setHours(0, 0, 0, 0);
  }

  function disablePastTime(ts: number) {
    return ts < Date.now();
  }

  function chainCurrency() {
    switch (collectionStore.form.base.chain) {
      case Chains.ASTAR:
        return 'ASTR';
      default:
        return 'GLMR';
    }
  }

  function uploadFileRequest(
    { file, onError, onFinish }: UploadCustomRequestOptions,
    logo: boolean
  ) {
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
    } else if (!file.type?.includes('image')) {
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
      collectionStore.form.base.chainType = ChainType.SUBSTRATE;
    } else if (chain !== Chains.ASTAR) {
      collectionStore.form.base.chainType = ChainType.EVM;
    }
  }

  return {
    addressLabel,
    booleanSelect,
    chains,
    chainTypes,
    collectionTypes,
    evmChains,
    formRef,
    isFormDisabled,
    isUnique,
    loading,
    nftChains,
    rules,
    rulesSingle,
    substrateChains,
    supplyTypes,
    chainCurrency,
    collectionEndpoint,
    disablePastDate,
    disablePastTime,
    onChainChange,
    openAddNft,
    prepareFormData,
    uploadFileRequest,
  };
}
