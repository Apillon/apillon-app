<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-model:value="websiteStore.search" />
    </div>

    <n-space size="large">
      <n-button :loading="websiteStore.loading" @click="websiteStore.fetchWebsites(archive)">
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>
      <Btn
        inner-class="flex gap-2 items-center"
        :disabled="authStore.isAdmin()"
        @click="websiteStore.modalNewWebsiteVisible = true"
      >
        <span class="icon-add text-xl"></span>
        <span>{{ $t('hosting.website.add') }}</span>
      </Btn>
    </n-space>
  </n-space>

  <!-- Modal - New website -->
  <HostingModal v-model:show="websiteStore.modalNewWebsiteVisible" :title="$t('hosting.website.new')" />
</template>

<script lang="ts" setup>
defineProps({
  archive: { type: Boolean, default: false },
});

const authStore = useAuthStore();
const websiteStore = useWebsiteStore();
</script>
