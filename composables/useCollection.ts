import type { FormItemRule, UploadCustomRequestOptions } from 'naive-ui';

export default function useCollection() {
  const $i18n = useI18n();
  const message = useMessage();
  const dataStore = useDataStore();
  const collectionStore = useCollectionStore();

  const { isEnoughSpaceInStorage } = useUpload();

  const loading = ref<boolean>(false);
  const formRef = ref<NFormInst | null>(null);

  const chains = [
    { label: $i18n.t(`nft.chain.${Chains.MOONBEAM}`), value: Chains.MOONBEAM },
    { label: $i18n.t(`nft.chain.${Chains.MOONBASE}`), value: Chains.MOONBASE },
    { label: $i18n.t(`nft.chain.${Chains.ASTAR}`), value: Chains.ASTAR },
  ];
  const collectionTypes = [
    {
      label: $i18n.t(`nft.collection.type.${NFTCollectionType.GENERIC}`),
      value: NFTCollectionType.GENERIC,
    },
    {
      label: $i18n.t(`nft.collection.type.${NFTCollectionType.NESTABLE}`),
      value: NFTCollectionType.NESTABLE,
    },
  ];
  const supplyTypes = [
    { label: $i18n.t('form.supplyTypes.unlimited'), value: 0 },
    { label: $i18n.t('form.supplyTypes.limited'), value: 1 },
  ];
  const booleanSelect = [
    { label: $i18n.t('form.booleanSelect.true'), value: true },
    { label: $i18n.t('form.booleanSelect.false'), value: false },
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
    ruleRequired($i18n.t('validation.collectionBaseUriRequired')),
    {
      type: 'url',
      message: $i18n.t('validation.collectionBaseUri'),
    },
  ];
  const rulesMaxSupply: FormItemRule[] = [
    {
      max: maxNft.value,
      validator: validateMaxSupply,
      message: $i18n.t('validation.collectionMaxSupplyReached', {
        max: NFT_MAX_SUPPLY,
      }),
    },
  ];
  const rulesDropPrice: FormItemRule[] = [
    ruleRequired($i18n.t('validation.collectionDropPrice')),
    {
      validator: validateDropPrice,
      message: $i18n.t('validation.collectionDropPrice'),
    },
  ];
  const rulesDropReserve: FormItemRule[] = [
    ruleRequired($i18n.t('validation.collectionDropReserve')),
    {
      validator: validateReserve,
      message: $i18n.t('validation.collectionDropReserve'),
    },
  ];
  const rulesRoyaltiesAddress: FormItemRule[] = [
    {
      validator: validateRoyaltiesAddress,
      message: $i18n.t('validation.collectionRoyaltiesAddress'),
    },
  ];
  const rulesRoyaltyFee: FormItemRule[] = [
    ruleRequired($i18n.t('validation.collectionRoyaltiesFeesRequired')),
    {
      validator: validateNaturalNumber,
      message: $i18n.t('validation.collectionRoyaltiesFees'),
    },
  ];
  const rulesCollectionLogo: FormItemRule[] = [
    ruleRequired($i18n.t('validation.collectionLogoRequired')),
    {
      validator: validateCollectionLogo,
      message: $i18n.t('validation.collectionLogoRequired'),
    },
  ];
  const rulesCollectionCoverImage: FormItemRule[] = [
    ruleRequired($i18n.t('validation.collectionCoverImageRequired')),
    {
      validator: validateCollectionCoverImage,
      message: $i18n.t('validation.collectionCoverImageRequired'),
    },
  ];
  const validateSingleIdRequired: FormItemRule[] = [
    ruleRequired($i18n.t('validation.nftIdRequired')),
    {
      validator: validateSingleNftIdUnique,
      message: $i18n.t('validation.nftIdDuplicate'),
    },
  ];

  const rules: NFormRules = {
    logo: rulesCollectionLogo,
    'base.logo': rulesCollectionLogo,
    coverImage: rulesCollectionCoverImage,
    'base.coverImage': rulesCollectionCoverImage,
    symbol: ruleRequired($i18n.t('validation.collectionSymbolRequired')),
    'base.symbol': ruleRequired($i18n.t('validation.collectionSymbolRequired')),
    name: ruleRequired($i18n.t('validation.collectionNameRequired')),
    'base.name': ruleRequired($i18n.t('validation.collectionNameRequired')),
    chain: ruleRequired($i18n.t('validation.collectionChainRequired')),
    'base.chain': ruleRequired($i18n.t('validation.collectionChainRequired')),
    collectionType: ruleRequired($i18n.t('validation.collectionTypeRequired')),
    'base.collectionType': ruleRequired($i18n.t('validation.collectionTypeRequired')),
    baseUri: rulesBaseUri,
    'behavior.baseUri': rulesBaseUri,
    baseExtension: ruleRequired($i18n.t('validation.collectionBaseExtensionRequired')),
    'behavior.baseExtension': ruleRequired($i18n.t('validation.collectionBaseExtensionRequired')),
    maxSupply: rulesMaxSupply,
    dropPrice: rulesDropPrice,
    'behavior.dropPrice': rulesDropPrice,
    dropStart: {
      validator: validateDropStart,
      message: $i18n.t('validation.collectionDropStart'),
    },
    'behavior.dropStart': {
      validator: validateDropStart,
      message: $i18n.t('validation.collectionDropStart'),
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
    'single.id': validateSingleIdRequired,
    collectionUuid: ruleRequired($i18n.t('validation.nftCollection')),
    'single.collectionUuid': ruleRequired($i18n.t('validation.nftCollection')),
    name: ruleRequired($i18n.t('validation.nftName')),
    'single.name': ruleRequired($i18n.t('validation.nftName')),
    description: ruleRequired($i18n.t('validation.nftDescription')),
    'single.description': ruleRequired($i18n.t('validation.nftDescription')),
  };

  function prepareFormData(addBaseUri = false) {
    return {
      project_uuid: dataStore.projectUuid,
      name: collectionStore.form.base.name,
      symbol: collectionStore.form.base.symbol,
      chain: collectionStore.form.base.chain,
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
      message.warning($i18n.t('validation.notEnoughSpaceInStorage', { name: file.name }));

      /** Mark file as failed */
      onError();
      return;
    } else if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      message.warning($i18n.t('validation.notImage'));

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

  return {
    loading,
    formRef,
    chains,
    collectionTypes,
    supplyTypes,
    booleanSelect,
    rules,
    rulesSingle,
    isFormDisabled,
    chainCurrency,
    disablePasteDate,
    disablePasteTime,
    prepareFormData,
    uploadFileRequest,
    handleLogoRemove,
    handleCoverImageRemove,
  };
}
