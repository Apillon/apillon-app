<template>
  <Heading>
    <div class="flex items-center gap-4">
      <NuxtLink v-if="link" class="flex items-center gap-x-2" :to="link">
        <span class="icon-back align-sub text-2xl"></span>
      </NuxtLink>
      <div>
        <slot name="title">
          <h1 v-if="title">{{ title }}</h1>
          <h1 v-else>{{ $t('dashboard.nav.smartContracts') }}</h1>
        </slot>
      </div>
    </div>
    <template #info>
      <div class="flex flex-wrap items-center justify-end gap-4 gap-y-2">
        <slot> </slot>
        <BtnDocumentation href="https://wiki.apillon.io/web3-services/12-web3-smart-contracts.html" />
        <ModalCreditCosts :service="ServiceTypeName.SMART_CONTRACTS" filter-by-chain />
      </div>
    </template>
  </Heading>
</template>

<script lang="ts" setup>
import { ServiceTypeName } from '~/lib/types/service';

defineProps({
  billing: { type: Boolean, default: false },
  link: { type: String, default: '/dashboard/service/smart-contracts' },
  title: { type: String, default: '' },
});
</script>
