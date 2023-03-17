<template>
  <Btn v-bind="$attrs" type="secondary" @click="modalWalletSelectVisible = true">
    {{ $t('login.wallet') }}
  </Btn>
  <!-- Modal - Wallet select -->
  <modal v-model:show="modalWalletSelectVisible" :title="$t('auth.wallet.connect')">
    <AuthWalletSelect />
  </modal>
</template>

<script lang="ts" setup>
const modalWalletSelectVisible = ref<boolean>(false);
</script>
