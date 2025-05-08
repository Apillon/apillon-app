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

      <!-- Redeploy -->
      <Btn
        v-if="
          simpletStore.active.backendStatus === ResourceStatus.FAILED ||
          simpletStore.active.frontendStatus === ResourceStatus.FAILED
        "
        class="locked w-full"
        size="medium"
        type="error"
        @click="redeploy(simpletStore.active.simpletDeploy_uuid)"
      >
        {{ $t('simplet.redeploy') }}
      </Btn>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const message = useMessage();
const simpletStore = useSimpletStore();
const websiteStore = useWebsiteStore();

async function redeploy(uuid: string) {
  try {
    const { data } = await $api.post<SimpletResponse>(endpoints.simpletRedeploy(uuid));
    simpletStore.active = data;
    message.success(t('simplet.wizard.redeployingInfo'));

    return data;
  } catch (e) {
    message.error(userFriendlyMsg(e));
  }
}
</script>
