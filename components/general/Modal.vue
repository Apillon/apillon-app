<template>
  <n-modal
    v-bind="$attrs"
    :title="title"
    preset="card"
    :class="size === 'large' ? 'max-w-5xl' : 'max-w-2xl'"
    :bordered="false"
    :show-icon="false"
    :segmented="true"
  >
    <template v-if="serviceName && servicePrice" #header-extra>
      <div>
        <strong>{{ $t('dashboard.credits.cost') }}:</strong>
        <span class="inline-block text-blue mx-1">{{ servicePrice.currentPrice }}</span>
        <span>{{ $t('dashboard.credits.credits') }}</span>
      </div>
    </template>
    <slot />
  </n-modal>
</template>

<script lang="ts" setup>
import { PriceServiceName } from '#imports';

const attrs = useAttrs();
const props = defineProps({
  size: { type: String as PropType<'medium' | 'large'>, default: 'medium' },
  title: { type: String, default: null },
  serviceName: { type: String as PropType<PriceServiceName>, default: null },
});

const paymentsStore = usePaymentsStore();
const servicePrice = ref<ProductPriceInterface | null>();

watch(
  () => attrs.show,
  async shown => {
    if (shown && props.serviceName) {
      servicePrice.value = await paymentsStore.getServicePrice(props.serviceName);
    }
  },
  { immediate: true }
);
</script>
