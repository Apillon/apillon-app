<template>
  <Dashboard :loading="authStore.loadingProfile" :learn-collapsible="false">
    <template #heading>
      <Heading>
        <h1>{{ $t('dashboard.homepage') }}</h1>
      </Heading>
    </template>
    <slot>
      <div class="p-8 mb-8 bg-bg-light text-body">
        <template v-if="authStore.isBetaUser()">
          <h3 class="mb-4 text-white">Welcome to the Apillon Closed Beta test</h3>
          <p>
            At this moment, you will be able to test Web3 Storage and Web3 Hosting services, while
            other services are yet to be added and released at a later date.
          </p>
          <p>
            To make your To make your testing journey smooth, please refer to Apillon's Wiki on the
            following two sections:
          </p>
          <p>
            To learn how things work in the background, refer to the following
            <Btn
              class="inline-block"
              type="link"
              href="https://wiki.apillon.io/build/#concepts"
              target="_blank"
            >
              article
            </Btn>
            <span>.</span>
          </p>
          <p>
            To start building immediately, check out our
            <Btn
              class="inline-block"
              type="link"
              href="https://wiki.apillon.io/build/3-apillon-api.html"
              target="_blank"
            >
              API docs
            </Btn>
            <span>.</span>
          </p>
          <br />

          <p>
            We are proud and happy to open the Closed Beta stage, tho we are fully aware there are
            still things that still need fixing. We are all about releasing fast, learning fast and
            improving even faster 😀.
          </p>
          <p>
            To help us detect bugs 🐞 or UI improvements, please file the ticket on our
            <Btn
              class="inline-block"
              type="link"
              href="https://discord.com/channels/881835505120079912/881848835364778006"
              target="_blank"
            >
              Discord channel
            </Btn>
            <span>.</span>
          </p>
        </template>
        <template v-else>
          <h3 class="mb-4 text-white">Apply for Closed Beta testing</h3>
          <p>
            Apillon is currently in the Closed Beta stage. Anyone can register an account on Apillon
            but only assigned users may get access to test the platform's Beta features.
          </p>
          <p>To join the Apillon Closed Beta program, please follow the steps below.</p>
          <ul class="list-disc pl-5">
            <li>
              If you do not yet have an Apillon account, create one on
              <Btn
                class="inline-block"
                type="link"
                href="http://apillon.io/register"
                target="_blank"
              >
                apillon.io/register
              </Btn>
              <span>.</span>
            </li>
            <li>Log in to your account.</li>
            <li>
              At the bottom of the welcome page, find an Closed Beta code assigned to your account.
            </li>
            <li>
              Copy the Closed Beta code and paste it to our
              <Btn
                class="inline-block"
                type="link"
                href="https://discord.gg/n6gVzCnz9t"
                target="_blank"
              >
                closed-beta channel
              </Btn>
              on Discord.
            </li>
            <li>
              Wait for an email with an invitation to join the Apillon Closed Beta program and
              access the platform's features.
            </li>
          </ul>
        </template>

        <!-- Referral code -->
        <h3 class="mt-8 text-white">Closed Beta code:</h3>
        <n-space
          class="p-4 bg-bg-light card-border mt-2"
          align="center"
          size="small"
          justify="space-between"
          :wrap="false"
        >
          <n-ellipsis class="align-bottom body-md" :line-clamp="1">
            {{ authStore.userUuid }}
          </n-ellipsis>
          <button @click="copyToClipboard(authStore.userUuid)">
            <span class="icon-copy text-xl align-sub"></span>
          </button>
        </n-space>

        <div class="p-4 bg-bg mt-10">
          <h4 class="text-white">Note:</h4>
          <p>
            Keep in mind that Apillon Closed Beta delivers no guarantees related to functionalities
            or access and is intended for testing purposes only. Beta features also come with
            several limitations, which will be removed with each platform update as more and more
            users deliver feedback on Closed Beta and help improve the platform's services.
          </p>
        </div>
      </div>
    </slot>

    <template v-if="isFeatureEnabled(Feature.REFERRAL, authStore.getUserRoles())" #learn>
      <!-- Referral -->
      <div class="md:max-w-lg p-8 mb-6 card-border">
        <h3 class="mb-4">{{ $t('referral.banner.title') }}</h3>
        <p class="text-body mb-6">
          {{ $t('referral.banner.description') }}
        </p>
        <Image
          src="/images/dashboard/referral.svg"
          class="mb-7"
          :width="359"
          :height="64"
          alt="apillon referral"
        />
        <Btn :loading="loading" type="primary" size="large" @click="enterReferral()">
          {{ $t('referral.banner.btn') }}
        </Btn>
      </div>
    </template>
  </Dashboard>

  <!-- Modal Referral -->
  <modal v-model:show="showModal" :title="$t('referral.enter.header')">
    <ReferralAcceptTerms />
  </modal>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const referralStore = useReferralStore();
const showModal = ref(false);

useHead({
  title: t('dashboard.dashboard'),
});

function enterReferral() {
  if (!referralStore.termsAccepted) {
    showModal.value = true;
  } else {
    router.push('/dashboard/referral');
  }
}

onMounted(() => {
  if (isFeatureEnabled(Feature.REFERRAL, authStore.getUserRoles())) {
    referralStore.getReferral();
  }
});
</script>
