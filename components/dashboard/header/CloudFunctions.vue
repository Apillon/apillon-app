<template>
  <Heading>
    <slot>
      <n-space align="center" size="large">
        <NuxtLink :to="{ name: 'dashboard-service-cloud-functions' }">
          <span class="icon-back text-2xl align-sub"></span>
        </NuxtLink>
        <h2>{{ cloudFunctionStore.active.name }}</h2>
      </n-space>
    </slot>

    <template #info>
      <ComputingCloudFunctionsProgress :size="250000" :max-size="5000000" />
    </template>

    <template #submenu>
      <div class="flex items-center gap-4 border-t border-bg-lighter py-8">
        <h4>{{ $t('computing.cloudFunctions.endpoint') }}</h4>

        <TableLink
          class="bg-white px-4 py-[10px] rounded-lg !text-black lg:min-w-[30rem]"
          color="text-black"
          :link="cloudFunctionStore.functionUuid"
        />
      </div>
      <MenuCloudFunctions />
    </template>
  </Heading>

  <W3Warn v-model:show="modalW3WarnVisible">
    {{ $t('w3Warn.computing.new') }}
  </W3Warn>
</template>

<script lang="ts" setup>
const cloudFunctionStore = useCloudFunctionStore();
const modalW3WarnVisible = ref<boolean>(false);
</script>
