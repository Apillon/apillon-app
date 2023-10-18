<template>
  <component
    :is="btnType === 'naive' ? NButton : btnType === 'btn' ? Btn : 'button'"
    v-bind="$attrs"
    @click="onClick"
  >
    <slot />
  </component>

  <SpendingWarn
    v-model:show="modalSpendingWarnVisible"
    @submit="emit('click', $event)"
    @close="modalSpendingWarnVisible = false"
  >
    <div v-if="servicePrice">
      <p>{{ servicePrice.description }}</p>
      <p>{{ servicePrice.currentPrice }} {{ $t('dashboard.credits.credits') }}</p>
    </div>
  </SpendingWarn>
</template>

<script lang="ts" setup>
import { NButton } from 'naive-ui';

const emit = defineEmits(['click']);
const props = defineProps({
  serviceName: { type: String, default: null },
  btnType: { type: String as PropType<'naive' | 'btn' | 'button'>, default: 'naive' },
});

const Btn = resolveComponent('Btn');
const paymentsStore = usePaymentsStore();
const modalSpendingWarnVisible = ref<boolean>(false);
const servicePrice = ref<ProductPriceInterface | null>();

async function onClick(event: MouseEvent) {
  servicePrice.value = await paymentsStore.getServicePrice(props.serviceName);

  if (servicePrice.value) {
    event.preventDefault();
    event.stopPropagation();
    modalSpendingWarnVisible.value = true;
  } else {
    emit('click', event);
  }
}
</script>
