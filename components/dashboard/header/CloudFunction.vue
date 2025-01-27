<template>
  <Heading>
    <slot>
      <div class="flex gap-4 items-center">
        <NuxtLink :to="{ name: 'dashboard-service-cloud-functions' }">
          <span class="icon-back text-2xl align-sub"></span>
        </NuxtLink>
        <div>
          <h2>{{ cloudFunctionStore.active.name }}</h2>
          <TableEllipsis
            :prefix="$t('computing.cloudFunctions.uuid')"
            :text="cloudFunctionStore.active.function_uuid"
          />
        </div>
      </div>
    </slot>

    <template #info>
      <ApiLink
        v-if="cloudFunctionStore.active.activeJob_id"
        :title="$t('computing.cloudFunctions.endpoint')"
        :url="gatewayUrl"
      />
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
    `https://${cloudFunctionStore.functionUuid}.${subdomain}.web3approved.com`
);
</script>
