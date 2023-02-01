<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  Service name -->
    <n-form-item
      path="serviceName"
      :label="$t('form.label.serviceName')"
      :label-props="{ for: 'serviceName' }"
    >
      <n-input
        v-model:value="formData.serviceName"
        :input-props="{ id: 'serviceName' }"
        :placeholder="$t('form.placeholder.serviceName')"
        clearable
      />
    </n-form-item>
    <n-tag :bordered="false" type="info" class="mb-8">Servicename.com/ </n-tag>

    <!--  Service type -->
    <n-form-item path="networkTypes" :label="$t('form.label.networkType')">
      <n-radio-group v-model:value="formData.networkType" name="radiogroup">
        <n-space>
          <n-radio
            v-for="(type, key) in networkTypes"
            :key="key"
            :value="type.value"
            :label="type.label"
          />
        </n-space>
      </n-radio-group>
    </n-form-item>

    <!--  Service submit -->
    <n-form-item>
      <input type="submit" class="hidden" :value="$t('form.login')" />
      <Btn type="primary" size="large" class="mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.createServiceAndContinue') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
const props = defineProps({
  serviceType: {
    type: Number,
    validator: (value: number) => Object.values(ServiceType).includes(value),
    required: true,
  },
});

const $i18n = useI18n();
const dataStore = useDataStore();
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const formData = ref<FormService>({
  serviceName: '',
  networkType: false,
});

const rules: NFormRules = {
  serviceName: [
    {
      required: true,
      message: 'Please enter service name',
      trigger: 'input',
    },
  ],
  networkType: [],
};

const networkTypes = [
  {
    value: false,
    label: $i18n.t('form.networkTypes.test'),
  },
  {
    value: true,
    label: $i18n.t('form.networkTypes.live'),
  },
];

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => window.$message.error(error.message || 'Error'))
      );
    } else {
      await createService();
    }
  });
}
async function createService() {
  loading.value = true;

  const bodyData = {
    project_id: dataStore.currentProjectId,
    serviceType_id: props.serviceType,
    name: formData.value.serviceName,
    active: 1,
    testNetwork: formData.value.networkType ? 0 : 1,
  };

  try {
    const res = await $api.post<CreateServiceResponse>(endpoints.services, bodyData);

    // TODO
    if (res.data) {
      console.log(res.data);
    }
  } catch (error) {
    window.$message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
