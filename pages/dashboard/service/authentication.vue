<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('dashboard.nav.authentication') }}</h1>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <!-- API keys -->
            <NuxtLink
              v-if="dataStore.hasServicesByType(ServiceType.AUTHENTICATION)"
              :to="{ name: 'dashboard-api-keys' }"
            >
              <n-button size="small">
                <span class="icon-acess text-xl mr-2"></span>
                {{ $t('dashboard.pageMenu.apiKeys') }}
              </n-button>
            </NuxtLink>

            <ModalCreditCosts :service="ServiceTypeName.AUTHENTICATION" />

            <IconInfo v-if="$i18n.te('w3Warn.auth.new')" @click="modalW3WarnVisible = true" />
          </n-space>
        </template>
      </Heading>
    </template>
    <slot>
      <div
        v-if="dataStore.hasServicesByType(ServiceType.AUTHENTICATION)"
        class="p-8 mb-8 bg-bg-light text-body rounded-lg"
      >
        <h3 class="mb-4 text-white">Apillon OAuth Integration</h3>
        <p>
          If you wish to integrate Apillon&#39;s OAuth protocol into your own project or website,
          you are able to do so. If you don&#39;t have an Apillon account or project already, you
          can get started on our dashboard. After you have created a project, navigate to your
          project&#39;s
          <Btn class="inline-block" type="link" @click="router.push('/dashboard/api-keys')">
            API keys
          </Btn>
          section under the project settings. You must generate an API key for the Authentication
          service with the <strong>KEY_EXECUTE</strong> permission included. This API key will be
          used to interact with Apillon&#39;s API, generate an OAuth session and verify a user
          login. Make sure you store your API key and your API key secret in a secure manner.
        </p>
        <p>To integrate Apillon&#39;s OAuth protocol into your website, follow these steps:</p>
        <ol class="list-decimal text-sm pl-4 mb-4">
          <li>
            <p>
              <strong>Generate an API Key:</strong> After creating a project, go to your
              project&#39;s settings and navigate to the
              <Btn class="inline-block" type="link" @click="router.push('/dashboard/api-keys')">
                API keys section </Btn
              >. Generate an API key for the Authentication service with the KEY_EXECUTE permission.
            </p>
          </li>
          <li>
            <p>
              <strong>Securely Store API Key:</strong> It&#39;s crucial to securely store your API
              key and its secret. These will be used to interact with Apillon&#39;s API, create
              OAuth sessions, and verify user logins. This should be done on the server-side,
              explained below.
            </p>
          </li>
        </ol>

        <p>
          Check out an example on
          <Btn
            class="inline-block"
            type="link"
            href="https://wiki.apillon.io/build/2-web3-services.html#web3-authentication"
            target="_blank"
          >
            Wiki
          </Btn>
          <span>.</span>
        </p>
      </div>
      <Empty
        v-else
        :title="$t('service.authentication.emptyTitle')"
        :info="$t('service.authentication.emptyInfo')"
        icon="storage/empty"
      >
        <FormService
          class="mt-4 pr-4 sm:pr-8"
          :service-type="ServiceType.AUTHENTICATION"
          :default-service-name="ServiceTypeName.AUTHENTICATION"
          :btn-text="
            $t('general.attachService', {
              service: $t('service.authentication.name').toLocaleLowerCase(),
            })
          "
        />
      </Empty>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.AUTH_NEW);

useHead({
  title: $i18n.t('dashboard.nav.authentication'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await dataStore.getServices();
      pageLoading.value = false;
    });
  }, 100);
});
</script>
