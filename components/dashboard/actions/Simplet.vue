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
          simpletStore.active.backendStatus < ResourceStatus.FAILED ||
          simpletStore.active.frontendStatus === ResourceStatus.FAILED
        "
        class="locked w-full"
        size="medium"
        type="error"
        @click="modalVariablesVisible = true"
      >
        {{ $t('simplet.redeploy') }}
      </Btn>
    </n-space>

    <!-- Modal - Github configuration -->
    <ModalFullScreen v-model:show="modalVariablesVisible" :title="$t('hosting.menu.envVars')">
      <TableHostingDeploymentVariables
        v-if="deploymentStore.deploymentConfig?.id"
        :config-id="deploymentStore.deploymentConfig?.id"
      />
      <template #footer>
        <Btn class="float-right" type="primary" @click="redeploy(simpletStore.active.simpletDeploy_uuid)">
          {{ $t('simplet.redeploy') }}
        </Btn>
      </template>
    </ModalFullScreen>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const simpletStore = useSimpletStore();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();

const modalVariablesVisible = ref<boolean>(false);

async function redeploy(uuid: string) {
  try {
    const bodyData = {
      project_uuid: dataStore.projectUuid,
      // backendVariables: prepareVariablesBE(),
      frontendVariables: deploymentStore.variables,
    };
    const { data } = await $api.post<SimpletResponse>(endpoints.simpletRedeploy(uuid), bodyData);
    simpletStore.active = data;
    message.success(t('simplet.wizard.redeployingInfo'));

    return data;
  } catch (e) {
    message.error(userFriendlyMsg(e));
  }
}
</script>
