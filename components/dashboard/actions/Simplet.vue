<template>
  <div>
    <n-space class="w-full lg:min-w-52" size="large" vertical>
      <!-- Refresh -->
      <Btn class="locked w-full" size="medium" type="secondary" :loading="simpletStore.loading" @click="refresh()">
        {{ $t('general.refresh') }}
      </Btn>

      <!-- Domain -->
      <template
        v-if="simpletStore.active.frontendStatus === ResourceStatus.ONLINE || websiteStore.active.w3ProductionLink"
      >
        <BtnDomain type="secondary" :frontend-uuid="simpletStore.active.frontend_uuid" />
        <BtnDns v-if="websiteStore.active.domain" />
      </template>

      <!-- SMTP -->
      <Btn
        v-if="simpletStore.active.backendStatus === ResourceStatus.ONLINE"
        class="locked w-full"
        size="medium"
        type="secondary"
        :disabled="loadingSmtp"
        :loading="loadingSmtp"
        @click="openModalSmtp()"
      >
        {{ $t('simplet.wizard.smtp.edit') }}
      </Btn>

      <!-- MySQL -->
      <Btn
        v-if="simpletStore.active.backendStatus === ResourceStatus.ONLINE"
        class="locked w-full"
        size="medium"
        type="secondary"
        :disabled="loadingMysql"
        :loading="loadingMysql"
        @click="openModalMysql()"
      >
        {{ $t('simplet.mysql.edit') }}
      </Btn>

      <!-- Redeploy -->
      <Btn
        v-if="
          true ||
          simpletStore.active.backendStatus === ResourceStatus.FAILED ||
          simpletStore.active.backendStatus === ResourceStatus.ERROR ||
          simpletStore.active.frontendStatus === ResourceStatus.FAILED ||
          simpletStore.active.frontendStatus === ResourceStatus.ERROR ||
          (simpletStore.active.backendStatus === ResourceStatus.ONLINE &&
            simpletStore.active.frontendStatus === ResourceStatus.REQUESTED)
        "
        class="locked w-full"
        size="medium"
        type="secondary"
        :disabled="loadingRedeploy"
        :loading="loadingRedeploy"
        @click="redeploy(simpletStore.active.simpletDeploy_uuid)"
      >
        {{ $t('simplet.redeploy') }}
      </Btn>

      <!-- Delete -->
      <Btn class="locked w-full" size="medium" type="error" :loading="loading" @click="deleteSimplet()">
        {{ $t('general.archive') }}
      </Btn>

      <!-- Preview -->
      <Btn
        v-if="simpletLink"
        class="locked w-full"
        size="medium"
        type="primary"
        :disabled="!simpletLink"
        :loading="!simpletLink"
        :href="simpletLink"
      >
        {{ $t('simplet.open') }}
      </Btn>
    </n-space>

    <!-- Modal - SMTP -->
    <ModalFullScreen v-model:show="modalSmtpVisible" :title="$t('hosting.menu.envVars')">
      <FormSimpletSmtp ref="simpletFormSmtpRef" class="mx-auto max-w-lg" />

      <template #footer>
        <Btn class="float-right" type="primary" :loading="loadingSmtp" @click="submitFormSmtp()">
          {{ $t('form.save') }}
        </Btn>
      </template>
    </ModalFullScreen>

    <!-- Modal - MySQL -->
    <ModalFullScreen v-model:show="modalMysqlVisible" :title="$t('hosting.menu.envVars')">
      <div class="mx-auto max-w-lg">
        <n-form ref="formRef" :model="simpletStore.form" :rules="rules" @submit.prevent="submitFormMysql">
          <FormFieldMySql :form="simpletStore.form.mysql" />
        </n-form>
      </div>

      <template #footer>
        <Btn class="float-right" type="primary" :loading="loadingMysql" @click="submitFormMysql()">
          {{ $t('form.save') }}
        </Btn>
      </template>
    </ModalFullScreen>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const router = useRouter();
const message = useMessage();
const dataStore = useDataStore();
const simpletStore = useSimpletStore();
const websiteStore = useWebsiteStore();
const { deleteItem, loading } = useDelete();
const simpletFormSmtpRef = useTemplateRef('simpletFormSmtpRef');

const formRef = ref<NFormInst | null>(null);
const loadingSmtp = ref<boolean>(false);
const loadingMysql = ref<boolean>(false);
const loadingRedeploy = ref<boolean>(false);
const modalSmtpVisible = ref<boolean>(false);
const modalMysqlVisible = ref<boolean>(false);

const rules = reactive({
  ['mysql.host']: ruleRequired(t('validation.mysqlRequired')),
  ['mysql.database']: ruleRequired(t('validation.mysqlRequired')),
  ['mysql.user']: ruleRequired(t('validation.mysqlRequired')),
  ['mysql.password']: ruleRequired(t('validation.mysqlRequired')),
});

const simpletLink = computed(() => websiteStore.active.domain || websiteStore.active.w3ProductionLink);

function openModalSmtp() {
  modalSmtpVisible.value = true;

  simpletStore.form.smtp.host = simpletStore.getBackendVariable('SMTP_HOST') || '';
  simpletStore.form.smtp.port = Number(simpletStore.getBackendVariable('SMTP_PORT') || '587');
  simpletStore.form.smtp.username = simpletStore.getBackendVariable('SMTP_USERNAME') || '';
  simpletStore.form.smtp.password = simpletStore.getBackendVariable('SMTP_PASSWORD') || '';
  simpletStore.form.smtp.senderName = simpletStore.getBackendVariable('SMTP_NAME_FROM') || '';
  simpletStore.form.smtp.senderEmail = simpletStore.getBackendVariable('SMTP_EMAIL_FROM') || '';
}
function openModalMysql() {
  modalMysqlVisible.value = true;

  simpletStore.form.mysql.host = simpletStore.getBackendVariable('MYSQL_HOST') || '';
  simpletStore.form.mysql.port = Number(simpletStore.getBackendVariable('MYSQL_PORT') || '3306');
  simpletStore.form.mysql.database = simpletStore.getBackendVariable('MYSQL_DATABASE') || '';
  simpletStore.form.mysql.user = simpletStore.getBackendVariable('MYSQL_USER') || '';
  simpletStore.form.mysql.password = simpletStore.getBackendVariable('MYSQL_PASSWORD') || '';
}

async function refresh() {
  simpletStore.fetchSimplet(simpletStore.active.simpletDeploy_uuid);
  const simpletLink = websiteStore.active.domain || websiteStore.active.w3ProductionLink;
  if (
    simpletStore.active.frontendStatus === ResourceStatus.ONLINE &&
    simpletStore.active.frontend_uuid === websiteStore.active.website_uuid &&
    !simpletLink
  ) {
    websiteStore.fetchWebsite(simpletStore.active.frontend_uuid);
  }
}

async function submitFormSmtp() {
  if (await simpletFormSmtpRef.value?.handleSubmit()) {
    loadingSmtp.value = true;
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
      const { data } = await $api.post<SimpletBackendResponse>(
        endpoints.simpletBackendRedeploy(simpletStore.active.backend_uuid),
        bodyData
      );
      simpletStore.backend = data;
      modalSmtpVisible.value = false;
      message.success(t('simplet.wizard.redeployingInfo'));
    } catch (e) {
      message.error(userFriendlyMsg(e));
      loadingSmtp.value = false;
    }
    setTimeout(() => {
      loadingSmtp.value = false;
    }, 30000);
  }
}

async function submitFormMysql(e?: Event | MouseEvent) {
  e?.preventDefault();
  formRef.value?.validate(async errors => {
    if (!errors) {
      await updateMysql();
    }
  });
}

async function updateMysql() {
  loadingMysql.value = true;
  try {
    const bodyData = {
      project_uuid: dataStore.projectUuid,
      secrets: [
        { key: 'MYSQL_HOST', value: simpletStore.form.mysql.host },
        { key: 'MYSQL_PORT', value: simpletStore.form.mysql.port },
        { key: 'MYSQL_DATABASE', value: simpletStore.form.mysql.database },
        { key: 'MYSQL_USER', value: simpletStore.form.mysql.user },
        { key: 'MYSQL_PASSWORD', value: simpletStore.form.mysql.password },
        { key: 'MYSQL_ROOT_PASSWORD', value: simpletStore.form.mysql.password },
      ],
    };
    const { data } = await $api.post<SimpletBackendResponse>(
      endpoints.simpletBackendRedeploy(simpletStore.active.backend_uuid),
      bodyData
    );
    simpletStore.backend = data;
    modalMysqlVisible.value = false;
    message.success(t('simplet.wizard.redeployingInfo'));
  } catch (e) {
    message.error(userFriendlyMsg(e));
    loadingMysql.value = false;
  }
  setTimeout(() => {
    loadingMysql.value = false;
  }, 30000);
}

async function redeploy(uuid: string) {
  try {
    loadingRedeploy.value = true;
    const { data } = await $api.post<SimpletCreateResponse>(endpoints.simpletRedeploy(uuid));
    simpletStore.active = data.data;
    message.success(t('simplet.wizard.redeployingInfo'));
  } catch (e) {
    message.error(userFriendlyMsg(e));
    loadingRedeploy.value = false;
  }
  setTimeout(() => {
    loadingRedeploy.value = false;
  }, 60000);
}

async function deleteSimplet() {
  await deleteItem(ItemDeleteKey.SIMPLET, simpletStore.active.simpletDeploy_uuid);
  router.push({ name: 'dashboard-simplet-archive' });
}
</script>
