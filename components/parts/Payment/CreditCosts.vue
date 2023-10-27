<template>
  <n-button class="rounded-lg" size="small" @click="modalCostsVisible = true">
    <span class="icon-credits text-xl mr-2"></span>
    {{ $t('dashboard.credits.checkPrice') }}
  </n-button>
  <Modal v-model:show="modalCostsVisible" :title="$t('dashboard.credits.creditCosts')">
    <div>
      <p v-if="$te(`dashboard.credits.services.${service}.description`)" class="mb-8 text-body">
        {{ $t(`dashboard.credits.services.${service}.description`) }}
      </p>

      <!-- Filter type -->
      <div v-if="filterByChain" class="mb-4">
        <strong>{{ $t('dashboard.credits.filterByChain') }}:</strong>
        <select-options
          v-model:value="selectedChain"
          :options="chains"
          class="w-[20vw] max-w-xs"
          size="small"
          :placeholder="$t('form.placeholder.chain')"
          filterable
          clearable
        />
      </div>

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
            <td class="text-right">
              {{ price.currentPrice }} {{ $t('dashboard.credits.credits') }}
            </td>
          </tr>
        </tbody>
      </n-table>

      <Btn class="mt-8" type="secondary" size="large" @click="modalCostsVisible = false">
        {{ $t('dashboard.credits.confirmPrices') }}
      </Btn>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import { ServiceTypeName } from '~/types/service';

const props = defineProps({
  service: { type: String as PropType<ServiceTypeName>, default: ServiceTypeName.NFT },
  filterByChain: { type: Boolean, default: false },
});

const paymentStore = usePaymentStore();
const collectionStore = useCollectionStore();
const { chains } = useCollection();

const modalCostsVisible = ref<boolean>(false);
const selectedChain = ref<number | null>(collectionStore.form.base.chain || Chains.MOONBEAM);

const servicePrices = ref<ProductPriceInterface[]>([]);
onMounted(async () => {
  servicePrices.value = await paymentStore.getServicePrices(props.service);
});

const shownPrices = computed(() => {
  if (!props.filterByChain) {
    return servicePrices.value;
  }
  const chainName = selectedChain.value ? Chains[selectedChain.value] : '';
  return servicePrices.value.filter(item => item.category === chainName + '_' + props.service);
});

/** Filter by selected chain in the form */
watch(
  () => modalCostsVisible.value,
  modalVisible => {
    if (modalVisible) {
      selectedChain.value = collectionStore.form.base.chain || Chains.MOONBEAM;
    }
  }
);
</script>
