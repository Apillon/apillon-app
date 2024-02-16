<template>
  <Dashboard :learn-collapsible="false">
    <template #heading>
      <Heading>
        <slot>
          <h2>{{ $t('referral.title') }}</h2>
        </slot>

        <template #info> </template>

        <template #submenu>
          <MenuReferral />
        </template>
      </Heading>
    </template>
    <slot>
      <Spinner v-if="loading" class="mt-40" />
      <n-space v-else class="pb-8" :size="16" vertical>
        <!-- Referral referres -->
        <ReferralReferres />

        <!-- Referral Share -->
        <ReferralShoutout />
      </n-space>
    </slot>

    <template #learn>
      <ReferralInfo />
    </template>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const referralStore = useReferralStore();

const loading = ref(false);

useHead({
  title: $i18n.t('referral.title'),
});
</script>
