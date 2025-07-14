<template>
  <n-space v-bind="$attrs" justify="space-between">
    <n-space size="large">
      <div class="w-[20vw] min-w-[11rem] max-w-xs">
        <n-input v-model:value="bucketStore.filter.search" :placeholder="$t('storage.file.search')" />
      </div>
      <!-- Filter type -->
      <select-options
        v-model:value="bucketStore.filter.bucketType"
        :options="bucketTypes"
        class="w-[20vw] min-w-[11rem] max-w-xs"
        size="medium"
        :placeholder="$t('form.placeholder.bucketType')"
        filterable
        clearable
      />
    </n-space>

    <n-space size="large">
      <!-- Show only if user select files -->
      <template v-if="bucketStore.selectedItems.length > 0">
        <!-- Delete files -->
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-button
              class="w-10"
              size="medium"
              type="error"
              :disabled="authStore.isAdmin()"
              ghost
              @click="emit('onBucketDelete')"
            >
              <span class="icon-delete text-xl"></span>
            </n-button>
          </template>
          <span>{{ $t('storage.delete.selectedBuckets') }}</span>
        </n-tooltip>

        <!-- Separator -->
        <n-divider class="mx-4 h-full" vertical />
      </template>

      <!-- Refresh storage content -->
      <n-button size="medium" :loading="bucketStore.loading" @click="bucketStore.fetchBuckets()">
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('storage.refresh') }}
      </n-button>

      <!-- Create new bucket -->
      <Btn
        v-if="bucketStore.hasBuckets"
        inner-class="flex gap-2 items-center"
        :disabled="authStore.isAdmin()"
        @click="showModalNewBucket = true"
      >
        <span class="icon-add text-xl"></span>
        <span>{{ $t('storage.bucket.new') }}</span>
      </Btn>
    </n-space>
  </n-space>

  <!-- Modal - Create bucket -->
  <modal v-model:show="showModalNewBucket" :title="$t('project.newBucket')">
    <FormStorageBucket @submit-success="showModalNewBucket = false" @create-success="onBucketCreated" />
  </modal>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

const emit = defineEmits(['onBucketDelete']);

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const bucketStore = useBucketStore();
const showModalNewBucket = ref<boolean | null>(false);

/** Bucket type */
const bucketTypes = ref<SelectOption[]>([
  {
    value: BucketType.STORAGE,
    label: t(`storage.type.${BucketType.STORAGE}`),
  },
  {
    value: BucketType.NFT_METADATA,
    label: t(`storage.type.${BucketType.NFT_METADATA}`),
  },
]);

function onBucketCreated(bucket: BucketInterface) {
  router.push(`/dashboard/service/storage/${bucket.bucket_uuid}`);
}
</script>
