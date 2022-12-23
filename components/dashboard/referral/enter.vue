<template>
  <!-- Referral enter -->
  <div class="text-white bg-black pt-8 pl-[100px] pb-20">
    <h4>{{ $t('referral.enter.header') }}</h4>

    <p class="mt-7 font-button text-base">
      <strong>
        {{ $t('referral.enter.country') }}
      </strong>
    </p>
    <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
      <n-input v-model:value="country" class="mt-2 mb-6 max-w-[522px]" disabled />
      <n-form-item path="terms" :show-label="false">
        <n-checkbox
          id="terms"
          v-model:checked="formData.terms"
          size="large"
          :label="$t('referral.enter.terms')"
        />
      </n-form-item>

      <n-form-item>
        <input type="submit" class="hidden" :value="$t('form.login')" />
        <Btn type="primary" class="-mt-4" @click="handleSubmit">
          {{ $t('referral.enter.header') }}
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const formRef = ref<NFormInst | null>(null);
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const country = ref('Slovenia');

const formData = ref({
  terms: undefined,
});

const rules: NFormRules = {
  terms: [
    {
      required: true,
      validator: validateRequiredCheckbox,
      message: $i18n.t('validation.terms'),
    },
  ],
};

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    console.log('Errors: ', errors);
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
    } else {
      enterReferral();
    }
  });
}

const emit = defineEmits(['enterReferral']);
function enterReferral() {
  emit('enterReferral');
}
</script>
