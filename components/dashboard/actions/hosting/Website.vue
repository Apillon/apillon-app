<template>
  <div>
    <n-space class="w-full lg:min-w-52" size="large" vertical>
      <!-- Refresh -->
      <n-button
        class="w-full"
        size="medium"
        :loading="bucketStore.folder.loading"
        @click="refreshWebpage(activeTab === tabs.PRODUCTION ? DeploymentEnvironment.PRODUCTION : 0)"
      >
        {{ $t('general.refresh') }}
      </n-button>

      <template v-if="websiteStore.isActiveWebsiteGithubSource">
        <n-button class="w-full" @click="showUpdateModal">
          {{ $t('hosting.deploy.updateConfig') }}
        </n-button>
        <n-button v-if="deploymentStore.deploymentConfig?.id" class="w-full" @click="modalVariablesVisible = true">
          {{ $t('hosting.menu.envVars') }}
        </n-button>
      </template>
      <Btn
        v-else
        class="locked w-full"
        size="medium"
        type="primary"
        :loading="deploying"
        :disabled="authStore.isAdmin()"
        @click="deployWebsite(DeploymentEnvironment.DIRECT_TO_PRODUCTION)"
      >
        {{ $t('hosting.deployProd') }}
      </Btn>

      <template v-if="websiteStore.active.w3ProductionLink">
        <BtnDomain />
        <FormStorageShortUrl :target-url="websiteStore.active.w3ProductionLink" class="w-full" />
      </template>

      <!-- Clear all files -->
      <n-button
        class="w-full"
        type="error"
        :disabled="authStore.isAdmin()"
        ghost
        @click="showModalDeleteWebsite = true"
      >
        {{ $t('hosting.website.delete') }}
      </n-button>
    </n-space>

    <!-- W3Warn - Hosting deploy -->
    <W3Warn v-model:show="modalW3WarnVisible" @submit="onModalConfirm">
      {{ $t('w3Warn.hosting.deploy') }}
    </W3Warn>

    <!-- Modal - Website under review -->
    <Modal v-model:show="modalWebsiteReviewVisible" :title="$t('hosting.review.title')">
      <p v-for="(item, key) in translateItems('hosting.review.content')" :key="key">
        {{ item }}
      </p>
      <div class="mt-8 grid w-full max-w-full grid-cols-1 gap-8">
        <Btn type="secondary" @click="onModalConfirm">{{ $t('hosting.review.confirm') }}</Btn>
        <PaymentCardPlan :show-card="false" btn-type="primary" :btn-text="$t('hosting.review.upgrade')" />
      </div>
    </Modal>

    <!-- Modal - Github configuration -->
    <modal
      v-model:show="modalGithubConfigVisible"
      :title="$t(websiteStore.isActiveWebsiteGithubSource ? 'hosting.deploy.update' : 'hosting.deploy.new')"
    >
      <FormStorageDeployConfig :config-id="deploymentStore.deploymentConfig?.id" @submit-success="handleConfigChange" />
    </modal>

    <!-- Modal - Github configuration -->
    <ModalFullScreen v-model:show="modalVariablesVisible" :title="$t('hosting.menu.envVars')">
      <TableHostingDeploymentVariables
        v-if="deploymentStore.deploymentConfig?.id"
        :config-id="deploymentStore.deploymentConfig?.id"
      />
    </ModalFullScreen>

    <!-- Modal - Delete Website -->
    <ModalDelete v-model:show="showModalDeleteWebsite" :title="$t('hosting.website.delete')">
      <FormDelete
        :id="websiteStore.active?.website_uuid"
        :type="ItemDeleteKey.WEBSITE"
        @submit-success="onWebsiteDeleted"
      />
    </ModalDelete>
  </div>
</template>

<script lang="ts" setup>
const { activeTab, tabs, checkUnfinishedBuilds, onWebsiteDeleted, refreshWebpage } = useHosting();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.HOSTING_DEPLOY);
const { subscriptionMessage } = usePayment();

const { t, te } = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const paymentStore = usePaymentStore();
const warningStore = useWarningStore();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();

const modalWebsiteReviewVisible = ref<boolean>(false);
const modalGithubConfigVisible = ref<boolean>(false);
const modalVariablesVisible = ref<boolean>(false);
const showModalDeleteWebsite = ref<boolean>(false);

const deploying = ref<boolean>(false);
const deployEnv = ref<number>(DeploymentEnvironment.STAGING);

const hasActiveDeployments = computed<boolean>(() => {
  return deploymentStore.staging.some(deployment => deployment.deploymentStatus < DeploymentStatus.SUCCESSFUL);
});

/** Show payment messages if user create subscription */
onMounted(async () => {
  await dataStore.waitOnPromises();
  subscriptionMessage();
});

const handleConfigChange = async () => {
  websiteStore.resetForm();
  modalGithubConfigVisible.value = false;

  setTimeout(() => checkUnfinishedBuilds(), 3000);
};

const showUpdateModal = async () => {
  if (deploymentStore.deploymentConfig) {
    Object.entries(deploymentStore.deploymentConfig).forEach(([key, value]) => {
      if (value && key in websiteStore.form) {
        websiteStore.form[key] = value;
      }
    });
  }
  modalGithubConfigVisible.value = true;
};

/** Deploy to stg/prod */
async function deploy(env: number) {
  deploying.value = true;
  await deploymentStore.deploy(websiteStore.active.website_uuid, env);
  deploying.value = false;
}

/**
 * On createNewWebsite click
 * If W3Warn has already been shown, show modal create new website, otherwise show warn first
 * */
function deployWebsite(env: number) {
  deployEnv.value = env;
  if (bucketStore.folder.items.length === 0 && env === DeploymentEnvironment.PRODUCTION && hasActiveDeployments.value) {
    message.warning(t('validation.hosting.waitActiveDeployment'));
  } else if (bucketStore.folder.items.length === 0) {
    message.warning(t('error.NO_FILES_TO_DEPLOY'));
  } else if (websiteStore.missingHtml) {
    message.error(t('validation.hosting.missingHtml'));
  } else if (!paymentStore.hasActiveSubscription && !sessionStorage.getItem(SessionKeys.WEBSITE_REVIEW)) {
    modalWebsiteReviewVisible.value = true;
    sessionStorage.setItem(SessionKeys.WEBSITE_REVIEW, Date.now().toString());
  } else if (!localStorage.getItem(LsW3WarnKeys.HOSTING_DEPLOY) && te('w3Warn.hosting.deploy')) {
    modalW3WarnVisible.value = true;
  } else {
    warningStore.showSpendingWarning(getPricingServiceName(env), () => deploy(env));
  }
}

/** When user close W3Warn, allow him to create new website */
function onModalConfirm() {
  warningStore.showSpendingWarning(getPricingServiceName(deployEnv.value), () => deploy(deployEnv.value));
}

function getPricingServiceName(env: number) {
  return env === DeploymentEnvironment.STAGING
    ? PriceServiceName.HOSTING_DEPLOY_TO_STAGING
    : PriceServiceName.HOSTING_DEPLOY_TO_PRODUCTION;
}
</script>
