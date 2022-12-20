<template>
  <n-form ref="formRef" :model="formData" :rules="rules">
    <!--  Folder submit -->
    <n-form-item>
      <input type="hidden" name="id" :value="formData.id" readonly />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        <slot v-if="$slots.default"></slot>
        <template v-else>{{ $t('general.delete') }}</template>
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  id: { type: Number, required: true },
  type: {
    type: String,
    validator: (type: string) => ['apiKey', 'bucket', 'directory', 'file'].includes(type),
    required: true,
  },
});

const $i18n = useI18n();
const emit = defineEmits(['submitSuccess']);

/** Form folder */
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const formData = ref<{ id: number }>({
  id: props.id,
});

const rules: NFormRules = {
  id: [
    {
      required: true,
      message: $i18n.t('validation.idRequired'),
    },
  ],
};

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
    } else {
      await deleteEntity();
    }
  });
}
async function deleteEntity() {
  loading.value = true;

  try {
    await $api.delete(getUrl(props.type, props.id));

    const successMsg = $i18n.te(`form.success.deleted.${props.type}`)
      ? $i18n.t(`form.success.deleted.${props.type}`)
      : $i18n.t('form.success.deleted.item');
    message.success(successMsg);

    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
  loading.value = false;
}

/** Get URL base on entity type */
function getUrl(type: string, id: number) {
  switch (type) {
    case 'apiKey':
      return `${endpoints.apiKey}${id}`;
    case 'bucket':
      return endpoints.bucket(id);
    case 'directory':
      return `${endpoints.directory}${id}`;
    default:
      return `${endpoints.file}${id}`;
  }
}
</script>
