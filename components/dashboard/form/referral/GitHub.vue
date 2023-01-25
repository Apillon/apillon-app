<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <div class="flex gap-8">
      <n-form-item
        class="w-full"
        path="name"
        :label="$t('referral.connectGithub')"
        :label-props="{ for: 'email' }"
      >
        <n-input
          v-model:value="formData.email"
          disabled
          :input-props="{ id: 'email' }"
          :placeholder="
            referralStore.github_name
              ? referralStore.github_name
              : 'Connect your GitHub account and your handle will be displayed here'
          "
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

const message = useMessage();

const $route = useRoute();
const $router = useRouter();

const $i18n = useI18n();
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const formData = ref({ email: null });

const ouathToken = computed(() => $route.query.code);

onMounted(async () => {
  console.log('Route: ', $route);
  if (ouathToken.value) {
    loading.value = true;
    // Github link // Send oath token to backend
    try {
      const res = await $api.post<ReferralResponse>(endpoints.referralGithub, {
        code: ouathToken.value,
      });
      referralStore.initReferral(res.data);
      $router.replace($route.path);
      message.success('Github connected');
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
        'https://github.com/login/oauth/authorize?client_id=d0482598d8adbd8adffa&redirect_uri=' +
          window.location.href,
        '_self'
      );
    } else {
      // Disconnect github account
      await disconnectGithub();
    }
  });
}

async function disconnectGithub() {
  loading.value = true;
  // Github link // Send oath token to backend
  try {
    const res = await $api.post<ReferralResponse>(endpoints.referralGithubDisc);
    referralStore.initReferral(res.data);
    message.success('Github disconnected');
  } catch (e) {
    console.error(e);
  }

  loading.value = false;
}
</script>
