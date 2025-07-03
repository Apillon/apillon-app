<template>
  <Dashboard :loading="pageLoading" :empty="!dataStore.project.selected || !bucketStore.hasBuckets">
    <template #empty>
      <ServiceEmpty
        docs="https://wiki.apillon.io/web3-services/2-web3-storage.html"
        :name="ServiceTypeName.STORAGE.toLowerCase()"
        :service="ServiceTypeName.STORAGE"
        :guides="serviceGuides"
        :image="BannerWEBP"
      >
        <template #actions>
          <Btn size="large" type="primary" @click="createNewBucket">
            {{ $t('storage.bucket.new') }}
          </Btn>
        </template>
      </ServiceEmpty>
    </template>
    <template #heading>
      <HeaderStorage />
    </template>

    <TableStorageBucket :buckets="bucketStore.items" />
  </Dashboard>

  <W3Warn v-model:show="showModalW3Warn" @submit="onModalW3WarnHide">
    {{ $t('w3Warn.bucket.new') }}
  </W3Warn>

  <!-- Modal - Create bucket -->
  <modal v-model:show="showModalNewBucket" :title="$t('project.newBucket')">
    <FormStorageBucket @submit-success="showModalNewBucket = false" @create-success="onBucketCreated" />
  </modal>
</template>

<script lang="ts" setup>
import BannerWEBP from '/assets/images/storage/file.webp';

const { t } = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const ipfsStore = useIpfsStore();
const bucketStore = useBucketStore();
const storageStore = useStorageStore();
const pageLoading = ref<boolean>(true);
const showModalW3Warn = ref<boolean>(false);
const showModalNewBucket = ref<boolean | null>(false);

useHead({
  title: t('dashboard.nav.storage'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await storageStore.getStorageInfo();
  await bucketStore.getBuckets();
  ipfsStore.getIpfsInfo(dataStore.projectUuid);

  pageLoading.value = false;
});

const serviceGuides = [
  {
    title: 'Upload files to IPFS with Apillon for free',
    content:
      'Get free and easy IPFS upload and store your files in a more efficient and distributed way on the Apillon platform.',
    link: 'https://blog.apillon.io/upload-files-to-ipfs-with-apillon-for-free-703003cf7e5/',
  },
  {
    title: 'FAQ: Apillon Web3 Storage',
    content:
      'Find answers to your questions on the Apillon Web3 Storage service, how to store files on a decentralized network, and more.',
    link: 'https://blog.apillon.io/faq-apillon-web3-storage-c99a9b0e8b12/',
  },
  {
    title: 'Apillon Recipe #4 — NFT metadata storage',
    content:
      'In round four of cooking Web3 with Apillon, you will find why the storage of NFT metadata matters and how to bring it to a decentralized…',
    link: 'https://blog.apillon.io/apillon-recipe-4-nft-metadata-storage-71da4fe7c60f/',
  },
];

/**
 * On createNewBucket click
 * If W3Warn has already been shown, show modal create new bucket, otherwise show warn first
 * */
function createNewBucket() {
  if (localStorage.getItem(LsW3WarnKeys.BUCKET_NEW)) {
    showModalNewBucket.value = true;
  } else {
    showModalW3Warn.value = true;
    showModalNewBucket.value = null;
  }
}

/** When user close W3Warn, allow him to create new bucket */
function onModalW3WarnHide() {
  if (showModalNewBucket.value !== false) {
    showModalNewBucket.value = true;
  }
}

/** Watch showModalNewBucket, onShow update timestamp of shown modal in session storage */
watch(
  () => showModalW3Warn.value,
  shown => {
    if (shown) {
      localStorage.setItem(LsW3WarnKeys.BUCKET_NEW, Date.now().toString());
    }
  }
);

function onBucketCreated(bucket: BucketInterface) {
  router.push(`/dashboard/service/storage/${bucket.bucket_uuid}`);
}
</script>
