<template>
  <Heading>
    <slot>
      <h1>
        {{ $t('dashboard.nav.smartContracts') }}
        <img src="/icons/beta.svg" alt="Beta" class="w-14 h-5 inline-block ml-2" />
      </h1>
    </slot>
    <template #info>
      <n-space :size="32" align="center">
        <ModalCreditCosts :service="ServiceTypeName.CONTRACTS" filter-by-chain />
      </n-space>
    </template>
  </Heading>
</template>
