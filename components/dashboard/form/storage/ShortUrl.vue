<template>
  <template v-if="autoSubmit"></template>
  <Btn v-else-if="targetUrl" v-bind="$attrs" type="secondary" :loading="loading" @click="generateShortUrl">
    {{ $t('storage.shortUrl.generateShortLink') }}
  </Btn>
  <n-form v-else v-bind="$attrs" ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  Ipfs name -->
    <n-form-item path="name" :label="$t('storage.shortUrl.targetUrl')" :label-props="{ for: 'targetUrl' }">
      <n-input
        v-model:value="formData.targetUrl"
        :input-props="{ id: 'targetUrl' }"
        :placeholder="$t('storage.shortUrl.targetUrl')"
        clearable
      />
    </n-form-item>

    <!--  Form submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('storage.shortUrl.generateLink')" />
      <Btn
        class="mt-2"
        :class="size === 'large' ? '!w-auto' : 'w-full'"
        :size="size"
        type="primary"
        :loading="loading"
        @click="handleSubmit"
      >
        {{ $t('storage.shortUrl.generateLink') }}
      </Btn>
    </n-form-item>
  </n-form>

  <!-- Modal - API key details -->
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    :close-on-esc="false"
    :closable="false"
    preset="dialog"
    :title="$t('storage.shortUrl.title')"
    :positive-text="$t('storage.shortUrl.btnCopy')"
    @positive-click="onClose"
  >
    <div v-if="loading" class="my-1 h-16 p-4">
      <Spinner />
    </div>
    <HostingPreviewLink
      v-else
      :link="shortUrl"
      :title="$t('storage.shortUrl.title')"
      :info="$t('storage.shortUrl.shortUrlInfo')"
      copy
    />
  </n-modal>
</template>

<script lang="ts" setup>
import type { Size } from 'naive-ui/es/button/src/interface';

type FormIpfs = {
  targetUrl: string | null;
};

const emit = defineEmits(['close', 'submitSuccess']);
const props = defineProps({
  autoSubmit: { type: Boolean, default: false },
  size: { type: String as PropType<Size>, default: 'medium' },
  targetUrl: { type: String, default: null },
});

const message = useMessage();
const { t } = useI18n();

const loading = ref<boolean>(false);
const showModal = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);
const shortUrl = ref<string | undefined>();

const formData = ref<FormIpfs>({
  targetUrl: props.targetUrl,
});

const rules: NFormRules = {
  targetUrl: ruleRequired(t('validation.ipfsCidRequired')),
};

onMounted(() => {
  if (props.autoSubmit && props.targetUrl) {
    showModal.value = true;
    generateShortUrl();
  }
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (!errors) {
      await generateShortUrl();
    }
  });
}

async function generateShortUrl() {
  loading.value = true;
  shortUrl.value = '';

  try {
    const { data } = await $api.post<ShortUrlResponse>(endpoints.shortUrl, formData.value);
    if (data) {
      shortUrl.value = data.url;
      showModal.value = true;
      emit('submitSuccess', data.url);
    }
  } catch (error: any) {
    /** Show error message  */
    window.$message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

function onClose() {
  showModal.value = false;
  emit('close');
}
</script>
