<template>
  <Dashboard :loading="loading">
    <template #heading>
      <Heading>
        <slot>
          <h2>{{ $t('referral.airdrop.title') }}</h2>
        </slot>

        <template #submenu>
          <MenuReferral />
        </template>
      </Heading>
    </template>

    <slot>
      <ReferralAirdrop v-if="referralStore.airdrop.totalPoints > 0" />
      <ReferralAirdropSubscribe v-else />
    </slot>

    <template #learn>
      <ReferralInfo />
    </template>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const referralStore = useReferralStore();

const loading = ref(true);

useHead({
  title: t('referral.airdrop.title'),
});

onMounted(async () => {
  await referralStore.getAirdrop();
  loading.value = false;
});
</script>
