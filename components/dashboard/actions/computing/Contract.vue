<template>
  <div>
    <n-space v-bind="$attrs" justify="space-between">
      <div class="w-[20vw] max-w-xs"></div>

      <n-space size="large">
        <!-- Actions -->
        <n-dropdown
          :key="contractStore.active.contractStatus"
          placement="bottom-end"
          trigger="click"
          :options="options"
          :disabled="authStore.isAdmin()"
        >
          <n-button size="small">
            <span class="text-primary">{{ $t('general.actions') }}</span>
            <div class="hidden md:flex items-center relative left-1">
              <span class="icon-down text-2xl text-primary"></span>
            </div>
          </n-button>
        </n-dropdown>
      </n-space>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  env: { type: Number, default: 0 },
});
const emit = defineEmits(['mint', 'nestMint', 'revoke', 'transfer']);

const $i18n = useI18n();
const authStore = useAuthStore();
const contractStore = useContractStore();

const actionsDisabled = computed<boolean>(
  () => contractStore.active?.contractStatus !== ContractStatus.DEPLOYED
);

const options = computed(() => {
  return [
    {
      label: $i18n.t('computing.contract.transfer'),
      key: 'transfer',
      disabled: actionsDisabled.value,
      props: {
        onClick: () => {
          if (!actionsDisabled.value) {
            emit('transfer');
          }
        },
      },
    },
  ];
});
</script>
