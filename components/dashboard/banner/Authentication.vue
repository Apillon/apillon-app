<template>
  <div class="relative bg-black text-white px-12 pt-5 pb-10 overflow-hidden rounded">
    <div class="max-w-[600px] w-1/2">
      <n-space size="large" align="center" class="h-12">
        <h4 class="mr-">{{ $t('nav.authentication') }}</h4>
        <div class="w-[1px] h-[13px] bg-grey-light"></div>
        <Image src="./images/auth/kilt.svg" />
        <NuxtIcon name="AuthKilt" class="text-[50px]" fill />
      </n-space>
      <p class="mb-8">
        Safeguard digital identities and ensure easy user verification for higher safety of online
        interactions.
      </p>
      <Btn type="secondary"> How to attach service </Btn>
    </div>
    <div class="absolute top-1/2 right-[75px] -translate-y-1/2">
      <AnimationLabirynth />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NSpace } from 'naive-ui';
</script>
