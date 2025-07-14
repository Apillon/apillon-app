<template>
  <div class="flex flex-wrap gap-y-8">
    <div>
      <SimpletContent :content="content" />

      <h4 class="my-4">{{ $t('computing.cloudFunctions.startNew') }}</h4>

      <n-space class="mb-8">
        <Btn @click="modalCreateCloudFunctionsVisible = true">
          {{ $t('computing.cloudFunctions.new') }}
        </Btn>
        <BtnDocumentation href="https://wiki.apillon.io/web3-services/8-web3-cloud-functions.html" />
        <Btn
          type="secondary"
          inner-class="text-white flex items-center justify-center"
          href="https://github.com/Apillon/cloud-function-template"
          target="_blank"
        >
          <span class="icon-cloud-functions mr-2 text-xl"></span>
          <span>{{ $t('computing.cloudFunctions.job.viewTemplate') }}</span>
        </Btn>
      </n-space>
    </div>
  </div>

  <!-- Modal - Create Cloud Functions -->
  <modal v-model:show="modalCreateCloudFunctionsVisible" :title="$t('computing.cloudFunctions.new')">
    <FormCloudFunctions @submit-success="modalCreateCloudFunctionsVisible = false" />
  </modal>
</template>

<script lang="ts" setup>
const { generateContent } = useSimplet();
const content = generateContent('cloudFunctions', 'computing');
const modalCreateCloudFunctionsVisible = ref<boolean | null>(false);
</script>
