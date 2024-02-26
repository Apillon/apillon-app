<template>
  <Dashboard :loading="loading">
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
      <n-space class="pb-8" :size="16" vertical>
        <!-- Referral referres -->
        <ReferralReferres />
      </n-space>
    </slot>

    <template #learn>
      <ReferralInfo />
    </template>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const referralStore = useReferralStore();

const loading = ref(true);

useHead({
  title: $i18n.t('referral.title'),
});

onMounted(async () => {
  referralStore.getReferral();
  await referralStore.getAirdrop();
  loading.value = false;
});
</script>
