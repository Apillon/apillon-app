export default function useCollection() {
  const $i18n = useI18n();
  const settingsStore = useSettingsStore();
  const collectionStore = useCollectionStore();

  const loading = ref<boolean>(false);
  const formRef = ref<NFormInst | null>(null);

  const chains = [
    { label: $i18n.t(`nft.chain.${Chains.MOONBEAM}`), value: Chains.MOONBEAM },
    { label: $i18n.t(`nft.chain.${Chains.MOONBASE}`), value: Chains.MOONBASE },
    // { label: $i18n.t(`nft.chain.${Chains.ASTAR_SHIBUYA}`), value: Chains.ASTAR_SHIBUYA },
    { label: $i18n.t(`nft.chain.${Chains.ASTAR}`), value: Chains.ASTAR },
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
    return isQuotaReached.value || settingsStore.isProjectUser();
  });

  const maxNft = computed(() => {
    return collectionStore.form.behaviour.supplyLimited === 1
      ? collectionStore.csvData?.length
      : NFT_MAX_SUPPLY;
  });

  const rules: NFormRules = {
    symbol: [
      {
        required: true,
        message: $i18n.t('validation.collectionSymbolRequired'),
      },
    ],
    name: [
      {
        required: true,
        message: $i18n.t('validation.collectionNameRequired'),
      },
    ],
    baseUri: [
      {
        required: true,
        message: $i18n.t('validation.collectionBaseUriRequired'),
      },
      {
        type: 'url',
        message: $i18n.t('validation.collectionBaseUri'),
      },
    ],
    baseExtension: [
      {
        required: true,
        message: $i18n.t('validation.collectionBaseExtensionRequired'),
      },
    ],
    chain: [
      {
        required: true,
        message: $i18n.t('validation.collectionChainRequired'),
      },
    ],
    maxSupply: [
      {
        max: maxNft.value,
        validator: validateMaxSupply,
        message: $i18n.t('validation.collectionMaxSupplyReached', {
          max: collectionStore.csvData?.length || NFT_MAX_SUPPLY,
        }),
      },
    ],
    mintPrice: [
      {
        required: true,
        message: $i18n.t('validation.collectionMintPrice'),
      },
      {
        validator: validateMintPrice,
        message: $i18n.t('validation.collectionMintPrice'),
      },
    ],
    dropStart: [
      {
        validator: validateDropStart,
        message: $i18n.t('validation.collectionDropStart'),
      },
    ],
    reserve: [
      {
        required: true,
        message: $i18n.t('validation.collectionReserve'),
      },
      {
        validator: validateReserve,
        message: $i18n.t('validation.collectionReserve'),
      },
    ],
    royaltiesAddress: [
      {
        required: true,
        message: $i18n.t('validation.collectionRoyaltiesAddressRequired'),
      },
    ],
    royaltiesFees: [
      {
        required: true,
        message: $i18n.t('validation.collectionRoyaltiesFeesRequired'),
      },
    ],
  };

  /**
   * Validations
   */
  function validateReserve(_: NFormItemRule, value: number): boolean {
    return (
      collectionStore.form.behaviour.supplyLimited === 0 ||
      collectionStore.form.behaviour.maxSupply === 0 ||
      value <= collectionStore.form.behaviour.maxSupply
    );
  }
  function validateMaxSupply(_: NFormItemRule, value: number): boolean {
    return value <= maxNft.value;
  }
  function validateDropStart(_: NFormItemRule, value: number): boolean {
    return !collectionStore.form.behaviour.isDrop || value > Date.now();
  }
  function validateMintPrice(_: NFormItemRule, value: number): boolean {
    return (
      !collectionStore.form.behaviour.isDrop || (value >= 0 && value < Number.MAX_SAFE_INTEGER)
    );
  }

  function disablePasteDate(ts: number) {
    return ts < Date.now();
  }

  return {
    loading,
    formRef,
    chains,
    supplyTypes,
    booleanSelect,
    rules,
    isQuotaReached,
    isFormDisabled,
    disablePasteDate,
  };
}
