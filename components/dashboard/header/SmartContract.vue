<template>
  <Heading
    :back="link"
    :docs="'https://wiki.apillon.io/web3-services/12-web3-smart-contracts.html'"
    :service="ServiceTypeName.SMART_CONTRACTS"
    filter-by-chain
  >
    <slot name="title">
      <h3 v-if="title">{{ title }}</h3>
      <h3 v-else>{{ $t('dashboard.nav.smartContracts') }}</h3>
    </slot>
  </Heading>
</template>

<script lang="ts" setup>
import { ServiceTypeName } from '~/lib/types/service';

defineProps({
  billing: { type: Boolean, default: false },
  link: { type: String, default: '/dashboard/service/smart-contracts' },
  title: { type: String, default: '' },
});
</script>
