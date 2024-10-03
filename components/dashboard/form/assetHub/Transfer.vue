<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <n-form-item
      path="address"
      :label="$t('form.label.assetHub.address')"
      :label-props="{ for: 'address' }"
    >
      <n-input
        v-model:value="formData.address"
        :input-props="{ id: 'address' }"
        :placeholder="$t('form.placeholder.assetHub.address')"
        clearable
      />
    </n-form-item>

    <n-form-item :show-label="false" :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('form.continue')" />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.continue') }}
      </Btn>
    </n-form-item>
    <Btn type="secondary" class="w-full mt-2" @click="$emit('close')">
      {{ $t('form.cancel') }}
    </Btn>
  </n-form>

  <AssetHubTransaction v-if="transactionSubmitted" link="transactionLink" @close="$emit('close')" />
  <AssetHubLoader v-if="loading" class="z-3000" />
</template>

<script lang="ts" setup>
type FormAssetTransfer = {
  address: string;
};

// const props = defineProps({});
const emit = defineEmits(['submitSuccess', 'close']);

const { t } = useI18n();
const message = useMessage();

const loading = ref(true);
const transactionSubmitted = ref(false);
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormAssetTransfer>({
  address: '',
});

const rules: NFormRules = {
  address: ruleRequired(t('validation.assetHub.addressRequired')),
};

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      transfer();
    }
  });
}

async function transfer() {
  loading.value = true;

  try {
    const res = await $api.post<any>('', formData.value);

    message.success(t('form.success.assetTransferred'));

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
