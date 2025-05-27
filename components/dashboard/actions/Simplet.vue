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

      <!-- SMTP -->
      <Btn class="locked w-full" size="medium" type="primary" @click="modalSmtpVisible = true">
        {{ $t('simplet.wizard.smtp.edit') }}
      </Btn>

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

    <!-- Modal - Github configuration -->
    <ModalFullScreen v-model:show="modalSmtpVisible" :title="$t('hosting.menu.envVars')">
      <FormSimpletSmtp ref="simpletFormSmtpRef" class="mx-auto max-w-lg" />

      <template #footer>
        <Btn class="float-right" type="primary" @click="submitFormSmtp()">
          {{ $t('simplet.wizard.smtp.edit') }}
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

const simpletFormSmtpRef = useTemplateRef('simpletFormSmtpRef');
const modalSmtpVisible = ref<boolean>(false);

async function submitFormSmtp() {
  if (await simpletFormSmtpRef.value?.handleSubmit()) {
    try {
      const bodyData = {
        project_uuid: dataStore.projectUuid,
        secrets: [
          { key: 'SMTP_HOST', value: simpletStore.form.smtp.host },
          { key: 'SMTP_PORT', value: simpletStore.form.smtp.port },
          { key: 'SMTP_USERNAME', value: simpletStore.form.smtp.username },
          { key: 'SMTP_PASSWORD', value: simpletStore.form.smtp.password },
          { key: 'SMTP_NAME_FROM', value: simpletStore.form.smtp.senderName },
          { key: 'SMTP_EMAIL_FROM', value: simpletStore.form.smtp.senderEmail },
        ],
      };
      const { data } = await $api.post<SimpletResponse>(
        endpoints.simpletBackendRedeploy(simpletStore.active.backend_uuid),
        bodyData
      );
      message.success(t('simplet.wizard.redeployingInfo'));
      console.log(data);
    } catch (e) {
      message.error(userFriendlyMsg(e));
    }
  }
}

async function redeploy(uuid: string) {
  try {
    const { data } = await $api.post<SimpletResponse>(endpoints.simpletRedeploy(uuid));
    simpletStore.active = data;
    message.success(t('simplet.wizard.redeployingInfo'));
  } catch (e) {
    message.error(userFriendlyMsg(e));
  }
}
</script>
