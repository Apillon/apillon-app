<template>
  <div>
    <!-- Heading -->
    <h1 class="mb-2 text-center sm:text-left">{{ $t('auth.login.title') }}</h1>
    <p class="mb-7 text-body">{{ $t('auth.login.description') }}</p>

    <!-- Wallet -->
    <template v-if="isLg && isFeatureEnabled(Feature.WALLET_LOGIN, authStore.getUserRoles())">
      <AuthWalletLogin class="w-full" />
    </template>

    <!-- Magic link -->
    <template v-if="isFeatureEnabled(Feature.MAGIC_LINK, authStore.getUserRoles())">
      <Btn type="secondary" class="w-full mt-2">
        <span class="icon-magic-link"></span>
        {{ $t('auth.login.magicLink') }}
      </Btn>
    </template>

    <!-- Separator -->
    <SeparatorText>
      <template
        v-if="
          (isLg && isFeatureEnabled(Feature.WALLET_LOGIN, authStore.getUserRoles())) ||
          isFeatureEnabled(Feature.MAGIC_LINK, authStore.getUserRoles())
        "
      >
        {{ $t('auth.login.orUseEmail') }}
      </template>
      <template v-else>{{ $t('auth.login.withEmail') }}</template>
    </SeparatorText>

    <!-- Form -->
    <AuthFormLogin />

    <!-- Separator -->
    <SeparatorText>
      <button id="apillon" @click="openPopup()">KILT LOGIN</button>
    </SeparatorText>

    <!-- Links -->
    <n-space vertical>
      <div>
        <span class="text-sm text-body">{{ $t('auth.login.forgotPassword') }} </span>&nbsp;
        <NuxtLink :to="{ name: 'login-reset-password' }">
          <Btn type="builders" size="tiny" inner-class="text-sm">
            {{ $t('auth.login.resetHere') }}
          </Btn>
        </NuxtLink>
      </div>
      <div>
        <span class="text-sm text-body">{{ $t('auth.login.dontHaveAccount') }} </span>&nbsp;
        <NuxtLink :to="{ name: 'register' }">
          <Btn type="builders" size="tiny" inner-class="text-sm">
            {{ $t('general.signup') }}
          </Btn>
        </NuxtLink>
      </div>
    </n-space>

    <AuthSocial />
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { isLg } = useScreen();
const authStore = useAuthStore();
const dataStore = useDataStore();
const loading = ref(false);
const sessionToken = ref<string | undefined>('');
const oauthAuthToken = ref<string | undefined>('');

onMounted(async () => {
  sessionToken.value = await getOauthSession();
});

function openPopup() {
  const oauthUrl = 'http://127.0.0.1:5173/';
  const childWindow = window.open(
    `${oauthUrl}?embedded=1&token=${sessionToken.value}`,
    'Apillon Auth Form',
    `height=${900} width=${450} resizable=no`
  );

  // VERIFICATION EVENT LISTENER
  window.addEventListener(
    'message',
    async event => {
      console.log('Event: ', event.data);
      if (event.data.verified) {
        oauthAuthToken.value = event.data.data.userData;
        console.log('Loading: ', loading.value);
        if (!loading.value) {
          console.log('Logging IN');
          await loginWithKilt();
          childWindow?.close();
        }
      }
    },
    false
  );
}

async function loginWithKilt() {
  loading.value = true;
  // Logout first - delete LS and store if there is any data
  authStore.logout();
  dataStore.resetCurrentProject();

  try {
    const res = await $api.post<LoginResponse>(endpoints.loginWithKilt, {
      token: oauthAuthToken.value,
    });
    authStore.saveUser(res.data);

    /** Fetch projects, if user hasn't any project redirect him to '/onboarding/first' so he will be able to create first project */
    dataStore.project.items = await dataStore.fetchProjects(true);
  } catch (error) {
    console.error(error);
  }
  loading.value = false;
}

async function getOauthSession() {
  loading.value = true;

  try {
    const response = await $api.get<OauthSessionResponse>(endpoints.oauthSession);
    loading.value = false;
    return response.data.data.session;
  } catch (error) {
    console.error(error);
  }
}

definePageMeta({
  layout: 'auth',
});
useHead({
  title: t('auth.login.title'),
});
</script>
