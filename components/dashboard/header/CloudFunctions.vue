<template>
  <Heading>
    <slot>
      <h1>
        {{ $t('dashboard.nav.cloudFunctions') }}
        <img src="/icons/beta.svg" alt="Beta" class="w-14 h-5 inline-block ml-2" />
      </h1>
    </slot>

    <template #info> </template>

    <template #submenu>
      <MenuCloudFunctions />
    </template>
  </Heading>
</template>

<script lang="ts" setup></script>
