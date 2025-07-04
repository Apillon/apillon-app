<template>
  <div class="flex min-h-full flex-col justify-center text-center">
    <div class="mx-auto mb-16 mt-8 max-w-lg">
      <IconSuccess class="text-3xl" />
      <h4 class="mt-6">{{ $t('hosting.website.deployed') }}</h4>
      <p>{{ $t('hosting.website.deployedInfo') }}</p>

      <div class="mt-8 inline-block">
        <Btn size="large" @click="proceed()">
          <span v-if="websiteStore.isActiveWebsiteGithubSource">{{ $t('hosting.website.deployments') }}</span>
          <span v-else>{{ $t('form.proceed') }}</span>
        </Btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['reset']);
const router = useRouter();
const websiteStore = useWebsiteStore();

function proceed() {
  emit('reset');
  router.push(`/dashboard/service/hosting/${websiteStore.active.website_uuid}`);
}
</script>
