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
      >
        <template #suffix>
          <Image src="./images/payment/mastercard.svg" :width="35" :height="24" alt="mastercard" />
        </template>
      </n-input>
    </n-form-item>

    <n-grid :cols="2" :span="2" :x-gap="8">
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
import { FormInst, FormValidationError, FormRules, FormItemRule, useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { FormBilling, BillingResponse } from '~~/types/settings';

const { t } = useI18n();
const loading = ref(false);
const formRef = ref<FormInst | null>(null);
const message = useMessage();
const authStore = useAuthStore();

const formData = ref<FormBilling>({
  cardHolder: authStore.username,
  cardNumber: '',
  expirationDate: '',
  cvv: '',
  postalCode: '',
  terms: null,
});

const rules: FormRules = {
  cardHolder: [
    {
      required: true,
      message: 'Please enter your name',
    },
    {
      validator: validateCardHolder,
      message: 'Please enter valid name',
    },
  ],
  cardNumber: [
    {
      required: true,
      message: 'Please enter credit card number',
    },
    {
      validator: validateCreditCard,
      message: 'Credit card validation error',
    },
  ],
  expirationDate: [
    {
      required: true,
      message: 'Please enter expiration date',
    },
    {
      validator: validateExpirationDate,
      message: 'Date is expired',
    },
  ],
  cvv: [
    {
      required: true,
      message: 'Please enter CVV',
    },
    {
      validator: validateCVV,
      message: 'Wrong CVV',
    },
  ],
  postalCode: [
    {
      required: true,
      message: 'Please enter postal code',
    },
    {
      validator: validatePostalCode,
      message: 'Wrong postal code',
    },
  ],
  terms: [
    {
      required: true,
      validator: validateRequiredCheckbox,
      message: 'Please accept the terms',
    },
  ],
};

// Custom validations
function validateCardHolder(_: FormItemRule, value: string): boolean {
  return cardValidator.cardholderName(value).isValid;
}
function validateCreditCard(_: FormItemRule, value: string): boolean {
  return cardValidator.number(value).isValid;
}
function validateExpirationDate(_: FormItemRule, value: string): boolean {
  return cardValidator.expirationDate(value).isValid;
}
function validateCVV(_: FormItemRule, value: string): boolean {
  return cardValidator.cvv(value).isValid;
}
function validatePostalCode(_: FormItemRule, value: string): boolean {
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
function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message)));
    } else {
      await updateUserProfile();
    }
  });
}
async function updateUserProfile() {
  loading.value = true;

  try {
    const { data, error } = await $api.post<BillingResponse>(endpoints.billing, formData.value);

    if (error) {
      message.error(error.message);
      loading.value = false;
      return;
    }

    // TODO
    if (data.data) {
      console.log(data);
    }
    loading.value = false;
  } catch (error) {
    message.error(t('error.API'));
    loading.value = false;
  }
}
</script>
