<template>
  <Heading
    :headline="$t('dashboard.nav.storage')"
    docs="https://wiki.apillon.io/web3-services/2-web3-storage.html"
    :info="$t('w3Warn.bucket.new')"
    :service="ServiceTypeName.STORAGE"
  >
    <template #details>
      <StorageProgress
        :key="storageStore.info.usedStorage"
        :size="storageStore.info.usedStorage"
        :max-size="storageStore.info.availableStorage"
      />
      <hr class="my-10 border-bg-lighter" />
    </template>

    <template v-if="ipfsStore.info" #detailsIpfsGateway>
      <StorageIpfsGateway :gateway="ipfsStore.info" />

      <hr class="my-10 border-bg-lighter" />
      <QuickLinks class="mb-4">
        <Btn
          size="large"
          type="secondary"
          href="https://wiki.apillon.io/build/2-storage-api.html#get-or-generate-link-for-ipfs"
        >
          {{ $t('general.learnMore') }}
        </Btn>
      </QuickLinks>
    </template>

    <template #detailsGenerate>
      <small class="mb-6 inline-block font-semibold">
        {{ $t('storage.ipfs.hotToGenerateLink') }}
        (<NuxtLink
          class="inline-block underline"
          href="https://wiki.apillon.io/build/2-storage-api.html#get-or-generate-link-for-ipfs"
          >{{ $t('general.learnMore') }}</NuxtLink
        >)
      </small>
      <FormStorageIpfs size="large" />

      <hr class="my-10 border-bg-lighter" />

      <small class="mb-6 inline-block font-semibold">
        {{ $t('storage.shortUrl.generateShortLink') }}

        (<NuxtLink
          class="inline-block underline"
          href="https://wiki.apillon.io/build/3-hosting-api.html#generate-short-url"
          >{{ $t('general.learnMore') }}</NuxtLink
        >)
      </small>
      <FormStorageShortUrl size="large" />
    </template>

    <!-- <template #submenu>
      <MenuStorage />
    </template> -->
  </Heading>
</template>

<script lang="ts" setup>
const ipfsStore = useIpfsStore();
const storageStore = useStorageStore();
</script>
