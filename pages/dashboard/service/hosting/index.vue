<template>
  <Dashboard :empty="!dataStore.project.selected || !websiteStore.hasWebsites" :loading="pageLoading">
    <template #empty>
      <ServiceEmpty
        docs="https://wiki.apillon.io/web3-services/3-web3-hosting.html"
        :name="ServiceTypeName.HOSTING.toLowerCase()"
        :service="ServiceTypeName.HOSTING"
        :guides="serviceGuides"
        :image="WebsitePNG"
      >
        <template #actions>
          <Btn size="large" type="primary" @click="createNewWebsite">
            {{ $t('hosting.website.addFirst') }}
          </Btn>
        </template>
      </ServiceEmpty>
    </template>
    <template #heading>
      <HeaderHosting />
    </template>

    <n-space class="pb-8" :size="32" vertical>
      <ActionsHosting />
      <TableHosting :websites="websiteStore.items" />
    </n-space>
  </Dashboard>

  <W3Warn v-model:show="modalW3WarnVisible" @submit="onModalW3WarnHide">
    {{ $t('w3Warn.hosting.upload') }}
  </W3Warn>

  <!-- Modal - Create Website -->
  <HostingModal v-model:show="showModalNewWebsite" :title="$t('hosting.website.new')" />
</template>

<script lang="ts" setup>
import WebsitePNG from '/assets/images/hosting/website.png';

const { t, te } = useI18n();
const dataStore = useDataStore();
const storageStore = useStorageStore();
const websiteStore = useWebsiteStore();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.HOSTING_NEW);

const pageLoading = ref<boolean>(true);
const showModalNewWebsite = ref<boolean | null>(false);

const serviceGuides = [
  {
    title: 'Should you choose decentralized hosting for your website?',
    content:
      'Explore the benefits and the possible risks of decentralized hosting to make an informed decision for your project.',
    link: 'https://blog.apillon.io/should-you-choose-decentralized-hosting-for-your-website-eed25da50470',
  },
  {
    title: 'The Web3Approved initiative offers free decentralized hosting for 100 years',
    content:
      'The initiative is a joint effort of Apillon and Crust Network, inviting Web3 players to practice what they preach.',
    link: 'https://blog.apillon.io/the-web3approved-initiative-offers-free-decentralized-hosting-for-100-years-c350a06f33b8',
  },
];

useHead({
  title: t('dashboard.nav.hosting'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await storageStore.getStorageInfo();
  await websiteStore.getWebsites();

  pageLoading.value = false;
});

/**
 * On createNewWebsite click
 * If W3Warn has already been shown, show modal create new website, otherwise show warn first
 * */
function createNewWebsite() {
  if (localStorage.getItem(LsW3WarnKeys.HOSTING_NEW) || !te('w3Warn.hosting.upload')) {
    showModalNewWebsite.value = true;
  } else {
    modalW3WarnVisible.value = true;
    showModalNewWebsite.value = null;
  }
}

/** When user close W3Warn, allow him to create new website */
function onModalW3WarnHide() {
  if (showModalNewWebsite.value !== false) {
    showModalNewWebsite.value = true;
  }
}
</script>
