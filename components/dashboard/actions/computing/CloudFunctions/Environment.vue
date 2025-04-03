<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-model:value="cloudFunctionStore.searchVariables" />
    </div>

    <n-space size="large">
      <!-- Refresh variables -->
      <n-button size="medium" :loading="cloudFunctionStore.loading" @click="refresh">
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('form.reset') }}
      </n-button>

      <!-- Add new variables -->
      <n-button size="medium" :disabled="authStore.isAdmin()" @click="modalCreateVariableVisible = true">
        <span class="icon-create-folder mr-2 text-xl text-primary"></span>
        <span class="text-primary">{{ $t('computing.cloudFunctions.variable.btnAddVariable') }}</span>
      </n-button>

      <n-upload :show-file-list="false" :custom-request="e => uploadEnvFile(e)">
        <n-button size="medium" :disabled="authStore.isAdmin()">
          <span class="icon-create-folder mr-2 text-xl text-primary"></span>
          <span class="text-primary">{{ $t('computing.cloudFunctions.variable.btnUploadEnv') }}</span>
        </n-button>
      </n-upload>

      <n-button size="medium" type="primary" :disabled="isDisabled" :loading="envLoading" @click="updateVariables">
        <span v-if="isDisabled" class="text-primary">
          {{ textCreateOrUpdate }}
        </span>
        <strong v-else>{{ textCreateOrUpdate }}</strong>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create Cloud Function variables -->
  <modal v-model:show="modalCreateVariableVisible" :title="$t('computing.cloudFunctions.variable.new')">
    <FormComputingCloudFunctionsVariable @submit-success="modalCreateVariableVisible = false" />
  </modal>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const cloudFunctionStore = useCloudFunctionStore();
const { envLoading, createEnvVariables, uploadEnvFile } = useCloudFunctions();

const modalCreateVariableVisible = ref<boolean>(false);

const textCreateOrUpdate = computed(() =>
  cloudFunctionStore.hasVariablesExisting
    ? t('computing.cloudFunctions.variable.btnUpdate')
    : t('computing.cloudFunctions.variable.btnCreate')
);

const isDisabled = computed(
  () => authStore.isAdmin() || (cloudFunctionStore.variablesNew.length === 0 && !cloudFunctionStore.variablesUpdate)
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
    cloudFunctionStore.variablesUpdate = false;
  }
}
</script>
