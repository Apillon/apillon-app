<template>
  <Dashboard>
    <slot>
      <div class="flex lg:flex-nowrap flex-wrap gap-8 max-w-[980px] p-8 bg-grey-lightBg">
        <div class="max-w-[480px]">
          <h4 class="mb-4">Welcome to Apillon</h4>
          <p>
            Thank you for registering for Apillon platform and becoming one of the first Beta
            testers!
          </p>
          <br />
          <p>
            The services are under development, but soon you’ll be able to test the available
            features and build your first Web3 product with Apillon.
          </p>
          <br />
          <p>
            You’ll also be able to win Apillon’s merch pack as through Apillon’s referral system
            which is in progress as we speak.
          </p>
          <div class="p-4 bg-grey-dark mt-8">
            <p>
              <strong>I’m registered, now what?</strong>
            </p>
            <p>
              Sit back and relax. Once the first feature is ready to be tested and used, we will
              notify you via email so you can start your Web3 journey.
            </p>
          </div>
        </div>
        <div>
          <Image src="/images/dashboard/welcome.svg" :width="400" :height="470" alt="apillon" />
        </div>
      </div>
      <div class="max-w-[980px] p-8 mt-7 bg-grey-lightBg">
        <p>
          <strong>Referral code:</strong>
        </p>
        <div class="max-w-[480px]">
          <div class="p-4 bg-grey-dark mt-2">
            <p>
              {{ authStore.userUuid }}
            </p>
          </div>
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const authStore = useAuthStore();

useHead({
  title: t('dashboard.dashboard'),
});
</script>
