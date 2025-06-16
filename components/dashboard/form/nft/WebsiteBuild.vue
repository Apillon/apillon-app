<template>
  <div class="w-full gap-4 md:grid md:grid-cols-3">
    <CardSelect
      v-for="(type, key) in websiteTypes"
      :key="key"
      class="md:my-0"
      :icon="type.icon"
      :title="type.label"
      @click="openLink(type.link)"
    >
    </CardSelect>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const websiteTypes = ref([
  {
    label: t('nft.collection.websiteDeploy.plain_js'),
    icon: 'library/javascript',
    link: 'https://github.com/Apillon/nft-template/fork',
  },
  {
    label: t('nft.collection.websiteDeploy.react'),
    icon: 'library/react',
    link: 'https://github.com/Apillon/nft-template-react/fork',
  },
  {
    label: t('nft.collection.websiteDeploy.vue'),
    icon: 'library/vue',
    link: 'https://github.com/Apillon/nft-template-vue/fork',
  },
]);

function openLink(url: string) {
  window.open(url, '_blank');
}
</script>
