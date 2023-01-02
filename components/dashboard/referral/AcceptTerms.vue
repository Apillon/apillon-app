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
      <n-form-item path="country" :show-label="false">
        <n-select
          id="country"
          v-model:value="formData.country"
          class="mt-2 mb-1 max-w-[522px]"
          :options="options"
        >
          <template #arrow>
            <span class="icon-down text-2xl"></span>
          </template>
        </n-select>
      </n-form-item>
      <n-form-item path="terms" :show-label="false">
        <div class="flex">
          <n-checkbox id="terms" v-model:checked="formData.terms" size="large" />
          <div class="cursor-pointer ml-2" @click="openModal()">
            {{ $t('referral.enter.terms') }}
          </div>
        </div>
      </n-form-item>

      <n-form-item>
        <input type="submit" class="hidden" :value="$t('form.login')" />
        <Btn :loading="loading" type="primary" class="-mt-4" @click="handleSubmit">
          {{ $t('referral.enter.header') }}
        </Btn>
      </n-form-item>
    </n-form>

    <Modal v-model:show="showModal">
      <h4>Terms referral</h4>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { createDiscreteApi, stepProps } from 'naive-ui';
import { useI18n } from 'vue-i18n';
const referralStore = useReferralStore();

const $i18n = useI18n();
const formRef = ref<NFormInst | null>(null);
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const formData = ref({
  terms: undefined,
  country: undefined,
});

const options = [
  {
    label: 'Slovenia',
    value: 'slo',
  },
];

const loading = ref(false);

const showModal = ref(false);

const rules: NFormRules = {
  terms: [
    {
      required: true,
      validator: validateRequiredCheckbox,
      message: $i18n.t('validation.terms'),
    },
  ],
  country: [
    {
      required: true,
      validator: validateRequiredDropdown,
      message: $i18n.t('validation.country'),
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

async function enterReferral() {
  loading.value = true;
  try {
    const res = await $api.post(endpoints.referral, {
      termsAccepted: true,
    });
    referralStore.initReferral(res.data);
    console.log('My res: ', res);

    emit('enterReferral');
  } catch (e) {
    console.error(e);
  }
  loading.value = false;
}

function openModal() {
  showModal.value = true;
}
</script>
