<template>
  <div>
    <Notification v-if="isFormDisabled" type="error" class="mb-8 w-full">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>

    <template v-else>
      <Notification v-if="!id && rpcApiKeyStore.quotaReached" type="warning" class="mb-8 w-full">
        {{ $t('rpc.apiKey.quotaReached') }},
        <NuxtLink class="text-yellow" :to="{ name: 'dashboard-service-rpc-subscription' }" @click="$emit('close')">
          {{ $t('project.upgradePlan') }}
        </NuxtLink>
      </Notification>
      <!-- Info text -->
      <p v-if="$i18n.te('computing.contract.infoNew')" class="mb-8 text-body">
        {{ $t('computing.contract.infoNew') }}
      </p>
      <p v-else-if="$i18n.te('computing.contract.infoEdit')" class="mb-8 text-body">
        {{ $t('computing.contract.infoEdit') }}
      </p>
    </template>
    <n-form
      v-bind="$attrs"
      ref="formRef"
      :model="rpcApiKeyStore.form"
      :disabled="isFormDisabled || (!id && rpcApiKeyStore.quotaReached)"
      :rules="rules"
      autocomplete="off"
      @submit.prevent="handleSubmit"
    >
      <n-form-item path="name" :label="$t('form.label.rpcApiKey.name')" :label-props="{ for: 'name' }">
        <n-input
          v-model:value="rpcApiKeyStore.form.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('form.placeholder.rpcApiKey.name')"
          clearable
        />
      </n-form-item>

      <!--  Contract description -->
      <n-form-item
        path="description"
        :label="$t('form.label.rpcApiKey.description')"
        :label-props="{ for: 'description' }"
      >
        <n-input
          v-model:value="rpcApiKeyStore.form.description"
          type="textarea"
          :input-props="{ id: 'description' }"
          :placeholder="$t('form.placeholder.rpcApiKey.description')"
          clearable
        />
      </n-form-item>

      <n-form-item :show-feedback="false" :show-label="false">
        <input type="submit" class="hidden" :value="$t('rpc.apiKeys.save')" />

        <Btn
          type="primary"
          class="mt-2 w-full"
          :loading="loading"
          :disabled="isFormDisabled || !!(!id && rpcApiKeyStore.quotaReached)"
          @click="handleSubmit"
        >
          {{ $t('rpc.apiKey.save') }}
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  id: { type: Number, default: 0 },
});

const $i18n = useI18n();
const message = useMessage();

const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess', 'close']);

const dataStore = useDataStore();
const rpcApiKeyStore = useRpcApiKeyStore();
const formRef = ref<NFormInst | null>(null);

const loading = ref<boolean>(false);

const isFormDisabled = computed<boolean>(() => {
  return !dataStore.isUserOwner;
});

const rules: NFormRules = {
  name: [ruleRequired($i18n.t('validation.rpc.nameRequired'))],
  description: [ruleDescription($i18n.t('validation.descriptionTooLong'))],
};

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else if (props.id) {
      updateApiKey();
    } else {
      createApiKey();
    }
  });
}

async function createApiKey() {
  if (!dataStore.projectUuid) return;

  loading.value = true;
  try {
    const bodyData = {
      ...rpcApiKeyStore.form,
      project_uuid: dataStore.projectUuid,
    };
    const res = await $api.post<RpcApiKeyResponse>(endpoints.rpcApiKeys(), bodyData);

    message.success($i18n.t('form.success.created.rpcApiKey'));

    rpcApiKeyStore.items.unshift(res.data as RpcApiKeyInterface);

    rpcApiKeyStore.handleSelectedIdChange();

    emit('submitSuccess');
    emit('createSuccess', res.data);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateApiKey() {
  loading.value = true;

  const bodyData = {
    name: rpcApiKeyStore.form.name,
    description: rpcApiKeyStore.form.description,
  };

  try {
    const res = await $api.put<RpcApiKeyResponse>(endpoints.rpcApiKeys(props.id), bodyData);

    const msg = $i18n.t('form.success.updated.rpcApiKey');

    message.success(msg);

    rpcApiKeyStore.items.forEach((item: RpcApiKeyInterface) => {
      if (item.id === props.id) {
        item.name = res.data.name;
        item.description = res.data.description;
      }
    });

    emit('submitSuccess');
    emit('updateSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

onMounted(async () => {
  if (!props.id) {
    await rpcApiKeyStore.getRpcApiKeyQuota();
  }
});
</script>
