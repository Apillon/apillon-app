<template>
  <div class="flex justify-center items-center md:w-1/2 md:pl-10">
    <div class="max-w-[400px]">
      <p class="body-lg text-grey mb-12">
        {{ $t('login.buildWeb3') }}
      </p>
      <n-space :size="40" class="font-bold">
        <Btn to="/">{{ $t('login.getStarted') }}</Btn>
        <NuxtLink href="https://docs.apillon.org/">{{ $t('login.goToDocs') }}</NuxtLink>
      </n-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NSpace } from 'naive-ui';
</script>
