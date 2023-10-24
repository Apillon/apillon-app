<template>
  <Heading>
    <slot>
      <n-space align="center" size="large">
        <NuxtLink :to="{ name: 'dashboard-service-computing' }">
          <span class="icon-back text-2xl align-sub"></span>
        </NuxtLink>
        <h2>{{ contractStore.active.name }}</h2>

        <div>
          <n-space class="" align="center" size="small" :wrap="false">
            <span>{{ $t('computing.contract.address') }}:</span>
            <n-ellipsis class="text-body align-bottom" :line-clamp="1">
              {{ contractStore.active.contractAddress }}
            </n-ellipsis>
            <button
              class="text-body"
              @click="copyToClipboard(contractStore.active.contractAddress || '')"
            >
              <span class="icon-copy"></span>
            </button>
          </n-space>
          <n-space class="" align="center" size="small" :wrap="false">
            <span>{{ $t('computing.contract.uuid') }}:</span>
            <n-ellipsis class="text-body align-bottom" :line-clamp="1">
              {{ contractStore.active.contract_uuid }}
            </n-ellipsis>
            <button class="text-body" @click="copyToClipboard(contractStore.active.contract_uuid)">
              <span class="icon-copy"></span>
            </button>
          </n-space>
        </div>
      </n-space>
    </slot>
    <template #info>
      <n-space :size="32" align="center">
        <IconInfo v-if="$i18n.te('w3Warn.computing.info')" @click="modalW3WarnVisible = true" />
      </n-space>
    </template>
  </Heading>

  <W3Warn v-model:show="modalW3WarnVisible">
    {{ $t('w3Warn.computing.new') }}
  </W3Warn>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const contractStore = useContractStore();
const modalW3WarnVisible = ref<boolean>(false);
</script>
