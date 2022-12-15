<template>
  <div v-if="id">
    <div class="body-sm mb-4">
      <p class="body-sm">{{ $t('form.label.apiKeyName') }}</p>
      <strong>{{ name }}</strong>
    </div>

    <div class="body-sm mb-4">
      <p class="body-sm">{{ $t('form.label.apiKeyType') }}</p>
      <strong>
        <template v-if="testNetwork">
          {{ $t('form.apiKeyTypes.test') }}
        </template>
        <template v-else>
          {{ $t('form.apiKeyTypes.live') }}
        </template>
      </strong>
    </div>

    <div class="body-sm mb-4">
      <p class="body-sm">{{ $t('dashboard.apiKey.apiKey') }}</p>
      <strong>{{ apiKey }}</strong>
      <button class="ml-2" @click="copyToClipboard(apiKey)">
        <span class="icon-copy"></span>
      </button>
    </div>

    <div class="body-sm mb-4">
      <p class="body-sm">{{ $t('dashboard.apiKey.apiKeySecret') }}</p>
      <strong>{{ apiKeySecret }}</strong>
      <button class="ml-2" @click="copyToClipboard(apiKeySecret)">
        <span class="icon-copy"></span>
      </button>
    </div>
  </div>
  <Spinner v-else />
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  id: { type: String, default: '' },
  status: { type: String, default: '' },
  apiKey: { type: String, default: '' },
  name: { type: String, default: '' },
  testNetwork: { type: Boolean, default: null },
  project_uuid: { type: String, default: '' },
  apiKeySecret: { type: String, default: '' },
});

const { t } = useI18n();
const message = useMessage();

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(
    () => {
      /* Resolved - text copied to clipboard successfully */
      message.success(t('dashboard.clipboard.copied'));
    },
    () => {
      /* Rejected - text failed to copy to the clipboard */
      message.warning(t('dashboard.clipboard.error'));
    }
  );
}
</script>
