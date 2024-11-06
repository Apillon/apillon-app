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
      <div v-if="cloudFunctionStore.active.activeJob_id">
        <h4>
          {{ $t('computing.cloudFunctions.endpoint') }}
        </h4>
        <div class="flex items-center gap-4 mt-2">
          <TableEllipsis
            class="bg-white px-4 py-[10px] rounded-lg !text-black max-w-sm lg:max-w-md xl:max-w-lg xxl:max-w-none"
            color="text-black"
            :text="gatewayUrl"
          />
        </div>
      </div>
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
