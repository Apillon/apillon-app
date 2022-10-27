<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  Service name -->
    <n-form-item path="serviceName" :label="$t('form.label.serviceName')">
      <n-input
        v-model:value="formData.serviceName"
        :placeholder="$t('form.placeholder.serviceName')"
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
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.createServiceAndContinue') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import {
  NForm,
  NFormItem,
  NInput,
  NRadioGroup,
  NRadio,
  NSpace,
  NTag,
  FormInst,
  createDiscreteApi,
  FormValidationError,
  FormRules,
} from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { FormService, CreateServiceResponse } from '~~/types/service';

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
const formRef = ref<FormInst | null>(null);
const { message } = createDiscreteApi(['message']);

const formData = ref<FormService>({
  serviceName: null,
  networkType: false,
});

const rules: FormRules = {
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
    label: $i18n.t('form.label.networkTypes.test'),
  },
  {
    value: true,
    label: $i18n.t('form.label.networkTypes.live'),
  },
];

// Submit
function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message)));
    } else {
      await createService();
    }
  });
}
async function createService() {
  loading.value = true;

  const bodyData = {
    project_id: dataStore.currentProject.id,
    serviceType_id: props.serviceType,
    name: formData.value.serviceName,
    active: 1,
    testNetwork: formData.value.networkType ? 0 : 1,
  };
  const { data, error } = await $api.post<CreateServiceResponse>(
    ServiceEndpoint.services,
    bodyData
  );

  if (error) {
    message.error(error.message);
    loading.value = false;
    return;
  }

  if (data.data) {
    console.log(data);
  }
  loading.value = false;
}
</script>
