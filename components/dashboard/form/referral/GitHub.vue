<template>
  <n-form
    ref="formRef"
    class="max-w-lg"
    :model="formData"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <div class="flex gap-8">
      <n-form-item
        class="w-full"
        path="name"
        :label="$t('referral.connectTwitter')"
        :label-props="{ for: 'email' }"
      >
        <n-input
          v-model:value="formData.email"
          :input-props="{ id: 'email' }"
          placeholder=""
          clearable
        />
      </n-form-item>

      <!--  Submit -->
      <n-form-item class="min-w-[110px]" label="">
        <input type="submit" class="hidden" :value="$t('form.connect')" />
        <Btn type="primary" size="large" :loading="loading" @click="handleSubmit">
          {{ referralStore.github_id ? 'Disconnect' : $t('form.connect') }}
        </Btn>
      </n-form-item>
    </div>

    <!--  Submit -->
  </n-form>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const referralStore = useReferralStore();

const $route = useRoute();

const $i18n = useI18n();
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const formData = ref({ email: null });

const ouathToken = computed(() => $route.query.code);

onMounted(async () => {
  if (ouathToken.value) {
    loading.value = true;
    console.log('My ouathToken', ouathToken.value);
    // Github link // Send oath token to backend
    try {
      const res = await $api.post(endpoints.referralGithub, {
        code: ouathToken.value,
      });
      console.log('My res github link: ', res);
    } catch (e) {
      console.error(e);
    }

    loading.value = false;
  }
});

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
    } else if (!referralStore.github_id) {
      window.open(
        'https://github.com/login/oauth/authorize?client_id=d0482598d8adbd8adffa&redirect_uri=http://localhost:3000/dashboard/referral',
        '_self'
      );
    } else {
      // Disconnect github account
    }
  });
}
</script>
