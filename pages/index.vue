<template>
  <div class="px-8 py-20">
    <h1 class="text-center">Welcome to AuthTrail</h1>
    <h1 class="text-center font-heading">Welcome to AuthTrail</h1>
    <h1 class="text-center font-inter">Welcome to AuthTrail</h1>
    <h1 class="text-center font-epilogue">Welcome to AuthTrail</h1>
    <h1 class="text-center font-content">Welcome to AuthTrail</h1>
    <h2 class="text-center">Welcome to AuthTrail</h2>
    <h3 class="text-center">Welcome to AuthTrail</h3>
    <h4 class="text-center">Welcome to AuthTrail</h4>
    <h5 class="text-center">Welcome to AuthTrail</h5>

    <p class="text-center">Welcome to AuthTrail</p>
    <strong class="text-center">Welcome to AuthTrail</strong>

    <p class="body-lg text-center">Welcome to AuthTrail</p>
    <strong class="body-lg text-center">Welcome to AuthTrail</strong>

    <p class="body-md text-center">Welcome to AuthTrail</p>
    <strong class="body-md text-center">Welcome to AuthTrail</strong>

    <p class="body-sm text-center">Welcome to AuthTrail</p>
    <strong class="body-sm text-center">Welcome to AuthTrail</strong>
    <br />
    <a href="https://authtrail.com" class="text-center">Welcome to AuthTrail</a>
    <span class="icon-delete"></span>

    <n-button>Naive button</n-button>
    <n-input-group key="i">
      <n-input-group-label>Label</n-input-group-label>
      <n-input type="text" name="i" />
    </n-input-group>
    <n-input-group key="num">
      <n-input-group-label>Label</n-input-group-label>
      <n-input-number name="num" />
    </n-input-group>
  </div>
</template>

<script lang="ts" setup>
import { NButton, NInput, NInputNumber, NInputGroup, NInputGroupLabel } from 'naive-ui';

definePageMeta({
  layout: 'signup',
});
useHead({
  title: 'AuthTrail',
});
</script>
