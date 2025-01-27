<template>
  <Heading>
    <slot>
      <div class="flex gap-4 items-center">
        <NuxtLink :to="{ name: 'dashboard-service-embedded-wallet' }">
          <span class="icon-back text-2xl align-sub"></span>
        </NuxtLink>
        <div>
          <h2>
            {{ $t('dashboard.nav.embeddedWallet') }}: {{ embeddedWalletStore.active.title }}
            <img src="/icons/beta.svg" alt="Beta" class="w-14 h-5 inline-block ml-2" />
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
