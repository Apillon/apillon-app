<template>
  <Spinner v-if="ipnsStore.loading" />
  <div v-else class="mb-8">
    <div v-if="ipnsStore.hasIpns">
      <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
        <n-form-item path="file" :label="$t('storage.ipns.selectIpns')" :label-props="{ for: 'file' }">
          <select-options
            v-model:value="formData.ipns"
            :options="ipnsItems"
            :placeholder="$t('storage.ipns.selectIpns')"
            filterable
            clearable
          />
        </n-form-item>

        <!--  Publis IPNS submit -->
        <n-form-item :show-label="false">
          <input type="submit" class="hidden" :value="$t('form.proceed')" />
          <Btn type="primary" size="large" class="mt-2" :loading="loading" @click="handleSubmit">
            {{ $t('storage.ipns.publish') }}
          </Btn>
        </n-form-item>
      </n-form>

      <!-- Separator -->
      <SeparatorText class="mb-8 mt-0" :border-left="true">
        {{ $t('storage.ipns.orCreateNew') }}
      </SeparatorText>
    </div>
    <div v-else>
      <h4 class="mb-4 mt-8 text-center">{{ $t('storage.ipns.createFirst') }}</h4>
    </div>
    <Btn type="secondary" size="large" @click="modalCreateIpnsVisible = true">
      {{ $t('storage.ipns.create') }}
    </Btn>

    <!-- Modal - New IPNS -->
    <modal v-model:show="modalCreateIpnsVisible" :title="$t('storage.ipns.new')">
      <FormStorageIpns :cid="cid" @submit-success="onIpnsCreated" />
    </modal>
  </div>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

type FormIpnsPublish = {
  ipns?: string;
};

const props = defineProps({
  cid: { type: String, required: true },
});
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const message = useMessage();
const { t } = useI18n();
const bucketStore = useBucketStore();
const ipnsStore = useIpnsStore();

const loading = ref(false);
const modalCreateIpnsVisible = ref<boolean>(false);
const ipnsPublishInterval: any = null as any;

const formRef = ref<NFormInst | null>(null);
const formData = ref<FormIpnsPublish>({
  ipns: undefined,
});
const rules: NFormRules = {
  ipns: [
    {
      required: true,
      message: t('validation.ipnsRequired'),
    },
  ],
};

const ipnsItems = computed<Array<SelectOption>>(() => {
  return ipnsStore.items.map(item => {
    return { label: item.name, value: item.ipns_uuid };
  });
});

onMounted(async () => {
  await ipnsStore.getIPNSs(bucketStore.selected);
});
onUnmounted(() => {
  /** Fallback to cancel interval in case of any errors */
  setTimeout(() => {
    clearInterval(ipnsPublishInterval);
  }, 100000);
});

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      // errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else if (formData.value.ipns) {
      publishToIpns(formData.value.ipns);
    } else {
      message.warning(t('validation.ipnsRequired'));
    }
  });
}

async function publishToIpns(ipnsUuid: string) {
  loading.value = true;

  try {
    const res = await $api.post<IpnsPublishResponse>(endpoints.ipnsPublish(bucketStore.selected, ipnsUuid), {
      cid: props.cid,
    });

    /** On  ipns publish, update data */
    updateIpnsInList(res.data);

    message.success(t('form.success.ipnsPublished'));

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

function updateIpnsInList(ipns: IpnsInterface) {
  ipnsStore.items.forEach(item => {
    if (item.ipns_uuid === ipns.ipns_uuid) {
      item.ipnsName = ipns.ipnsName;
      item.ipnsValue = ipns.ipnsValue;
      item.link = ipns.link;
    }
  });
}

function onIpnsCreated() {
  modalCreateIpnsVisible.value = false;
  /** Emit events */
  emit('submitSuccess');
  message.success(t('form.success.ipnsPublished'));
}
</script>
