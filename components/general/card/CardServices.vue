<template>
  <div>
    <strong class="mb-3 block">{{ $t('dashboard.simplet.includedServices') }}</strong>

    <div class="card-light relative flex flex-col justify-between gap-4 p-8">
      <n-table class="plain" :bordered="false" single-line>
        <tbody>
          <tr v-for="(item, key) in includedServices" :key="key">
            <td :class="{ '!border-b-0': key + 1 === includedServices.length }">
              <span class="mr-4 flex items-center gap-3">
                <span class="icon-check text-xl text-green"></span>
                <strong class="text-white-primary lg:whitespace-nowrap">{{ item.name }}</strong>
              </span>
            </td>
            <td :class="{ '!border-b-0': key + 1 === includedServices.length }">
              {{ item.description }}
            </td>
          </tr>
        </tbody>
      </n-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  services: { type: Array<number>, default: [] },
});
const { web3Services } = useService();
const includedServices = web3Services.filter(item => props.services.includes(item.id as ServiceType));
</script>
