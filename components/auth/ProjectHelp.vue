<template>
  <div class="my-20 flex w-full items-center justify-center md:my-0 md:w-1/2 md:pl-10">
    <div class="md:max-w-[400px]">
      <p class="body-lg text-bo mb-12">
        {{ $t('auth.onboarding.buildWeb3') }}
      </p>
      <n-space :size="40" class="font-bold">
        <Btn :to="{ name: 'dashboard' }" type="link">{{ $t('auth.onboarding.getStarted') }}</Btn>
        <NuxtLink href="https://wiki.apillon.io/">{{ $t('auth.onboarding.goToDocs') }}</NuxtLink>
      </n-space>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
