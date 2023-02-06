<template>
  <Dashboard>
    <slot>
      <div class="dashboard-wrapper">
        <div class="flex lg:flex-nowrap flex-wrap gap-8 max-w-[1080px] p-8 bg-bg-lighter">
          <div class="max-w-xl">
            <template v-if="authStore.isBetaUser()">
              <h4 class="mb-4">Welcome to the Apillon Closed Beta test</h4>
              <p>
                At this moment, you will be able to test Web3 Storage and Web3 Hosting services,
                while other services are yet to be added and released at a later date.
              </p>
              <p>
                To make your To make your testing journey smooth, please refer to Apillon’s Wiki on
                the following two sections:
              </p>
              <br />
              <p>
                To learn how things work in the background, refer to the following
                <Btn href="https://wiki.apillon.io/build/#concepts" target="_blank">
                  <span class="font-content text-blue">article</span> </Btn
                >.
              </p>
              <p>
                To start building immediately, check out our
                <Btn href="https://wiki.apillon.io/build/3-apillon-api.html" target="_blank">
                  <span class="font-content text-blue">API docs</span> </Btn
                >.
              </p>
              <br />

              <p>
                We are proud and happy to open the Closed Beta stage, tho we are fully aware there
                are still things that still need fixing. We are all about releasing fast, learning
                fast and improving even faster 😀.
              </p>
              <p>
                To help us detect bugs 🐞 or UI improvements, please file the ticket on our
                <Btn
                  href="https://discord.com/channels/881835505120079912/881848835364778006"
                  target="_blank"
                >
                  <span class="font-content text-blue">Discord channel</span>
                </Btn>
              </p>
            </template>
            <template v-else>
              <h4 class="mb-4">Apply for Closed Beta testing</h4>
              <p>
                Apillon is currently in the Closed Beta stage. Anyone can register an account on
                Apillon but only assigned users may get access to test the platform’s Beta features.
              </p>
              <br />
              <p>To join the Apillon Closed Beta program, please follow the steps below.</p>
              <br />
              <ul class="list-disc pl-4">
                <li>
                  If you do not yet have an Apillon account, create one on
                  <Btn href="http://apillon.io/register" target="_blank">
                    <span class="font-content text-blue">apillon.io/register</span>
                  </Btn>
                  <span>.</span>
                </li>
                <li>Log in to your account.</li>
                <li>
                  At the bottom of the welcome page, find an Closed Beta code assigned to your
                  account.
                </li>
                <li>
                  Copy the Closed Beta code and paste it to our
                  <Btn href="https://discord.gg/n6gVzCnz9t" target="_blank">
                    <span class="font-content text-blue">closed-beta channel</span>
                  </Btn>
                  on Discord.
                </li>
                <li>
                  Wait for an email with an invitation to join the Apillon Closed Beta program and
                  access the platform’s features.
                </li>
              </ul>
            </template>

            <div class="p-4 bg-bg-light mt-8">
              <p class="font-bold">Note:</p>
              <p>
                Keep in mind that Apillon Closed Beta delivers no guarantees related to
                functionalities or access and is intended for testing purposes only. Beta features
                also come with several limitations, which will be removed with each platform update
                as more and more users deliver feedback on Closed Beta and help improve the
                platform’s services.
              </p>
            </div>
          </div>
          <div>
            <Image src="/images/dashboard/welcome.svg" :width="400" :height="470" alt="apillon" />
          </div>
        </div>

        <!-- Referral code -->
        <div class="max-w-[1080px] p-8 my-8 bg-bg-lighter">
          <p class="font-bold">Closed Beta code:</p>
          <div class="max-w-xl">
            <div class="p-4 bg-bg-light mt-2">
              <p>{{ authStore.userUuid }}</p>
            </div>
          </div>
        </div>

        <!-- Referral -->
        <div
          v-if="isFeatureEnabled(Feature.REFERRAL, authStore.getUserRoles())"
          class="max-w-lg p-8 mb-8 bg-bg-light"
        >
          <h3 class="mb-4">{{ $t('referral.banner.title') }}</h3>
          <p class="text-body mb-7">
            {{ $t('referral.banner.description') }}
          </p>
          <Btn :loading="loading" type="primary" size="large" @click="enterReferral()">
            {{ $t('referral.banner.btn') }}
          </Btn>
        </div>
      </div>
    </slot>
  </Dashboard>

  <!-- Modal Referral -->
  <modal v-model:show="showModal" :title="$t('referral.enter.header')">
    <ReferralAcceptTerms />
  </modal>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
const config = useRuntimeConfig();
const referralStore = useReferralStore();

useHead({
  title: t('dashboard.dashboard'),
});

function enterReferral() {
  if (!termsAccepted.value) {
    showModal.value = true;
  } else {
    router.push('/dashboard/referral');
  }
}

const loading = ref(false);
const termsAccepted = ref(false);

onMounted(() => {
  if (isFeatureEnabled(Feature.REFERRAL, authStore.getUserRoles())) {
    getReferral();
  }
});

async function getReferral() {
  loading.value = true;
  try {
    const res = await $api.get<ReferralResponse>(endpoints.referral);
    // If there is no error -> user already accepted terms & conditions
    referralStore.initReferral(res.data);
    termsAccepted.value = true;
  } catch (e) {
    if (config.public.ENV === AppEnv.LOCAL) {
      console.error(e);
    }
  }
  loading.value = false;
}

const showModal = ref(false);
</script>
