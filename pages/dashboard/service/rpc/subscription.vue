<template>
  <Dashboard>
    <template #heading>
      <Heading>
        <h1>{{ $t('dashboard.nav.rpc') }}</h1>
      </Heading>
    </template>

    <slot>
      <div class="pb-8 mb-6">
        <h4>
          {{ $t('rpc.apiKey.headline') }}
        </h4>
        <RpcSubscriptions />
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup></script>
