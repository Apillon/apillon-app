<template>
  <Heading :category="PriceServiceCategory.ACURAST">
    <h3>
      {{ $t('dashboard.nav.cloudFunctions') }}
      <img src="/icons/beta.svg" alt="Beta" class="ml-2 inline-block h-5 w-14" />
    </h3>

    <template #submenu>
      <MenuCloudFunctions />
    </template>

    <template #details>
      <CloudFunctionsInstructions />
    </template>
  </Heading>
</template>

<script lang="ts" setup></script>
