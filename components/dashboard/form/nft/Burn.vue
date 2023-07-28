<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <p>{{ $t('nft.collection.burn.info') }}</p>

    <!--  Form submit -->
    <n-form-item>
      <input type="submit" class="hidden" :value="$t('nft.collection.burn.title')" />
      <Btn type="error" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('nft.collection.revoke') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const props = defineProps({
  collectionUuid: { type: String, required: true },
});
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const message = useMessage();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const formData = ref<{ collectionUuid: string }>({
  collectionUuid: props.collectionUuid,
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      await burn();
    }
  });
}

async function burn() {
  loading.value = true;

  try {
    await $api.post(endpoints.collectionBurn(props.collectionUuid));

    message.success($i18n.t('form.success.nftBurned'));

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
