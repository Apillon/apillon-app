<template>
  <ModalFullScreen :progress="progress" :title="$t('hosting.website.create')">
    <template #header-center>
      <div class="flex items-center gap-4 text-xs">
        <template v-for="(step, key) in enumValues(WebsiteCreateStep)">
          <span v-if="key > 0 && $te(`hosting.website.createStep.${step}`)" class="card-border w-3"></span>
          <strong
            v-if="$te(`hosting.website.createStep.${step}`)"
            :class="step === websiteStore.stepWebsiteCreate ? 'text-yellow' : 'text-disabled'"
          >
            {{ $t(`hosting.website.createStep.${step}`) }}
          </strong>
        </template>
      </div>
    </template>

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
        class="mx-auto max-w-lg"
        hide-submit
        >form
      </FormHostingWebsiteGitHub>
      <FormHostingWebsite
        v-else-if="websiteStore.stepWebsiteCreate === WebsiteCreateStep.FORM"
        ref="formWebsiteRef"
        class="mx-auto max-w-lg"
        hide-submit
      />
      <NftPreviewCollection
        v-else-if="metadataStore.stepCollectionCreate === WebsiteCreateStep.REVIEW"
        @back="metadataStore.stepCollectionCreate = WebsiteCreateStep.FORM"
        @deploy="createCollection()"
      />
      <AnimationDeploy v-else-if="websiteStore.stepWebsiteCreate === WebsiteCreateStep.DEPLOYING" class="min-h-full" />
      <NftCollectionDeployed
        v-if="websiteStore.stepWebsiteCreate === WebsiteCreateStep.DEPLOYED"
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
            size="small"
            type="secondary"
            @click="back"
          >
            {{ $t('general.back') }}
          </Btn>
          <Btn size="small" @click="nextStep()">{{ $t('form.continue') }} </Btn>
        </div>
      </div>
    </template>
  </ModalFullScreen>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue';
import { enumValues } from '~/lib/utils';
import { WebsiteCreateStep } from '~/lib/types/hosting';

const message = useMessage();
const authStore = useAuthStore();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const websiteStore = useWebsiteStore();

const { t } = useI18n();
const { uploadFiles } = useUpload();
const { isUnique, collectionEndpoint, prepareFormData } = useCollection();
const { pricing, deployCollection, uploadLogoAndCover } = useMetadata();

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

const submitForm = async formRef => (formRef ? await formRef.handleSubmitForm() : false);

async function submitFormWebsite() {
  if (await submitForm(formWebsiteRef.value)) {
    websiteStore.stepWebsiteCreate = WebsiteCreateStep.PREVIEW;
  }
}
async function submitFormGithub() {
  if (await submitForm(formWebsiteGithubRef.value)) {
    websiteStore.stepWebsiteCreate = WebsiteCreateStep.PREVIEW;
  }
}

function back() {
  switch (websiteStore.stepWebsiteCreate) {
    case WebsiteCreateStep.FORM:

    default:
      websiteStore.stepWebsiteCreate -= 1;
  }
}
function nextStep() {
  switch (websiteStore.stepWebsiteCreate) {
    case WebsiteCreateStep.FROM:
      submitForm();
      break;
    case WebsiteCreateStep.TYPE:
      websiteTypeRef.value?.nextStep();
    default:
      websiteStore.stepWebsiteCreate += 1;
  }
}
</script>
