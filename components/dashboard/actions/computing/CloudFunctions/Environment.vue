<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="min-w-[11rem] w-[20vw] max-w-xs">
      <n-input
        v-model:value="cloudFunctionStore.searchVariables"
        type="text"
        name="search"
        size="small"
        :placeholder="$t('general.search')"
        clearable
      >
        <template #prefix>
          <span class="icon-search text-2xl"></span>
        </template>
      </n-input>
    </div>

    <n-space size="large">
      <!-- Refresh variables -->
      <n-button size="small" :loading="cloudFunctionStore.loading" @click="refresh">
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Add new variables -->
      <n-button
        size="small"
        :disabled="authStore.isAdmin() || cloudFunctionStore.variablesNew.length"
        @click="modalCreateVariableVisible = true"
      >
        <span class="icon-create-folder text-xl text-primary mr-2"></span>
        <span class="text-primary">{{
          $t('computing.cloudFunctions.variable.btnAddVariable')
        }}</span>
      </n-button>

      <n-upload :show-file-list="false" accept=".env" :custom-request="e => uploadFile(e)">
        <n-button
          size="small"
          :disabled="authStore.isAdmin() || cloudFunctionStore.variablesNew.length"
        >
          <span class="icon-create-folder text-xl text-primary mr-2"></span>
          <span class="text-primary">{{
            $t('computing.cloudFunctions.variable.btnUploadEnv')
          }}</span>
        </n-button>
      </n-upload>

      <n-button
        size="small"
        type="primary"
        :disabled="authStore.isAdmin() || cloudFunctionStore.variablesNew.length === 0"
        :loading="envLoading"
        @click="updateVariables"
      >
        <span
          v-if="authStore.isAdmin() || cloudFunctionStore.variablesNew.length === 0"
          class="text-primary"
        >
          {{ textCreateOrUpdate }}
        </span>
        <strong v-else>{{ textCreateOrUpdate }}</strong>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create Cloud Function variables -->
  <modal
    v-model:show="modalCreateVariableVisible"
    :title="$t('computing.cloudFunctions.variable.new')"
  >
    <FormComputingCloudFunctionsVariable
      @submit-success="modalCreateVariableVisible = false"
      @create-success=""
    />
  </modal>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const cloudFunctionStore = useCloudFunctionStore();
const { envLoading, createEnvVariables, uploadFile } = useCloudFunctions();

const modalCreateVariableVisible = ref<boolean>(false);

const textCreateOrUpdate = computed(() =>
  cloudFunctionStore.hasVariablesExisting
    ? t('computing.cloudFunctions.variable.btnUpdate')
    : t('computing.cloudFunctions.variable.btnCreate')
);

function refresh() {
  cloudFunctionStore.variablesNew = [];
  cloudFunctionStore.searchVariables = '';
  cloudFunctionStore.fetchVariables(cloudFunctionStore.functionUuid);
}

async function updateVariables() {
  if (!cloudFunctionStore.variablesNew.every(v => !!v.key && !!v.value)) {
    message.warning(t('validation.cloudFunctions.valuesRequired'));
  } else {
    const vars = [...cloudFunctionStore.variables, ...cloudFunctionStore.variablesNew];
    const cloudFunction = await createEnvVariables(vars, cloudFunctionStore.functionUuid);

    if (cloudFunction) {
      cloudFunctionStore.variables = vars;
      cloudFunctionStore.variablesNew = [];
      cloudFunctionStore.searchVariables = '';
    }
  }
}
</script>
