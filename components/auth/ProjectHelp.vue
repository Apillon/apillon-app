<template>
  <div class="flex justify-center items-center w-full md:w-1/2 md:pl-10 my-20 md:my-0">
    <div class="md:max-w-[400px]">
      <p class="body-lg text-bo mb-12">
        {{ $t('onboarding.buildWeb3') }}
      </p>
      <n-space :size="40" class="font-bold">
        <Btn :to="{ name: 'dashboard' }" type="link">{{ $t('onboarding.getStarted') }}</Btn>
        <NuxtLink href="https://wiki.apillon.io/">{{ $t('onboarding.goToDocs') }}</NuxtLink>
      </n-space>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
