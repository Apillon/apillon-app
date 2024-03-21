import IconInfo from '../components/parts/Icon/Info.vue';

export default function useCollection() {
  const { t, te } = useI18n();
  const dataStore = useDataStore();
  const collectionStore = useCollectionStore();

  const loading = ref<boolean>(false);
  const formRef = ref<NFormInst | null>(null);

  const chains = [
    { label: t(`nft.chain.${Chains.MOONBEAM}`), value: Chains.MOONBEAM },
    { label: t(`nft.chain.${Chains.MOONBASE}`), value: Chains.MOONBASE },
    // { label: t(`nft.chain.${Chains.ASTAR_SHIBUYA}`), value: Chains.ASTAR_SHIBUYA },
    { label: t(`nft.chain.${Chains.ASTAR}`), value: Chains.ASTAR },
  ];
  const collectionTypes = [
    {
      label: t(`nft.collection.type.${NFTCollectionType.GENERIC}`),
      value: NFTCollectionType.GENERIC,
    },
    {
      label: t(`nft.collection.type.${NFTCollectionType.NESTABLE}`),
      value: NFTCollectionType.NESTABLE,
    },
  ];
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
    return collectionStore.form.behavior.supplyLimited === 1
      ? collectionStore.csvData?.length
      : NFT_MAX_SUPPLY;
  });

  /**
   * Rules
   */
  const rulesBaseUri: NFormItemRule[] = [
    ruleRequired(t('validation.collectionBaseUriRequired')),
    {
      type: 'url',
      message: t('validation.collectionBaseUri'),
    },
  ];
  const rulesMaxSupply: NFormItemRule[] = [
    {
      max: maxNft.value,
      validator: validateMaxSupply,
      message: t('validation.collectionMaxSupplyReached', {
        max: collectionStore.csvData?.length || NFT_MAX_SUPPLY,
      }),
    },
  ];
  const rulesDropPrice: NFormItemRule[] = [
    ruleRequired(t('validation.collectionDropPrice')),
    {
      validator: validateDropPrice,
      message: t('validation.collectionDropPrice'),
    },
  ];
  const rulesDropReserve: NFormItemRule[] = [
    ruleRequired(t('validation.collectionDropReserve')),
    {
      validator: validateReserve,
      message: t('validation.collectionDropReserve'),
    },
  ];
  const rulesRoyaltiesAddress: NFormItemRule[] = [
    {
      validator: validateRoyaltiesAddress,
      message: t('validation.collectionRoyaltiesAddress'),
    },
  ];
  const rulesRoyaltyFee: NFormItemRule[] = [
    ruleRequired(t('validation.collectionRoyaltiesFeesRequired')),
    {
      validator: validateNaturalNumber,
      message: t('validation.collectionRoyaltiesFees'),
    },
  ];

  const rules: NFormRules = {
    symbol: ruleRequired(t('validation.collectionSymbolRequired')),
    'base.symbol': ruleRequired(t('validation.collectionSymbolRequired')),
    name: ruleRequired(t('validation.collectionNameRequired')),
    'base.name': ruleRequired(t('validation.collectionNameRequired')),
    chain: ruleRequired(t('validation.collectionChainRequired')),
    'base.chain': ruleRequired(t('validation.collectionChainRequired')),
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
    infoLabel,
  };
}
