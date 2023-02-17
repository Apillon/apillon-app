<template>
  <Spinner v-if="ipnsStore.loading" />
  <div v-else>
    <div v-if="ipnsStore.items.length">
      <h4 class="mb-4">{{ $t('storage.ipns.selectIpns') }}</h4>
      <div v-for="ipns in ipnsStore.items" :key="ipns.id" class="mb-4">
        <n-space justify="space-between" align="center">
          <p>{{ ipns.name }}</p>
          <Btn type="secondary" @click="publishToIpns(ipns.id)">
            {{ $t('storage.ipns.publish') }}
          </Btn>
        </n-space>
      </div>

      <h4 class="mt-8 mb-4">{{ $t('storage.ipns.orCreateNew') }}</h4>
    </div>
    <div v-else>
      <h4 class="mt-8 mb-4">{{ $t('storage.ipns.createFirst') }}</h4>
    </div>
    <Btn type="primary" size="large" @click="modalCreateIpnsVisible = true">
      {{ $t('storage.ipns.create') }}
    </Btn>

    <!-- Modal - New IPNS -->
    <modal v-model:show="modalCreateIpnsVisible" :title="$t('storage.ipns.new')">
      <FormStorageIpns @submit-success="modalCreateIpnsVisible = false" />
    </modal>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const props = defineProps({
  cid: { type: String, required: true },
});
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const message = useMessage();
const $i18n = useI18n();
const bucketStore = useBucketStore();
const ipnsStore = useIpnsStore();

const loading = ref(false);
const modalCreateIpnsVisible = ref<boolean>(false);

onMounted(async () => {
  await ipnsStore.getIPNSs(bucketStore.selected);
});

async function publishToIpns(ipnsId: number) {
  loading.value = true;

  try {
    const res = await $api.post<IpnsPublishResponse>(
      endpoints.ipnsPublish(bucketStore.selected, ipnsId),
      { cid: props.cid }
    );

    message.success($i18n.t('form.success.created.ipns'));

    /** On  ipns publish, update data */
    ipnsStore.items.forEach(ipns => {
      if (ipns.id === res.data.id) {
        ipns.ipnsName = res.data.ipnsName;
        ipns.ipnsValue = res.data.ipnsValue;
      }
    });

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
