<template>
  <n-form
    ref="formRef"
    class="max-w-lg"
    :model="formData"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <div class="flex">
      <strong>{{ $t('referral.connectTwitter') }}</strong>
      <div class="relative mt-10">
        <ReferralPoints :points="2" />
      </div>
    </div>

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

const $route = useRoute();

const $i18n = useI18n();
const formRef = ref<NFormInst | null>(null);

const formData = ref({ email: null });

const ouathToken = computed(() => $route.query.oauth_token);
const oauthVerifier = computed(() => $route.query.oauth_verifier);
// oauth_token=yWN-MwAAAAABkvwbAAABhXNpJbA

const loading = ref(false);

onMounted(async () => {
  if (ouathToken.value && oauthVerifier.value) {
    loading.value = true;
    try {
      console.log('My ouathToken', ouathToken.value);
      const res = await $api.post(endpoints.referralTwitter, {
        oauth_token: ouathToken.value,
        oauth_verifier: oauthVerifier.value,
      });
      console.log('resLink: ', res);
    } catch (e) {
      console.error(e);
    }

    loading.value = false;
    // Send oath token to backend
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
    } else {
      // window.open(
      //   'https://github.com/login/oauth/authorize?client_id=d0482598d8adbd8adffa&redirect_uri=http://localhost:3000/dashboard/referral',
      //   '_self'
      // );
      console.log('Connect twitter');
      await connectTwitter();
    }
  });
}

async function connectTwitter() {
  loading.value = true;
  try {
    const res = await $api.get<ApiKeyRolesResponse>(endpoints.referralTwitterAuth, {
      redirectUrl: window.location.origin + window.location.pathname,
    });
    console.log('My res twitter connect: ', res);
    window.open(res.data.url, '_self');
    console.log('Open window');
  } catch (e) {
    console.error(e);
  }
  loading.value = false;
}
</script>
