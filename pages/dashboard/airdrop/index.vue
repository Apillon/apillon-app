<template>
  <Dashboard :loading="loading">
    <template #heading>
      <Heading>
        <slot>
          <h2>{{ $t('referral.airdrop.title') }}</h2>
        </slot>

        <template #info> </template>

        <template #submenu>
          <MenuReferral />
        </template>
      </Heading>
    </template>

    <slot>
      <ReferralAirdrop />
    </slot>

    <template #learn>
      <ReferralInfo />
    </template>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const referralStore = useReferralStore();

const loading = ref(false);

useHead({
  title: t('referral.title'),
});

onMounted(async () => {
  await referralStore.getAirdrop();
  loading.value = false;
});
</script>
