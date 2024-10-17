<template>
  <Heading>
    <slot>
      <h1>{{ $t('dashboard.nav.smartContracts') }}</h1>
    </slot>
    <template #info>
      <n-space :size="32" align="center">
        <ModalCreditCosts :service="ServiceTypeName.CONTRACT" />
      </n-space>
    </template>
  </Heading>
</template>
