<template>
  <n-form ref="formRef" :model="formData" :rules="rules" :disabled="isDisabled">
    <n-form-item path="terms" :show-label="false" :show-feedback="formErrors && !formData.terms">
      <n-checkbox v-model:checked="formData.terms" size="medium" :label="termsLabel" />
      <IconInfo v-if="isDisabled" size="sm" :tooltip="$t('referral.info.claim.tooltipDisabled')" />
    </n-form-item>

    <!--  Signup submit -->
    <n-form-item :show-label="false" :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('referral.info.claim.btn')" />

      <Btn
        type="primary"
        size="large"
        class="mt-2"
        :loading="loading"
        :disabled="isDisabled"
        @click="handleSubmit"
      >
        {{ $t('referral.info.claim.btn') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormItemRule } from 'naive-ui';

type AirdropForm = {
  terms?: boolean;
};

const $i18n = useI18n();
const message = useMessage();
const authStore = useAuthStore();

const formRef = ref<NFormInst | null>(null);
const formErrors = ref<boolean>(false);
const disabled = ref<boolean>(false);
const loading = ref<boolean>(false);
const submitted = ref<string | null>(localStorage.getItem(LS_KEYS.AIRDROP_REVIEW));

const formData = ref<AirdropForm>({
  terms: false,
});

const rules: NFormRules = {
  terms: [
    {
      validator: (_: FormItemRule, value: string) => !!value,
      message: $i18n.t('validation.terms'),
      trigger: 'change',
    },
  ],
};

const isDisabled = computed(
  () =>
    disabled.value ||
    submitted.value === authStore.user.evmWallet ||
    submitted.value === authStore.email
);

/** Terms label with link  */
const termsLabel = computed<any>(() => {
  return h('span', {}, [
    $i18n.t('auth.terms.consent'),
    h(
      'a',
      { href: 'https://apillon.io/legal-disclaimer', target: '_blank' },
      { default: () => $i18n.t('auth.terms.app') }
    ),
    $i18n.t('auth.terms.and'),
    h(
      'a',
      { href: 'https://apillon.io/privacy-policy', target: '_blank' },
      { default: () => $i18n.t('auth.terms.pp') }
    ),
    '.',
  ]);
});

function handleSubmit(e: MouseEvent | null) {
  e?.preventDefault();
  formErrors.value = false;
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      formErrors.value = true;
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      await airdropReview();
    }
  });
}
async function airdropReview() {
  loading.value = true;

  try {
    await $api.post<GeneralResponse<boolean>>(endpoints.airdropReviewTasks);

    message.success($i18n.t('referral.info.claim.inReview'));

    disabled.value = true;
    localStorage.setItem(LS_KEYS.AIRDROP_REVIEW, authStore.user.evmWallet || authStore.email);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
