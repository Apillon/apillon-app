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
      max: NFT_MAX_SUPPLY,
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
      required: isRoyaltyRequired(),
      message: t('validation.collectionRoyaltiesAddressRequired'),
    },
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
  const validateSingleIdRequired: FormItemRule[] = [
    ruleRequired(t('validation.nftIdRequired')),
    {
      validator: validateSingleNftIdUnique,
      message: t('validation.nftIdDuplicate'),
    },
  ];

  const rules: NFormRules = {
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
      royaltiesAddress: collectionStore.form.behavior.royaltiesAddress,
      royaltiesFees: collectionStore.form.behavior.royaltiesFees,
      baseUri: addBaseUri ? collectionStore.form.behavior.baseUri : undefined,
      useApillonIpfsGateway: collectionStore.form.base.useApillonIpfsGateway,
      useIpns: collectionStore.form.base.useIpns,
    };
  }

  function collectionEndpoint() {
    return collectionStore.form.base.chain === SubstrateChain.UNIQUE
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
    return !collectionStore.form.behavior.drop || (value > 0 && value < Number.MAX_SAFE_INTEGER);
  }
  function validateRoyaltiesAddress(_: FormItemRule, value: string): boolean {
    return (
      !isRoyaltyRequired() ||
      (collectionStore.form.base.chain === SubstrateChain.UNIQUE
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
    infoLabel,
    onChainChange,
    openAddNft,
    prepareFormData,
    uploadFileRequest,
  };
}
