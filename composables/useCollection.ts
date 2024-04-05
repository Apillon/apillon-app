import type { FormItemRule, UploadCustomRequestOptions } from 'naive-ui';
import IconInfo from '../components/parts/Icon/Info.vue';

export default function useCollection() {
  const { t, te } = useI18n();
  const router = useRouter();
  const message = useMessage();
  const dataStore = useDataStore();
  const collectionStore = useCollectionStore();
  const config = useRuntimeConfig();

  const { isEnoughSpaceInStorage } = useUpload();

  const loading = ref<boolean>(false);
  const formRef = ref<NFormInst | null>(null);

  const chains = enumKeys(Chains)
    .filter(key => Chains[key] !== Chains.ASTAR_SHIBUYA)
    .map(k => {
      return { name: k.toLowerCase(), label: t(`nft.chain.${Chains[k]}`), value: Chains[k] };
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

  const maxNft = computed(() => {
    return collectionStore.form.behavior.supplyLimited === 1 ? NFT_MAX_SUPPLY : NFT_MAX_SUPPLY;
  });

  /**
   * Rules
   */
  const rulesBaseUri: FormItemRule[] = [
    ruleRequired(t('validation.collectionBaseUriRequired')),
    {
      type: 'url',
      message: t('validation.collectionBaseUri'),
    },
  ];
  const rulesMaxSupply: FormItemRule[] = [
    {
      max: maxNft.value,
      validator: validateMaxSupply,
      message: t('validation.collectionMaxSupplyReached', {
        max: NFT_MAX_SUPPLY,
      }),
    },
  ];
  const rulesDropPrice: FormItemRule[] = [
    ruleRequired(t('validation.collectionDropPrice')),
    {
      validator: validateDropPrice,
      message: t('validation.collectionDropPrice'),
    },
  ];
  const rulesDropReserve: FormItemRule[] = [
    ruleRequired(t('validation.collectionDropReserve')),
    {
      validator: validateReserve,
      message: t('validation.collectionDropReserve'),
    },
  ];
  const rulesRoyaltiesAddress: FormItemRule[] = [
    {
      validator: validateRoyaltiesAddress,
      message: t('validation.collectionRoyaltiesAddress'),
    },
  ];
  const rulesRoyaltyFee: FormItemRule[] = [
    ruleRequired(t('validation.collectionRoyaltiesFeesRequired')),
    {
      validator: validateNaturalNumber,
      message: t('validation.collectionRoyaltiesFees'),
    },
  ];
  const rulesCollectionLogo: FormItemRule[] = [
    ruleRequired(t('validation.collectionLogoRequired')),
    {
      validator: validateCollectionLogo,
      message: t('validation.collectionLogoRequired'),
    },
  ];
  const rulesCollectionCoverImage: FormItemRule[] = [
    ruleRequired(t('validation.collectionCoverImageRequired')),
    {
      validator: validateCollectionCoverImage,
      message: t('validation.collectionCoverImageRequired'),
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
    logo: rulesCollectionLogo,
    'base.logo': rulesCollectionLogo,
    coverImage: rulesCollectionCoverImage,
    'base.coverImage': rulesCollectionCoverImage,
    symbol: ruleRequired(t('validation.collectionSymbolRequired')),
    'base.symbol': ruleRequired(t('validation.collectionSymbolRequired')),
    name: ruleRequired(t('validation.collectionNameRequired')),
    'base.name': ruleRequired(t('validation.collectionNameRequired')),
    chain: ruleRequired(t('validation.collectionChainRequired')),
    'base.chain': ruleRequired(t('validation.collectionChainRequired')),
    'base.chainType': ruleRequired(t('validation.collectionChainTypeRequired')),
    collectionType: ruleRequired(t('validation.collectionTypeRequired')),
    'base.collectionType': ruleRequired(t('validation.collectionTypeRequired')),
    baseUri: rulesBaseUri,
    'behavior.baseUri': rulesBaseUri,
    baseExtension: ruleRequired(t('validation.collectionBaseExtensionRequired')),
    'behavior.baseExtension': ruleRequired(t('validation.collectionBaseExtensionRequired')),
    maxSupply: rulesMaxSupply,
    dropPrice: rulesDropPrice,
    'behavior.dropPrice': rulesDropPrice,
    dropStart: {
      validator: validateDropStart,
      message: t('validation.collectionDropStart'),
    },
    'behavior.dropStart': {
      validator: validateDropStart,
      message: t('validation.collectionDropStart'),
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
    /** On dev env use ASTAR_SHIBUYA chain if user want to deploy substrate collection on Astar
    const chain =
      collectionStore.form.base.chain === Chains.ASTAR &&
      collectionStore.form.base.chainType === ChainType.SUBSTRATE &&
      config.public.ENV === AppEnv.DEV
        ? Chains.ASTAR_SHIBUYA
        : collectionStore.form.base.chain;
         */
    return {
      chain: collectionStore.form.base.chain,
      project_uuid: dataStore.projectUuid,
      name: collectionStore.form.base.name,
      symbol: collectionStore.form.base.symbol,
      collectionType: collectionStore.form.base.collectionType,
      baseExtension: collectionStore.form.behavior.baseExtension,
      dropPrice: collectionStore.form.behavior.dropPrice,
      maxSupply:
        collectionStore.form.behavior.supplyLimited === 1
          ? collectionStore.form.behavior.maxSupply
          : 0,
      drop: collectionStore.form.behavior.drop,
      dropStart: Math.floor((collectionStore.form.behavior.dropStart || Date.now()) / 1000),
      dropReserve: collectionStore.form.behavior.dropReserve || 0,
      isRevokable: collectionStore.form.behavior.revocable,
      isSoulbound: collectionStore.form.behavior.soulbound,
      royaltiesAddress:
        collectionStore.form.behavior.royaltiesFees === 0
          ? null
          : collectionStore.form.behavior.royaltiesAddress,
      royaltiesFees: collectionStore.form.behavior.royaltiesFees,
      baseUri: addBaseUri ? collectionStore.form.behavior.baseUri : undefined,
    };
  }

  function collectionEndpoint() {
    return collectionStore.form.base.chain === Chains.ASTAR &&
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
    return value <= maxNft.value;
  }
  function validateDropStart(_: FormItemRule, value: number): boolean {
    return !collectionStore.form.behavior.drop || value > Date.now();
  }
  function validateDropPrice(_: FormItemRule, value: number): boolean {
    return !collectionStore.form.behavior.drop || (value > 0 && value < Number.MAX_SAFE_INTEGER);
  }
  function validateRoyaltiesAddress(_: FormItemRule, value: string): boolean {
    return collectionStore.form.behavior.royaltiesFees === 0 || validateEvmAddress(_, value);
  }
  function validateCollectionLogo(_: FormItemRule): boolean {
    return !!collectionStore.form.base.logo?.id;
  }
  function validateCollectionCoverImage(_: FormItemRule): boolean {
    return !!collectionStore.form.base.coverImage?.id;
  }
  function validateSingleNftIdUnique(_: FormItemRule): boolean {
    if (collectionStore.metadata.length >= 1) {
      return !collectionStore.metadata.find(item => item.id === collectionStore.form.single.id);
    }
    return true;
  }

  function disablePasteDate(ts: number) {
    return ts < new Date().setHours(0, 0, 0, 0);
  }

  function disablePasteTime(ts: number) {
    return ts < Date.now();
  }

  const infoLabel = (field: string) => {
    if (
      te(`form.label.${field}`) &&
      te(`nft.collection.labelInfo.${field}`) &&
      t(`nft.collection.labelInfo.${field}`)
    ) {
      return [
        h('span', { class: 'mr-1' }, t(`form.label.${field}`)),
        h(IconInfo, { size: 'sm', tooltip: t(`nft.collection.labelInfo.${field}`) }, ''),
      ];
    }
    return te(`form.label.${field}`) ? t(`form.label.${field}`) : field;
  };

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
      onFinish,
      onError,
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

  function handleCoverImageRemove() {
    collectionStore.form.base.coverImage = {} as FileListItemType;
  }

  function handleLogoRemove() {
    collectionStore.form.base.logo = {} as FileListItemType;
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
    loading,
    formRef,
    chains,
    chainTypes,
    collectionTypes,
    supplyTypes,
    booleanSelect,
    rules,
    rulesSingle,
    isFormDisabled,
    chainCurrency,
    collectionEndpoint,
    disablePasteDate,
    disablePasteTime,
    infoLabel,
    onChainChange,
    openAddNft,
    prepareFormData,
    uploadFileRequest,
    handleLogoRemove,
    handleCoverImageRemove,
  };
}
