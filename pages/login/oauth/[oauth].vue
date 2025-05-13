<script lang="ts" setup>
import { OauthTypes } from '~/lib/values/general.values';

useHead({
  title: 'OAuth',
});

definePageMeta({
  layout: 'auth',
  middleware: to => {
    const action = sessionStorage.getItem(SessionKeys.OAUTH_ACTION);
    const oauthType = Array.isArray(to.params.oauth) ? to.params.oauth.join() : to.params.oauth;

    if (
      !oauthType ||
      !enumValues(OauthTypes).includes(oauthType) ||
      !action ||
      !enumValues(OauthActionTypes).includes(action)
    ) {
      sessionStorage.removeItem(SessionKeys.OAUTH_ACTION);
      return navigateTo('/login/');
    }
  },
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const dataStore = useDataStore();

const loading = ref(true);
const action = ref<typeof OauthActionTypes | string | null>(sessionStorage.getItem(SessionKeys.OAUTH_ACTION));
const oauthType = computed<string>(() =>
  Array.isArray(route.params.oauth) ? route.params.oauth.join() : route.params.oauth
);

onMounted(() => {
  if (action.value === OauthActionTypes.LOGIN) {
    login();
  } else {
    loading.value = false;
    router.push('/login');
  }
  sessionStorage.removeItem(SessionKeys.OAUTH_ACTION);
});

async function login() {
  loading.value = true;

  try {
    const { data } = await $api.post<LoginResponse>(`/oauth/${oauthType.value}/login`, getOauthParams());

    authStore.saveUser(data);
    await dataStore.fetchProjects(true);
  } catch (e: ApiError | any) {
    console.error(e);
    router.replace('/login');
  }

  loading.value = false;
}

/**
 * Get request body with codes returned from oauth as query params
 */
function getOauthParams() {
  const params = {} as any;

  if (oauthType.value === OauthTypes.GOOGLE) {
    params.code = route.query.code;
    params.redirectUrl = `${window.location.origin}/login/oauth/google`;
  }

  return params;
}
</script>

<template>
  <div class="h-full w-full">
    <Spinner :size="64" />
  </div>
</template>
