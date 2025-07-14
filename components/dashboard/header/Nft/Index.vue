<template>
  <Heading
    docs="https://wiki.apillon.io/web3-services/4-nfts.html"
    :service="ServiceTypeName.NFT"
    filter-by-chain
    :headline="$t('dashboard.nav.nft')"
  >
    <template #submenu>
      <MenuCollection />
    </template>
  </Heading>
</template>

<script lang="ts" setup></script>
