<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  Card holder -->
    <n-form-item
      path="cardHolder"
      :label="$t('form.label.cardHolder')"
      :label-props="{ for: 'cardHolder' }"
    >
      <n-input
        v-model:value="formData.cardHolder"
        :input-props="{ id: 'cardHolder' }"
        :placeholder="$t('form.placeholder.cardHolder')"
        clearable
      />
    </n-form-item>

    <!--  Card number -->
    <n-form-item
      path="cardNumber"
      :label="$t('form.label.cardNumber')"
      :label-props="{ for: 'cardNumber' }"
    >
      <n-input
        v-model:value="formData.cardNumber"
        :input-props="{ id: 'cardNumber' }"
        :placeholder="$t('form.placeholder.cardNumber')"
        @input="handleCreditCardInput"
        clearable
      >
        <template #suffix>
          <Image src="/images/payment/mastercard.svg" :width="35" :height="24" alt="mastercard" />
        </template>
      </n-input>
    </n-form-item>

    <n-grid :cols="2" :span="2" :x-gap="32">
      <!--  Expiration Date -->
      <n-form-item-gi
        :span="1"
        path="expirationDate"
        :label="$t('form.label.expirationDate')"
        :label-props="{ for: 'expirationDate' }"
      >
        <n-input
          v-model:value="formData.expirationDate"
          :input-props="{ id: 'expirationDate' }"
          :placeholder="$t('form.placeholder.expirationDate')"
          @input="handleExpirationDateInput"
          clearable
        />
      </n-form-item-gi>

      <!--  CVV -->
      <n-form-item-gi
        :span="1"
        path="cvv"
        :label="$t('form.label.cvv')"
        :label-props="{ for: 'cvv' }"
      >
        <n-input
          v-model:value="formData.cvv"
          :input-props="{ id: 'cvv' }"
          :placeholder="$t('form.placeholder.cvv')"
          @input="handleCvvInput"
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <!-- Postal code -->
    <n-form-item
      path="postalCode"
      :label="$t('form.label.postalCode')"
      :label-props="{ for: 'postalCode' }"
    >
      <n-input
        v-model:value="formData.postalCode"
        :input-props="{ id: 'postalCode' }"
        :placeholder="$t('form.placeholder.postalCode')"
        @input="handlePostalCodeInput"
        clearable
      />
    </n-form-item>

    <!--  Project terms -->
    <n-form-item path="terms" :show-label="false">
      <n-checkbox
        id="terms"
        v-model:checked="formData.terms"
        size="medium"
        :label="$t('form.terms.payment')"
      />
    </n-form-item>

    <!--  Submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.saveCard')" />
      <Btn type="primary" class="mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.saveCard') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import cardValidator from 'card-validator';
import { textMarshal } from 'text-marshal';
import { useMessage } from 'naive-ui';

const $i18n = useI18n();
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const message = useMessage();
const authStore = useAuthStore();

const formData = ref<FormBilling>({
  cardHolder: authStore.username,
  cardNumber: '',
  expirationDate: '',
  cvv: '',
  postalCode: '',
  terms: false,
});

const rules: NFormRules = {
  cardHolder: [
    {
      required: true,
      message: $i18n.t('validation.cardHolderRequired'),
    },
    {
      validator: validateCardHolder,
      message: $i18n.t('validation.cardHolder'),
    },
  ],
  cardNumber: [
    {
      required: true,
      message: $i18n.t('validation.cardNumberRequired'),
    },
    {
      validator: validateCreditCard,
      message: $i18n.t('validation.cardNumber'),
    },
  ],
  expirationDate: [
    {
      required: true,
      message: $i18n.t('validation.expirationDateRequired'),
    },
    {
      validator: validateExpirationDate,
      message: $i18n.t('validation.expirationDate'),
    },
  ],
  cvv: [
    {
      required: true,
      message: $i18n.t('validation.cvvRequired'),
    },
    {
      validator: validateCVV,
      message: $i18n.t('validation.cvv'),
    },
  ],
  postalCode: [
    {
      required: true,
      message: $i18n.t('validation.postalCodeRequired'),
    },
    {
      validator: validatePostalCode,
      message: $i18n.t('validation.postalCode'),
    },
  ],
  terms: [
    {
      required: true,
      validator: validateRequiredCheckbox,
      message: $i18n.t('validation.terms'),
    },
  ],
};

// Custom validations
function validateCardHolder(_: NFormItemRule, value: string): boolean {
  return cardValidator.cardholderName(value).isValid;
}
function validateCreditCard(_: NFormItemRule, value: string): boolean {
  return cardValidator.number(value).isValid;
}
function validateExpirationDate(_: NFormItemRule, value: string): boolean {
  return cardValidator.expirationDate(value).isValid;
}
function validateCVV(_: NFormItemRule, value: string): boolean {
  return cardValidator.cvv(value).isValid;
}
function validatePostalCode(_: NFormItemRule, value: string): boolean {
  return cardValidator.postalCode(value).isValid;
}

/** Format credit card */
function handleCreditCardInput(value: string | [string, string]) {
  const data = textMarshal({
    input: value,
    template: 'xxxx - xxxx - xxxx - xxxx',
    disallowCharacters: [/[a-z]/, /\W/],
  });
  formData.value.cardNumber = data.marshaltext;
}

/** Format Expiration date */
function handleExpirationDateInput(value: string | [string, string]) {
  const data = textMarshal({
    input: value,
    template: 'xx/xxxx',
    disallowCharacters: [/[a-z]/, /\W/],
  });
  formData.value.expirationDate = data.marshaltext;
}

/** Format CVV */
function handleCvvInput(value: string | [string, string]) {
  const data = textMarshal({
    input: value,
    template: 'xxx',
    disallowCharacters: [/[a-z]/, /\W/],
  });
  formData.value.cvv = data.marshaltext;
}

/** Format CVV */
function handlePostalCodeInput(value: string | [string, string]) {
  const data = textMarshal({
    input: value,
    template: 'xxxx',
    disallowCharacters: [/[a-z]/, /\W/],
  });
  formData.value.postalCode = data.marshaltext;
}

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
    } else {
      await updateUserProfile();
    }
  });
}
async function updateUserProfile() {
  loading.value = true;

  try {
    const res = await $api.post<BillingResponse>(endpoints.billing, formData.value);

    // TODO
    if (res.data) {
      console.log(res.data);
    }
    loading.value = false;
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
