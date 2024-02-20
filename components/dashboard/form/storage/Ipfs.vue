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
    <n-form-item path="name" :label="cidIpns" :label-props="{ for: 'cid' }">
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
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('storage.ipfs.generateLink') }}
      </Btn>
    </n-form-item>

    <div class="min-h-[5rem]">
      <HostingPreviewLink
        v-if="ipfsLink"
        :loading="loading"
        :link="ipfsLink"
        :title="$t('storage.ipfs.ipfsLink')"
        :info="$t('storage.ipfs.ipfsLinkInfo')"
      />
    </div>
  </n-form>
</template>

<script lang="ts" setup>
type FormIpfs = {
  cid: string;
  type: string | null;
};
enum IpfsType {
  CID = 'CID',
  IPNS = 'IPNS',
}

const message = useMessage();
const $i18n = useI18n();
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
  cid: ruleRequired($i18n.t('validation.ipfsCidRequired')),
  type: ruleRequired($i18n.t('validation.ipfsTypeRequired')),
};

const cidIpns = computed(() => (formData.value.type ? formData.value.type : 'CID/IPNS'));

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
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
    formData.value.type
  );
  if (res) {
    ipfsLink.value = res.link;
  }
  loading.value = false;
}
</script>
