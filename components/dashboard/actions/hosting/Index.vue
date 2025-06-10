<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-model:value="websiteStore.search" />
    </div>

    <n-space size="large">
      <n-button :disabled="authStore.isAdmin()" @click="showModalNewWebsite = true">
        <span class="icon-add mr-2 text-xl text-primary"></span>
        <span class="text-primary">{{ $t('hosting.website.add') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - New website -->
  <HostingModal v-model:show="showModalNewWebsite" :title="$t('hosting.website.new')" />
</template>

<script lang="ts" setup>
defineProps({
  archive: { type: Boolean, default: false },
});

const authStore = useAuthStore();
const websiteStore = useWebsiteStore();
const showModalNewWebsite = ref<boolean>(false);
</script>
