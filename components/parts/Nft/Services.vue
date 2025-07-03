<template>
  <div class="grid gap-4 md:grid-cols-3">
    <div v-for="(service, key) in nftServices" :key="key" class="card-light flex flex-col justify-between p-8">
      <div>
        <div class="mb-4 flex items-center gap-2">
          <span class="text-2xl" :class="service.icon"></span>
          <h5>{{ $t(`service.${service.name}.name`) }}</h5>
        </div>
        <p>
          {{ $t(`service.${service.name}.description`) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { web3Services } = useService();
const nftServices = web3Services.filter(item => [ServiceType.STORAGE, ServiceType.NFT].includes(item.id));
</script>
