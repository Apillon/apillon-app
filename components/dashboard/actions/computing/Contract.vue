<template>
  <n-space size="large" justify="end">
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
</template>

<script lang="ts" setup>
const emit = defineEmits(['transfer']);

const { t } = useI18n();
const authStore = useAuthStore();
const contractStore = useContractStore();

const actionsDisabled = computed<boolean>(
  () => contractStore.active?.contractStatus !== ContractStatus.DEPLOYED
);

const options = computed(() => {
  return [
    {
      label: t('computing.contract.transfer'),
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
