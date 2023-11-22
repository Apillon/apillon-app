export default function useCollection() {
  const $i18n = useI18n();
  const dataStore = useDataStore();
  const collectionStore = useCollectionStore();

  const loading = ref<boolean>(false);
  const formRef = ref<NFormInst | null>(null);

  const chains = [
    { label: $i18n.t(`nft.chain.${Chains.MOONBEAM}`), value: Chains.MOONBEAM },
    { label: $i18n.t(`nft.chain.${Chains.MOONBASE}`), value: Chains.MOONBASE },
    // { label: $i18n.t(`nft.chain.${Chains.ASTAR_SHIBUYA}`), value: Chains.ASTAR_SHIBUYA },
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
    return collectionStore.form.behavior.supplyLimited === 1
      ? collectionStore.csvData?.length
      : NFT_MAX_SUPPLY;
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
        max: collectionStore.csvData?.length || NFT_MAX_SUPPLY,
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
    ruleRequired($i18n.t('validation.collectionRoyaltiesAddressRequired')),
    {
      validator: validateEvmAddress,
      message: $i18n.t('validation.collectionRoyaltiesAddress'),
    },
  ];
  const rulesRoyaltyFee: NFormItemRule[] = [
    ruleRequired($i18n.t('validation.collectionRoyaltiesFeesRequired')),
    // {
    //   validator: validateNumberNotZero,
    //   message: $i18n.t('validation.collectionRoyaltiesFees'),
    // },
  ];

  const rules: NFormRules = {
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

  function disablePasteDate(ts: number) {
    return ts < new Date().setHours(0, 0, 0, 0);
  }

  function disablePasteTime(ts: number) {
    return ts < Date.now();
  }

  return {
    loading,
    formRef,
    chains,
    collectionTypes,
    supplyTypes,
    booleanSelect,
    rules,
    isFormDisabled,
    disablePasteDate,
    disablePasteTime,
  };
}
