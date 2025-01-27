<template>
  <Heading>
    <slot>
      <h1>
        {{ $t('dashboard.nav.cloudFunctions') }}
        <img src="/icons/beta.svg" alt="Beta" class="w-14 h-5 inline-block ml-2" />
      </h1>
    </slot>

    <template #info>
      <n-space size="large">
        <BtnDocumentation
          size="small"
          href="https://wiki.apillon.io/web3-services/8-web3-cloud-functions.html"
        />
        <ModalCreditCosts :category="PriceServiceCategory.ACURAST" />
      </n-space>
    </template>

    <template #submenu>
      <MenuCloudFunctions />
    </template>
  </Heading>
</template>

<script lang="ts" setup></script>
