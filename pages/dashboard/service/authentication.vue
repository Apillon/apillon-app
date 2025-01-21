<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('dashboard.nav.authentication') }}</h1>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <!-- API Keys -->
            <NuxtLink
              v-if="dataStore.hasServicesByType(ServiceType.AUTHENTICATION)"
              :to="{ name: 'dashboard-api-keys' }"
            >
              <n-button size="small">
                <span class="icon-acess mr-2 text-xl"></span>
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
        class="mb-8 rounded-lg bg-bg-light p-8 text-body"
      >
        <h3 class="mb-4 text-white">Apillon OAuth Integration</h3>
        <p class="mb-2">To integrate Apillon's OAuth protocol into your project or website, follow these steps:</p>
        <ol class="mb-4 list-decimal pl-6 text-sm">
          <li>
            <p>
              Navigate to
              <Btn class="inline-block" type="link" @click="router.push('/dashboard/project-settings')">
                Project settings
              </Btn>
              <span>.</span>
            </p>
          </li>
          <li>
            <p>
              Click the
              <Btn class="inline-block" type="link" @click="router.push('/dashboard/api-keys')"> API Keys </Btn>
              <span> tab.</span>
            </p>
          </li>
          <li>
            <p>
              Click <strong>“Generate new key”</strong>, name it, and toggle the Authentication service with the
              <strong>KEY_EXECUTE</strong> permission.
            </p>
          </li>
          <li>
            <p>
              Securely store the API key and its secret. This step is crucial as you will need those to interact with
              the Apillon API, create OAuth sessions, and verify user log-ins. This should be done on the server side.
            </p>
          </li>
          <li>
            <p>
              Follow the
              <Btn
                class="inline-block"
                type="link"
                href="https://wiki.apillon.io/build/7-apillon-oauth-integration.html"
                target="_blank"
              >
                OAuth integration docs
              </Btn>
              on the Apillon wiki. Additionally, you can check out the
              <Btn class="inline-block" type="link" href="https://github.com/Apillon/oauth-demo" target="_blank">
                Apillon OAuth demo on our Github
              </Btn>
            </p>
          </li>
          <li>
            <p>
              If you want to learn more about how OAuth works in the background, refer to the
              <Btn
                class="inline-block"
                type="link"
                href="https://wiki.apillon.io/web3-services/5-web3-authentication.html"
                target="_blank"
              >
                Web3 Authentication Apillon wiki page
              </Btn>
            </p>
          </li>
        </ol>
      </div>
      <Empty
        v-else
        :title="$t('dashboard.service.authentication.emptyTitle')"
        :info="$t('dashboard.service.authentication.emptyInfo')"
        icon="storage/empty"
      >
        <FormService
          class="mt-4 min-w-[13rem] pr-4 sm:pr-8"
          :service-type="ServiceType.AUTHENTICATION"
          default-service-name="Authentication service"
          :btn-text="$t('dashboard.service.authentication.emptyBtn')"
        />
      </Empty>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ServiceType, ServiceTypeName } from '~/lib/types/service';

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
