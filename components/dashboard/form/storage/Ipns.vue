<template>
  <Spinner v-if="ipnsUuid && !ipns" />
  <div v-else>
    <Notification v-if="isFormDisabled" type="error" class="mb-8 w-full">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>
    <template v-else>
      <!-- Info text -->
      <p v-if="ipnsUuid && $te('storage.ipns.infoNew')" class="mb-8 text-body">
        {{ $t('storage.ipns.infoNew') }}
      </p>
      <p v-else-if="ipnsUuid && $te('storage.ipns.infoEdit')" class="mb-8 text-body">
        {{ $t('storage.ipns.infoEdit') }}
      </p>
    </template>

    <n-form ref="formRef" :model="formData" :rules="rules" :disabled="isFormDisabled" @submit.prevent="handleSubmit">
      <!--  Ipns name -->
      <n-form-item path="name" :label="$t('form.label.ipnsName')" :label-props="{ for: 'ipnsName' }">
        <n-input
          v-model:value="formData.name"
          :input-props="{ id: 'ipnsName' }"
          :placeholder="$t('form.placeholder.ipnsName')"
          clearable
        />
      </n-form-item>

      <!--  Ipns description -->
      <n-form-item
        path="description"
        :label="$t('form.label.ipnsDescription')"
        :label-props="{ for: 'ipnsDescription' }"
      >
        <n-input
          v-model:value="formData.description"
          type="textarea"
          :input-props="{ id: 'ipnsDescription' }"
          :placeholder="$t('form.placeholder.ipnsDescription')"
          clearable
        />
      </n-form-item>

      <!--  Form submit -->
      <n-form-item :show-feedback="false">
        <input type="submit" class="hidden" :value="$t('storage.ipns.create')" />
        <Btn type="primary" class="mt-2 w-full" :loading="loading" :disabled="isFormDisabled" @click="handleSubmit">
          <template v-if="ipns">
            {{ $t('storage.ipns.update') }}
          </template>
          <template v-else>
            {{ $t('storage.ipns.create') }}
          </template>
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
type FormIpns = {
  name: string;
  description?: string | null;
  cid?: string | null | undefined;
};

const props = defineProps({
  ipnsUuid: { type: String, default: null },
  cid: { type: String, default: null },
});

const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const message = useMessage();
const { t } = useI18n();
const dataStore = useDataStore();
const ipnsStore = useIpnsStore();
const bucketStore = useBucketStore();
const warningStore = useWarningStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const ipns = ref<IpnsInterface | undefined>();

const formData = ref<FormIpns>({
  name: ipns.value?.name || '',
  description: ipns.value?.description || '',
  cid: props.cid || undefined,
});

const rules: NFormRules = {
  name: [ruleRequired(t('validation.ipnsNameRequired'))],
  description: [ruleDescription(t('validation.descriptionTooLong'))],
};

onMounted(async () => {
  if (props.ipnsUuid) {
    ipns.value = await ipnsStore.getIpnsFromList(bucketStore.selected, props.ipnsUuid);

    if (ipns.value) {
      formData.value.name = ipns.value.name;
      formData.value.description = ipns.value.description;
    }
  }
});

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      // errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else if (props.ipnsUuid) {
      await updateIpns();
    } else {
      warningStore.showSpendingWarning(PriceServiceName.IPNS, () => createIpns());
    }
  });
}

async function createIpns() {
  loading.value = true;

  try {
    const res = await $api.post<IpnsCreateResponse>(endpoints.ipns(bucketStore.selected), formData.value);

    message.success(t('form.success.created.ipns'));

    /** On new ipns created add new item to list */
    ipnsStore.items.unshift(res.data);

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateIpns() {
  loading.value = true;

  try {
    const res = await $api.patch<IpnsUpdateResponse>(
      endpoints.ipns(bucketStore.selected, props.ipnsUuid),
      formData.value
    );

    message.success(t('form.success.updated.ipns'));

    /** On ipns updated refresh ipns data */
    ipnsStore.items.forEach((item: IpnsInterface) => {
      if (item.ipns_uuid === props.ipnsUuid) {
        item.name = res.data.name;
        item.description = res.data.description;
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
