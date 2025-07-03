<template>
  <n-space class="pb-8" :size="32" vertical>
    <ActionsAuthentication />

    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="data"
      :loading="dataStore.service.loading"
      :pagination="pagination"
      :row-props="rowProps"
      @update:page-size="(pz: number) => (pagination.pageSize = pz)"
    />
  </n-space>

  <!-- Modal - Edit IPNS -->
  <modal v-model:show="modalEditAuthVisible" :title="$t('service.edit')">
    <FormService
      :service-uuid="currentRow?.service_uuid"
      :service-type="ServiceType.AUTHENTICATION"
      @submit-success="modalEditAuthVisible = false"
    />
  </modal>

  <!-- Modal - Delete API key -->
  <ModalDelete v-model:show="modalDeleteAuthVisible" :title="$t('service.delete')">
    <FormDelete :id="currentRow?.service_uuid" type="service" @submit-success="onServiceDeleted" />
  </ModalDelete>
</template>

<script lang="ts" setup>
import { NDropdown, NTag } from 'naive-ui';

const props = defineProps({
  serviceType: {
    type: Number,
    validator: (value: number) => Object.values(ServiceType).includes(value),
    required: true,
  },
});

const { t } = useI18n();
const dataStore = useDataStore();

const modalEditAuthVisible = ref<boolean>(false);
const modalDeleteAuthVisible = ref<boolean>(false);
const pagination = reactive(createPagination(false));

const createColumns = (): NDataTableColumns<ServiceInterface> => {
  return [
    {
      key: 'name',
      title: t('general.serviceName'),
      render(row) {
        return [
          h(resolveComponent('IconStatus'), { active: row.active === 1 }, ''),
          h('span', { class: 'ml-2 text-blue' }, row.name),
        ];
      },
    },
    {
      key: 'service_uuid',
      title: t('general.uuid'),
      render(row: ServiceInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.service_uuid }, '');
      },
    },
    {
      key: 'serviceType',
      title: t('general.serviceType'),
      render(row) {
        return h(
          'span',
          { class: 'text-body' },
          {
            default: () => row.serviceType,
          }
        );
      },
    },
    {
      key: 'status',
      title: t('general.status'),
      render(row: ServiceInterface) {
        return h(
          NTag,
          { type: row.active ? 'success' : 'default', round: true, bordered: false },
          {
            default: () => (row.active ? t('general.active') : t('general.paused')),
          }
        );
      },
    },
    {
      key: 'actions',
      title: '',
      align: 'right',
      className: '!py-0 !sticky right-0',
      render() {
        return h(
          NDropdown,
          {
            options: dropdownOptions,
            trigger: 'click',
          },
          {
            default: () => h(resolveComponent('BtnActions')),
          }
        );
      },
    },
  ];
};
const currentRow = ref<ServiceInterface>({} as ServiceInterface);
const columns = createColumns();

/** Data: filtered websites */
const data = computed<Array<ServiceInterface>>(() => {
  return (
    dataStore.services.filter(
      item =>
        item.serviceType_id === props.serviceType &&
        item.name.toLowerCase().includes(dataStore.service.search.toLowerCase())
    ) || []
  );
});

function rowProps(row: ServiceInterface) {
  return {
    onClick: () => {
      currentRow.value = row;
    },
  };
}

const dropdownOptions = [
  {
    key: 'edit',
    label: t('general.edit'),
    props: {
      onClick: () => {
        modalEditAuthVisible.value = true;
      },
    },
  },
  {
    key: 'delete',
    label: t('general.delete'),
    props: {
      class: '!text-pink',
      onClick: () => {
        modalDeleteAuthVisible.value = true;
      },
    },
  },
];

/**
 * Delete Service
 */
function onServiceDeleted() {
  modalDeleteAuthVisible.value = false;
  dataStore.services = dataStore.services.filter(item => item.service_uuid !== currentRow.value.service_uuid);
}
</script>
