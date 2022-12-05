<template>
  <div>
    <n-menu
      v-model:value="(name as string)"
      :options="menuOptions"
      @update-value="handleUpdateValue"
    />

    <!-- Modal - Destroy bucket -->
    <n-modal v-model:show="showModalDestroyBucket">
      <n-card
        style="width: 660px"
        :title="$t('storage.bucketDestroy')"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <FormStorageBucketDestroy :bucket-id="bucketId" />
      </n-card>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import type { MenuOption } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { name, params } = useRoute();
const showModalDestroyBucket = ref<boolean>(false);
const NuxtLink = resolveComponent('NuxtLink');

/** Bucket ID from route */
const bucketId = parseInt(`${params?.id}`);

function handleUpdateValue(key: string, item: MenuOption) {
  console.info('[onUpdate:value]: ' + JSON.stringify(key));
  console.info('[onUpdate:value]: ' + JSON.stringify(item));
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(NuxtLink, { to: { path: '/dashboard/service/storage/:id' } }, () => t('storage.files')),
    key: 'dashboard-service-storage-id',
  },
  {
    label: () =>
      h(
        NuxtLink,
        { class: 'disabled', to: { name: 'dashboard-service-storage' }, disabled: true },
        () => t('storage.snapshots')
      ),
    key: 'snapshots',
    disabled: true,
  },
  {
    label: () =>
      h(NuxtLink, { href: '/dashboard/service/storage/stats' }, () => t('storage.stats')),
    key: 'stats',
    disabled: true,
  },
  {
    label: () => h('span', {}, t('storage.history')),
    key: 'history',
    disabled: true,
  },
  {
    label: () => h('span', { class: 'text-grey-light' }, t('storage.destroy')),
    key: 'delete',
    onClick: () => (showModalDestroyBucket.value = true),
  },
];
</script>
