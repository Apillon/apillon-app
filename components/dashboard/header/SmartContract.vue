<template>
  <Heading>
    <slot>
      <NuxtLink class="flex items-center gap-x-2" :to="link">
        <span class="icon-back text-2xl align-sub"></span>
        <h1 v-if="title">{{ title }}</h1>
        <h1 v-else>{{ $t('dashboard.nav.smartContracts') }}</h1>
      </NuxtLink>
    </slot>
    <template #info>
      <ModalCreditCosts :service="ServiceTypeName.CONTRACTS" filter-by-chain />
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
