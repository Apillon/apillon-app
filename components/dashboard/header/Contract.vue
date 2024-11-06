<template>
  <Heading>
    <slot>
      <n-space align="center" size="large">
        <NuxtLink :to="{ name: 'dashboard-service-computing' }">
          <span class="icon-back text-2xl align-sub"></span>
        </NuxtLink>
        <h2>{{ contractStore.active.name }}</h2>
      </n-space>
    </slot>
    <template #info>
      <n-space :size="32" align="center" justify="end">
        <slot name="info"> </slot>
        <IconInfo v-if="$te('w3Warn.computing.info')" @click="modalW3WarnVisible = true" />
      </n-space>
    </template>
  </Heading>

  <W3Warn v-model:show="modalW3WarnVisible">
    {{ $t('w3Warn.computing.new') }}
  </W3Warn>
</template>

<script lang="ts" setup>
const contractStore = useContractStore();
const modalW3WarnVisible = ref<boolean>(false);
</script>
