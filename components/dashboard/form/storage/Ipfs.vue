<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <n-form-item path="type" :label="$t('storage.ipfs.selectType')" :label-props="{ for: 'type' }">
      <select-options
        v-model:value="formData.type"
        :options="types"
        :placeholder="$t('general.pleaseSelect')"
        filterable
        clearable
      />
    </n-form-item>
    <!--  Ipfs name -->
    <n-form-item path="cid" :label="cidIpns" :label-props="{ for: 'cid' }">
      <n-input
        v-model:value="formData.cid"
        :input-props="{ id: 'cid' }"
        :placeholder="$t('storage.ipfs.enterCid')"
        clearable
      />
    </n-form-item>

    <!--  Form submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('storage.ipfs.generateLink')" />
      <Btn
        class="mt-2"
        :class="size === 'large' ? '!w-auto' : 'w-full'"
        :size="size"
        type="primary"
        :loading="loading"
        @click="handleSubmit"
      >
        {{ $t('storage.ipfs.generateLink') }}
      </Btn>
    </n-form-item>

    <HostingPreviewLink
      v-if="ipfsLink"
      :loading="loading"
      :link="ipfsLink"
      :title="$t('storage.ipfs.ipfsLink')"
      :info="$t('storage.ipfs.ipfsLinkInfo')"
    />
  </n-form>
</template>

<script lang="ts" setup>
import type { Size } from 'naive-ui/es/button/src/interface';

type FormIpfs = {
  cid: string;
  type: string | null;
};
enum IpfsType {
  CID = 'CID',
  IPNS = 'IPNS',
}

defineProps({
  size: { type: String as PropType<Size>, default: 'medium' },
});

const message = useMessage();
const { t } = useI18n();
const dataStore = useDataStore();
const ipfsStore = useIpfsStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const ipfsLink = ref<string | null>(null);
const types = enumKeyValues(IpfsType);

const formData = ref<FormIpfs>({
  cid: '',
  type: null,
});

const rules: NFormRules = {
  cid: ruleRequired(t('validation.ipfsCidRequired')),
  type: ruleRequired(t('validation.ipfsTypeRequired')),
};

const cidIpns = computed(() => (formData.value.type ? formData.value.type : 'CID/IPNS'));

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      await generateIpfsLink();
    }
  });
}

async function generateIpfsLink() {
  loading.value = true;
  ipfsLink.value = '';

  const res = await ipfsStore.fetchIpfsLink(
    dataStore.projectUuid,
    formData.value.cid,
    formData.value.type || IpfsType.CID
  );
  if (res) {
    ipfsLink.value = res.link;
  }
  loading.value = false;
}
</script>
