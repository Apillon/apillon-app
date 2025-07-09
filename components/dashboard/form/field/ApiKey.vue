<template>
  <n-collapse :expanded-names="expandedNames" accordion @item-header-click="handleItemHeaderClick">
    <n-collapse-item name="apiKey">
      <template #header>
        {{ $t('form.label.advancedSettings') }}
      </template>
      <template #arrow>
        {{ $t('form.label.advancedSettings') }}
      </template>

      <n-form-item path="apiKey" :label="$t('form.label.apiKey')" :label-props="{ for: 'apiKey' }">
        <n-select
          :value="apiKey"
          :options="apiKeyOptions"
          :placeholder="$t('form.placeholder.apiKey')"
          clearable
          @update:value="$emit('update:apiKey', $event)"
        >
        </n-select>
      </n-form-item>

      <n-form-item path="apiSecret" :label="$t('form.label.apiSecret')" :label-props="{ for: 'apiSecret' }">
        <div v-if="configId && !showApiSecretInput" class="flex flex-row gap-4">
          <n-input :disabled="true" :placeholder="$t('form.label.apiSecretSet')"> </n-input>
          <Btn type="primary" class="mt-2" @click="onChangeSecretPress">
            {{ $t('general.change') }}
          </Btn>
        </div>

        <n-input
          v-else
          :value="apiSecret"
          :input-props="{ id: 'apiSecret', autocomplete: 'off' }"
          show-password-on="click"
          type="password"
          :placeholder="$t('form.placeholder.apiSecret')"
          clearable
          @update:value="$emit('update:apiSecret', $event)"
        />
      </n-form-item>

      <slot />
    </n-collapse-item>
  </n-collapse>
</template>

<script lang="ts" setup>
import type { CollapseProps, SelectOption } from 'naive-ui';

defineEmits(['update:apiKey', 'update:apiSecret']);
defineProps({
  apiKey: { type: [String, null], default: null },
  apiSecret: { type: [String, null], default: null },
  configId: { type: Number, default: 0 },
});

const settingsStore = useSettingsStore();
const apiKeyOptions = ref<SelectOption[]>([]);
const expandedNames = ref<string[]>([]);
const showApiSecretInput = ref(false);

const onChangeSecretPress = () => {
  showApiSecretInput.value = true;
};

const handleItemHeaderClick: CollapseProps['onItemHeaderClick'] = ({ name, expanded }) => {
  if (expanded) {
    expandedNames.value.push(name);
  } else {
    expandedNames.value = expandedNames.value.filter(i => i !== name);
  }
};

onMounted(async () => {
  checkQuota();
  await settingsStore.getApiKeys();
  apiKeyOptions.value = settingsStore.apiKeys.map((item: ApiKeyInterface) => {
    return {
      label: item.name,
      value: item.apiKey,
    };
  });
});

async function checkQuota() {
  await settingsStore.fetchApiKeyQuota();
  if (settingsStore.apiKeyQuotaReached) {
    expandedNames.value.push('apiKey');
  }
}
</script>
