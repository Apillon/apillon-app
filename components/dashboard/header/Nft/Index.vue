<template>
  <Heading>
    <slot>
      <h1>{{ $t('dashboard.nav.nft') }}</h1>
    </slot>
    <template #info>
      <ModalCreditCosts :service="ServiceTypeName.NFT" filter-by-chain />
    </template>

    <template #submenu>
      <MenuCollection />
    </template>
  </Heading>
</template>

<script lang="ts" setup></script>
