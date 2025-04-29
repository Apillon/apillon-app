<template>
  <ModalFullScreen
    :progress="progress"
    :steps="WebsiteCreateStep"
    :active-step="websiteStore.stepWebsiteCreate"
    trans-key="hosting.website.createStep"
    :title="$t('hosting.website.create')"
  >
    <slot>
      <FormHostingWebsiteTypeSelect
        v-if="websiteStore.stepWebsiteCreate === WebsiteCreateStep.TYPE"
        ref="websiteTypeRef"
        class="mx-auto max-w-lg"
      />
      <FormHostingWebsiteGitHub
        v-else-if="
          websiteStore.stepWebsiteCreate === WebsiteCreateStep.FORM && websiteStore.form.type == WebsiteType.GITHUB
        "
        ref="formWebsiteGithubRef"
        :title="$t('hosting.website.new')"
        hide-submit
        @back="websiteStore.stepWebsiteCreate -= 1"
      />
      <FormHostingWebsite
        v-else-if="websiteStore.stepWebsiteCreate === WebsiteCreateStep.FORM"
        ref="formWebsiteRef"
        class="mx-auto max-w-lg"
        :title="$t('hosting.website.new')"
        hide-submit
      />
      <HostingPreviewWebsite
        v-else-if="websiteStore.stepWebsiteCreate === WebsiteCreateStep.REVIEW"
        @back="websiteStore.stepWebsiteCreate = WebsiteCreateStep.FORM"
        @deploy="deploy()"
      />
      <AnimationDeploy
        v-else-if="websiteStore.stepWebsiteCreate === WebsiteCreateStep.DEPLOYING"
        class="min-h-full"
        :title="$t('hosting.website.deploying')"
        :content="$t('hosting.website.deployingInfo')"
      />
      <HostingWebsiteDeployed
        v-else-if="websiteStore.stepWebsiteCreate === WebsiteCreateStep.DEPLOYED"
        class="mx-auto max-w-5xl"
      />
    </slot>
    <template v-if="websiteStore.stepWebsiteCreate < WebsiteCreateStep.REVIEW" #footer>
      <div class="flex w-full items-center justify-between gap-4 px-10 py-3">
        <p>
          <strong>{{ $t('nft.collection.review.totalCosts') }}: </strong>
          <span>{{ totalCredits }} {{ $t('dashboard.credits.credits') }}</span>
        </p>
        <div class="flex items-center gap-2">
          <Btn
            v-if="websiteStore.stepWebsiteCreate !== WebsiteCreateStep.TYPE"
            class="min-w-40"
            type="secondary"
            @click="back"
          >
            {{ $t('general.back') }}
          </Btn>
          <Btn class="min-w-40" @click="nextStep()">{{ $t('form.continue') }} </Btn>
        </div>
      </div>
    </template>
  </ModalFullScreen>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue';

const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const websiteStore = useWebsiteStore();

const { createWebsite } = useHosting();
const { pricing } = useMetadata();

const websiteTypeRef = useTemplateRef('websiteTypeRef');
const formWebsiteRef = useTemplateRef('formWebsiteRef');
const formWebsiteGithubRef = useTemplateRef('formWebsiteGithubRef');

const totalCredits = computed(() => sumCredits(pricing.value));
const progress = computed(() => Math.min(100, 20 * websiteStore.stepWebsiteCreate));

onMounted(async () => {
  await dataStore.waitOnPromises();
  storageStore.getStorageInfo();
  paymentStore.getPriceList();
});

const submitFormRef = async formRef => (formRef ? await formRef.handleSubmit() : false);

async function submitForm() {
  const formRef = websiteStore.form.type === WebsiteType.BASIC ? formWebsiteRef : formWebsiteGithubRef;
  if (await submitFormRef(formRef.value)) {
    websiteStore.stepWebsiteCreate = WebsiteCreateStep.REVIEW;
  }
}

function back() {
  switch (websiteStore.stepWebsiteCreate) {
    case WebsiteCreateStep.FORM:
      if (websiteStore.form.type === WebsiteType.GITHUB) {
        formWebsiteGithubRef.value?.back();
      } else {
        websiteStore.stepWebsiteCreate -= 1;
      }
      break;
    default:
      websiteStore.stepWebsiteCreate -= 1;
  }
}
function nextStep() {
  switch (websiteStore.stepWebsiteCreate) {
    case WebsiteCreateStep.FORM:
      submitForm();
      break;
    case WebsiteCreateStep.TYPE:
      websiteTypeRef.value?.nextStep();
      if (websiteStore.form.type) {
        websiteStore.stepWebsiteCreate += 1;
      }
      break;
    default:
      websiteStore.stepWebsiteCreate += 1;
      break;
  }
}

async function deploy() {
  websiteStore.stepWebsiteCreate = WebsiteCreateStep.DEPLOYING;
  const website = await createWebsite();
  websiteStore.stepWebsiteCreate = website ? WebsiteCreateStep.DEPLOYED : WebsiteCreateStep.FORM;
}
</script>
