<template>
  <Spinner v-if="ipnsStore.loading" />
  <div v-else class="mb-8">
    <div v-if="ipnsStore.hasIpns">
      <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
        <n-form-item
          path="file"
          :label="$t('storage.ipns.selectIpns')"
          :label-props="{ for: 'file' }"
        >
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
      <SeparatorText class="mt-0 mb-8" :border-left="true">
        {{ $t('storage.ipns.orCreateNew') }}
      </SeparatorText>
    </div>
    <div v-else>
      <h4 class="text-center mt-8 mb-4">{{ $t('storage.ipns.createFirst') }}</h4>
    </div>
    <Btn type="secondary" size="large" @click="modalCreateIpnsVisible = true">
      {{ $t('storage.ipns.create') }}
    </Btn>

    <!-- Modal - New IPNS -->
    <modal v-model:show="modalCreateIpnsVisible" :title="$t('storage.ipns.new')">
      <FormStorageIpns @submit-success="modalCreateIpnsVisible = false" />
    </modal>
  </div>
</template>

<script lang="ts" setup>
type FormIpnsPublish = {
  ipns?: string;
};

const props = defineProps({
  cid: { type: String, required: true },
});
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const message = useMessage();
const $i18n = useI18n();
const bucketStore = useBucketStore();
const ipnsStore = useIpnsStore();

const loading = ref(false);
const modalCreateIpnsVisible = ref<boolean>(false);
let ipnsPublishInterval: any = null as any;

const formRef = ref<NFormInst | null>(null);
const formData = ref<FormIpnsPublish>({
  ipns: undefined,
});
const rules: NFormRules = {
  ipns: [
    {
      required: true,
      message: $i18n.t('validation.ipnsRequired'),
    },
  ],
};

const ipnsItems = computed<Array<NSelectOption>>(() => {
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
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else if (formData.value.ipns) {
      publishToIpns(formData.value.ipns);
    } else {
      message.warning($i18n.t('validation.ipnsRequired'));
    }
  });
}

async function publishToIpns(ipnsUuid: string) {
  loading.value = true;

  try {
    await $api.post<IpnsPublishResponse>(endpoints.ipnsPublish(bucketStore.selected, ipnsUuid), {
      cid: props.cid,
    });

    message.success($i18n.t('form.success.ipnsPublish'));

    /** IPNS Publish polling */
    checkIfIpnsPublished(ipnsUuid);

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

function checkIfIpnsPublished(ipnsUuid: string) {
  ipnsPublishInterval = setInterval(async () => {
    const publishedIpns = await ipnsStore.fetchIpnsById(bucketStore.selected, ipnsUuid);

    if (publishedIpns.ipnsValue) {
      /** On  ipns publish, update data */
      updateIpnsInList(publishedIpns);

      message.success($i18n.t('form.success.ipnsPublished'));
      clearInterval(ipnsPublishInterval);
    }
  }, 10000);
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
</script>
