<template>
  <div v-if="id" class="mb-8">
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

    <div class="body-sm mb-4">
      <p class="body-sm">{{ $t('dashboard.apiKey.authorization') }}</p>
      <TableEllipsis :text="authorization" text-white />
    </div>
  </div>
  <Spinner v-else />
</template>

<script lang="ts" setup>
const props = defineProps({
  id: { type: String, default: '' },
  status: { type: String, default: '' },
  apiKey: { type: String, default: '' },
  name: { type: String, default: '' },
  testNetwork: { type: Boolean, default: null },
  projectUuid: { type: String, default: '' },
  apiKeySecret: { type: String, default: '' },
});

const authorization = computed<string>(() => {
  const auth = window.btoa(`${props.apiKey}:${props.apiKeySecret}`);
  return `Basic ${auth}`;
});
</script>
