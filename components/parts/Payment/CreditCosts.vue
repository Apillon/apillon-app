<template>
  <Spinner v-if="loading" />
  <template v-else>
    <div v-if="!service || (servicePrices && servicePrices.length)">
      <n-space :size="32">
        <!-- Filter by service -->
        <div v-if="filterByService && !service" class="mb-4">
          <strong>{{ $t('dashboard.credits.filterByService') }}:</strong>
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
        <div v-if="filterByChain" class="mb-4">
          <strong>{{ $t('dashboard.credits.filterByChain') }}:</strong>
          <select-options
            v-model:value="selectedChain"
            :options="chainsByService"
            class="min-w-[13rem] max-w-xs"
            size="small"
            :placeholder="$t('form.placeholder.chain')"
            filterable
            :clearable="!service"
          />
        </div>
      </n-space>

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
              <NuxtIcon
                :name="getIconName(price)"
                class="float-left text-white text-2xl mr-3"
                filled
              />
              <span>{{ price.description }} </span>
            </td>
            <td class="text-right">
              <strong class="text-white">
                {{ price.currentPrice }} {{ $t('dashboard.credits.credits') }}
              </strong>
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
});

const paymentStore = usePaymentStore();
const collectionStore = useCollectionStore();
const { chains, nftChains, evmChains, substrateChains } = useCollection();

const identityChains = enumKeyValues(IdentityChains);
const services = enumKeyValues(ServiceTypeName);
const selectedService = ref<string | null>(props.service);
const servicePrices = ref<ProductPriceInterface[]>([]);
const selectedChain = ref<number | null>(null);
const loading = ref<boolean>(true);

onMounted(async () => {
  if (props.filterByChain && props.service === ServiceTypeName.NFT) {
    selectedChain.value = props.chain || collectionStore.form.base.chain || Chains.MOONBEAM;
  }

  servicePrices.value = props.category
    ? await paymentStore.getServicePricesByCategory(props.category)
    : props.service
      ? await paymentStore.getServicePrices(props.service)
      : await paymentStore.getPriceList();

  /** Sort by category (chain name) */
  servicePrices.value.sort((a, b) =>
    a.category.toLowerCase() < b.category.toLowerCase() ? -1 : 1
  );

  loading.value = false;
});

const chainsByService = computed(() => {
  switch (selectedService.value) {
    case ServiceTypeName.AUTHENTICATION:
      return identityChains;
    case ServiceTypeName.HOSTING:
      return [];
    case ServiceTypeName.NFT:
      return nftChains;
    case ServiceTypeName.STORAGE:
      return [];
    case ServiceTypeName.CONTRACTS:
      return [...evmChains, ...chains];
    default:
      return [...identityChains, ...chains, ...substrateChains];
  }
});

const shownPrices = computed(() => {
  /** Filter by chain and service */
  if (
    props.filterByChain &&
    selectedChain.value &&
    props.filterByService &&
    selectedService.value
  ) {
    const chainName = getChainName(selectedChain.value, selectedService.value);
    return servicePrices.value.filter(
      item => item.category === chainName + '_' + selectedService.value
    );
  } else if (props.filterByChain && selectedChain.value) {
    /** Filter by chain */
    const chainName = getChainName(selectedChain.value, props.service);
    return servicePrices.value.filter(item => item.name.includes(chainName));
  } else if (props.filterByService && selectedService.value) {
    /** Filter by service */
    return servicePrices.value.filter(item => item.service === selectedService.value);
  } else {
    return servicePrices.value;
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

function getChainName(chain: string | number, service?: string): string {
  if (service === ServiceTypeName.CONTRACTS && Number.isInteger(chain)) {
    return chain in EvmChain ? EvmChain[chain] : Chains[chain];
  } else if (service === ServiceTypeName.NFT || Number.isInteger(chain)) {
    return chain in Chains
      ? Chains[chain]
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
    case PriceServiceCategory.ASTAR_CONTRACT:
    case PriceServiceCategory.ASTAR_NFT:
      return 'logo/astar';
    case PriceServiceCategory.MOONBASE_CONTRACT:
    case PriceServiceCategory.MOONBASE_NFT:
      return 'logo/moonbase';
    case PriceServiceCategory.MOONBEAM_CONTRACT:
    case PriceServiceCategory.MOONBEAM_NFT:
      return 'logo/moonbeam';
    case PriceServiceCategory.ETHEREUM_CONTRACT:
    case PriceServiceCategory.ETHEREUM_NFT:
    case PriceServiceCategory.SEPOLIA_CONTRACT:
    case PriceServiceCategory.SEPOLIA_NFT:
      return 'logo/evm';
    case PriceServiceCategory.UNIQUE_NFT:
      return 'logo/unique';
    case PriceServiceCategory.GRILL_CHAT:
      return 'logo/subsocial';
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
    case ServiceTypeName.SOCIAL:
      return 'logo/subsocial';
    case ServiceTypeName.WALLET:
      return 'icon/wallet';
  }

  return 'icon/change';
}
</script>
