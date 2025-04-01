<template>
  <div class="d-flex flex-column max-w-4xl pb-8">
    <h4>{{ $t('indexer.instructions.deployYourIndexer') }}</h4>
    <p v-html="$t('indexer.instructions.instruction1')"></p>
    <p>{{ $t('indexer.instructions.instruction2') }}</p>

    <div class="card-lighter mb-6 mt-4 p-8">
      <n-space :size="16" vertical>
        <div class="flex items-center gap-2">
          <IconNumber class="" :number="1" active />
          <h4>{{ $t('indexer.instructions.step1') }}</h4>
        </div>
        <CliCommand command="npm install -g @apillon/cli" title="Install the CLI globally" list />
      </n-space>

      <hr class="my-6 border-bg" />

      <n-space :size="16" vertical>
        <div class="flex items-center gap-2">
          <IconNumber class="" :number="2" active />
          <h4>{{ $t('indexer.instructions.step2') }}</h4>
        </div>
        <p class="text-xs font-bold text-white">
          {{ $t('indexer.instructions.chooseTemplate') }}
        </p>
        <ul class="ml-4 list-disc text-xs">
          <li class="mb-2">
            <a class="link" href="https://github.com/subsquid-labs/squid-substrate-template" target="_blank">
              {{ $t('indexer.instructions.substrateTemplate') }}
            </a>
          </li>
          <li>
            <a class="link" href="https://github.com/subsquid-labs/squid-evm-templates" target="_blank">
              {{ $t('indexer.instructions.evmTemplates') }}
            </a>
          </li>
        </ul>
      </n-space>

      <hr class="my-6 border-bg" />

      <n-space :size="16" vertical>
        <div class="flex items-center gap-2">
          <IconNumber class="" :number="3" active />
          <h4>{{ $t('indexer.instructions.step3') }}</h4>
        </div>
        <p class="text-xs font-bold text-white">
          Explore <a class="link" href="https://docs.sqd.dev/" target="_blank">the docs</a> to learn how to customize
          your squid
        </p>
      </n-space>

      <hr class="my-6 border-bg" />

      <n-space class="mb-6" :size="16" vertical>
        <div class="flex items-center gap-2">
          <IconNumber class="" :number="4" active />
          <h4>{{ $t('indexer.instructions.step4') }}</h4>
        </div>
        <CliCommand
          command="apillon indexing deploy <path to indexer> -i <indexer-uuid>"
          title="Run indexer deployment inside your local project"
          list
        />
      </n-space>

      <Btn size="large" :loading="loading" @click="deployFinished">{{ $t('indexer.instructions.btnFinish') }}</Btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const router = useRouter();
const message = useMessage();
const indexerStore = useIndexerStore();
const indexerLogsStore = useIndexerLogStore();
const indexerDeploymentsStore = useIndexerDeploymentsStore();

const loading = ref<boolean>(false);

async function deployFinished() {
  loading.value = true;
  const indexerUuid = indexerStore.active.indexer_uuid;
  const indexer = await indexerStore.fetchIndexer(indexerUuid);

  loading.value = false;
  if (!indexer) {
    router.push({ name: 'dashboard-service-indexer' });
    return;
  }

  indexerStore.active = indexer;

  if (indexer.squidId) {
    await indexerLogsStore.getLogs(indexer.indexer_uuid);
    await indexerDeploymentsStore.getDeployments(indexer.indexer_uuid);
  } else {
    message.warning(t('indexer.instructions.deployNotFinished'));
  }
}
</script>
