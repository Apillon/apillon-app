<template>
  <div>
    <n-space class="w-full lg:min-w-52" size="large" vertical>
      <!-- Refresh -->
      <Btn
        class="locked w-full"
        size="medium"
        type="secondary"
        :loading="simpletStore.loading"
        @click="simpletStore.fetchSimplet(simpletStore.active.simpletDeploy_uuid)"
      >
        {{ $t('general.refresh') }}
      </Btn>

      <!-- Preview -->
      <Btn
        v-if="websiteStore.active.w3ProductionLink"
        class="locked w-full"
        size="medium"
        type="secondary"
        :href="websiteStore.active.w3ProductionLink"
      >
        {{ $t('general.preview') }}
      </Btn>

      <!-- Collection -->
      <Btn
        class="locked w-full"
        size="medium"
        type="secondary"
        :to="`/dashboard/service/nft/${simpletStore.active.contract_uuid}`"
      >
        {{ $t('nft.collection.preview') }}
      </Btn>

      <!-- Domain -->
      <BtnDomain :frontend-uuid="simpletStore.active.frontend_uuid" />
    </n-space>
  </div>
</template>

<script lang="ts" setup>
const simpletStore = useSimpletStore();
const websiteStore = useWebsiteStore();
</script>
