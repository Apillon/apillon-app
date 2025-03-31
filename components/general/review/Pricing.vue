<template>


    <div>      
      <div class="mb-4">       
      <h6 v-if="title">{{ title }}</h6>
      <h6 v-else>{{ $t('nft.collection.review.costs') }}</h6>
        <p v-if="info">          
          {{info}}
        </p>
      </div>

      <slot/>

      <n-table class="plain my-6 table-fixed" :bordered="false" :single-line="true">
        <tbody>
          <tr v-for="price in pricing">
            <td>{{ price.description }}</td>
            <td class="!text-white">{{ price.currentPrice }} {{ $t('dashboard.credits.credits') }}</td>
          </tr>
        </tbody>
      </n-table>
      <div class="card-light p-6">
        <div class="flex gap-2">
          <strong class="block w-1/2">{{ $t('nft.collection.review.totalSpend') }}</strong>
          <div class="flex w-1/2 flex-col gap-1 text-right">
            <strong>{{ totalCredits }} {{ $t('dashboard.credits.credits') }}</strong>
            <small>
              {{ $t('nft.collection.review.balance') }}: {{ formatNumber(paymentStore.credit.balance || 0) }}
              {{ $t('dashboard.credits.credits') }}
            </small>
          </div>
        </div>
        <hr class="my-6 w-full border-bg-lighter" />
        <div class="my-6">
          <n-checkbox v-model:checked="nonRefundable" :label="t('nft.collection.review.nonRefundable')" />
        </div>
        <Btn size="large" type="primary" :disabled="!nonRefundable" @click="$emit('deploy')">
          <template v-if="deployText"> {{ deployText }} </template>
          <template v-else>            
            {{ $t('nft.collection.review.createCollection') }}
          </template>
        </Btn>
      </div>
    </div>
</template>

<script setup lang="ts">
import { formatNumber } from '~/lib/utils/helpers';

defineEmits(['deploy']);
const props = defineProps({
  title:{type: String, default: ''},
  info:{type: String, default: ''},
  deployText:{type: String, default: ''},
  pricing: {type: Array<ProductPriceInterface>, default: []},
})
const { t } = useI18n();
const paymentStore = usePaymentStore();

const nonRefundable = ref<boolean>(false);


const totalCredits = computed(() => sumCredits(props.pricing));

</script>
