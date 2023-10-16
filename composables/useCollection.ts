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

  const isQuotaReached = computed<boolean>(() => {
    return collectionStore.quotaReached === true;
  });
  const isFormDisabled = computed<boolean>(() => {
    return isQuotaReached.value || dataStore.isProjectUser;
  });

  const maxNft = computed(() => {
    return collectionStore.form.behavior.supplyLimited === 1
      ? collectionStore.csvData?.length
      : NFT_MAX_SUPPLY;
  });

  const ruleBaseUri: NFormItemRule[] = [
    ruleRequired($i18n.t('validation.collectionBaseUriRequired')),
    {
      type: 'url',
      message: $i18n.t('validation.collectionBaseUri'),
    },
  ];
  const ruleMaxSupply: NFormItemRule[] = [
    {
      max: maxNft.value,
      validator: validateMaxSupply,
      message: $i18n.t('validation.collectionMaxSupplyReached', {
        max: collectionStore.csvData?.length || NFT_MAX_SUPPLY,
      }),
    },
  ];
  const ruleDropPrice: NFormItemRule[] = [
    ruleRequired($i18n.t('validation.collectionDropPrice')),
    {
      validator: validateDropPrice,
      message: $i18n.t('validation.collectionDropPrice'),
    },
  ];
  const ruleDropReserve: NFormItemRule[] = [
    ruleRequired($i18n.t('validation.collectionDropReserve')),
    {
      validator: validateReserve,
      message: $i18n.t('validation.collectionDropReserve'),
    },
  ];
  const ruleRoyaltiesAddress: NFormItemRule[] = [
    ruleRequired($i18n.t('validation.collectionRoyaltiesAddressRequired')),
    {
      validator: validateEvmAddress,
      message: $i18n.t('validation.collectionRoyaltiesAddress'),
    },
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
    baseUri: ruleBaseUri,
    'behavior.baseUri': ruleBaseUri,
    baseExtension: ruleRequired($i18n.t('validation.collectionBaseExtensionRequired')),
    'behavior.baseExtension': ruleRequired($i18n.t('validation.collectionBaseExtensionRequired')),
    maxSupply: ruleMaxSupply,
    dropPrice: ruleDropPrice,
    'behavior.dropPrice': ruleDropPrice,
    dropStart: {
      validator: validateDropStart,
      message: $i18n.t('validation.collectionDropStart'),
    },
    'behavior.dropStart': {
      validator: validateDropStart,
      message: $i18n.t('validation.collectionDropStart'),
    },
    dropReserve: ruleDropReserve,
    'behavior.dropReserve': ruleDropReserve,
    royaltiesAddress: ruleRoyaltiesAddress,
    'behavior.royaltiesAddress': ruleRoyaltiesAddress,
    royaltiesFees: ruleRequired($i18n.t('validation.collectionRoyaltiesFeesRequired')),
    'behavior.royaltiesFees': ruleRequired($i18n.t('validation.collectionRoyaltiesFeesRequired')),
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
    isQuotaReached,
    isFormDisabled,
    disablePasteDate,
    disablePasteTime,
  };
}
