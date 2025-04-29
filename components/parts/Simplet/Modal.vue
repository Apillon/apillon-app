<template>
  <ModalFullScreen
    :progress="progress"
    :steps="SimpletCreateStep"
    :active-step="simpletsStore.stepSimpletCreate"
    trans-key="dashboard.simplet.wizard.createStep"
    :title="$t('dashboard.simplet.wizard.create')"
  >
    <slot>
      <FormSimpletTypeSelect
        v-if="simpletsStore.stepSimpletCreate === SimpletCreateStep.TYPE"
        ref="simpletTypeRef"
        class="mx-auto max-w-lg"
      />
      <FormSimpletCollection
        v-if="simpletsStore.stepSimpletCreate === SimpletCreateStep.COLLECTION"
        ref="simpletCollectionRef"
        class="mx-auto max-w-lg"
      />
      <FormSimplet
        v-else-if="simpletsStore.stepSimpletCreate === SimpletCreateStep.FORM"
        ref="simpletFormRef"
        class="mx-auto max-w-lg"
        hide-submit
      />
      <FormSimpletSmtp
        v-else-if="simpletsStore.stepSimpletCreate === SimpletCreateStep.SMTP"
        ref="simpletFormSmtpRef"
        class="mx-auto max-w-lg"
        hide-submit
      />
      <SimpletPreview
        v-else-if="simpletsStore.stepSimpletCreate === SimpletCreateStep.REVIEW"
        @back="simpletsStore.stepSimpletCreate = SimpletCreateStep.FORM"
        @deploy="deploy()"
      />
      <AnimationDeploy
        v-else-if="simpletsStore.stepSimpletCreate === SimpletCreateStep.DEPLOYING"
        class="min-h-full"
        :title="$t('dashboard.simplet.wizard.deploying')"
        :content="$t('dashboard.simplet.wizard.deployingInfo')"
      />
      <SimpletDeployed
        v-else-if="simpletsStore.stepSimpletCreate === SimpletCreateStep.DEPLOYED"
        class="mx-auto max-w-5xl"
      />
    </slot>
    <template v-if="simpletsStore.stepSimpletCreate < SimpletCreateStep.REVIEW" #footer>
      <div class="flex w-full items-center justify-between gap-4 px-10 py-3">
        <p>
          <strong>{{ $t('nft.collection.review.totalCosts') }}: </strong>
          <span>{{ totalCredits }} {{ $t('dashboard.credits.credits') }}</span>
        </p>
        <div class="flex items-center gap-2">
          <Btn
            v-if="simpletsStore.stepSimpletCreate !== SimpletCreateStep.TYPE"
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
const props = defineProps({
  type: { type: Number, default: 0 },
});
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const simpletsStore = useSimpletsStore();

const simpletTypeRef = useTemplateRef('simpletTypeRef');
const simpletCollectionRef = useTemplateRef('simpletCollectionRef');
const simpletFormRef = useTemplateRef('simpletFormRef');
const simpletFormSmtpRef = useTemplateRef('simpletFormSmtpRef');

const totalCredits = 150;
const progress = computed(() => Math.min(100, 20 * (simpletsStore.stepSimpletCreate - 1)));

onMounted(async () => {
  if (props.type > 0) {
    simpletsStore.form.type = props.type;
    simpletsStore.stepSimpletCreate = SimpletCreateStep.COLLECTION;
  } else {
    simpletsStore.stepSimpletCreate = SimpletCreateStep.TYPE;
  }
  await dataStore.waitOnPromises();
  paymentStore.getPriceList();
});

async function submitForm() {
  if (await simpletFormRef.value?.handleSubmit()) {
    simpletsStore.stepSimpletCreate =
      simpletsStore.form.type === SimpletType.FREE_MINT ? SimpletCreateStep.REVIEW : SimpletCreateStep.SMTP;
  }
}
async function submitFormSmtp() {
  if (await simpletFormSmtpRef.value?.handleSubmit()) {
    simpletsStore.stepSimpletCreate = SimpletCreateStep.REVIEW;
  }
}

function back() {
  switch (simpletsStore.stepSimpletCreate) {
    case SimpletCreateStep.FORM:
      simpletsStore.stepSimpletCreate -= 1;

      break;
    default:
      simpletsStore.stepSimpletCreate -= 1;
  }
}
function nextStep() {
  switch (simpletsStore.stepSimpletCreate) {
    case SimpletCreateStep.TYPE:
      simpletTypeRef.value?.nextStep();
      if (simpletsStore.form.type) {
        simpletsStore.stepSimpletCreate += 1;
      }
      break;
    case SimpletCreateStep.COLLECTION:
      simpletCollectionRef.value?.nextStep();
      if (simpletsStore.form.collection) {
        simpletsStore.stepSimpletCreate += 1;
      }
      break;
    case SimpletCreateStep.FORM:
      submitForm();
      break;
    case SimpletCreateStep.SMTP:
      submitFormSmtp();
      break;
    default:
      simpletsStore.stepSimpletCreate += 1;
      break;
  }
}

async function deploy() {
  simpletsStore.stepSimpletCreate = SimpletCreateStep.DEPLOYING;
  const simplet = await createSimplet();
  simpletsStore.stepSimpletCreate = simplet ? SimpletCreateStep.DEPLOYED : SimpletCreateStep.FORM;
}

function createSimplet() {
  return true;
}
</script>
