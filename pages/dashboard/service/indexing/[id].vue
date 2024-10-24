<template>
  <Dashboard>
    <template #heading>
      <HeaderIndexer
        v-if="indexerStore.active.indexer_uuid"
        :indexer-uuid="indexerStore.active.indexer_uuid"
      />
    </template>

    <slot v-if="indexerStore.active.indexer_uuid">
      <n-space v-if="indexerStore.active?.squidId" class="pb-8" :size="32" vertical>
        <h4>{{ $t('indexer.indexerApiEndpoint') }}</h4>
        <HostingPreviewLink
          class="xl:max-w-3xl xxl:max-w-4xl"
          :link="indexerStore.active.squid?.api?.urls[0].url || ''"
        />
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
                <span class="text-white lg:whitespace-nowrap">{{ $t('indexer.description') }}</span>
              </td>
              <td>
                {{ indexerStore.active.description }}
              </td>
            </tr>
            <tr>
              <td>
                <span class="text-white lg:whitespace-nowrap">{{
                  $t('indexer.lastDeployed')
                }}</span>
              </td>
              <td>
                {{ dateTimeToDateAndTime(indexerStore.active.squid?.deployedAt || '') }}
              </td>
            </tr>
            <!--Squid Status-->
            <tr>
              <td>
                <span class="text-white lg:whitespace-nowrap">{{ $t('indexer.squidStatus') }}</span>
              </td>
              <td>
                <n-tag
                  v-bind="$attrs"
                  :type="indexerStore.active.squid?.status == 'DEPLOYED' ? 'success' : 'error'"
                  :bordered="false"
                  size="tiny"
                  round
                >
                  <n-space :class="'text-bg-dark'" :size="0" align="center" :wrap="false">
                    <span class="mx-1 uppercase">{{ indexerStore.active.squid?.status }}</span>
                  </n-space>
                </n-tag>
              </td>
            </tr>
            <!--API Status-->
            <tr>
              <td>
                <span class="text-white lg:whitespace-nowrap">{{ $t('indexer.apiStatus') }}</span>
              </td>
              <td>
                <n-tag
                  v-bind="$attrs"
                  :type="
                    indexerStore.active.squid?.api?.status == 'AVAILABLE' ? 'success' : 'error'
                  "
                  :bordered="false"
                  size="tiny"
                  round
                >
                  <n-space :class="'text-bg-dark'" :size="0" align="center" :wrap="false">
                    <span class="mx-1 uppercase">{{ indexerStore.active.squid?.api?.status }}</span>
                  </n-space>
                </n-tag>
              </td>
            </tr>
            <!--Processor Status-->
            <tr>
              <td>
                <span class="text-white lg:whitespace-nowrap">{{
                  $t('indexer.processorStatus')
                }}</span>
              </td>
              <td>
                <n-tag
                  v-bind="$attrs"
                  :type="
                    indexerStore.active.squid?.processors[0].status == 'SYNCED'
                      ? 'success'
                      : 'error'
                  "
                  :bordered="false"
                  size="tiny"
                  round
                >
                  <n-space :class="'text-bg-dark'" :size="0" align="center" :wrap="false">
                    <span class="mx-1 uppercase">{{
                      indexerStore.active.squid?.processors[0].status
                    }}</span>
                  </n-space>
                </n-tag>
              </td>
            </tr>
            <tr>
              <td>
                <span class="text-white lg:whitespace-nowrap">{{
                  $t('indexer.processedBlocks')
                }}</span>
              </td>
              <td>
                {{
                  `${indexerStore.active.squid?.processors[0].syncState.currentBlock}/${indexerStore.active.squid?.processors[0].syncState.totalBlocks} `
                }}
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-space>
      <div v-else class="d-flex flex-column">
        <h4>{{ $t('indexer.instructions.deployYourIndexer') }}</h4>
        <p>
          {{ $t('indexer.instructions.instruction1') }}
        </p>
        <p>{{ $t('indexer.instructions.instruction2') }}</p>

        <n-space class="mt-8 pb-8 mx-auto" :size="16" vertical>
          <h4>{{ $t('indexer.instructions.step1') }}</h4>
          <CliCommand command="npm install -g @apillon/cli" title="Install the CLI globally" />
        </n-space>

        <n-space class="mt-8 pb-8 mx-auto" :size="16" vertical>
          <h4>{{ $t('indexer.instructions.step2') }}</h4>
          <p>
            {{ $t('indexer.instructions.chooseTemplate') }}
          </p>
          <ul>
            <li>
              <a
                class="link"
                href="https://github.com/subsquid-labs/squid-substrate-template"
                target="_blank"
              >
                {{ $t('indexer.instructions.substrateTemplate') }}
              </a>
            </li>
            <li>
              <a
                class="link"
                href="https://github.com/subsquid-labs/squid-evm-templates"
                target="_blank"
              >
                {{ $t('indexer.instructions.evmTemplates') }}
              </a>
            </li>
          </ul>
        </n-space>

        <n-space class="mt-8 pb-8 mx-auto" :size="16" vertical>
          <h4>{{ $t('indexer.instructions.step3') }}</h4>
          <p>
            Explore <a class="link" href="https://docs.sqd.dev/" target="_blank">the docs</a> to
            learn how to customize your squid
          </p>
        </n-space>

        <n-space class="mt-8 pb-8 mx-auto" :size="16" vertical>
          <h4>{{ $t('indexer.instructions.step4') }}</h4>
          <CliCommand
            command="apillon indexing deploy-indexer <Path to indexer> -i <indexer-uuid>"
            title="Run indexer deployment inside your squid project locally"
          />
        </n-space>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const indexerStore = useIndexerStore();
const { initIndexer } = useIndexer();

useHead({
  title: $i18n.t('dashboard.nav.hosting'),
});

onMounted(() => {
  initIndexer();
});
</script>
