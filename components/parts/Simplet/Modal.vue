<template>
  <ModalFullScreen
    :progress="progress"
    :steps="SimpletCreateStep"
    :active-step="
      simpletsStore.stepSimpletCreate === SimpletCreateStep.SMTP
        ? SimpletCreateStep.FORM
        : simpletsStore.stepSimpletCreate
    "
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
      />
      <FormSimpletSmtp
        v-else-if="simpletsStore.stepSimpletCreate === SimpletCreateStep.SMTP"
        ref="simpletFormSmtpRef"
        class="mx-auto max-w-lg"
        @skip="skipSmtp()"
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
const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const simpletsStore = useSimpletsStore();
const embeddedWalletStore = useEmbeddedWalletStore();

const simpletTypeRef = useTemplateRef('simpletTypeRef');
const simpletCollectionRef = useTemplateRef('simpletCollectionRef');
const simpletFormRef = useTemplateRef('simpletFormRef');
const simpletFormSmtpRef = useTemplateRef('simpletFormSmtpRef');

const totalCredits = 150;
const progress = computed(() => Math.min(100, 20 * (simpletsStore.stepSimpletCreate - 1)));

onMounted(async () => {
  await dataStore.waitOnPromises();
  paymentStore.getPriceList();
  simpletsStore.getSimpletTemplates();
  embeddedWalletStore.getEmbeddedWallets();
  simpletsStore.stepSimpletCreate = 7;
});

watch(
  () => props.type,
  newType => {
    if (newType > 0) {
      simpletsStore.form.type = newType;
      simpletsStore.stepSimpletCreate = SimpletCreateStep.COLLECTION;
    } else {
      simpletsStore.stepSimpletCreate = SimpletCreateStep.TYPE;
    }
  }
);

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

async function skipSmtp() {
  simpletsStore.form.smtp.host = '';
  simpletsStore.form.smtp.username = '';
  simpletsStore.form.smtp.password = '';
  simpletsStore.form.smtp.senderName = '';
  simpletsStore.form.smtp.senderEmail = '';
  simpletsStore.stepSimpletCreate = SimpletCreateStep.REVIEW;
}

async function deploy() {
  simpletsStore.stepSimpletCreate = SimpletCreateStep.DEPLOYING;

  const simpletUuid =
    simpletsStore.templates.find(t => t.id === simpletsStore.form.type)?.simplet_uuid ||
    simpletsStore.templates[0].simplet_uuid;
  const simplet = await createSimplet(simpletUuid);

  simpletsStore.stepSimpletCreate = simplet ? SimpletCreateStep.DEPLOYED : SimpletCreateStep.FORM;
}

const prepareVariablesBE = (): KeyValue[] => [
  { key: 'CLAIM_TYPE', value: simpletsStore.form.type || SimpletType.AIRDROP },
  { key: 'ADMIN_WALLET', value: simpletsStore.form.walletAddress || '' },
  ...(simpletsStore.form.smtp.host
    ? [
        { key: 'SMTP_HOST', value: simpletsStore.form.smtp.host },
        { key: 'SMTP_PORT', value: simpletsStore.form.smtp.port },
        { key: 'SMTP_USERNAME', value: simpletsStore.form.smtp.username },
        { key: 'SMTP_PASSWORD', value: simpletsStore.form.smtp.password },
        { key: 'SMTP_NAME_FROM', value: simpletsStore.form.smtp.senderName },
        { key: 'SMTP_EMAIL_FROM', value: simpletsStore.form.smtp.senderEmail },
      ]
    : []),
];
const prepareVariablesFE = (embeddedWallet: string): KeyValue[] => {
  const frontendVariables: KeyValue[] = [
    { key: 'NUXT_PUBLIC_CLAIM_TYPE', value: simpletsStore.form.type || SimpletType.AIRDROP },
    { key: 'NUXT_PUBLIC_EMBEDDED_WALLET_CLIENT', value: embeddedWallet },
    ...(simpletsStore.form.type === SimpletType.POAP && simpletsStore.form.startTime
      ? [{ key: 'NUXT_PUBLIC_CLAIM_START', value: simpletsStore.form.startTime }]
      : []),
    ...(simpletsStore.form.type === SimpletType.POAP && simpletsStore.form.endTime
      ? [{ key: 'NUXT_PUBLIC_CLAIM_END', value: simpletsStore.form.endTime }]
      : []),
  ];
  return frontendVariables;
};

async function createSimplet(simpletUuid: string) {
  try {
    const embeddedWallet = await getEmbeddedWallet(simpletsStore.form.embeddedWallet);

    const bodyData = {
      project_uuid: dataStore.projectUuid,
      name: simpletsStore.form.name,
      description: simpletsStore.form.description,
      apillonApiKey: simpletsStore.form.apiKey || null,
      apillonApiSecret: simpletsStore.form.apiSecret || null,
      nftCollection_uuid: simpletsStore.form.collection,
      backendVariables: prepareVariablesBE(),
      frontendVariables: prepareVariablesFE(embeddedWallet),
    };

    const { data } = await $api.post<SimpletResponse>(endpoints.simpletDeploy(simpletUuid), bodyData);
    message.success(t('nft.collection.websiteDeploy.success'));

    return data;
  } catch (e) {
    message.error(userFriendlyMsg(e));
  }
  return null;
}

async function getEmbeddedWallet(integrationUuid?: string | null): Promise<string> {
  if (integrationUuid) return integrationUuid;

  const embeddedWallet = await createEmbeddedWallet();
  return embeddedWallet?.integration_uuid || '';
}

async function createEmbeddedWallet() {
  try {
    const bodyData = {
      title: `Embedded wallet: ${simpletsStore.form.name}`,
      description: `Embedded wallet: ${simpletsStore.form.description}`,
      project_uuid: dataStore.projectUuid,
    };
    const { data } = await $api.post<EmbeddedWalletResponse>(endpoints.embeddedWalletIntegration, bodyData);
    return data;
  } catch (error: ApiError | any) {
    message.error(userFriendlyMsg(error));
  }
}
</script>
