<template>
  <Heading>
    <slot>
      <h1>{{ $t('dashboard.nav.cloudFunctions') }}</h1>
    </slot>

    <template #info> </template>

    <template #submenu>
      <MenuCloudFunctions />
    </template>
  </Heading>
</template>

<script lang="ts" setup></script>
