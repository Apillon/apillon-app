<template>
  <div class="card-light px-6 py-4 mb-6 max-w-3xl">
    <n-table class="plain" :bordered="false" single-line>
      <tbody>
        <tr>
          <td>
            <span class="text-white lg:whitespace-nowrap">{{ $t('indexer.name') }}</span>
          </td>
          <td>
            {{ indexerStore.active.name }}
          </td>
        </tr>
        <tr>
          <td>
            <span class="text-white lg:whitespace-nowrap">
              {{ $t('indexer.description') }}
            </span>
          </td>
          <td>
            {{ indexerStore.active.description }}
          </td>
        </tr>
        <tr>
          <td>
            <span class="text-white lg:whitespace-nowrap">
              {{ $t('dashboard.createTime') }}
            </span>
          </td>
          <td>
            {{ dateTimeToDateAndTime(indexerStore.active.createTime || '') }}
          </td>
        </tr>
        <tr>
          <td>
            <span class="text-white lg:whitespace-nowrap">
              {{ $t('indexer.lastDeployed') }}
            </span>
          </td>
          <td>
            {{ dateTimeToDateAndTime(indexerStore.active.squid?.deployedAt || '') }}
          </td>
        </tr>
        <!--Squid Status-->
        <tr>
          <td>
            <span class="text-white lg:whitespace-nowrap">
              {{ $t('indexer.squidStatus') }}
            </span>
          </td>
          <td>
            <IndexerStatus
              :status="indexerStore.active.squid?.status == 'DEPLOYED' ? 'success' : 'error'"
            >
              {{ indexerStore.active.squid?.status }}
            </IndexerStatus>
          </td>
        </tr>
        <!--API Status-->
        <tr>
          <td class="!border-bg-light">
            <span class="text-white lg:whitespace-nowrap">{{ $t('indexer.apiStatus') }}</span>
          </td>
          <td class="!border-bg-light">
            <IndexerStatus
              :status="indexerStore.active.squid?.api?.status == 'AVAILABLE' ? 'success' : 'error'"
            >
              {{ indexerStore.active.squid?.api?.status }}
            </IndexerStatus>
          </td>
        </tr>
        <tr>
          <td class="!border-bg-light !pl-0">
            <h6 class="py-3 text-white">{{ $t('indexer.processors') }}</h6>
          </td>
        </tr>
        <!--Processor Status-->
        <tr>
          <td>
            <span class="text-white lg:whitespace-nowrap">
              {{ $t('indexer.processorStatus') }}
            </span>
          </td>
          <td>
            <IndexerStatus
              :status="
                indexerStore.active.squid?.processors[0].status == 'SYNCED' ? 'success' : 'error'
              "
            >
              {{ indexerStore.active.squid?.processors[0].status }}
            </IndexerStatus>
          </td>
        </tr>
        <tr>
          <td class="!border-bg-light">
            <span class="text-white lg:whitespace-nowrap">
              {{ $t('indexer.processedBlocks') }}
            </span>
          </td>
          <td class="!border-bg-light">
            {{
              `${indexerStore.active.squid?.processors[0].syncState.currentBlock}/${indexerStore.active.squid?.processors[0].syncState.totalBlocks} `
            }}
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script lang="ts" setup>
const indexerStore = useIndexerStore();
</script>
