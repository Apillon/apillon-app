<template>
  <Spinner v-if="serviceUuid && !service" />
  <n-form
    v-else
    v-bind="$attrs"
    ref="formRef"
    :model="formData"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <!--  Service name -->
    <n-form-item
      v-if="!defaultServiceName"
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

    <!--  Service type -->
    <n-form-item class="hidden" path="networkTypes" :label="$t('form.label.networkType')">
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
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.login')" />
      <Btn
        :disabled="disabled"
        type="primary"
        size="large"
        :loading="loading"
        @click="handleSubmit"
      >
        <template v-if="service">
          {{ $t('form.update') }}
        </template>
        <template v-else-if="btnText">
          {{ btnText }}
        </template>
        <template v-else>
          {{ $t('form.createServiceAndContinue') }}
        </template>
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
type FormService = {
  serviceName: string;
  networkType: boolean;
};

const props = defineProps({
  serviceUuid: { type: String, default: '' },
  serviceType: {
    type: Number,
    validator: (value: number) => Object.values(ServiceType).includes(value),
    required: true,
  },
  defaultServiceName: { type: String, default: '' },
  btnText: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const service = ref<ServiceInterface | undefined>();

onMounted(async () => {
  if (props.serviceUuid) {
    await dataStore.getServices();
    service.value = dataStore.services.find(item => item.service_uuid === props.serviceUuid);

    if (service.value) {
      formData.value.serviceName = service.value.name;
    }
  } else if (props.defaultServiceName) {
    formData.value.serviceName = props.defaultServiceName;
  }
});

const formData = ref<FormService>({
  serviceName: service.value?.name || '',
  networkType: true,
});

const rules: NFormRules = {
  serviceName: [
    {
      required: true,
      message: 'Please enter service name',
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
    } else if (props.serviceUuid) {
      await updateService();
    } else {
      await createService();
    }
  });
}
async function createService() {
  loading.value = true;

  const bodyData = {
    project_uuid: dataStore.project.selected,
    serviceType_id: props.serviceType,
    name: formData.value.serviceName,
    active: 1,
    testNetwork: formData.value.networkType ? 0 : 1,
  };

  try {
    const res = await $api.post<ServiceResponse>(endpoints.services(), bodyData);

    const msg = $i18n.te(`form.success.created.${ServiceTypeNames[props.serviceType]}`)
      ? $i18n.t(`form.success.created.${ServiceTypeNames[props.serviceType]}`)
      : $i18n.t('form.success.created.service');
    message.success(msg);

    /** On new service created add new item to list */
    dataStore.services = await dataStore.fetchServices();
    const createdService = dataStore.services.find(
      item => item.service_uuid === res.data.service_uuid
    );

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess', createdService);
  } catch (error) {
    if (props.serviceType === ServiceType.RPC) {
      // At the moment dwellir returns 500 if email is taken for RPC service
      message.error($i18n.t('form.error.rpcEmailTaken'));
    }
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateService() {
  loading.value = true;

  const bodyData = {
    project_uuid: dataStore.project.selected,
    serviceType_id: props.serviceType,
    name: formData.value.serviceName,
    active: 1,
    testNetwork: formData.value.networkType ? 0 : 1,
  };

  try {
    const res = await $api.patch<ServiceResponse>(endpoints.services(props.serviceUuid), bodyData);

    const msg = $i18n.te(`form.success.updated.${ServiceTypeNames[props.serviceType]}`)
      ? $i18n.t(`form.success.updated.${ServiceTypeNames[props.serviceType]}`)
      : $i18n.t('form.success.updated.service');
    message.success(msg);

    /** On service updated refresh data */
    dataStore.services.forEach((item: ServiceInterface) => {
      if (item.service_uuid === props.serviceUuid) {
        item.name = res.data.name;
      }
    });

    /** Emit events */
    emit('submitSuccess');
    emit('updateSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
