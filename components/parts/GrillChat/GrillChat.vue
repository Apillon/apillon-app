<template>
  <div id="grill" class="h-screen"></div>
</template>

<script lang="ts" setup>
import type { ResourceParameters } from '@subsocial/resource-discussions';
import { Resource } from '@subsocial/resource-discussions';
import type { GrillConfig } from '@subsocial/grill-widget';
import grill from '@subsocial/grill-widget';

const config: GrillConfig = {
  theme: 'dark',
  widgetElementId: 'grill',
  hub: { id: 'YOUR-HUB_ID' },
  channel: {
    type: 'resource',
    resource: new Resource({
      schema: 'chain',
      chainType: 'evm',
      chainName: 'ethereum',
      resourceType: 'account',
      resourceValue: {
        accountAddress: '0x0000000000000000000000000',
      },
    }),
    settings: {
      enableBackButton: false,
      enableLoginButton: false,
      enableInputAutofocus: true,
    },
    metadata: {
      title: 'Ethereum account',
      body: '...',
      image: '',
    },
  },
};

onMounted(() => {
  grill.init({});
});
</script>
