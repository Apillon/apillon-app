<template>
  <div class="flex flex-col flex-grow max-w-sm relative bg-bg-light p-8 rounded-lg">
    <div class="text-center">
      <h4 class="text-bodyDark mb-4">{{ package.name }}</h4>

      <h1 v-if="package.price === 0" class="text-white">{{ $t('dashboard.subscription.free') }}</h1>
      <div v-else class="flex items-baseline justify-center">
        <h1 class="text-white mr-1">{{ formatPrice(package.price || 0) }}</h1>
        <p class="font-bold">{{ $t('dashboard.subscription.plusTaxes') }}</p>
      </div>

      <p>{{ package.limits }}</p>
    </div>

    <div class="my-4 border-b border-bg-lighter"></div>

    <ul class="flex-grow mb-6">
      <li v-for="(benefit, key) in package.benefits" :key="key" class="my-2">
        <NuxtIcon name="icon/success" class="inline-block float-left mr-2 text-2xl text-green" />
        <p class="text-white">{{ benefit }}</p>
      </li>
    </ul>
    <Btn
      v-if="isOwner"
      :type="isSelected ? 'secondary' : 'primary'"
      size="large"
      :loading="loading"
      round
      @click="onPress"
    >
      {{ isSelected ? $t('rpc.apiKey.continue') : $t('dashboard.payment.selectPlan') }}
    </Btn>
  </div>
</template>

<script lang="ts" setup>
export type RpcSubscriptionPackage = {
  name: string;
  price: number;
  benefits: string[];
  id: number;
  limits: string;
};

defineProps({
  package: { type: Object as PropType<RpcSubscriptionPackage>, required: true },
  isSelected: { type: Boolean, required: true },
  onPress: { type: Function as PropType<() => void>, required: true },
  loading: { type: Boolean, required: true },
  isOwner: { type: Boolean, default: false },
});
</script>
