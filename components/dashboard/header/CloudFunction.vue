<template>
  <Heading
    :back="{ name: 'dashboard-service-cloud-functions' }"
    docs="https://wiki.apillon.io/web3-services/8-web3-cloud-functions.html"
  >
    <div>
      <h2>{{ cloudFunctionStore.active.name }}</h2>
      <TableEllipsis :prefix="$t('computing.cloudFunctions.uuid')" :text="cloudFunctionStore.active.function_uuid" />
    </div>

    <template #info>
      <ApiLink :title="$t('computing.cloudFunctions.endpoint')" :url="gatewayUrl" />
    </template>

    <template #submenu>
      <MenuCloudFunction />
    </template>
  </Heading>

  <W3Warn v-model:show="modalW3WarnVisible">
    {{ $t('w3Warn.computing.new') }}
  </W3Warn>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
const cloudFunctionStore = useCloudFunctionStore();
const modalW3WarnVisible = ref<boolean>(false);

const subdomain = computed(() =>
  cloudFunctionStore.active?.endpointUrl || config.public.ENV === AppEnv.DEV
    ? 'gw-dev'
    : config.public.ENV === AppEnv.STAGING
      ? 'gw-stg'
      : 'gw'
);

const gatewayUrl = computed(
  () =>
    cloudFunctionStore.active?.gatewayUrl ||
    `https://${cloudFunctionStore.functionUuid}.${subdomain.value}.web3approved.com`
);
</script>
