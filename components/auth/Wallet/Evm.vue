<script lang="ts" setup>
import { useConnect } from 'use-wagmi';

const { connect, connectors, pendingConnector } = useConnect();
</script>

<template>
  <div class="max-w-md w-full md:px-6 my-12 mx-auto">
    <div class="my-8 text-center">
      <h3 class="flex-cc mb-6">
        <NuxtIcon name="icon/wallet" class="text-xl mr-2" filled />
        {{ $t('auth.wallet.evm.title') }}
      </h3>
      <p>
        {{ $t('auth.wallet.evm.info') }}
      </p>
    </div>

    <n-space size="large" vertical>
      <Btn
        v-for="(connector, key) in connectors"
        :key="key"
        type="secondary"
        size="large"
        :loading="connector.id === pendingConnector?.id"
        @click="connect({ connector })"
      >
        <span class="inline-flex gap-2 items-center">
          <NuxtIcon :name="`wallet/${connector.id}`" class="text-xl" filled />
          <span>{{ connector.name }}</span>
        </span>
      </Btn>
    </n-space>
  </div>
</template>
