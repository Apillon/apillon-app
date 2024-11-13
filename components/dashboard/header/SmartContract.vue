<template>
  <Heading>
    <div class="flex gap-4 items-center">
      <NuxtLink v-if="link" class="flex items-center gap-x-2" :to="link">
        <span class="icon-back text-2xl align-sub"></span>
      </NuxtLink>
      <div>
        <slot name="title">
          <h1 v-if="title">{{ title }}</h1>
          <h1 v-else>{{ $t('dashboard.nav.smartContracts') }}</h1>
        </slot>
      </div>
    </div>
    <template #info>
      <n-space :size="24" align="center">
        <slot> </slot>
        <ModalCreditCosts :service="ServiceTypeName.CONTRACTS" filter-by-chain />
      </n-space>
    </template>
  </Heading>
</template>

<script lang="ts" setup>
defineProps({
  billing: { type: Boolean, default: false },
  link: { type: String, default: '/dashboard/service/smart-contracts' },
  title: { type: String, default: '' },
});
</script>
