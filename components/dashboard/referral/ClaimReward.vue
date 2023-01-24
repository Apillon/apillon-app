<template>
  <!-- Referral enter -->

  <div class="text-white">
    <div>
      {{ data.merchItem.description }}
    </div>

    <div class="flex bg-bg-dark mt-10">
      <div class="p-5">
        <img class="max-w-[100px]" :src="data.merchItem.imageUrl" alt="apillon merch" />
      </div>

      <div class="mt-8 pl-5">
        <div class="text-base font-bold mb-1">
          {{ data.merchItem.name }}
        </div>
        <div
          v-if="
            data.attributes.find(el => {
              return el.name === 'size';
            })
          "
          class="mb-1"
        >
          {{
            'Size: ' +
            data.attributes.find(el => {
              return el.name === 'size';
            }).selectedValue
          }}
        </div>
        <div
          v-if="data.attributes.length !== 0"
          class="cursor-pointer text-primary font-bold"
          @click="closeModal()"
        >
          Change selection
        </div>
      </div>
    </div>

    <!-- Second col -->
    <n-form
      ref="formRef"
      class="mt-10"
      :model="formData"
      :rules="rules"
      @submit.prevent="handleSubmit"
    >
      <div class="flex">
        <n-form-item
          class="w-full mr-2"
          path="firstName"
          :label="'First name'"
          :label-props="{ for: 'firstName' }"
        >
          <n-input
            v-model:value="formData.firstName"
            :input-props="{ id: 'firstName' }"
            :placeholder="'Type here'"
          />
        </n-form-item>

        <n-form-item
          path="lastName"
          class="w-full ml-2"
          :label="'Last name'"
          :label-props="{ for: 'lastName' }"
        >
          <n-input
            v-model:value="formData.lastName"
            :input-props="{ id: 'lastName' }"
            :placeholder="'Type here'"
          />
        </n-form-item>
      </div>

      <div class="flex">
        <n-form-item
          class="w-full mr-2"
          path="street"
          :label="'Street'"
          :label-props="{ for: 'street' }"
        >
          <n-input
            v-model:value="formData.street"
            :input-props="{ id: 'street' }"
            :placeholder="'Type here'"
          />
        </n-form-item>

        <n-form-item
          class="max-w-[125px] ml-2"
          path="number"
          :label="'Number'"
          :label-props="{ for: 'number' }"
        >
          <n-input
            v-model:value="formData.number"
            :input-props="{ id: 'number' }"
            :placeholder="'Type here'"
          />
        </n-form-item>
      </div>

      <div class="flex w-full">
        <n-form-item
          class="max-w-[125px] mr-2"
          path="zip"
          :label="'ZIP'"
          :label-props="{ for: 'zip' }"
        >
          <n-input
            v-model:value="formData.zip"
            :input-props="{ id: 'zip' }"
            :placeholder="'Type here'"
          />
        </n-form-item>

        <n-form-item
          class="w-full ml-2"
          path="country"
          :label="'Country'"
          :label-props="{ for: 'country' }"
        >
          <n-select id="country" v-model:value="formData.country" :options="options">
            <template #arrow>
              <span class="icon-down text-2xl"></span>
            </template>
          </n-select>
        </n-form-item>
      </div>

      <n-form-item class="w-full">
        <input type="submit" class="hidden" :value="$t('form.login')" />
        <Btn :loading="loading" type="primary" class="w-full -mt-4" @click="handleSubmit">
          {{ 'Confirm and continue' }}
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const $i18n = useI18n();
const formRef = ref<NFormInst | null>(null);
const message = useMessage();

const referralStore = useReferralStore();

onMounted(() => {
  if (referralStore.shippingInfo) {
    formData.value.firstName = referralStore.shippingInfo.firstName;
    formData.value.lastName = referralStore.shippingInfo.lastName;
    formData.value.street = referralStore.shippingInfo.street;
    formData.value.number = referralStore.shippingInfo.houseNumber;
    formData.value.zip = referralStore.shippingInfo.postalCode;
    formData.value.country = referralStore.shippingInfo.country;
  }
});

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const formData = ref({
  firstName: '',
  lastName: '',
  street: '',
  number: '',
  zip: '',
  country: undefined,
});

const options = [
  {
    label: 'Slovenia',
    value: 'slo',
  },
];

const loading = ref(false);

const rules: NFormRules = {
  firstName: [
    {
      required: true,
      validator: validateRequiredDropdown,
      message: $i18n.t('validation.cardHolderRequired'),
    },
  ],
  lastName: [
    {
      required: true,
      validator: validateRequiredDropdown,
      message: $i18n.t('validation.cardHolderRequired'),
    },
  ],
  street: [
    {
      required: true,
      validator: validateRequiredDropdown,
      message: $i18n.t('validation.streetRequired'),
    },
  ],
  number: [
    {
      required: true,
      validator: validateRequiredDropdown,
      message: $i18n.t('validation.houseNumberRequired'),
    },
  ],
  zip: [
    {
      required: true,
      validator: validateRequiredDropdown,
      message: $i18n.t('validation.postalCodeRequired'),
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
      claimReward();
    }
  });
}

const emit = defineEmits(['closeModal']);

async function claimReward() {
  loading.value = true;
  try {
    const res = await $api.post(endpoints.referralClaimReward, {
      id: props.data.merchItem.id,
      info: {
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        street: formData.value.street,
        houseNumber: formData.value.number,
        postalCode: formData.value.zip,
        country: formData.value.country,
        selectedAttributes: props.data.attributes,
      },
    });

    console.log('My res: ', res);
    message.success('Reward claimed!');
    closeModal();
  } catch (e) {
    message.error('Error claiming reward. Please try again later');
    console.error(e);
  }
  loading.value = false;
}

function closeModal() {
  // Emit close modal
  emit('closeModal');
}
</script>
