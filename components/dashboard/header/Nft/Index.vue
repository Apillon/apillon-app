<template>
  <Heading>
    <slot>
      <h1>{{ $t('dashboard.nav.nft') }}</h1>
    </slot>
    <template #info>
      <n-space size="large">
        <BtnDocumentation size="small" href="https://wiki.apillon.io/web3-services/4-nfts.html" />
        <ModalCreditCosts :service="ServiceTypeName.NFT" filter-by-chain />
      </n-space>
    </template>

    <template #submenu>
      <MenuCollection />
    </template>
  </Heading>
</template>

<script lang="ts" setup></script>
