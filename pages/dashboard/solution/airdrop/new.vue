<template>
  <Dashboard :loading="false" full-height>
    <template #heading>
      <Heading>
        <slot>
          <h3>
            <span class="text-body">{{ $t('dashboard.solution.nftCollection.name') }} / </span
            >{{ $t('general.customize') }}
          </h3>
        </slot>
        <template #info>
          <n-space :size="32" align="center" :wrap="false">
            <ModalCreditCosts :service="ServiceTypeName.NFT" />
            <IconInfo @click="showModalW3Warn = true" />
          </n-space>
        </template>
      </Heading>

      <W3Warn v-model:show="showModalW3Warn">
        {{ $t('w3Warn.nft.new') }}
      </W3Warn>
    </template>
    <slot>
      <SolutionTabs
        :solution="SolutionKey.NFT_COLLECTION"
        :tab="tab"
        :tabs="tabs"
        @change="t => (tab = t)"
      />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();

useHead({
  title: t('dashboard.nav.services'),
});

const tab = ref<string>('create');
const tabs = {
  create: resolveComponent('SolutionNftCollectionCreate'),
  preview: resolveComponent('SolutionNftCollectionPreview'),
  mint: resolveComponent('SolutionNftCollectionMint'),
};

const showModalW3Warn = ref<boolean>(false);
</script>
