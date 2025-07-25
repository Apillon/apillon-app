<template>
  <Spinner v-if="loading" />
  <template v-else>
    <div v-if="!service || (servicePrices && servicePrices.length)">
      <div v-if="filterByChain || filterByService" class="mb-4 flex gap-6">
        <!-- Filter by service -->
        <div v-if="filterByService && !service">
          <strong class="mb-1 inline-block">{{ $t('dashboard.credits.filterByService') }}:</strong>
          <select-options
            v-model:value="selectedService"
            :options="services"
            class="min-w-[13rem] max-w-xs"
            size="small"
            :placeholder="$t('form.placeholder.chain')"
            filterable
            clearable
          />
        </div>
        <!-- Filter by chain -->
        <div v-if="filterByChain" class="flex justify-between" :class="{ 'w-full': service === ServiceTypeName.NFT }">
          <div>
            <strong class="mb-1 inline-block text-sm">{{ $t('dashboard.credits.filterByChain') }}:</strong>
            <select-options
              v-model:value="selectedChain"
              :options="chainsByService"
              class="min-w-[13rem] max-w-xs"
              size="small"
              :placeholder="$t('form.placeholder.chain')"
              filterable
              clearable
            />
          </div>
          <FormFieldSwitch
            v-if="service === ServiceTypeName.NFT"
            v-model:value="isMainnet"
            :text-active="$t('nft.mainnet')"
            :text-inactive="$t('nft.testnet')"
          />
        </div>
      </div>

      <n-table class="plain" :bordered="false" :single-line="true">
        <thead>
          <tr>
            <th>
              <template v-if="service || category">
                {{ $t(`dashboard.credits.services.${service || category}.name`) }}
              </template>
              <template v-else> {{ $t('dashboard.credits.serviceDescription') }} </template>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(price, key) in shownPrices" :key="key">
            <td>
              <NuxtIcon :name="getIconName(price)" class="float-left mr-3 text-2xl text-white" filled />
              <span v-if="price.description">{{ price.description }} </span>
              <span v-else class="capitalize">{{ price.name.replaceAll('_', ' ').toLowerCase() }}</span>
            </td>
            <td class="text-right">
              <strong class="text-white"> {{ price.currentPrice }} {{ $t('dashboard.credits.credits') }} </strong>
            </td>
          </tr>
        </tbody>
      </n-table>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { ServiceTypeName } from '~/lib/types/service';

const props = defineProps({
  chain: { type: Number, default: null },
  category: { type: String, default: null },
  service: { type: String, default: null },
  filterByChain: { type: Boolean, default: false },
  filterByService: { type: Boolean, default: false },
  showCreateCollection: { type: Boolean, default: false },
});

const paymentStore = usePaymentStore();
const metadataStore = useMetadataStore();
const {
  availableNftChains,
  availableNftTestChains,
  chains,
  enterpriseChainIDs,
  chainsTestnet,
  substrateChains,
  isChainAvailable,
} = useCollection();

const identityChains = enumKeyValues(IdentityChains);
const services = enumKeyValues(ServiceTypeName);
const selectedService = ref<string | undefined>(props.service);
const servicePrices = ref<ProductPriceInterface[]>([]);
const selectedChain = ref<number | null | undefined>();
const loading = ref<boolean>(true);
const isMainnet = ref<boolean>(false);

const availableNftChainsCategories = availableNftChains.value.map(
  c => getChainName(c.value) + `_${ServiceTypeName.NFT}`
);
const availableNftTestChainsCategories = availableNftTestChains.value.map(
  c => getChainName(c.value) + `_${ServiceTypeName.NFT}`
);

onMounted(async () => {
  if (props.filterByChain && props.service === ServiceTypeName.NFT) {
    selectedChain.value = props.chain || metadataStore.form.smartContract.chain;
  }
  await paymentStore.getActiveSubscription();

  servicePrices.value = props.category
    ? await paymentStore.getServicePricesByCategory(props.category)
    : props.service
      ? await paymentStore.getServicePrices(props.service)
      : await paymentStore.getPriceList();

  /** Filter enterprise service prices */
  const enterpriseServiceCategories = enterpriseChainIDs
    .map(chain => [`${EvmChain[chain]}_NFT`, `${EvmChain[chain]}_CONTRACT`])
    .flat();

  servicePrices.value = servicePrices.value.filter(
    s => paymentStore.hasPlan(PLAN_NAMES.BUTTERFLY) || !enterpriseServiceCategories.includes(s.category)
  );

  /** Sort by category (chain name) */
  servicePrices.value.sort((a, b) => (a.category.toLowerCase() < b.category.toLowerCase() ? -1 : 1));

  loading.value = false;
});

const chainsByService = computed(() => {
  switch (selectedService.value) {
    case ServiceTypeName.AUTHENTICATION:
      return identityChains;
    case ServiceTypeName.HOSTING:
      return [];
    case ServiceTypeName.NFT:
      return props.service === ServiceTypeName.NFT
        ? isMainnet.value
          ? availableNftChains.value
          : availableNftTestChains.value
        : [...availableNftChains.value, ...availableNftTestChains.value];
    case ServiceTypeName.STORAGE:
      return [];
    case ServiceTypeName.SMART_CONTRACTS:
      return [...chains, ...chainsTestnet].filter(c => isChainAvailable(c.value));
    default:
      return [...identityChains, ...chains, ...chainsTestnet, ...substrateChains].filter(c =>
        isChainAvailable(c.value)
      );
  }
});

const shownPrices = computed(() => {
  const chainName = selectedChain.value ? getChainName(selectedChain.value, selectedService.value) : '';

  /** Show only create collection */
  const filteredServices = props.showCreateCollection
    ? servicePrices.value.filter(
        item => item.name.endsWith('_COLLECTION') && !item.name.endsWith('_TRANSFER_COLLECTION')
      )
    : props.service === ServiceTypeName.NFT
      ? isMainnet.value
        ? servicePrices.value.filter(item => availableNftChainsCategories.includes(item.category))
        : servicePrices.value.filter(item => availableNftTestChainsCategories.includes(item.category))
      : servicePrices.value;

  /** Filter by chain and service */
  if (props.filterByChain && selectedChain.value && props.filterByService && selectedService.value) {
    return filteredServices.filter(item => item.category === chainName + '_' + selectedService.value);
  } else if (props.filterByChain && selectedChain.value && props.service) {
    /** Filter by chain */
    const service = props.service === ServiceTypeName.SMART_CONTRACTS ? 'CONTRACT' : props.service;
    return filteredServices.filter(item => item.name.startsWith(service + '_' + chainName));
  } else if (props.filterByChain && selectedChain.value) {
    /** Filter by chain */
    return filteredServices.filter(item => item.name.includes(chainName));
  } else if (props.filterByService && selectedService.value) {
    /** Filter by service */
    return filteredServices.filter(item => item.service === selectedService.value);
  } else {
    return filteredServices;
  }
});

/** Watch selectedService, onChange reset selected chain */
watch(
  () => selectedService.value,
  service => {
    if (service) {
      selectedChain.value = null;
    }
  }
);
watch(
  () => isMainnet.value,
  _ => {
    if (props.service === ServiceTypeName.NFT) {
      selectedChain.value = null;
    }
  }
);

function getChainName(chain?: string | number, service?: string): string {
  if (!chain) {
    return '';
  } else if (service === ServiceTypeName.SMART_CONTRACTS && Number.isInteger(chain)) {
    return chain in EvmChain ? EvmChain[chain] : SubstrateChain[chain];
  } else if (service === ServiceTypeName.NFT || Number.isInteger(chain)) {
    return chain in EvmChain
      ? EvmChain[chain]
      : SubstrateChain[chain] === SubstrateChain.ASTAR
        ? SubstrateChain[chain] + '_WASM'
        : SubstrateChain[chain];
  }
  return `${chain}`;
}

function getIconName(service: ProductPriceInterface) {
  switch (service.category.trim()) {
    case PriceServiceCategory.ACURAST:
      return 'icon/cloud-functions';
    case PriceServiceName.INDEXER:
      return 'menu/indexer';
  }
  switch (service.name) {
    case PriceServiceName.HOSTING_WEBSITE:
      return 'icon/magic-link';
    case PriceServiceName.HOSTING_DEPLOY_TO_STAGING:
      return 'icon/deploy';
    case PriceServiceName.HOSTING_DEPLOY_TO_PRODUCTION:
      return 'icon/deploy';
    case PriceServiceName.HOSTING_CHANGE_WEBSITE_DOMAIN:
      return 'icon/change';
    case PriceServiceName.KILT_IDENTITY:
      return 'logo/kilt';
  }
  switch (service.service) {
    case ServiceTypeName.COMPUTING:
      return 'menu/computing';
    case ServiceTypeName.EMBEDDED_WALLET:
      return 'icon/wallet';
    case ServiceTypeName.NFT:
      return `logo/${extractChainFromCategory(service.category, ServiceTypeName.NFT)}`;
    case ServiceTypeName.SMART_CONTRACTS:
      return `logo/${extractChainFromCategory(service.category, 'CONTRACT')}`;
    case ServiceTypeName.SIMPLETS:
      return 'dashboard/simplet';
  }

  return 'icon/change';
}

const extractChainFromCategory = (category: string, suffix = '') =>
  category.trim().replace(`_${suffix}`, '').toLowerCase();
</script>
