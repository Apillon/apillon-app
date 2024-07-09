<template>
  <Heading>
    <slot>
      <h1>{{ $t('dashboard.nav.smartContracts') }}</h1>
    </slot>
    <template #info>
      <!-- <n-space :size="32" align="center">
        <n-button size="small" @click="$router.push({ name: '' })">
          <span class="icon-credits text-xl mr-2"></span>
          <span> {{ $t('embeddedWallet.checkPrice') }}</span>
        </n-button>
      </n-space> -->
    </template>
  </Heading>
</template>
