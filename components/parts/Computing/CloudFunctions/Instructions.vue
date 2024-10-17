<template>
  <div class="flex gap-y-8 flex-wrap">
    <div>
      <SolutionContent :content="content" />

      <h4 class="my-4">{{ $t('computing.cloudFunctions.startNew') }}</h4>

      <n-space class="mb-8">
        <Btn @click="modalCreateCloudFunctionsVisible = true">
          {{ $t('computing.cloudFunctions.new') }}
        </Btn>
        <Btn
          type="secondary"
          inner-class="text-white flex items-center justify-center"
          href="https://wiki.apillon.io/web3-services/7-web3-compute.html"
        >
          <span class="icon-file text-xl mr-2"></span>
          <span>{{ $t('computing.cloudFunctions.documentation') }}</span>
        </Btn>
        <Btn
          type="secondary"
          inner-class="text-white flex items-center justify-center"
          href="https://github.com/Apillon/cloud-function-template"
          target="_blank"
        >
          <span class="icon-cloud-functions text-xl mr-2"></span>
          <span>{{ $t('computing.cloudFunctions.job.viewTemplate') }}</span>
        </Btn>
      </n-space>
    </div>
    <!-- <div class="lg:w-1/2">
      <h3 class="mb-2">{{ $t('computing.cloudFunctions.checkVideo') }}</h3>
      <LearnVideo
        :title="$t('computing.cloudFunctions.checkVideo')"
        html-content="https://www.youtube.com/embed/AslkbJH4OAM?si=IVlEtikZsgI85iWl"
        class="w-full"
      />
    </div> -->
  </div>

  <!-- Modal - Create Cloud Functions -->
  <modal
    v-model:show="modalCreateCloudFunctionsVisible"
    :title="$t('computing.cloudFunctions.new')"
  >
    <FormComputingCloudFunctions
      @submit-success="modalCreateCloudFunctionsVisible = false"
      @create-success=""
    />
  </modal>
</template>

<script lang="ts" setup>
const { generateContent } = useSolution();
const content = generateContent('cloudFunctions', 'computing');
const modalCreateCloudFunctionsVisible = ref<boolean | null>(false);
</script>
