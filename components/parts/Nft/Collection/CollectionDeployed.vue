<template>
  <div class="text-center">
    <div class="mx-auto mb-16 mt-8 max-w-lg">
      <IconSuccess class="text-3xl" />
      <h4 class="mt-6">{{ $t('nft.collection.deployed.title') }}</h4>
      <p>{{ $t('nft.collection.deployed.info') }}</p>
    </div>
    <div class="card-light border-none px-8 pb-14 pt-11">
      <h4>{{ $t('nft.collection.deployed.next') }}</h4>
      <p class="mb-9 mt-2">{{ $t('nft.collection.deployed.nextInfo') }}</p>

      <div class="mx-auto flex max-w-4xl flex-col gap-2 md:flex-row">
        <NftCollectionDeployedCard
          :title="$t('nft.collection.deployed.standalone')"
          :info="$t('nft.collection.deployed.standaloneInfo')"
        />
        <NftCollectionDeployedCard
          :title="$t('nft.collection.deployed.standalone')"
          :info="$t('nft.collection.deployed.standaloneInfo')"
        >
          <Btn size="small">{{ $t('nft.marketplaces') }}</Btn>
        </NftCollectionDeployedCard>
        <NftCollectionDeployedCard
          :title="$t('nft.collection.deployed.standalone')"
          :info="$t('nft.collection.deployed.standaloneInfo')"
        >
          <Btn size="small">{{ $t('nft.marketplaces') }}</Btn>
        </NftCollectionDeployedCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
