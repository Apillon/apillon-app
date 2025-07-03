import type { FormItemRule } from 'naive-ui';
import IconInfo from '~/components/parts/Icon/Info.vue';

export default function useForm(base = 'form.label.collection') {
  const { t, te } = useI18n();
  const websiteStore = useWebsiteStore();
  const metadataStore = useMetadataStore();

  /**
   * Rules
   */
  const ruleApiKey = (form: Record<string, any>) => ({
    validator: (_, value) => validateApiKey(value, form?.apiSecret),
    message: t('validation.apiKeyRequired'),
    trigger: 'blur',
  });
  const ruleApiSecret = (form: Record<string, any>) => ({
    validator: (_, value) => validateApiSecret(value, form?.apiKey),
    message: t('validation.apiSecretRequired'),
    trigger: 'blur',
  });

  /** Website rules */
  const rulesWebsite: NFormRules = {
    name: [ruleRequired(t('validation.website.nameRequired'))],
    description: [ruleDescription(t('validation.descriptionTooLong'))],
    repoId: [ruleRequired(t('validation.hosting.repoRequired'))],
    branchName: [ruleRequired(t('validation.hosting.branchNameRequired'))],
    buildDirectory: [ruleRequired(t('validation.hosting.buildDirectoryRequired'))],
    apiKey: ruleApiKey(websiteStore.form),
    apiSecret: ruleApiSecret(websiteStore.form),
  };

  /** Rules NFT Collection    */
  const rulesCollection: NFormRules = {
    symbol: ruleRequired(t('validation.collection.symbolRequired')),
    name: ruleRequired(t('validation.collection.nameRequired')),
    chain: ruleRequired(t('validation.collection.chainRequired')),
    chainType: ruleRequired(t('validation.collection.chainTypeRequired')),
    collectionType: ruleRequired(t('validation.collection.typeRequired')),
    baseUri: [
      ruleRequired(t('validation.collection.baseUriRequired')),
      { type: 'url', message: t('validation.collection.baseUri') },
    ],
    baseExtension: ruleRequired(t('validation.collection.baseExtensionRequired')),
    maxSupply: {
      max: NFT_MAX_SUPPLY,
      validator: validateMaxSupply,
      message: t('validation.collection.maxSupplyReached', { max: NFT_MAX_SUPPLY }),
    },
    dropPrice: [
      ruleRequired(t('validation.collection.dropPrice')),
      { validator: validateDropPrice, message: t('validation.collection.dropPrice') },
    ],
    dropStart: {
      validator: validateDropStart,
      message: t('validation.collection.dropStart'),
    },
    dropReserve: [
      ruleRequired(t('validation.collection.dropReserve')),
      { validator: validateReserve, message: t('validation.collection.dropReserve') },
    ],
    royaltiesAddress: [
      { required: isRoyaltyRequired(), message: t('validation.collection.royaltiesAddressRequired') },
      { validator: validateRoyaltiesAddress, message: t('validation.collection.royaltiesAddress') },
    ],
    royaltiesFees: [
      ruleRequired(t('validation.collection.royaltiesFeesRequired')),
      { validator: validateNaturalNumber, message: t('validation.collection.royaltiesFees') },
    ],
  };

  const rulesNftSingle: NFormRules = {
    collectionUuid: ruleRequired(t('validation.nft.collection')),
    id: [
      ruleRequired(t('validation.nft.idRequired')),
      { validator: validateSingleNftIdUnique, message: t('validation.nft.idDuplicate') },
    ],
    image: ruleRequired(t('validation.nft.image')),
    name: ruleRequired(t('validation.nft.name')),
    description: ruleRequired(t('validation.nft.description')),
    attributes: { validator: validateAttributes, message: t('validation.nft.attributes') },
  };

  /**
   * Functions
   */
  function labelInfo(field: string): string {
    if (te(`${base}.${field}`) && te(`${base}.labelInfo.${field}`) && t(`${base}.labelInfo.${field}`)) {
      return labelInfoText(t(`${base}.${field}`), decodeHTMLEntities(t(`${base}.labelInfo.${field}`))) as string;
    }
    return te(`${base}.${field}`) ? t(`${base}.${field}`) : field;
  }

  function labelInfoText(label: string, info?: string): string | VNode<any> {
    if (info && info.length > 0) {
      return h('span', { class: 'inline-flex items-center' }, [
        h('span', { class: 'mr-1' }, label),
        h(IconInfo, { class: 'info-icon', size: 'sm', tooltip: info }, ''),
      ]);
    }
    return label;
  }

  /**
   * Validations
   */
  function validateReserve(_: FormItemRule, value: number): boolean {
    return (
      !metadataStore.form.smartContract.supplyLimited ||
      metadataStore.form.smartContract.maxSupply === 0 ||
      value <= metadataStore.form.smartContract.maxSupply
    );
  }
  function validateMaxSupply(_: FormItemRule, value: number): boolean {
    return (
      value <= NFT_MAX_SUPPLY &&
      (metadataStore.form.smartContract.supplyLimited ? value > 0 && value <= metadataStore.metadata.length : true)
    );
  }
  function validateDropStart(_: FormItemRule, value: number): boolean {
    return metadataStore.form.smartContract.dropPrice === 0 || value > Date.now();
  }
  function validateDropPrice(_: FormItemRule, value: number): boolean {
    return metadataStore.form.smartContract.dropPrice === 0 || (value >= 0.00001 && value <= 10000000000);
  }
  function validateRoyaltiesAddress(_: FormItemRule, value: string): boolean {
    return (
      !isRoyaltyRequired() ||
      (metadataStore.form.smartContract.chain === SubstrateChain.UNIQUE
        ? substrateAddressValidate(_, value, SubstrateChainPrefix.UNIQUE)
        : metadataStore.form.smartContract.chainType === ChainType.SUBSTRATE
          ? substrateAddressValidate(_, value, SubstrateChainPrefix.ASTAR)
          : validateEvmAddress(_, value))
    );
  }
  function validateSingleNftIdUnique(_: FormItemRule): boolean {
    if (metadataStore.metadata.length >= 1) {
      return !metadataStore.metadata.find(item => item.id === metadataStore.form.single.id);
    }
    return true;
  }
  function validateAttributes(_: FormItemRule, values: AttributeInterface[]): boolean {
    return values.every(v => !!v.display_type && !!v.trait_type && v.value);
  }

  function isRoyaltyRequired() {
    return (
      (metadataStore.form.smartContract.chainType === ChainType.EVM &&
        metadataStore.form.smartContract.royaltiesFees > 0) ||
      (metadataStore.form.smartContract.chainType === ChainType.SUBSTRATE &&
        metadataStore.form.smartContract.dropPrice > 0)
    );
  }

  return {
    rulesCollection,
    rulesNftSingle,
    rulesWebsite,
    labelInfo,
    labelInfoText,
    ruleApiKey,
    ruleApiSecret,
  };
}
