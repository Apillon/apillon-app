<template>
  <n-modal
    v-bind="$attrs"
    :title="title"
    preset="card"
    :class="sizeClass"
    :bordered="false"
    :show-icon="false"
    :segmented="true"
  >
    <template v-if="serviceName && servicePrice" #header-extra>
      <div>
        <strong>{{ $t('dashboard.credits.cost') }}:</strong>
        <span class="mx-1 inline-block text-blue">{{ servicePrice.currentPrice }}</span>
        <span>{{ $t('dashboard.credits.credits') }}</span>
      </div>
    </template>
    <slot />
  </n-modal>
</template>

<script lang="ts" setup>
import { PriceServiceName } from '#imports';
import type { Size } from 'naive-ui/es/select/src/interface';

const attrs = useAttrs();
const props = defineProps({
  size: { type: String as PropType<Size>, default: 'medium' },
  title: { type: String, default: null },
  serviceName: { type: String as PropType<PriceServiceName>, default: null },
});

const paymentStore = usePaymentStore();
const servicePrice = ref<ProductPriceInterface | null>();

const sizeClass = computed(() => {
  switch (props.size) {
    case 'tiny':
      return 'max-w-lg';
    case 'small':
      return 'max-w-xl';
    case 'large':
      return 'max-w-5xl';
    default:
      return 'max-w-2xl';
  }
});

watch(
  () => attrs.show,
  async shown => {
    if (shown && props.serviceName) {
      servicePrice.value = await paymentStore.getServicePrice(props.serviceName);
    }
  },
  { immediate: true }
);
</script>
