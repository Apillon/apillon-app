<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div
    v-if="isFeatureEnabled(Feature.SOCIAL_ICONS, authStore.getUserRoles())"
    class="flex items-center justify-center text-xl mt-8"
  >
    <div v-for="(social, key) in socials" :key="key" class="mx-2">
      <a
        :href="social.link"
        class="inline-flex items-center justify-center w-10 h-10 border-[1px]"
        target="_blank"
      >
        <span v-if="social.iconName" :class="social.iconName"></span>
        <img v-else-if="social.icon" :src="social.icon" :alt="social.name" />
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();

const socials: Array<SocialInterface> = [
  { name: 'GitHub', link: 'https://www.github.com', iconName: 'icon-github' },
  { name: 'Twitter', link: 'https://www.twitter.com', iconName: 'icon-twitter' },
  { name: 'Google', link: 'https://www.google.com', iconName: 'icon-google' },
];
</script>
