<template>
  <n-button v-bind="$attrs" @click="onClick">
    <slot />
  </n-button>

  <SpendingWarn
    v-model:show="modalSpendingWarnVisible"
    @submit="emit('click', $event)"
    @close="modalSpendingWarnVisible = false"
  >
    HOSTING_DEPLOY_TO_STAGING
  </SpendingWarn>
</template>

<script lang="ts" setup>
const emit = defineEmits(['click']);
const props = defineProps({
  serviceName: { type: String, default: null },
});

const paymentsStore = usePaymentsStore();
const modalSpendingWarnVisible = ref<boolean>(false);

async function onClick(event: MouseEvent) {
  const servicePrice = await paymentsStore.getServicePrice('HOSTING_DEPLOY_TO_STAGING');
  if (servicePrice) {
    event.preventDefault();
    event.stopPropagation();
    modalSpendingWarnVisible.value = true;
  } else {
    emit('click', event);
  }
}
</script>
