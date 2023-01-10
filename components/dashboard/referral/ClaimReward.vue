<template>
  <!-- Referral enter -->

  <div class="text-white bg-black pt-8 pl-[100px] pb-20">
    <h4 class="mb-10">{{ $t('referral.rewardsClaim') }}</h4>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 font-button text-sm">
      <!-- First col -->

      <div>
        <img :src="data" alt="apillon merch" />
        <div class="max-w-[230px] mt-8">
          {{ $t('referral.rewardsSize') }}
        </div>
      </div>

      <!-- Second col -->
      <n-form
        ref="formRef"
        class="pr-20"
        :model="formData"
        :rules="rules"
        @submit.prevent="handleSubmit"
      >
        <n-form-item
          path="firstName"
          :label="$t('form.label.firstName')"
          :label-props="{ for: 'firstName' }"
        >
          <n-input
            v-model:value="formData.firstName"
            :input-props="{ id: 'firstName' }"
            :placeholder="$t('form.placeholder.firstName')"
          />
        </n-form-item>

        <n-form-item
          path="lastName"
          :label="$t('form.label.lastName')"
          :label-props="{ for: 'lastName' }"
        >
          <n-input
            v-model:value="formData.lastName"
            :input-props="{ id: 'lastName' }"
            :placeholder="$t('form.placeholder.lastName')"
          />
        </n-form-item>

        <n-form-item
          path="street"
          :label="$t('form.label.street')"
          :label-props="{ for: 'street' }"
        >
          <n-input
            v-model:value="formData.street"
            :input-props="{ id: 'street' }"
            :placeholder="$t('form.placeholder.street')"
          />
        </n-form-item>

        <n-form-item
          path="number"
          :label="$t('form.label.number')"
          :label-props="{ for: 'number' }"
        >
          <n-input
            v-model:value="formData.number"
            :input-props="{ id: 'number' }"
            :placeholder="$t('form.placeholder.number')"
          />
        </n-form-item>

        <n-form-item path="zip" :label="$t('form.label.zip')" :label-props="{ for: 'zip' }">
          <n-input
            v-model:value="formData.zip"
            :input-props="{ id: 'zip' }"
            :placeholder="$t('form.placeholder.zip')"
          />
        </n-form-item>

        <n-form-item path="country" :show-label="false">
          <n-select
            id="country"
            v-model:value="formData.country"
            class="mt-2 mb-1"
            :options="options"
          >
            <template #arrow>
              <span class="icon-down text-2xl"></span>
            </template>
          </n-select>
        </n-form-item>

        <n-form-item>
          <input type="submit" class="hidden" :value="$t('form.login')" />
          <Btn :loading="loading" type="primary" class="-mt-4" @click="handleSubmit">
            {{ $t('referral.enter.header') }}
          </Btn>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createDiscreteApi, stepProps } from 'naive-ui';
import { useI18n } from 'vue-i18n';
const referralStore = useReferralStore();

const $i18n = useI18n();
const formRef = ref<NFormInst | null>(null);
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const props = defineProps({
  data: { type: String, required: true },
});

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
