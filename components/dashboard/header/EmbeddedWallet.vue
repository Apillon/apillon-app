<template>
  <Heading>
    <slot>
      <div class="flex items-center gap-4">
        <NuxtLink :to="{ name: 'dashboard-service-embedded-wallet' }">
          <span class="icon-back align-sub text-2xl"></span>
        </NuxtLink>
        <div>
          <h2>
            {{ $t('dashboard.nav.embeddedWallet') }}: {{ embeddedWalletStore.active.title }}
            <img src="/icons/beta.svg" alt="Beta" class="ml-2 inline-block h-5 w-14" />
          </h2>
          <TableEllipsis
            :prefix="$t('embeddedWallet.table.integration_uuid')"
            :text="embeddedWalletStore.active.integration_uuid"
          />
        </div>
      </div>
    </slot>

    <template #info>
      <ActionsEmbeddedWalletSignature />
    </template>
  </Heading>
</template>

<script lang="ts" setup>
const embeddedWalletStore = useEmbeddedWalletStore();
</script>
