<template>
  <n-button class="rounded-lg" size="small" @click="modalCostsVisible = true">
    <span class="icon-credits text-xl mr-2"></span>
    {{ $t('dashboard.credits.checkPrice') }}
  </n-button>
  <Modal v-model:show="modalCostsVisible" :title="$t('dashboard.credits.estimatedCosts')">
    <div>
      <p v-if="$te(`dashboard.credits.services.${service}.description`)" class="mb-8 text-body">
        {{ $t(`dashboard.credits.services.${service}.description`) }}
      </p>

      <n-table class="plain" :bordered="false" :single-line="true">
        <thead>
          <tr>
            <th>{{ $t('dashboard.credits.serviceDescription') }}</th>
            <th class="!text-right">{{ $t('dashboard.credits.cost') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(price, key) in servicePrices" :key="key">
            <td>{{ price.description }}</td>
            <td class="text-right">
              ~{{ price.currentPrice }} {{ $t('dashboard.credits.credits') }}
            </td>
          </tr>
        </tbody>
      </n-table>

      <div class="bg-bg-lighter flex justify-between p-2 mt-8 rounded">
        <span>{{ $t('dashboard.credits.yourFunds') }}</span>
        <strong class="text-blue">
          {{ paymentsStore.credit.balance }} {{ $t('dashboard.credits.credits') }}
        </strong>
      </div>

      <Btn class="my-8" type="secondary" size="large" @click="modalCostsVisible = false">
        {{ $t('dashboard.credits.confirmPrices') }}
      </Btn>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import { ServiceTypeName } from '~/types/service';

const props = defineProps({
  service: { type: String as VuePropType<ServiceTypeName>, default: ServiceTypeName.NFT },
});

const paymentsStore = usePaymentsStore();
const modalCostsVisible = ref<boolean>(false);

const servicePrices = ref<ProductPriceInterface[]>([]);
onMounted(async () => {
  servicePrices.value = await paymentsStore.getServicePrices(props.service);
});
</script>
