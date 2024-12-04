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
      <div class="flex flex-wrap justify-end items-center gap-4 gap-y-2">
        <slot> </slot>
        <BtnDocumentation
          size="small"
          href="https://wiki.apillon.io/web3-services/12-web3-smart-contracts.html"
        />
        <ModalCreditCosts :service="ServiceTypeName.CONTRACTS" filter-by-chain />
      </div>
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
