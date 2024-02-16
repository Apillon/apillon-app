<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-airdrop',
    label: t('referral.menu.airdrop'),
    path: `/dashboard/airdrop`,
  },
  {
    key: 'dashboard-airdrop-referral',
    label: t('referral.menu.referral'),
    path: `/dashboard/airdrop/referral`,
  },
];
</script>
