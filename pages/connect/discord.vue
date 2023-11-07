<template>
  <Dashboard :loading="true" />
</template>

<script lang="ts" setup>
const { query } = useRoute();
const router = useRouter();
const message = useMessage();
const $i18n = useI18n();

onBeforeMount(() => {
  if (query.error) {
    router.push({ name: 'profile' });
    message.error(toStr(query.error_description) || toStr(query.error) || 'Discord connect failed');
  } else {
    discordConnect(toStr(query.code));
  }
});

async function discordConnect(code: string) {
  try {
    await $api.post(endpoints.discordConnect, { code });

    message.success($i18n.t('profile.discord.connected'));
  } catch (error) {
    /** Show error message */
    message.error(userFriendlyMsg(error));
  }
  /** Redirect back to profile */
  router.push({ name: 'profile' });
}
</script>
