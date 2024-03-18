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
    // { label: $i18n.t(`nft.chain.${Chains.ASTAR_SHIBUYA}`), value: Chains.ASTAR_SHIBUYA },
    { label: $i18n.t(`nft.chain.${Chains.ASTAR}`), value: Chains.ASTAR },
  ];
  const NftAmount = [
    {
      label: $i18n.t('nft.amount.single'),
      sublabel: $i18n.t('nft.amount.singleContent'),
      value: 0,
    },
    {
      label: $i18n.t('nft.amount.multiple'),
      sublabel: $i18n.t('nft.amount.multipleContent'),
      value: 1,
    },
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
  const rulesBaseUri: NFormItemRule[] = [
    ruleRequired($i18n.t('validation.collectionBaseUriRequired')),
    {
      type: 'url',
      message: $i18n.t('validation.collectionBaseUri'),
    },
  ];
  const rulesMaxSupply: NFormItemRule[] = [
    {
      max: maxNft.value,
      validator: validateMaxSupply,
      message: $i18n.t('validation.collectionMaxSupplyReached', {
        max: NFT_MAX_SUPPLY,
      }),
    },
  ];
  const rulesDropPrice: NFormItemRule[] = [
    ruleRequired($i18n.t('validation.collectionDropPrice')),
    {
      validator: validateDropPrice,
      message: $i18n.t('validation.collectionDropPrice'),
    },
  ];
  const rulesDropReserve: NFormItemRule[] = [
    ruleRequired($i18n.t('validation.collectionDropReserve')),
    {
      validator: validateReserve,
      message: $i18n.t('validation.collectionDropReserve'),
    },
  ];
  const rulesRoyaltiesAddress: NFormItemRule[] = [
    {
      validator: validateRoyaltiesAddress,
      message: $i18n.t('validation.collectionRoyaltiesAddress'),
    },
  ];
  const rulesRoyaltyFee: NFormItemRule[] = [
    ruleRequired($i18n.t('validation.collectionRoyaltiesFeesRequired')),
    {
      validator: validateNaturalNumber,
      message: $i18n.t('validation.collectionRoyaltiesFees'),
    },
  ];
  const rulesCollectionLogo: NFormItemRule[] = [
    ruleRequired($i18n.t('validation.collectionLogoRequired')),
    {
      validator: validateCollectionLogo,
      message: $i18n.t('validation.collectionLogoRequired'),
    },
  ];
  const rulesCollectionCoverImage: NFormItemRule[] = [
    ruleRequired($i18n.t('validation.collectionCoverImageRequired')),
    {
      validator: validateCollectionCoverImage,
      message: $i18n.t('validation.collectionCoverImageRequired'),
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
    id: ruleRequired($i18n.t('validation.nftId')),
    'single.id': ruleRequired($i18n.t('validation.nftId')),
    collectionUuid: ruleRequired($i18n.t('validation.nftCollection')),
    'single.collectionUuid': ruleRequired($i18n.t('validation.nftCollection')),
    name: ruleRequired($i18n.t('validation.nftName')),
    'single.name': ruleRequired($i18n.t('validation.nftName')),
    description: ruleRequired($i18n.t('validation.nftDescription')),
    'single.description': ruleRequired($i18n.t('validation.nftDescription')),
  };

  /**
   * Validations
   */
  function validateReserve(_: NFormItemRule, value: number): boolean {
    return (
      collectionStore.form.behavior.supplyLimited === 0 ||
      collectionStore.form.behavior.maxSupply === 0 ||
      value <= collectionStore.form.behavior.maxSupply
    );
  }
  function validateMaxSupply(_: NFormItemRule, value: number): boolean {
    return value <= maxNft.value;
  }
  function validateDropStart(_: NFormItemRule, value: number): boolean {
    return !collectionStore.form.behavior.drop || value > Date.now();
  }
  function validateDropPrice(_: NFormItemRule, value: number): boolean {
    return !collectionStore.form.behavior.drop || (value > 0 && value < Number.MAX_SAFE_INTEGER);
  }
  function validateRoyaltiesAddress(_: NFormItemRule, value: string): boolean {
    return collectionStore.form.behavior.royaltiesFees === 0 || validateEvmAddress(_, value);
  }
  function validateCollectionLogo(_: NFormItemRule): boolean {
    return !!collectionStore.form.base.logo?.id;
  }
  function validateCollectionCoverImage(_: NFormItemRule): boolean {
    return !!collectionStore.form.base.coverImage?.id;
  }

  function disablePasteDate(ts: number) {
    return ts < new Date().setHours(0, 0, 0, 0);
  }

  function disablePasteTime(ts: number) {
    return ts < Date.now();
  }

  function uploadFileRequest(
    { file, onError, onFinish }: NUploadCustomRequestOptions,
    logo: boolean
  ) {
    const uploadedFile: FileListItemType = {
      ...file,
      fullPath: `/Images${file.fullPath}`,
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

  function handleCoverImageChange(event: NUploadCustomRequestOptions) {
    handleCoverImageRemove();
    uploadFileRequest(event, false);
  }

  return {
    loading,
    formRef,
    chains,
    NftAmount,
    collectionTypes,
    supplyTypes,
    booleanSelect,
    rules,
    rulesSingle,
    isFormDisabled,
    disablePasteDate,
    disablePasteTime,
    uploadFileRequest,
    handleLogoRemove,
    handleCoverImageRemove,
    handleCoverImageChange,
  };
}
