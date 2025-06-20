<template>
  <n-form-item path="embeddedWallet" :label="labelInfo('integration')" :label-props="{ for: 'embeddedWallet' }">
    <n-select
      v-bind="$attrs"
      :loading="embeddedWalletStore.loading"
      :placeholder="$t('form.placeholder.select')"
      :options="items"
      filterable
    />
  </n-form-item>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

const embeddedWalletStore = useEmbeddedWalletStore();
const { labelInfo } = useForm('form.label.embeddedWallet');
const items = ref<SelectOption[]>([]);

onMounted(async () => {
  await embeddedWalletStore.getEmbeddedWallets();
  if (embeddedWalletStore.hasEmbeddedWallets) {
    items.value = embeddedWalletStore.items.map((item: EmbeddedWalletInterface) => ({
      value: item.integration_uuid,
      label: item.title,
    }));
  }
});
</script>
