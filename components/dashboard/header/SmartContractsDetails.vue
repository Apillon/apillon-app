<template>
  <Heading>
    <slot>
      <NuxtLink
        class="flex items-center gap-x-2"
        :to="{ name: 'dashboard-service-smart-contracts' }"
      >
        <span class="icon-back text-2xl align-sub"></span>
        <h1>{{ $t('dashboard.nav.smartContractDetails') }}</h1>
      </NuxtLink>
    </slot>
    <template #info> </template>
  </Heading>
</template>
