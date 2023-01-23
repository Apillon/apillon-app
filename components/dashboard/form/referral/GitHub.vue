<template>
  <n-form
    ref="formRef"
    class="max-w-lg"
    :model="formData"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <div>
      <strong>{{ $t('referral.connectGithub') }}</strong>
      <ReferralPoints :points="2" />
    </div>
    <!--  Email -->
    <n-form-item path="email" :label-props="{ for: 'email' }">
      <n-input
        v-model:value="formData.email"
        :input-props="{ id: 'email', type: 'email' }"
        placeholder=""
      />
    </n-form-item>

    <!--  Submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.connect')" />
      <Btn type="primary" class="mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.connect') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const $i18n = useI18n();
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const formData = ref({ email: null });

const rules: NFormRules = {
  email: [
    {
      type: 'email',
      message: $i18n.t('validation.email'),
    },
    {
      required: true,
      message: $i18n.t('validation.emailRequired'),
    },
  ],
};

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  const message = useMessage();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
    } else {
      // await connectTwitter();
    }
  });
}
</script>
