<template>
  <div class="flex flex-col flex-grow max-w-sm relative">
    <div
      v-if="!allowSwitch && !isSelected"
      class="absolute inset-0 bg-opacity-50 backdrop-blur-sm z-10 flex items-end justify-center pb-4"
    >
      <div class="text-center">
        <p class="text-white font-bold text-xl mb-2">{{ $t('rpc.subscription.unavailable') }}</p>
        <p class="text-white">
          {{ $t('rpc.subscription.unavailableDescription') }}
        </p>
      </div>
    </div>

    <h1 class="text-center">{{ package.name }}</h1>
    <div class="my-4 border-b border-bg-lighter"></div>
    <template v-if="package.price === 0">
      <h1 class="text-white">{{ $t('dashboard.subscription.free') }}</h1>
    </template>
    <template v-else>
      <div class="flex items-baseline">
        <h1 class="text-white mr-1">{{ formatPrice(package.price || 0) }}</h1>
        <p class="font-bold">{{ $t('dashboard.subscription.plusTaxes') }}</p>
      </div>
    </template>

    <div>
      <h4>{{ $t('rpc.initial.subscriptionLimits') }}</h4>
      <p>{{ package.limits }}</p>
    </div>

    <div class="my-4 border-b border-bg-lighter"></div>
    <ul class="flex-grow">
      <li v-for="(benefit, key) in package.benefits" :key="key" class="my-2">
        <NuxtIcon name="icon/success" class="inline-block float-left mr-2 text-2xl text-green" />
        <p>{{ benefit }}</p>
      </li>
    </ul>

    <Btn v-if="isSelected && isOwner" type="primary" size="large" :loading="loading" round disabled>
      {{ $t('dashboard.payment.currentPlan') }}
    </Btn>
    <Btn
      v-else-if="allowSwitch && isOwner"
      type="primary"
      size="large"
      round
      :loading="loading"
      @click="onPress"
    >
      {{ $t('dashboard.payment.selectPlan') }}
    </Btn>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  package: {
    type: Object as PropType<{
      name: string;
      price: number;
      benefits: string[];
      id: number;
      limits: string;
    }>,
    required: true,
  },
  isSelected: {
    type: Boolean,
    required: true,
  },
  onPress: {
    type: Function as PropType<() => void>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  allowSwitch: {
    type: Boolean,
    required: true,
  },
  isOwner: {
    type: Boolean,
    default: false,
  },
});
</script>
