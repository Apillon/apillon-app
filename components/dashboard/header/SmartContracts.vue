<template>
  <Heading>
    <slot>
      <h1>
        {{ $t('dashboard.nav.smartContracts') }}
        <img src="/icons/beta.svg" alt="Beta" class="ml-2 inline-block h-5 w-14" />
      </h1>
    </slot>
    <template #info>
      <n-space align="center">
        <BtnDocumentation href="https://wiki.apillon.io/web3-services/12-web3-smart-contracts.html" />
        <ModalCreditCosts :service="ServiceTypeName.SMART_CONTRACTS" filter-by-chain />
      </n-space>
    </template>
    <template #submenu>
      <MenuSmartContract />
    </template>
  </Heading>
</template>

<script setup lang="ts">
import { ServiceTypeName } from '~/lib/types/service';
</script>
