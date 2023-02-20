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

      <div class="mb-8 flex items-center">
        <span class="bg-white h-[1px] w-full"></span>
        <strong class="inline-block px-5 mx-[8%] text-body whitespace-nowrap">
          {{ $t('storage.ipns.orCreateNew') }}
        </strong>
        <span class="bg-white h-[1px] w-full"></span>
      </div>
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
import { useMessage } from 'naive-ui';

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
    return { label: item.name, value: item.id };
  });
});

onMounted(async () => {
  await ipnsStore.getIPNSs(bucketStore.selected);
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

async function publishToIpns(ipnsId: number) {
  loading.value = true;

  try {
    const res = await $api.post<IpnsPublishResponse>(
      endpoints.ipnsPublish(bucketStore.selected, ipnsId),
      { cid: props.cid }
    );

    message.success($i18n.t('form.success.ipnsPublished'));

    /** On  ipns publish, update data */
    ipnsStore.items.forEach(ipns => {
      if (ipns.id === res.data.id) {
        ipns.ipnsName = res.data.ipnsName;
        ipns.ipnsValue = res.data.ipnsValue;
        ipns.link = res.data.link;
      }
    });

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
