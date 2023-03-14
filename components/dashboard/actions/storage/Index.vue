<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] max-w-xs">
      <n-input
        v-model:value="bucketStore.search"
        type="text"
        name="search"
        size="small"
        :placeholder="$t('storage.file.search')"
        clearable
      >
        <template #prefix>
          <span class="icon-search text-2xl"></span>
        </template>
      </n-input>
    </div>

    <n-space size="large">
      <!-- Show only if user select files -->
      <template v-if="bucketStore.selectedItems.length > 0">
        <!-- Delete files -->
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-button class="w-10" size="small" type="error" ghost @click="emit('onBucketDelete')">
              <span class="icon-delete text-xl"></span>
            </n-button>
          </template>
          <span>{{ $t('storage.delete.selectedBuckets') }}</span>
        </n-tooltip>

        <!-- Separator -->
        <n-divider class="h-full mx-4" vertical />
      </template>

      <!-- Refresh storage content -->
      <n-button size="small" :loading="bucketStore.loading" @click="bucketStore.fetchBuckets()">
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('storage.refresh') }}
      </n-button>

      <!-- Create new bucket -->
      <n-button v-if="bucketStore.hasBuckets" size="small" @click="showModalNewBucket = true">
        <span class="icon-create-folder text-xl text-primary mr-2"></span>
        <span class="text-primary">{{ $t('storage.bucket.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create bucket -->
  <modal v-model:show="showModalNewBucket" :title="$t('project.newBucket')">
    <FormStorageBucket @submit-success="showModalNewBucket = false" />
  </modal>
</template>

<script lang="ts" setup>
const emit = defineEmits(['onBucketDelete']);

const bucketStore = useBucketStore();
const showModalNewBucket = ref<boolean | null>(false);
</script>
