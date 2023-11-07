<template>
  <div>
    <n-space :size="32">
      <!-- Filter by service -->
      <div v-if="filterByService" class="mb-4">
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
          clearable
        />
      </div>
    </n-space>

    <n-table class="plain" :bordered="false" :single-line="true">
      <thead>
        <tr>
          <th>{{ $t('dashboard.credits.serviceDescription') }}</th>
          <th class="!text-right">{{ $t('dashboard.credits.cost') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(price, key) in shownPrices" :key="key">
          <td>{{ price.description }}</td>
          <td class="text-right">{{ price.currentPrice }} {{ $t('dashboard.credits.credits') }}</td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script lang="ts" setup>
import { ServiceTypeName } from '~/types/service';

const props = defineProps({
  service: { type: String as PropType<ServiceTypeName>, default: null },
  filterByChain: { type: Boolean, default: false },
  filterByService: { type: Boolean, default: false },
});

const paymentStore = usePaymentStore();
const collectionStore = useCollectionStore();
const { chains } = useCollection();

const identityChains = enumKeyValues(IdentityChains);
const services = enumKeyValues(ServiceTypeName);
const selectedService = ref<string | null>(props.service);
const servicePrices = ref<ProductPriceInterface[]>([]);
const selectedChain = ref<number | null>(null);

onMounted(async () => {
  if (props.filterByChain && props.service === ServiceTypeName.NFT) {
    selectedChain.value = collectionStore.form.base.chain || Chains.MOONBEAM;
  }

  servicePrices.value = props.service
    ? await paymentStore.getServicePrices(props.service)
    : await paymentStore.getPriceList();
});

const chainsByService = computed(() => {
  switch (selectedService.value) {
    case ServiceTypeName.AUTHENTICATION:
      return identityChains;
    case ServiceTypeName.HOSTING:
      return [];
    case ServiceTypeName.NFT:
      return chains;
    case ServiceTypeName.STORAGE:
      return [];
    default:
      return [...identityChains, ...chains];
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
    const chainName = getChainName(selectedChain.value);
    return servicePrices.value.filter(item => item.category.includes(chainName));
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
  if (service === ServiceTypeName.NFT || Number.isInteger(chain)) {
    return Chains[chain];
  }
  return `${chain}`;
}
</script>
