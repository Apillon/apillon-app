<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <div class="flex gap-8">
      <n-form-item class="w-full" path="name" :label="$t('referral.connectTwitter')" :label-props="{ for: 'email' }">
        <n-input
          v-model:value="formData.email"
          disabled
          :input-props="{ id: 'email' }"
          :placeholder="
            referralStore.twitter_name
              ? referralStore.twitter_name
              : 'Connect your Twitter account and your handle will be displayed here'
          "
          clearable
        />
      </n-form-item>

      <!--  Submit -->
      <n-form-item class="min-w-[110px]" label="">
        <input type="submit" class="hidden" :value="$t('form.connect')" />
        <Btn type="primary" size="large" :loading="loading" @click="handleSubmit">
          {{ referralStore.twitter_name ? 'Disconnect' : $t('form.connect') }}
        </Btn>
      </n-form-item>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
const message = useMessage();

const referralStore = useReferralStore();

const $route = useRoute();
const $router = useRouter();

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
      const res = await $api.post<ReferralResponse>(endpoints.referralTwitter, {
        oauth_token: ouathToken.value,
        oauth_verifier: oauthVerifier.value,
      });
      referralStore.initReferral(res.data);
      $router.replace($route.path);
      message.success('Twitter connected');
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
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      // window.open(
      //   'https://github.com/login/oauth/authorize?client_id=d0482598d8adbd8adffa&redirect_uri=http://localhost:3000/dashboard/referral',
      //   '_self'
      // );

      if (!referralStore.twitter_id) {
        await connectTwitter();
      } else {
        await disconnectTwitter();
        // Disconnect twitter account
      }
    }
  });
}

async function connectTwitter() {
  loading.value = true;
  try {
    const res = await $api.get<ApiKeyRolesResponse>(endpoints.referralTwitterAuth, {
      url: window.location.origin + window.location.pathname,
    });
    window.open(res.data.url, '_self');
  } catch (e) {
    console.error(e);
  }
  loading.value = false;
}

async function disconnectTwitter() {
  loading.value = true;
  try {
    const res = await $api.post<ReferralResponse>(endpoints.referralTwitterDisc);
    referralStore.initReferral(res.data);
    message.success('Twitter disconnected');
  } catch (e) {
    console.error(e);
  }
  loading.value = false;
}
</script>
