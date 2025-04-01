<template>
  <div class="relative overflow-hidden rounded bg-bg-dark px-12 pb-10 pt-5">
    <div class="w-1/2 max-w-xl">
      <n-space size="large" align="center" class="h-12">
        <h4 class="mr-">{{ $t('dashboard.nav.authentication') }}</h4>
        <div class="h-[13px] w-[1px] bg-white"></div>
        <NuxtIcon name="auth/kilt" class="text-[50px]" filled />
      </n-space>
      <p class="mb-8">
        Safeguard digital identities and ensure easy user verification for higher safety of online interactions.
      </p>
      <Btn type="secondary"> How to attach service </Btn>
    </div>
    <div class="absolute right-[75px] top-1/2 -translate-y-1/2">
      <AnimationIcons :num-of-icons="8" :animation-name="'labirynth'" :size="'md'" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>
